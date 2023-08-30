import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    MDBNavbar,
    MDBContainer,
    MDBNavbarNav,
    MDBCollapse
  } from 'mdb-react-ui-kit';
import FileUploader from './FileUploader';

export default function Navbar(props) {
  const navigate = useNavigate();
  const [uploadTrigger, setUploadTrigger] = useState(false)
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    navigate("/")
  }

  return (
    <>
      <MDBNavbar expand='lg' style={{top: "0", right: "0", left: "0", background: "rgba(39, 86, 125, 0.25)"}}>
      <MDBContainer fluid>
        <h2 style={{color: "rgba(39, 86, 125, 1)"}} onClick={() => navigate('/dashboard')}> SEDIMARK Catalogue </h2>
        <MDBCollapse navbar >
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            
          </MDBNavbarNav>
          <div className="r-navbar">
            {!props.loggedIn ? (
                <>
              <h3 style={{"width": "200px"}} onClick={() => navigate('/login')}> Login </h3>  
                </>
            ) : (
                <>
                <h3 style={{"width": "200px", marginRight: "1%"}} onClick={() => handleLogout()}> Logout </h3>  
                <h3 style={{"width": "200px"}} onClick={() => setUploadTrigger(!uploadTrigger)}> Upload File </h3>
                </>
            )}
          </div>       
        </MDBCollapse>
      </MDBContainer>
      </MDBNavbar>

      { uploadTrigger ? <FileUploader></FileUploader> : <div></div> }

    </>
  );
}