const API_BASE = '/.netlify/functions';

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = new Error(`API Error: ${response.status} ${response.statusText}`) as ApiError;
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}