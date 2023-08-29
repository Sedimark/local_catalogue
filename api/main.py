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
from models.models import Dataset, Metadata, Plot
from fastapi.middleware.cors import CORSMiddleware
from utils import format_pd
import seaborn as sb
import matplotlib.pyplot as plt

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

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/read_datasets")
async def read_datasets() -> List[Dataset]:
    datasets = []
    client   = Minio(ENDPOINT, access_key=ACCESS_KEY, secret_key=SECRET_KEY)
    if client.bucket_exists("dataspace"):
        for item in client.list_objects("dataspace", recursive=True):
            metadata = client.stat_object("dataspace", item.object_name).metadata
            datasets.append(Dataset(name = item.object_name, metadata = Metadata(
                MetaAccess= metadata['x-amz-meta-access'] if 'x-amz-meta-access' in metadata else None,
                MetaDownload= metadata['x-amz-meta-download'] if 'x-amz-meta-download' in metadata else None,
                MetaUploadDate= metadata['x-amz-meta-uploaddate'] if 'x-amz-meta-uploaddate' in metadata else None,
                MetaTagCount= metadata['x-amz-tagging-count'] if 'x-amz-tagging-count' in metadata else None
            ), tags = client.get_object_tags("dataspace", item.object_name)))
    return datasets


@app.get("/get_dataset/{dataset_name}")
async def get_datasets_name(dataset_name: str):
    client   = Minio(ENDPOINT, access_key=ACCESS_KEY, secret_key=SECRET_KEY)
    if client.bucket_exists("dataspace"):
        try:
            dataset_object = client.get_object("dataspace", dataset_name)
            dataset = pd.DataFrame.from_dict(json.loads(dataset_object.data))
            formated_dataset = format_pd(dataset).to_json()
        except:
            raise HTTPException(status_code=404, detail="Dataset not found")
        return {
            "data": formated_dataset,
        }
    raise HTTPException(status_code=404, detail="Bucket not found")

@app.post('/df_col_image')
async def correlation_df_image(details: Plot):
    client   = Minio(ENDPOINT, access_key=ACCESS_KEY, secret_key=SECRET_KEY)
    if client.bucket_exists("dataspace"):
        try:
            dataset_object = client.get_object("dataspace", details.dataset_name)
            dataset = pd.DataFrame.from_dict(json.loads(dataset_object.data))
            formated_dataset = format_pd(dataset)
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

        except:
            raise HTTPException(status_code=404, detail="Dataset not found")
        return StreamingResponse(buf, media_type="image/png")
    raise HTTPException(status_code=404, detail="Bucket not found")
    
