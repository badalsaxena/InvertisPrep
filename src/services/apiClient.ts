/**
 * API Client for secure communication with backend servers
 * This client automatically handles authentication tokens
 */

import { getApiUrl } from '@/utils/environment';

/**
 * Generic API response type
 */
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Central API client for the application
 * Handles authentication tokens and common request functionality
 */
class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    try {
      // Check if we have a manually set port in localStorage
      let apiUrl = getApiUrl();
      const savedPort = localStorage.getItem('backend_port');
      
      if (savedPort) {
        console.log(`Using saved backend port from localStorage: ${savedPort}`);
        apiUrl = `http://localhost:${savedPort}`;
      }
      
      if (!apiUrl) {
        console.error('API URL is undefined or empty. Using fallback URL.');
        this.baseUrl = 'https://invertisprepbackend.vercel.app';
      } else {
        this.baseUrl = apiUrl;
      }
      console.log('API Client initialized with base URL:', this.baseUrl);
    } catch (error) {
      console.error('Error initializing API client:', error);
      // Fallback to a default URL
      this.baseUrl = 'https://invertisprepbackend.vercel.app';
    }
  }

  /**
   * Set the authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    console.log('Auth token set for API client');
  }

  /**
   * Clear the authentication token (e.g., on logout)
   */
  clearAuthToken(): void {
    this.authToken = null;
    console.log('Auth token cleared from API client');
  }

  /**
   * Get the base URL for debugging and testing
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Test CORS configuration with a simple request
   */
  async testCors(endpoint: string = '/api/health'): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`Testing CORS to ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'GET',
          'Origin': window.location.origin
        }
      });
      
      console.log('CORS preflight response:', response);
      
      if (response.ok) {
        return { 
          success: true, 
          message: 'CORS is properly configured' 
        };
      } else {
        return { 
          success: false, 
          message: `CORS preflight failed with status: ${response.status}` 
        };
      }
    } catch (error) {
      console.error('CORS test error:', error);
      return { 
        success: false, 
        message: `CORS error: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Get common headers for API requests
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Make a GET request with network error handling
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      console.log(`Making GET request to ${this.baseUrl}${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await this.handleResponse<T>(response);
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      
      // Handle different error types
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        return {
          error: 'Network error: Please check your internet connection',
          status: 0
        };
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          error: 'Request timed out. Please try again later.',
          status: 0
        };
      }
      
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  /**
   * Make a POST request
   */
  async post<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await this.handleResponse<T>(response);
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await this.handleResponse<T>(response);
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse<T>(response);
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  /**
   * Handle API response and error cases
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Try to get error details from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error: ${response.status}`);
      } catch (e) {
        // If error parsing fails, throw generic error with status
        if (e instanceof SyntaxError) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        throw e;
      }
    }

    // Check for no content response
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }
}

// Create a singleton instance
const apiClient = new ApiClient();
export default apiClient; 