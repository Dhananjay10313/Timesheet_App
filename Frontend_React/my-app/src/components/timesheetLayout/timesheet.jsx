import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { formatDate } from 'react-datepicker/dist/date_utils';

const Timesheet = ({ employee_id, events, modProjects }) => {
  const [timesheet, setTimesheet] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  // const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];

  // console.log("from timesheet")
  console.log("events", events);

  // const [events, setEvents] = useState([]);
  const [showBusinessOnly, setShowBusinessOnly] = useState(true);
  const [showDailyTotals, setShowDailyTotals] = useState(false);
  const [rowHeaderColumns, setRowHeaderColumns] = useState([
    { title: "Date" },
    { title: "Day", width: 40 },
  ]);

  console.log("modProjects1", modProjects);
  const projects = false
    ? modProjects
    : [
        { id: 1, name: "Project A", color: "#38761d" },
        { id: 2, name: "Project B", color: "#0d8ecf" },
        { id: 3, name: "Project C", color: "#f1c232" },
      ];

  const currentDate = new Date();

  // Target date (October 1, 2024)
  const targetDate = new Date("2024-10-01");

  // Calculate the difference in time
  const timeDifference = currentDate - targetDate;

  // Convert time difference from milliseconds to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  console.log("daysDifference", daysDifference)

  const config = {
    locale: "en-us",
    onBeforeRowHeaderRender: (args) => {
      args.row.columns[0].horizontalAlignment = "center";
      args.row.columns[1].text = args.row.start.toString("ddd");
      if (args.row.columns[2]) {
        args.row.columns[2].text = args.row.events
          .totalDuration()
          .toString("h:mm");
      }
    },
    onBeforeEventRender: (args) => {
      const duration = new DayPilot.Duration(args.data.start, args.data.end);
      const project = projects.find((p) => p.id === args.data.project);
      args.data.barColor = project.color;
      args.data.areas = [
        {
          top: 13,
          right: 5,
          text: duration.toString("h:mm"),
          fontColor: "#999999",
        },
        {
          top: 5,
          left: 5,
          text: args.data.text,
        },
        {
          top: 20,
          left: 5,
          text: project.name,
          fontColor: "#999999",
        },
      ];
      args.data.html = "";
    },
    cellWidthSpec: "Auto",
    cellWidthMin: 25,
    timeHeaders: [{ groupBy: "Hour" }, { groupBy: "Cell", format: "mm" }],
    scale: "CellDuration",
    cellDuration: 60,
    eventHeight: 40,
    heightSpec: "Max",
    height: 450,
    days: daysDifference,
    viewType: "Days",
    startDate: "2024-10-01",
    allowEventOverlap: false,
    timeRangeSelectedHandling: "Enabled",
    eventDeleteHandling: "Update",
    // contextMenu : new DayPilot.Menu({
    //   items: [
    //     {text:"Delete", onClick: args => { const e = args.source; events.remove(e); } }
    //   ]
    // }),
    onEventDelete: function (args) {
      const date1 = new Date(args.e.data.end);
      const date2 = new Date(latestDate); // No 'T' in date2

      console.log("latest_date", args.e.data.manager_id);
      if (args.e.data.status==2) {
        toast.error("Already Approved can't delete");
        args.preventDefault();
        return;
      } else if (!confirm("Do you really want to delete this event?")) {
        args.preventDefault();
      }
    },
    onEventDeleted: async function (args) {
      // AJAX call to the server, this example uses jQuery
      console.log("timesheet_id ", args.e.id());
      const response = await axios.delete(
        "http://localhost:8000/deleteSingleTimesheetEntry",
        {
          data: { emp_id: employee_id, timesheet_id: args.e.id() },
        }
      );
      console.log("delete response", response.data);
    },
    onTimeRangeSelected: async (args) => {
      console.log("clicked");
      // if (employee_id !== 1) return; // Change 1 to currently logged in user
      const timesheet = args.control;
      const timesheet_id = Math.floor(Math.random() * 1000000);
      const form = [
        { name: "Text", id: "text" },
        { name: "Start", id: "start", type: "datetime" },
        {
          name: "End",
          id: "end",
          type: "datetime",
          onValidate: (args) => {
            if (args.values.end.getTime() < args.values.start.getTime()) {
              args.valid = false;
              args.message = "End must be after start";
            }
          },
        },
        { name: "Project", id: "project", options: projects },
      ];
      const data = {
        id: timesheet_id,
        start: args.start,
        end: args.end,
        project: projects[0].id,
        text: "New task",
      };
      const options = {
        locale: "en-us",
      };
      const modal = await DayPilot.Modal.form(form, data, options);
      timesheet.clearSelection();
      if (modal.canceled) {
        return;
      }
      timesheet.events.add(modal.result);
      console.log("Modal Result", modal.result);
      console.log(events);

      const formData = {
        timesheet_id: timesheet_id,
        task_name: modal.result.text,
        manager_id: manager_id, //change with managerid
        status: 1,
        start_time: modal.result.start.value,
        end_time: modal.result.end.value,
        employee_id: employee_id, //change for currently logged in user
        project_id: modal.result.project,
      };
      axios
        .post("http://localhost:8000/postTimesheetDataByUser", formData)
        .then((response) => {
          console.log("Response:", response.data);
          // Handle the response data here
        });
      console.log(formData);
    },
  };

  useEffect(() => {
    if (!timesheet) {
      return;
    }

    const fetchData = async () => {
      const response = await axios.post(
        "http://localhost:8000/getLatestApproveRequestForEmployee",
        { emp_id: employee_id }
      );
      setLatestDate(response.data["latest_date"]);
    };

    fetchData();
    // const events = [
    // {
    //   id: 1,
    //   text: "Task 1",
    //   start: "2025-05-02T10:00:00",
    //   end: "2025-05-02T11:00:00",
    //   project: 1,
    // },
    //   {
    //     id: 2,
    //     text: "Task 2",
    //     start: "2025-05-05T09:30:00",
    //     end: "2025-05-05T11:30:00",
    //     project: 2,
    //   },
    //   {
    //     id: 3,
    //     text: "Task 3",
    //     start: "2025-05-07T10:30:00",
    //     end: "2025-05-07T13:30:00",
    //     project: 3,
    //   }
    // ];
    // setEvents(events);

    // const firstDay = new DayPilot.Date("2024-10-01");
    // if (timesheet) {
    //   timesheet.scrollTo(firstDay.addHours(9));
    // }
  }, [timesheet]);

  const changeBusiness = (e) => {
    setShowBusinessOnly(e.target.checked);
  };

  const changeSummary = (e) => {
    setShowDailyTotals(e.target.checked);
  };

  useEffect(() => {
    if (showDailyTotals) {
      setRowHeaderColumns([
        { title: "Date" },
        { title: "Day", width: 40 },
        { title: "Total", width: 60 },
      ]);
    } else {
      setRowHeaderColumns([{ title: "Date" }, { title: "Day", width: 40 }]);
    }
  }, [showDailyTotals]);

  return (
    <div>
      <ToastContainer />
      <div className={"toolbar"}>
        <div className={"toolbar-item"}>
          <label>
            <input
              type={"checkbox"}
              onChange={changeBusiness}
              checked={showBusinessOnly}
            />{" "}
            Show only business hours
          </label>
        </div>
        {/* <div className={"toolbar-item"}>
          <label>
            <input
              type={"checkbox"}
              onChange={changeSummary}
              checked={showDailyTotals}
            />{" "}
            Show daily totals
          </label>
        </div> */}
      </div>
      <DayPilotScheduler
        {...config}
        showNonBusiness={!showBusinessOnly}
        rowHeaderColumns={rowHeaderColumns}
        events={events}
        controlRef={setTimesheet}
        // onEventClicked={(args) => {
        //   DayPilot.Modal.alert("Event clicked: " + args.e.id());
        // }}
      />
    </div>
  );
};

export default Timesheet;
