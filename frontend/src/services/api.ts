// API Configuration and Service Layer
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'read-only';
    createdAt: string;
  };
}

interface VerifyResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'read-only';
    createdAt: string;
  };
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('finance_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async verifyToken(): Promise<VerifyResponse> {
    return this.request<VerifyResponse>('/auth/verify');
  }

  // Transaction endpoints (ready for your backend)
  async getTransactions() {
    return this.request('/transactions');
  }

  async createTransaction(transaction: any) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: string, transaction: any) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: string) {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints (ready for your backend)
  async getAnalytics() {
    return this.request('/analytics');
  }

  // User management endpoints (ready for your backend)
  async getUsers() {
    return this.request('/users');
  }
}

export const apiService = new ApiService();
export default apiService;

