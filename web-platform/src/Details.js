import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import "./Details.css";
import Navbar from "./Navbar";
import ReusableTable from "./ReusableTable";

export default function Details(props) {
  const { id } = useParams();
  const { state } = useLocation();
  const [dataset, setDataset] = useState(null);
  const [columns, setColumns] = useState(null);
  console.log(state)
  const readDataset = () => {
    let sessionDataset = sessionStorage.getItem(id);
    if(sessionDataset === null)
      fetch("http://localhost:8000/get_dataset/"+id, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          let temp = JSON.parse(data["data"])
          setDataset(temp);
          console.log(temp)
          sessionStorage.setItem(id, JSON.stringify(temp))
        });
    else{
      setDataset(JSON.parse(sessionDataset))
    }
    
  };

  useEffect(() => {
    readDataset();
  }, []);

  return (
   <>
    <Navbar></Navbar>
    <div class="d-flex">
      <div class="p-2" style={{marginLeft: "5%"}}>
        <h2>Details about the dataset</h2>
        <p>Name: {state ? state.name : "Loading..."}</p>
        <p>Metadatas: </p>
        <div style={{marginLeft: "5%"}}>
        {
          state ?
            Object.keys(state["metadata"] || []).map((e, i) => {
              return <p>{e} : {state["metadata"][e]}</p>  
            })
          : 
            "Loading..."
        }
        </div>
        <p>Tags: </p>
        <div style={{marginLeft: "5%"}}>
        {
          state ?
            Object.keys(state["tags"] || []).map((e, i) => {
              return <p>{e} : {state["tags"][e]}</p>              
            })
          : 
            "Loading..."
        }
        </div>
      </div>
      
      <div class="p-2 flex-grow-1" style={{marginLeft: "5%", marginRight: "1%"}}>
        <h2>Dataset table</h2>
        {
          dataset && state ? (
            <ReusableTable data={dataset} dataset_name={state.name}></ReusableTable>
          ) : (
            <></>
          )
        }
      </div>
    </div>
   </>
  );
}
