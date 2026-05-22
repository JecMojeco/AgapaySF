const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = { 
    ...options.headers,
    'ngrok-skip-browser-warning': 'true'
  };
  
  // Don't set Content-Type if it's FormData, let browser handle it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const config = {
    ...options,
    credentials: 'include', // CRITICAL for sessions
    headers,
  };

  const response = await fetch(url, config);
  
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = { error: await response.text() };
  }

  if (!response.ok) {
    console.error(`API Error ${response.status}:`, data);
    
    // Dispatch event for AuthContext to handle session loss/deactivation
    if (response.status === 401 || response.status === 403) {
      window.dispatchEvent(new CustomEvent('api-auth-error', { 
        detail: { status: response.status, error: data.error } 
      }));
    }

    throw new Error(data.error || `API request failed with status ${response.status}`);
  }

  return data;
};
