from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
from typing import List

app = FastAPI(title="Misho Kursova Meme Generator")

# Tva pozvolqva da se vruzva frontend-a
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tuka se svurzva s bazata danni, ne go butai
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.misho_db
collection = db.memes

class MemeModel(BaseModel):
    image_url: str
    top_text: str
    bottom_text: str

class MemeResponse(MemeModel):
    id: str

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Meme Generator Backend is running!"}

@app.get("/api/memes", response_model=List[MemeResponse])
async def get_memes():
    memes = []
    cursor = collection.find({})
    async for document in cursor:
        memes.append(MemeResponse(
            id=document["_id"],
            image_url=document["image_url"],
            top_text=document["top_text"],
            bottom_text=document["bottom_text"]
        ))
    return memes

@app.post("/api/memes", response_model=MemeResponse)
async def create_meme(meme: MemeModel):
    meme_dict = meme.dict()
    meme_dict["_id"] = str(uuid.uuid4())
    await collection.insert_one(meme_dict)
    
    return MemeResponse(
        id=meme_dict["_id"],
        image_url=meme_dict["image_url"],
        top_text=meme_dict["top_text"],
        bottom_text=meme_dict["bottom_text"]
    )

@app.delete("/api/memes/{meme_id}")
async def delete_meme(meme_id: str):
    result = await collection.delete_one({"_id": meme_id})
    if result.deleted_count == 1:
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Meme not found")
