import os
import json
from typing import Optional
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

class LLMManager:
    def __init__(self, prompt_dir: Optional[str] = None, history_file: Optional[str] = None):
        load_dotenv()
        # Resolve defaults relative to this file's directory (the package/parent directory)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if prompt_dir is None:
            self.system_prompt_dir = os.path.join(base_dir, "prompts")
        else:
            self.system_prompt_dir = os.path.join(base_dir, prompt_dir)
        if history_file is None:
            self.history_file = os.path.join(base_dir, "history.json")
        else:
            self.history_file = os.path.join(base_dir, history_file)
            
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Missing API key")

        self.model = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key
        )

        self.system_prompt = self.switch_prompt("urges.txt")

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])

        self.history = self._load_history()

    #prompt methods 
    def _load_system_prompt(self, filepath: str) -> str:
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                return f.read().strip()
        else:
            return "You are a concise, helpful AI assistant."

    def act_rag(self, prompt: str, context: str) -> str:
        """ Generate a response based on the given prompt and context. """
        return f"Echoing prompt: {prompt} with context: {context}"