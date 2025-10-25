from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from llm_manager.llm_manager import LLMManager

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptInput(BaseModel):
    prompt: str

class RAGInput(PromptInput):
    context: str

class ModelResponse(BaseModel):
    response: str

# Keep one LLMManager instance per persona to preserve conversation history
llm_managers: dict[str, LLMManager] = {}

def get_llm_manager(persona: str) -> LLMManager:
    """
    Get or create an LLMManager for the given persona.
    Each persona maintains its own conversation history.
    """
    if persona not in llm_managers:
        # Create a new manager with persona-specific history file
        llm_managers[persona] = LLMManager(history_file=f"history_{persona}.json")
        llm_managers[persona].switch_prompt(f"{persona}.txt")
    return llm_managers[persona]


@app.get("/")
def root():
    return ModelResponse(response="Server is running.")

@app.post("/api/v1/chat/{persona}")
def chat(persona: str, prompt: PromptInput):
    llm = get_llm_manager(persona)
    # Ensure the correct prompt is loaded (in case it was changed)
    llm.switch_prompt(f"{persona}.txt")
    response = llm.chat(prompt.prompt)
    return ModelResponse(response=response)

@app.post("/api/v1/rag/{persona}")
def chat_rag(persona: str, rag_input: RAGInput):
    llm = get_llm_manager(persona)
    # Ensure the correct prompt is loaded (in case it was changed)
    llm.switch_prompt(f"{persona}.txt")
    response = llm.act_rag(rag_input.prompt, rag_input.context)
    return ModelResponse(response=response)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)