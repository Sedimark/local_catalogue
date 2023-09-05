from io import BytesIO
from typing import List, Union
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from minio import Minio
import os
import json
import numpy as np
import pandas as pd
from models.models import Dataset, DatasetSearcher, Metadata, Plot
from fastapi.middleware.cors import CORSMiddleware
from utils import format_pd
import seaborn as sb
import matplotlib.pyplot as plt
import requests
origins = [
    "*",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

ACCESS_KEY = os.environ["ACCESS_KEY"] 
SECRET_KEY = os.environ["SECRET_KEY"]
ENDPOINT   = os.environ["ENDPOINT"]

# @app.get("/read_global_datasets")
# async def read_global_datasets():
#     datasets = []
#     request = requests.get("http://localhost:8001/get_all_objects")
#     data = request.json()
#     for entry in data:
#         for key in entry:
#             client = Minio(key.split("//")[-1], access_key=ACCESS_KEY, secret_key=SECRET_KEY)
#             for dataset in entry[key]:
#                 if "/" in dataset:
#                     dataspace_name = dataset.split("/")[0]
#                     dataset_name   = dataset.split("/")[-1]
#                     if "jsonld" in dataset_name.lower():
#                         if client.bucket_exists(dataspace_name):
#                             metadata = client.stat_object(dataspace_name, dataset_name).metadata
#                             datasets.append(Dataset(name = dataset_name, metadata = Metadata(
#                                 MetaAccess= metadata['x-amz-meta-access'] if 'x-amz-meta-access' in metadata else None,
#                                 MetaDownload= metadata['x-amz-meta-download'] if 'x-amz-meta-download' in metadata else None,
#                                 MetaUploadDate= metadata['x-amz-meta-uploaddate'] if 'x-amz-meta-uploaddate' in metadata else None,
#                                 MetaTagCount= metadata['x-amz-tagging-count'] if 'x-amz-tagging-count' in metadata else None,
#                                 Source = key
#                             ), tags = client.get_object_tags(dataspace_name, dataset_name)))
#     return datasets

@app.get("/read_global_datasets")
async def read_global_datasets():
    request = requests.get("http://localhost:8001/get_all_objects_with_details")
    data = request.json()

    return data

@app.post("/get_dataset/")
async def get_dataset(dataset_searcher: DatasetSearcher):
    request = requests.post("http://localhost:8001/get_dataset", data=json.dumps({
        "url": dataset_searcher.url,
        "name": dataset_searcher.name,
    }))
    data = request.json()
    try:
        dataset_link = data["dataset"]
        df = pd.read_json(dataset_link)
        formated_dataset = format_pd(df).to_json()
        return {
            "data": formated_dataset,
        }
    except:
        raise HTTPException(status_code=404, detail="Dataset not found")


@app.post('/df_col_image')
async def correlation_df_image(details: Plot):
    request = requests.post("http://localhost:8001/get_dataset", data=json.dumps({
        "url": details.url,
        "name": details.dataset_name,
    }))
    data = request.json()
    try:
        dataset_link = data["dataset"]
        df = pd.read_json(dataset_link)
        formated_dataset = format_pd(df)
        sb.set(rc={'figure.figsize':(12,6)})
        plot = sb.lineplot(data=formated_dataset[details.column])
        plt.xlabel("Index")
        plt.ylabel(details.column.capitalize())
        plt.xticks(range(0, len(formated_dataset.index), len(formated_dataset.index)//10))
        plt.title("Plot for {} data".format(details.column.capitalize()))
        
        # create a buffer to store image data
        buf = BytesIO()
        plot.get_figure().savefig(buf, format="png")
        buf.seek(0)
        plt.close() #needed because data will add on the same plot for each request
        return StreamingResponse(buf, media_type="image/png")
    except:
        raise HTTPException(status_code=404, detail="Dataset not found")


    
