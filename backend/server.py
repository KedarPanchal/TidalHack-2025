from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from llm_manager.llm_manager import LLMManager

app = FastAPI()

class PromptInput(BaseModel):
    prompt: str

class ModelResponse(BaseModel):
    response: str


@app.get("/")
def root():
    return ModelResponse(response="Server is running.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)