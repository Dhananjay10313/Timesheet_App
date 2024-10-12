import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import SideBar from "./Sidebar";
import Button from "react-bootstrap/Button";
import Navbark from "./Navbar";
import EditableTable from "./RefTable";
import MyForm from "./TicketInpBox";
import TicketPage from "./TicketPage";

function App() {
  const [openSidebarToggle, setOpenSidebcdarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      {/* <Navbark />
      <container style={{ display: "flex" }}> */}
      <SideBar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      {/* <TicketPage />
      </container> */}
      {/* <MyForm /> */}
    </>
  );
}

export default App;
