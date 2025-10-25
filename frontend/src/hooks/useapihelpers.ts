import { useCallback } from "react";
import { usePOST } from "./useapi";

export function useChatRequest() {
    const { sendRequest, loading, error } = usePOST();

    const chatRequest = useCallback(async (message: string) => {
        return sendRequest("api/v1/chat", { prompt: message });
    }, [sendRequest]);

    return { sendRequest: chatRequest, loading, error };
}

export function useRAGRequest() {
    const { sendRequest, loading, error } = usePOST();

    const ragRequest = useCallback(async (message: string, context: string) => {
        return sendRequest("api/v1/chat/rag", { prompt: message, context: context });
    }, [sendRequest]);

    return { sendRequest: ragRequest, loading, error };
}