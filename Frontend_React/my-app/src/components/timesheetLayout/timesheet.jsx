import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import axios from "axios";
// import { formatDate } from 'react-datepicker/dist/date_utils';

const Timesheet = ({ employee_id, events, modProjects }) => {
  const [timesheet, setTimesheet] = useState(null);

  // console.log("from timesheet")
  console.log("events", events);

  // const [events, setEvents] = useState([]);
  const [showBusinessOnly, setShowBusinessOnly] = useState(false);
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
    cellDuration: 15,
    eventHeight: 40,
    heightSpec: "Max",
    height: 450,
    days: 31,
    viewType: "Days",
    startDate: "2024-10-01",
    allowEventOverlap: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      if (employee_id !== 1) return; // Change 1 to currently logged in user
      const timesheet = args.control;
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
        id: DayPilot.guid(),
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
      console.log(modal.result.end.value);
      console.log(events);

      const formData = {
        task_name: modal.result.text,
        manager_id: 1, //change with managerid
        status: 1,
        start_time: modal.result.start.value,
        end_time: modal.result.end.value,
        employee_id: 1, //change for currently logged in user
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

    const firstDay = new DayPilot.Date("2025-05-01");
    if (timesheet) {
      timesheet.scrollTo(firstDay.addHours(9));
    }
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
        <div className={"toolbar-item"}>
          <label>
            <input
              type={"checkbox"}
              onChange={changeSummary}
              checked={showDailyTotals}
            />{" "}
            Show daily totals
          </label>
        </div>
      </div>
      <DayPilotScheduler
        {...config}
        showNonBusiness={!showBusinessOnly}
        rowHeaderColumns={rowHeaderColumns}
        events={events}
        controlRef={setTimesheet}
      />
    </div>
  );
};

export default Timesheet;
