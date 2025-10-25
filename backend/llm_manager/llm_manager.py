class LLMManager():
    def __init__(self):
        pass

    def act(self, prompt: str) -> str:
        """ Generate a response based on the given prompt. """
        return f"Echoing prompt: {prompt}"

    def act_rag(self, prompt: str, context: str) -> str:
        """ Generate a response based on the given prompt and context. """
        return f"Echoing prompt: {prompt} with context: {context}"