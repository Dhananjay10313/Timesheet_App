import axios from "axios";
import React, { useState, useEffect } from "react";
import BasicExample from "./creactedTable";


function MyForm() {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState([]);


  useEffect(()=>{
    axios.post(
      "http://localhost:8000/getTicketDataByUser"
     ,
      {
        "id":1
      }
    ).then((response)=>{
      console.log(response.data)
      setData(response.data)
    });
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Input 1:", inputValue1);
    console.log("Input 2:", inputValue2);
    // setInputValue1(""), setInputValue2("");
   
    const formData={
      "ticket_id":  Math.floor(Math.random() * (10000 - 1 + 1)) + 1,
      "create_at": "2024-10-08", // Replace with the desired date in YYYY-MM-DD format
      "description": inputValue2,
      "status": 0, // Replace with the desired status value
      "creator_id": 1, // Replace with the creator's ID
      "project_id": parseInt(selectedOption), // Replace with the project's ID
      "ref_employee_id": parseInt(inputValue1) 
    }
    // const formData = {
    //   "ticket_id": 0,
    //   "create_at": "2024-10-08",
    //   "description": "string",
    //   "status": 0,
    //   "creator_id": 1,
    //   "project_id": 1,
    //   "ref_employee_id": 1
    // }

    setData([...data, formData]);

    await axios.post(
      "http://localhost:8000/addTicketDataToTable"
     ,
     formData
    )


  };

  return (
    <div>
    <div className="container ticket-container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="input1" className="form-label">
              Employee
            </label>
            <input
              type="text"
              className="form-control"
              id="input1"
              value={inputValue1}
              onChange={(e) => setInputValue1(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="input2" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="input2"
              value={inputValue2}
              onChange={(e) => setInputValue2(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="select" className="form-label">
              Select Project
            </label>
            <select
              className="form-select"
              id="select"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="1">Option 1</option>
              <option value="1">Option 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
    <BasicExample data={data}/>
    </div>
  );
}

export default MyForm;
