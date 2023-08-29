import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Datasets.css';

export default function Datasets() {
    const navigate = useNavigate();
    const [datasets, setDatasets] = useState([]);

    const getDatasets = () => {
        let sessionDatasets = sessionStorage.getItem("datasets");
        if(sessionDatasets === null)
            fetch('http://localhost:8000/read_datasets', {
                method: 'GET',

            }).then(res => res.json()).then((data) => {
                setDatasets(data)
                console.log(data)
                sessionStorage.setItem("datasets", JSON.stringify(data))
            })
        else{
            setDatasets(JSON.parse(sessionDatasets))
        }
    }

    useEffect(() => {
        getDatasets();
    }, []);

    const handleSelectedDataset = (dataset_name, index) => {
        if(datasets && datasets[index])
            navigate('/details/'+dataset_name, { state: datasets[index] })
        else
            alert("Doesnt exist")
    }

    return (
        <div className="Datasets">
            <div class="datasets-form">
                <div class="top">
                    <h2 class="dataset-title"> Datasets available </h2>
                </div>
                <div class="datasets-list">
                    <ul>
                        {datasets ?
                            datasets.map((dataset, index) => <li onClick={() => handleSelectedDataset(dataset.name, index)} key={dataset.name + index.toString()} >{dataset.name}</li>)
                            : <div></div>}
                    </ul>
                </div>
            </div>
        </div>
    );
}
