from pydantic import BaseModel, EmailStr

class Dataset(BaseModel):
    name: str
    tags: dict | None = {}
    metadata: dict | None = {}

class Metadata(BaseModel):
    MetaAccess: str | None = ""
    MetaDownload: str | None = ""
    MetaUploadDate: str | None = ""
    MetaTagCount: str | None = ""

class Plot(BaseModel):
    column: str
    dataset_name: str