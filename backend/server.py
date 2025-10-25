from fastapi import FastAPI, Depends
from pydantic import BaseModel
import uvicorn
from llm_manager.llm_manager import LLMManager

app = FastAPI()

class PromptInput(BaseModel):
    prompt: str

class RAGInput(PromptInput):
    context: str

class ModelResponse(BaseModel):
    response: str


@app.get("/")
def root():
    return ModelResponse(response="Server is running.")

@app.post("/api/v1/chat")
def chat(prompt: PromptInput, llm: LLMManager = Depends()):
    response = llm.act(prompt.prompt)
    return ModelResponse(response=response)

@app.post("/api/v1/chat/rag")
def chat_rag(rag_input: RAGInput, llm: LLMManager = Depends()):
    response = llm.act_rag(rag_input.prompt, rag_input.context)
    return ModelResponse(response=response)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)