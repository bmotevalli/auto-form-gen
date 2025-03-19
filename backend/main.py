from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from pydantic import BaseModel, Field, conint, constr
from typing import Literal

class SedimentaryLog(BaseModel):
    RockType: Literal['Sandstone', 'Limestone', 'Shale'] = Field(..., description="Rock type")
    Colour: constr(strip_whitespace=True, min_length=1) = Field(..., description="Colour as a string")
    Hardness: conint(ge=1, le=10) = Field(..., description="Hardness from 1 to 10")

app = FastAPI()

# Add CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing; you can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/schema")
def get_form_schema():
    return SedimentaryLog.schema()
