from pydantic import BaseModel, EmailStr

class Dataset(BaseModel):
    name: str
    tags: dict | None = {}
    metadata: dict | None = {}

class DatasetSearcher(BaseModel):
    url: str
    name: str
    
class Metadata(BaseModel):
    MetaAccess: str | None = ""
    MetaDownload: str | None = ""
    MetaUploadDate: str | None = ""
    MetaTagCount: str | None = ""
    Source: str | None = ""

class Plot(BaseModel):
    column: str
    url: str
    dataset_name: str