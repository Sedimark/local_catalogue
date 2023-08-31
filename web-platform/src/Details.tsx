import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import "./Details.css";
import Navbar from "./Navbar";
import ReusableTable from "./ReusableTable";

export default function Details(props) {
  const { id } : any = useParams();
  const { state } : any = useLocation();
  const [dataset, setDataset] : any = useState(null);
  const [columns, setColumns] = useState(null);

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
  const triggerTrain = (dataset_name: string) => {

  }
  useEffect(() => {
    readDataset();
  }, []);

  return (
   <>
    <Navbar></Navbar>
    <div className="d-flex">
      <div className="p-2" style={{marginLeft: "5%", width: "15%"}}>
        <h2>Details about the dataset</h2>
        <div style={{backgroundColor: "rgba(39, 86, 125, 0.25)", paddingLeft: "10px", marginTop: "5px", overflowX: "clip"}}>
        <h4>Name: {state ? state.name : "Loading..."}</h4>
        <h4>Metadatas: </h4>
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
        <h4>Tags: </h4>
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
        <h3 style={{"width": "200px"}} onClick={() => triggerTrain(dataset.name)}> Trigger train </h3>  
        </div>
      </div>
      
      <div className="p-2 flex-grow-1" style={{marginLeft: "1%", marginRight: "1%"}}>
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
