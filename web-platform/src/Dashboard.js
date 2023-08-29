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
      <div className="body">
       
        {/* <div class="r-navbar">
         <div class="top-left">
         <h2 style={{color: "rgba(39, 86, 125, 1)"}} onClick={() => navigate('/')}> SEDIMARK Catalogue </h2>
         </div> 
         <div class="r-navbar top-right">
          <h3 style={{"width": "200px"}} onClick={() => setUploadTrigger(!uploadTrigger)}> Upload File </h3>
         </div>       
        </div> */}
        <div class="body-inner">
        <div class="idk">
            { uploadTrigger ? <FileUploader></FileUploader> : <div></div> }
        </div>
        
        </div>
        <div class="datasets">
            <Datasets></Datasets>
        </div>
        
      </div>
      
    </div>
  );
}

export default Dashboard;
