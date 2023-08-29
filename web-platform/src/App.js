import React, { useState } from 'react';

import Navbar from "./Navbar";
import './App.css';

function App() {
  const [loginTrigger, setLoginTrigger] = useState(false)
  
  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="body">
      </div>
    </div>
  );
}

export default App;
