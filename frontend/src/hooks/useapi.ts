import { useState, useCallback } from "react";

interface UseAPIReturn {
    sendRequest: (endpoint: string, options?: RequestInit) => Promise<any>;
    loading: boolean;
    error: Error | null;
}

interface usePOSTReturn extends UseAPIReturn {
    sendRequest: (endpoint: string, body: any, options?: RequestInit) => Promise<any>;
}

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Base hook for making API requests.
 * 
 * @returns An object containing:
 * - sendRequest: Function to send an API request to the specified endpoint
 * - loading: Boolean indicating if a request is in progress
 * - error: Error object if the request failed, null otherwise
 * 
 * @example
 * ```tsx
 * const { sendRequest, loading, error } = useAPI();
 * 
 * const fetchData = async () => {
 *   const data = await sendRequest('users', { method: 'GET' });
 *   console.log(data);
 * };
 * ```
 */
export function useAPI(): UseAPIReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const sendRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
        setLoading(true);
        const response = await fetch(`${apiBaseURL}/${endpoint}`, options);
        if (!response.ok) {
            setError(new Error(`API request failed with status ${response.status}`));
        }
        setLoading(false);
        return response.json();
    }, []);

    return { sendRequest, loading, error };
}

/**
 * Hook for making POST requests to the API.
 * 
 * @returns An object containing:
 * - sendRequest: Function to send a POST request with a JSON body
 * - loading: Boolean indicating if a request is in progress
 * - error: Error object if the request failed, null otherwise
 * 
 * @example
 * ```tsx
 * const { sendRequest, loading, error } = usePOST();
 * 
 * const createUser = async () => {
 *   const newUser = { name: 'John Doe', email: 'john@example.com' };
 *   const response = await sendRequest('users', newUser);
 *   console.log(response);
 * };
 * ```
 */
export function usePOST(): usePOSTReturn {
    const { sendRequest, loading, error } = useAPI();

    const postRequest = useCallback(async (endpoint: string, body: any, options: RequestInit = {}) => {
        return sendRequest(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            ...options,
        });
    }, [sendRequest]);

    return { sendRequest: postRequest, loading, error };
}

/**
 * Hook for making GET requests to the API.
 * 
 * @returns An object containing:
 * - sendRequest: Function to send a GET request to the specified endpoint
 * - loading: Boolean indicating if a request is in progress
 * - error: Error object if the request failed, null otherwise
 * 
 * @example
 * ```tsx
 * const { sendRequest, loading, error } = useGET();
 * 
 * const fetchUsers = async () => {
 *   const users = await sendRequest('users');
 *   console.log(users);
 * };
 * ```
 */
export function useGET(): UseAPIReturn {
    const { sendRequest, loading, error } = useAPI();

    const getRequest = useCallback(async (endpoint: string) => {
        return sendRequest(endpoint, {
            method: "GET",
        });
    }, [sendRequest]);

    return { sendRequest: getRequest, loading, error };
}