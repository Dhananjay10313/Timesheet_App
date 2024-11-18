import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox 
} from "@mui/material";
// import { formatDate } from 'react-datepicker/dist/date_utils';

const Timesheet = ({ employee_id, events, modProjects }) => {
  const [timesheet, setTimesheet] = useState(null);

  // //console.log("from timesheet")
  //console.log("events", events);

  // const [events, setEvents] = useState([]);
  const [showBusinessOnly, setShowBusinessOnly] = useState(true);
  const [showDailyTotals, setShowDailyTotals] = useState(false);
  const [rowHeaderColumns, setRowHeaderColumns] = useState([
    { title: "Date" },
    { title: "Day", width: 40 },
  ]);

  //console.log("modProjects1", modProjects);
 
  //console.log("modProjects1", modProjects);
  // modProjects[0].id=1
  // useEffect(()=>{
  //   if(modProjects.length>0 && modProjects[0]!==null && modProjects[0].id!==null){
  //     modProjects[0].id=1
  //   }
  // },[modProjects])
  
  const projects = modProjects.length>0
    ? modProjects
    : [
        { id: 12, name: "Project A", color: "#38761d" },
        { id: 290092, name: "Project B", color: "#0d8ecf" },
        { id: 394940, name: "Project C", color: "#f1c232" },
      ];

  const currentDate = new Date();

  // Target date (October 1, 2024)
  const targetDate = new Date("2024-10-01");

  // Calculate the difference in time
  const timeDifference = currentDate - targetDate;

  // Convert time difference from milliseconds to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  //console.log("daysDifference", daysDifference)

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
      if(modProjects.length==0){
        return
      }
      const duration = new DayPilot.Duration(args.data.start, args.data.end);
      const project = projects.find((p) => (p.id == args.data.project));
      //console.log("new log",args.data.project)
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
    cellDuration: 30,
    eventHeight: 40,
    heightSpec: "Max",
    height: 473,
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
      //console.log(modal.result.end.value);
      //console.log(events);

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
          //console.log("Response:", response.data);
          // Handle the response data here
        });
      //console.log(formData);
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
      <AppBar position="static" sx={{ backgroundColor: 'black', mb: 1, mt:0}}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={changeBusiness}
                  checked={showBusinessOnly}
                  sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                />
              }
              label="Show only business hours"
            />
            {/* <FormControlLabel
              control={
                <Checkbox onChange={changeSummary} checked={showDailyTotals}  sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />
              }
              label="Show daily totals"
            /> */}
          </Box>
          { employee_id!=0 && <Typography variant="h6">{"Employee ID: "+ employee_id}</Typography>}
        </Toolbar>
      </AppBar>
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
