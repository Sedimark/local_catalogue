import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';
import Navbar from "./Navbar";
export default function Login() {
  let navigate = useNavigate();
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const login = () => {
    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user,
        password: password
      })
    }).then(res => res.json()).then((data) => {
      localStorage.setItem("accessToken", data.access_token);
      navigate('/dashboard')
    })
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="body">
        <div className="Login">
          <div className="form">
            <div className="top">
              <h2> Login into the platform </h2>
            </div>
            <div className="credentials-form">
              <input type="text" placeholder='Username' id="username" onChange={(e) => { setUser(e.target.value) }} />
              <input type="password" placeholder='Password' id="password" onChange={(e) => { setPassword(e.target.value) }} />
              <button className="loginButton" onClick={() => { login() }}>Login</button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
