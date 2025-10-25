import { useCallback } from "react";
import { usePOST } from "./useapi";

export type ChatPersona = "urges" | "checkin";

/**
 * Hook for sending chat messages to the API.
 * 
 * @returns An object containing:
 * - sendRequest: Function to send a chat message to the API
 * - loading: Boolean indicating if a request is in progress
 * - error: Error object if the request failed, null otherwise
 * 
 * @example
 * ```tsx
 * const { sendRequest, loading, error } = useChatRequest();
 * 
 * const handleSendMessage = async (persona: ChatPersona, message: string) => {
 *   const response = await sendRequest(persona, message);
 *   console.log(response);
 * };
 * ```
 */
export function useChatRequest() {
    const { sendRequest, loading, error } = usePOST();

    const chatRequest = useCallback(async (persona: string, message: string) => {
        return sendRequest(`api/v1/chat/${persona}`, { prompt: message });
    }, [sendRequest]);

    return { sendRequest: chatRequest, loading, error };
}

/**
 * Hook for sending RAG (Retrieval-Augmented Generation) requests to the API.
 * 
 * @returns An object containing:
 * - sendRequest: Function to send a chat message with additional context
 * - loading: Boolean indicating if a request is in progress
 * - error: Error object if the request failed, null otherwise
 * 
 * @example
 * ```tsx
 * const { sendRequest, loading, error } = useRAGRequest();
 * 
 * const handleRAGQuery = async (persona: ChatPersona, query: string, context: string) => {
 *   const response = await sendRequest(persona, query, context);
 *   console.log(response);
 * };
 * ```
 */
export function useRAGRequest() {
    const { sendRequest, loading, error } = usePOST();

    const ragRequest = useCallback(async (persona: string, message: string, context: string) => {
        return sendRequest(`api/v1/rag/${persona}`, { prompt: message, context: context });
    }, [sendRequest]);

    return { sendRequest: ragRequest, loading, error };
}