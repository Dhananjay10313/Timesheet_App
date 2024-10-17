import React, { useState } from "react";

function MyForm() {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Input 1:", inputValue1);
    console.log("Input 2:", inputValue2);
    setInputValue1(""), setInputValue2("");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="input1" className="form-label">
              Input 1
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
              Input 2
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
              Select an option
            </label>
            <select
              className="form-select"
              id="select"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
}

export default MyForm;
