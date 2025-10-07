from pydantic import BaseModel, Field
import uuid, datetime as dt

class Macros(BaseModel):
    protein_g: float
    carbs_g: float
    fat_g: float

class Item(BaseModel):
    name: str
    quantity: float
    unit: str
    calories: float
    macros: Macros
    confidence: float

class MealAnalysis(BaseModel):
    meal_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp_iso: str = Field(default_factory=lambda: dt.datetime.utcnow().isoformat() + "Z")
    items: list[Item]
    calories_total: float
    suggestion: str
    assumptions: list[str] = []
    source_image_id: str | None = None
    model_version: str | None = None
