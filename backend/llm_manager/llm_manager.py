class LLMManager():
    def __init__(self):
        pass

    def act(self, prompt: str) -> str:
        """ Generate a response based on the given prompt. """
        return "Test string response from LLM Manager."

    def act_rag(self, prompt: str, context: str) -> str:
        """ Generate a response based on the given prompt and context. """
        # Leave this blank for now we can implement later if needed
        return "Test string response from LLM Manager with RAG."