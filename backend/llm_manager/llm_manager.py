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

    def switch_prompt(self, new_prompt_file: str="urges.txt"):
        self.system_prompt = self._load_system_prompt(os.path.join(self.system_prompt_dir, new_prompt_file))
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        print(f"[INFO] Switched system prompt to '{new_prompt_file}'.")

    #history methods
    def _load_history(self) -> list:
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, "r", encoding="utf-8") as f:
                    messages_json = json.load(f)
                    history = []
                    for msg in messages_json:
                        if msg["role"] == "human":
                            history.append(HumanMessage(content=msg["content"]))
                        elif msg["role"] == "assistant":
                            history.append(AIMessage(content=msg["content"]))
                    return history
            except Exception as e:
                print(f"[WARN] Failed to load history: {e}")
        return []

    def _save_history(self):
        messages_json = []
        for msg in self.history:
            role = "human" if isinstance(msg, HumanMessage) else "assistant"
            messages_json.append({"role": role, "content": msg.content})
        with open(self.history_file, "w", encoding="utf-8") as f:
            json.dump(messages_json, f, indent=2)

    def clear_history(self):
        self.history = []
        if os.path.exists(self.history_file):
            os.remove(self.history_file)

    #chat methods
    def chat(self, user_message: str) -> str:
        chain_input = {"history": self.history, "input": user_message}
        formatted_prompt = self.prompt.format_messages(**chain_input)

        response = self.model.invoke(formatted_prompt)

        self.history.append(HumanMessage(content=user_message))
        self.history.append(AIMessage(content=response.content))
        self._save_history()

        return response.content
