// API helper with centralized auth token management
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('token');
  }
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('token');
};

const apiFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Get response text first
  const responseText = await response.text();

  // Check if response is empty
  if (!responseText) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return null;
  }

  // Try to parse as JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      const data = JSON.parse(responseText);
      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(`Server error: ${responseText.substring(0, 100)}`);
      }
      throw parseError;
    }
  } else {
    throw new Error(`Non-JSON response: ${responseText.substring(0, 100)}`);
  }
};

// Auth endpoints
export const login = (email, password) => {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const signup = (name, email, password, lat, lng, role) => {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, lat, lng, role }),
  });
};

export const getCurrentUser = () => {
  return apiFetch('/api/auth/me');
};

export const updateRole = (role) => {
  return apiFetch('/api/auth/role', {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
};

// Request endpoints
export const getRequests = (lat, lng, radiusKm = 5) => {
  return apiFetch(`/api/requests?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
};

export const createRequest = (types, description, contact, lat, lng, address = '') => {
  return apiFetch('/api/requests', {
    method: 'POST',
    body: JSON.stringify({ types, description, contact, lat, lng, address }),
  });
};

export const assignRequest = (id) => {
  return apiFetch(`/api/requests/${id}/assign`, {
    method: 'POST',
  });
};

export const completeRequest = (id) => {
  return apiFetch(`/api/requests/${id}/complete`, {
    method: 'POST',
  });
};
