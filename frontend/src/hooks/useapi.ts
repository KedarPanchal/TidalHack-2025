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

export function useGET(): UseAPIReturn {
    const { sendRequest, loading, error } = useAPI();

    const getRequest = useCallback(async (endpoint: string) => {
        return sendRequest(endpoint, {
            method: "GET",
        });
    }, [sendRequest]);

    return { sendRequest: getRequest, loading, error };
}