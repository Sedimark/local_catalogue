import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import "./Plot.css";

const correlationDatasetImage = (dataset_name, col) => {
    fetch("http://localhost:8000/df_col_image", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'column': col,
        'dataset_name': dataset_name,
      }),
    })
    .then(response => response.blob())
    .then(blob => {
        var blobURL = URL.createObjectURL(blob);
        var image = document.getElementById(col) as HTMLImageElement;
        image!.onload = function(){
            URL.revokeObjectURL(image.src); // release the blob URL once the image is loaded
        }
        image!.src = blobURL;
    })
    .catch(error => {
        console.error(error);
    });
  };

export default function Plot(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    correlationDatasetImage(props.dataset_name, props.col);
  }

  return (
    <>
      <button className="plotButton" onClick={handleShow}>
        {props.col.toUpperCase()}
      </button>

      <Modal show={show} size="xl" aria-labelledby="contained-modal-title-vcenter"
      centered onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.col.toUpperCase()}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body><img style={{width:"1100px", height:"600px"}} alt={props.col} id={props.col}></img></Modal.Body>
        
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}