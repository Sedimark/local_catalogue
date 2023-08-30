import React, { useState } from "react";
import './FileUploader.css';

const uploadFile = async (file) => {
  let fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = (e) => {
    let data = new FormData();
    data.append("file", file);
    
    console.log(data);
    fetch("http://localhost:8000/upload_dataset", {
      method: "POST",
      body: data,
      headers: {
        'Authorization': 'Bearer '+localStorage.getItem("accessToken"),
      },
      }).then(res => res.json()).then(response => {
          console.log(response);      
    });
  };
};

export default function FileUploader() {
  const [file, setFile] = useState("");

  const handleFileUpload = (e) => {
    setFile(e.target.files[0])
  }

  return (
      <div className="Upload">
        <label htmlFor="contained-button-file">
        <input
            type="file"
            class="file"
            onChange={handleFileUpload}
          />
        </label>
        <button
            class="upload-button"
            onClick={() => uploadFile(file)}
            
          >
              Upload file
          </button>
      </div>
  );
}
