// // import React, { useState, useEffect } from "react";

// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // import LeaveEditableTable from "./LeaveApply";
// // import axios from "axios";
// // import ApproveLeaveTable from "./LeaveApprove";

// // // export default function DateInput() {
// // //         const [startDate, setStartDate] = useState(new Date());
// // //         const [endDate, setEndDate] = useState(null);

// // // const handleChange = (range) => {
// // //     const [startDate, endDate] = range;
// // //     setStartDate(startDate);
// // //     setEndDate(endDate);
// // //   };

// // //           return (
// // //             <div>
// // //   <DatePicker
// // //     selected={startDate}
// // //     onChange={handleChange}
// // //     startDate={startDate}
// // //     endDate={endDate}
// // //     minDate={new Date()}
// // //     selectsRange
// // //   />
// // //             </div>
// // //           );
// // //     }



// // async function fetchLeaveData(emp_id) {
// //   try {
// //     const response = await axios.post(
// //       "http://localhost:8000/getLeaveDataByUser",
// //       {
// //         id: emp_id, //change by currently logged in user
// //       }
// //     );
// //     console.log("fetchrrrrrrrrrrrrrrrrrrrrrrr", response.data);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error fetching timesheet data:", error);
// //     return [];
// //   }
// // }


// // async function fetchLeaveRemainingData(emp_id) {
// //   try {
// //     const response = await axios.post(
// //       "http://localhost:8000/getLeavesRemaining",
// //       {
// //         id: emp_id, //change by currently logged in user
// //       }
// //     );
// //     console.log("fetchrrrrrrrrrrrrrrrrrrrrrrr", response.data);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error fetching timesheet data:", error);
// //     return [];
// //   }
// // }




// // function LeaveInputBox() {
// //   const [startDate, setStartDate] = useState(new Date());
// //   const [endDate, setEndDate] = useState(null);
// //   const [inputValue, setInputValue] = useState("");
// //   //   const [selectedOption, setSelectedOption] = useState('Option 1');
// //   const [inputValue1, setInputValue1] = useState("");
// //   const [inputValue2, setInputValue2] = useState("");
// //   const [cont, setCont] =useState(0);
// //   const [data, setData] = useState([
// //     { id: "numa", name: "jdsh", status: "io" },
// //   ]);
// //   const [balanceData, setBalanceData] = useState(null);
// //   const [selectedOption, setSelectedOption] = useState("");

// //   useEffect(() => {
// //     // axios
// //     //   .post("http://localhost:8000/getLeaveDataByUser", {
// //     //     id: 1,
// //     //   })
// //     //   .then((response) => {
// //     //     console.log(response.data);
// //     //     setData(response.data);
// //     //   });

// //     //   const leaveData= await fetchLeaveData(1);
// //     //   setData(leaveData)
// //     //   console.log("Leave",data)

// //     // axios
// //     //   .post("http://localhost:8000/getLeavesRemaining", {
// //     //     id: 1,
// //     //   })
// //     //   .then((response) => {
// //     //     // console.log("balance data",response.data);
// //     //     setBalanceData(response.data);
// //     //     console.log("balance data",balanceData);
// //     //   });


// //     const fetchData = async () => {
// //       const leaveResponse = await fetchLeaveData(1);
// //       // console.log("Leave data: ", leaveResponse);
// //       setData(leaveResponse);
// //       console.log("Leave Data: ", data);
      

// //       // const formattedDataList = timesheetResponse.map((item) => ({
// //       //   id: item.id,
// //       //   text: item.text,
// //       //   start: item.start,
// //       //   end: item.end,
// //       //   project: item.project,
// //       // }));
// //       // setFormattedData(formattedDataList);
// //       // console.log("timesheetData updated: ", timesheetData);

// //       try {
// //         const remainingResponse = await fetchLeaveRemainingData(1);
// //         setBalanceData(remainingResponse);
// //         console.log("remaining data", balanceData)
        
// //       } catch (error) {
// //         console.error("Error fetching approval data:", error);
// //       }
// //     };

// //     fetchData();

// //   }, []);

  

// //   const handleStartDateChange = (date) => {
// //     setStartDate(date);
// //   };

// //   const handleChange = (range) => {
// //     const [startDate, endDate] = range;
// //     setStartDate(startDate);
// //     setEndDate(endDate);
// //   };

// //   const handleEndDateChange = (date) => {
// //     setEndDate(date);
// //   };

// //   const handleInputChange = (event) => {
// //     setInputValue(event.target.value);
// //   };

// //   const handleOptionChange = (event) => {
// //     setSelectedOption(event.target.value);
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     // Handle form submission here
// //     console.log("Start Date:", startDate);
// //     console.log("End Date:", endDate);
// //     console.log("Input Value:", inputValue);
// //     console.log("Selected Option:", selectedOption);
// //     const dateObject = new Date(startDate);
// //     const formattedDate = dateObject.toISOString().slice(0, 10);
// //     console.log(formattedDate);
// //     setStartDate(formattedDate);

// //     const dateObject1 = new Date(endDate);
// //     const formattedDate1 = dateObject1.toISOString().slice(0, 10);
// //     console.log(typeof formattedDate1);

// //     setEndDate(formattedDate1);

// //     const formData = {
// //       leave_id: 1,
// //       start_time: formattedDate,
// //       end_time: formattedDate1,
// //       reason: inputValue2,
// //       t_id: parseInt(selectedOption),
// //       status: 1,
// //       manager_id: 1,
// //       employee_id: 1,
// //     };

// //     const tdays = Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
// //     console.log(tdays);

// //     const selectedData = balanceData.find(
// //       (item) => item.t_id === selectedOption
// //     );
// //     if (selectedData && selectedData.balance < selectedData.tdays) {
// //       setAlertMessage(`Balance for ticket ${selectedOption} is not available.`);
// //     } else {
// //       axios.post("http://localhost:8000/addLeaveDataToTable", formData);
// //       setData([...data, formData]);
// //       console.log(data);
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className="container ticket-container">
// //         <form onSubmit={handleSubmit}>
// //           <div className="row">
// //             <div className="col-md-6">
// //               <label htmlFor="input1" className="form-label">
// //                 Input 1
// //               </label>
// //               <DatePicker
// //                 selected={startDate}
// //                 onChange={handleChange}
// //                 startDate={startDate}
// //                 endDate={endDate}
// //                 minDate={new Date()}
// //                 selectsRange
// //               />
// //             </div>
// //             <div className="col-md-6">
// //               <label htmlFor="input2" className="form-label">
// //                 Input 2
// //               </label>
// //               <input
// //                 type="text"
// //                 className="form-control"
// //                 id="input2"
// //                 value={inputValue2}
// //                 onChange={(e) => setInputValue2(e.target.value)}
// //               />
// //             </div>

// //             <div className="col-md-6">
// //               <label htmlFor="select" className="form-label">
// //                 Select an option
// //               </label>
// //               <select
// //                 className="form-select"
// //                 id="select"
// //                 value={selectedOption}
// //                 onChange={(e) => setSelectedOption(e.target.value)}
// //               >
// //                 <option value="">Select...</option>
// //                 <option value="1">Sick Leave</option>
// //                 <option value="2">Casual Leave</option>
// //                 <option value="3">Paid Leave</option>
// //                 {/* Add more options as needed */}
// //               </select>
// //             </div>
// //           </div>
// //           <button type="submit" className="btn btn-primary mt-3">
// //             Submit
// //           </button>
// //         </form>
// //       </div>
// //       <LeaveEditableTable data={data} />
// //       <ApproveLeaveTable/>
// //     </div>
// //     // <div className="form-container">
// //     //   <div className="date-picker-container">
// //     //   <DatePicker
// //     //         selected={startDate}
// //     //         onChange={handleChange}
// //     //         startDate={startDate}
// //     //         endDate={endDate}
// //     //         minDate={new Date()}
// //     //         selectsRange
// //     //       />
// //     //   </div>
// //     //   <div className="input-container">
// //     //     <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter Value" />
// //     //   </div>
// //     //   <div className="dropdown-container">
// //     //     <select value={selectedOption} onChange={handleOptionChange}>
// //     //       <option value="Option 1">Option 1</option>
// //     //       <option value="Option 2">Option 2</option>
// //     //       <option value="Option 3">Option 3</option>
// //     //     </select>
// //     //   </div>
// //     //   <div className="submit-container">
// //     //     <button type="submit" onClick={handleSubmit}>Submit</button>
// //     //   </div>
// //     // </div>
// //   );
// // }

// // export default LeaveInputBox;

// // //     const [date, setDate] = useState(new Date());
// // //   const [startDate, setStartDate] = useState();
// // //   const [endDate, setEndDate] = useState();

// // //   const handleChange = (range) => {
// // //     const [startDate, endDate] = range;
// // //     setStartDate(startDate);
// // //     setEndDate(endDate);
// // //   };

// // //   return (
// // //     <div>
// // //       <DatePicker selected={date} onChange={handleChange} />
// // //     </div>
// // //   );



// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import LeaveEditableTable from "./LeaveApply";
// import axios from "axios";
// import ApproveLeaveTable from "./LeaveApprove";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// async function fetchLeaveData(emp_id) {
//   try {
//     const response = await axios.post(
//       "http://localhost:8000/getLeaveDataByUser",
//       {
//         emp_id: emp_id, //change by currently logged in user
//       }
//     );
//     console.log("fetchrrrrrrrrrrrrrrrrrrrrrrr", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching timesheet data:", error);
//     return [];
//   }
// }

// async function fetchLeaveRemainingData(emp_id) {
//   try {
//     const response = await axios.post(
//       "http://localhost:8000/getLeavesRemaining",
//       {
//         emp_id: emp_id, //change by currently logged in user
//       }
//     );
//     console.log("fetchrrrrrrrrrrrrrrrrrrrrrrr", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching timesheet data:", error);
//     return [];
//   }
// }

// function LeaveInputBox() {
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [inputValue1, setInputValue1] = useState("");
//   const [inputValue2, setInputValue2] = useState("");
//   const [cont, setCont] = useState(0);
//   const [data, setData] = useState([{ id: "numa", name: "jdsh", status: "io" }]);
//   const [balanceData, setBalanceData] = useState(null);
//   const [selectedOption, setSelectedOption] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       const leaveResponse = await fetchLeaveData(1);
//       setData(leaveResponse);
//       console.log("Leave Data: ", leaveResponse);

//       try {
//         const remainingResponse = await fetchLeaveRemainingData(1);
//         setBalanceData(remainingResponse);
//       } catch (error) {
//         console.error("Error fetching approval data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     console.log("Updated balance data: ", balanceData);
//   }, [balanceData]);

//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };

//   const handleChange = (range) => {
//     const [startDate, endDate] = range;
//     setStartDate(startDate);
//     setEndDate(endDate);
//   };

//   const handleEndDateChange = (date) => {
//     setEndDate(date);
//   };

//   const handleInputChange = (event) => {
//     setInputValue(event.target.value);
//   };

//   const handleOptionChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log("Start Date:", startDate);
//     console.log("End Date:", endDate);
//     console.log("Input Value:", inputValue);
//     console.log("Selected Option:", selectedOption);
//     const dateObject = new Date(startDate);
//     const formattedDate = dateObject.toISOString().slice(0, 10);
//     console.log(formattedDate);
//     setStartDate(formattedDate);

//     const dateObject1 = new Date(endDate);
//     const formattedDate1 = dateObject1.toISOString().slice(0, 10);
//     console.log(typeof formattedDate1);

    
//     setEndDate(formattedDate1);

//     const formData = {
//       start_time: formattedDate,
//       end_time: formattedDate1,
//       reason: inputValue2,
//       t_id: parseInt(selectedOption),
//       status: 1,
//       manager_id: 1,
//       employee_id: 1,
//     };

//     const tdays = Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
//     console.log("tdays",tdays);

//     const selectedData = await balanceData.find(
//       (item) => item.t_id == selectedOption
//     );

//     balanceData.map((item, index) => (
//       console.log(index,item.t_id===1)
//     ))

//     // console.log

//     console.log("dsjkhd", typeof selectedData.balance)
//     if (selectedData.balance < tdays) {
//       console.log(`Balance for ticket ${selectedOption} is not available.`);
//       console.log("alter")
//       toast.error("Specified holidays not available");
//     } else {
//       axios.post("http://localhost:8000/addLeaveDataToTable", formData);
//       axios.post("http://localhost:8000/updateRemainingLeaves",{
//         emp_id: 1, // change with current user
//         t_id: parseInt(selectedOption),
//         days: parseInt(tdays)
//       })
//       setData([...data, formData]);
//       console.log(data);
//     }
//   };

//   return (
//     <div>
//       <ToastContainer/>
//       <div className="container ticket-container">
//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-md-6">
//               <label htmlFor="input1" className="form-label">
//                 Input 1
//               </label>
//               <DatePicker
//                 selected={startDate}
//                 onChange={handleChange}
//                 startDate={startDate}
//                 endDate={endDate}
//                 minDate={new Date()}
//                 selectsRange
//               />
//             </div>
//             <div className="col-md-6">
//               <label htmlFor="input2" className="form-label">
//                 Input 2
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="input2"
//                 value={inputValue2}
//                 onChange={(e) => setInputValue2(e.target.value)}
//               />
//             </div>

//             <div className="col-md-6">
//               <label htmlFor="select" className="form-label">
//                 Select an option
//               </label>
//               <select
//                 className="form-select"
//                 id="select"
//                 value={selectedOption}
//                 onChange={(e) => setSelectedOption(e.target.value)}
//               >
//                 <option value="">Select...</option>
//                 <option value="1">Sick Leave</option>
//                 <option value="2">Casual Leave</option>
//                 <option value="3">Paid Leave</option>
//                 {/* Add more options as needed */}
//               </select>
//             </div>
//           </div>
//           <button type="submit" className="btn btn-primary mt-3">
//             Submit
//           </button>
//         </form>
//       </div>
//       <LeaveEditableTable data={data} />
//       <ApproveLeaveTable />
//     </div>
//   );
// }

// export default LeaveInputBox;




import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LeaveEditableTable from "./LeaveApply";
import axios from "axios";
import ApproveLeaveTable from "./LeaveApprove";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

async function fetchLeaveData(emp_id) {
  try {
    const response = await axios.post("http://localhost:8000/getLeaveDataByUser", { emp_id });
    return response.data;
  } catch (error) {
    console.error("Error fetching leave data:", error);
    return [];
  }
}

async function fetchLeaveRemainingData(emp_id) {
  try {
    const response = await axios.post("http://localhost:8000/getLeavesRemaining", { emp_id });
    return response.data;
  } catch (error) {
    console.error("Error fetching leave remaining data:", error);
    return [];
  }
}

function LeaveInputBox() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [balanceData, setBalanceData] = useState([]);
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const leaveResponse = await fetchLeaveData(1); // Fetch for employee ID 1 (you can replace with dynamic value)
      setData(leaveResponse);

      const remainingResponse = await fetchLeaveRemainingData(1);
      setBalanceData(remainingResponse);
    };

    fetchData();
  }, []);

  useEffect(()=>{
    console.log("balance Data", balanceData)
  },[balanceData])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = endDate?.toISOString().slice(0, 10);

    const daysRequested = Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    const selectedData = balanceData.find((item) => item.t_id == selectedOption);

    console.log("selectedData", selectedData)
    if (selectedData?.balance < daysRequested) {
      toast.error("Specified holidays not available");
    } else {
      // Post the leave application and update remaining leaves
      await axios.post("http://localhost:8000/addLeaveDataToTable", {
        start_time: formattedStartDate,
        end_time: formattedEndDate,
        reason,
        t_id: parseInt(selectedOption),
        status: 1,
        manager_id: 1,
        employee_id: 1,
      });

      await axios.post("http://localhost:8000/updateRemainingLeaves", {
        emp_id: 1, // Adjust based on current user
        t_id: parseInt(selectedOption),
        days: parseInt(daysRequested),
      });

      setData([...data, { start_date: formattedStartDate, end_date: formattedEndDate, reason, t_id: parseInt(selectedOption), status: 1, leave_id: Math.floor(Math.random() * (10000 - 1 + 1)) + 1}]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h2>Apply for Leave</h2>

        {/* Reason Input */}
        <TextField
          label="Reason for Leave"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Date Pickers for Leave Start and End Date */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "1px" }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
            minDate={dayjs()} // Ensure the start date cannot be before today
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
            minDate={startDate || dayjs()} // Ensure the end date cannot be before the start date
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </div>

        {/* Leave Type Selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Leave Type</InputLabel>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <MenuItem value="1">Sick Leave</MenuItem>
            <MenuItem value="2">Casual Leave</MenuItem>
            <MenuItem value="3">Paid Leave</MenuItem>
            {/* Add more leave types as needed */}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Leave Application
        </Button>
      </div>

      {/* Display Leave Data */}
      <LeaveEditableTable data={data} />
      <ApproveLeaveTable />
    </LocalizationProvider>
  );
}

export default LeaveInputBox;

