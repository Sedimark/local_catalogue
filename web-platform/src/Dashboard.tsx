import React, { useState } from 'react';
import FileUploader from './FileUploader';
import Datasets from './Datasets';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Dashboard() {
  const [uploadTrigger, setUploadTrigger] = useState(false)
  const navigate = useNavigate();
  return (
    <div className="App">
      <Navbar loggedIn={!!localStorage.getItem("accessToken")}></Navbar>
      <Datasets></Datasets>
    </div>
  );
}

export default Dashboard;
