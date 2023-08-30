import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import './Datasets.css';

export default function Datasets() {
    const navigate = useNavigate();
    const [datasets, setDatasets]: any = useState([]);
    const [currentDatasets, setCurrentDatasets]: any = useState([]);
    const [tags, setTags]: any = useState([]);
    const [filterTags, setFilterTags] : any = useState({})
    const getDatasets = () => {
        let sessionDatasets = sessionStorage.getItem("datasets");
        if (sessionDatasets === null)
            fetch('http://localhost:8000/read_datasets', {
                method: 'GET',

            }).then(res => res.json()).then((data) => {
                setDatasets(data)
                setCurrentDatasets(data)
                getTags(data)
                sessionStorage.setItem("datasets", JSON.stringify(data))
            })
        else {
            setDatasets(JSON.parse(sessionDatasets))
            setCurrentDatasets(JSON.parse(sessionDatasets))
            getTags(JSON.parse(sessionDatasets))
        }
    }

    useEffect(() => {
        getDatasets();
    }, []);

    const filterByTags = (tags: any) => {
        // let temp = currentDatasets.filter( ds => Object.keys(filterTags).every( filter => {
        //     console.log(ds)
        //     if(ds.tags[filter])
        //         ds.tags[filter].includes(filterTags[filter])

        // } ))
        let temp = datasets.filter( ds => Object.keys(tags).every( filter => {
                 try{
                    if(ds.tags[filter])
                        return tags[filter].includes(ds.tags[filter])
                 }
                 catch(e){
                 }
             } ))
        setCurrentDatasets(temp)
    }

    const removeTagFilter = (key: any, value: any) => {
        let temp = {...filterTags}; 
        if(temp[key])
            temp[key] = temp[key].filter(val => val !== value)
            if(temp[key].length === 0)
                delete temp[key]
        setFilterTags(temp)
        filterByTags(temp)
    }

    const addTagFilter = (key: any, value: any) => {
        let temp = {...filterTags}; 
        if(temp[key])
            temp[key].push(value)
        else
            temp[key] = [value]
        setFilterTags(temp)
        filterByTags(temp)
    }

    const getTags = (dataset: any) => {
        let tags = {}
        dataset.map((key) => {
            if (key.tags) {
                for (let k of Object.keys(key.tags)) {
                    if (tags[k])
                        tags[k].push(key.tags[k])
                    else
                        tags[k] = [key.tags[k]]
                }
            }
        })
        setTags(tags)
    }

    const handleSelectedDataset = (dataset_name, index) => {
        if (datasets && datasets[index])
            navigate('/details/' + dataset_name, { state: datasets[index] })
        else
            alert("Doesnt exist")
    }

    const searchDatasets = (dataset_name) => {
        let temp = currentDatasets.filter((dataset: any) => {
            return dataset.name.includes(dataset_name)
        })
        setCurrentDatasets(temp)
    }

    const cleanFilters = () => {
        setCurrentDatasets(datasets)
        let searchBar = document.getElementById("searchBar") as HTMLInputElement;
        searchBar.value = "";
        setFilterTags({})
        let x = document.getElementsByName("filterCheckBox") as NodeListOf<HTMLInputElement>;
        for(let chk of x){
            chk.checked = false;
        }
    }

    return (
        <>
            <div style={{ marginTop: "2%", marginBottom: "1%" }}>
                <h2> Available datasets </h2>
            </div>
            <div style={{ display: "flex" }}>
                <div className="p-2" style={{ marginLeft: "5%", borderRadius: "5px", width: "15%", backgroundColor: "rgba(39, 86, 125, 0.25)" }}>
                    <h2>Search</h2>
                    <input id="searchBar" type="text" style={{ marginBottom: "2%" }} onChange={(e) => searchDatasets(e.target.value)}>

                    </input>
                    <h2>Filters</h2>
                    <ul style={{ textAlign: "left" }}>
                        {
                            tags ? (<>

                                {Object.keys(tags).map((k, idx) => {
                                    return <>
                                        <h2>{k}</h2>
                                        <div>
                                            {
                                                tags[k].map((value) => {
                                                    return <div>
                                                        <input className="form-check-input" type="checkbox" value="" name="filterCheckBox" onChange={(e) => {
                                                            if(e.target.checked){
                                                                addTagFilter(k, value)
                                                            }
                                                            else{
                                                                removeTagFilter(k, value)
                                                            }
                                                        }} />
                                                        <label className='fw-bold mb-1 ms-3 fs-5'>{value}</label>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </>
                                })}

                            </>) : (<>

                            </>)
                        }
                    </ul>
                    <h3 style={{width: "80%"}} onClick={() => cleanFilters()}>
                        Reset filters
                    </h3>
                </div>
                <div className="p-2 flex-grow-1" style={{ marginLeft: "5%", marginRight: "1%", textAlign: "left" }}>

                    <MDBTable align='middle'>
                        <MDBTableHead>
                            <tr className='fs-4'>
                                <th scope='col'>Dataset name</th>
                                <th scope='col'>Tags</th>
                                <th scope='col'>Upload date</th>
                                <th scope='col'>Downloadable</th>
                                <th scope='col'>Actions</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {currentDatasets ?
                                currentDatasets.map((dataset: any, index) =>
                                    <tr className='fs-5'>

                                        <td>
                                            <div className='d-flex align-items-center'>
                                                <div className='ms-3'>
                                                    <p className='fw-bold mb-1'>{dataset.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {
                                                dataset.tags ? (<>
                                                    {Object.keys(dataset.tags).map((tag) => {
                                                            return <>
                                                            <p className='fw-bold mb-1' >{tag}</p>
                                                            <p className='text-muted mb-0'>{dataset.tags[tag]}</p>
                                                        </>
                                                    })}</>) : (<></>)
                                            }
                                        </td>
                                        <td>
                                            {dataset.metadata["MetaUploadDate"]}
                                        </td>
                                        <td> {dataset.metadata["MetaDownload"]}</td>
                                        <td>
                                            <MDBBtn color='link' rounded className="fs-5" onClick={() => handleSelectedDataset(dataset.name, index)} >
                                                View dataset
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                )
                                : <div></div>}
                        </MDBTableBody>
                    </MDBTable>
                </div>
            </div>
        </>
    );
}
