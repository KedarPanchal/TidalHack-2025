import { useCallback } from "react";
import { usePOST } from "./useapi";

export type ChatPersona = "urges" | "checkin";
/**
 * Hook for sending chat messages to the API for a specific persona.
 *
 * The API routes are persona-scoped and expect a POST body with a JSON
 * `prompt` field. Use the returned `sendRequest` function to invoke the
 * API for a given persona (for example, `urges` or `checkin`).
 *
 * @param persona - Chat persona to route the request to (`'urges' | 'checkin'`).
 * @returns An object containing:
 * - sendRequest: Function to send a chat message to the API for the given persona
 *   (signature: `(persona: ChatPersona, message: string) => Promise<any>`)
 * - loading: Boolean indicating if a request is in progress
 * - error: Error object if the request failed, null otherwise
 *
 * @example
 * ```tsx
 * const { sendRequest, loading, error } = useChatRequest();
 *
 * // send a message via the 'urges' persona
 * const onSend = async () => {
 *   const response = await sendRequest('urges', 'Hello — how are you?');
 *   console.log(response);
 * };
 * ```
 */
export function useChatRequest() {
    const { sendRequest, loading, error } = usePOST();

    const chatRequest = useCallback(async (persona: ChatPersona, message: string) => {
        return sendRequest(`api/v1/chat/${persona}`, { prompt: message });
    }, [sendRequest]);

    return { sendRequest: chatRequest, loading, error };
}

/**
 * Hook for sending RAG (Retrieval-Augmented Generation) requests to the API.
 *
 * RAG requests include an explicit `context` payload in addition to the
 * `prompt`. The returned `sendRequest` signature is
 * `(persona: ChatPersona, message: string, context: string) => Promise<any>`.
 *
 * @param persona - Chat persona to route the request to (`'urges' | 'checkin'`).
 * @returns An object containing:
 * - sendRequest: Function to send a chat message with additional context
 *   for the given persona
 * - loading: Boolean indicating if a request is in progress
 * - error: Error object if the request failed, null otherwise
 *
 * @example
 * ```tsx
 * const { sendRequest, loading, error } = useRAGRequest();
 *
 * // send a RAG query using the 'checkin' persona and a short context
 * const onRagQuery = async () => {
 *   const response = await sendRequest('checkin', 'What should I ask?', 'context text...');
 *   console.log(response);
 * };
 * ```
 */
export function useRAGRequest() {
    const { sendRequest, loading, error } = usePOST();

    const ragRequest = useCallback(async (persona: ChatPersona, message: string, context: string) => {
        return sendRequest(`api/v1/rag/${persona}`, { prompt: message, context: context });
    }, [sendRequest]);

    return { sendRequest: ragRequest, loading, error };
}