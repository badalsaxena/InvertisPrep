import { getApiUrl } from '@/utils/environment';

const VISITOR_SESSION_KEY = 'invertisPrep_visitedThisSession';

/**
 * Service for managing visitor count operations
 */
class VisitorCounterService {
  private baseUrl: string;
  private cachedCount: number | null = null;
  private lastFetchTime: number = 0;
  private fetchPromise: Promise<number> | null = null;

  constructor() {
    try {
      // Always use the current origin for API calls in this case
      this.baseUrl = window.location.origin;
      console.log('Visitor counter service initialized with API URL:', this.baseUrl);
    } catch (error) {
      console.error('Error initializing visitor counter service:', error);
      this.baseUrl = window.location.origin;
    }
  }

  /**
   * Get the current visitor count from the API
   */
  async getVisitorCount(): Promise<number> {
    try {
      // If we have a cached count and it's less than 5 seconds old, use it
      const now = Date.now();
      if (this.cachedCount !== null && now - this.lastFetchTime < 5000) {
        return this.cachedCount;
      }

      // If there's already a fetch in progress, return that promise
      if (this.fetchPromise) {
        return this.fetchPromise;
      }

      // Start a new fetch
      this.fetchPromise = this.fetchCountFromAPI();
      const count = await this.fetchPromise;
      this.fetchPromise = null;
      return count;
    } catch (error) {
      console.error('Error getting visitor count:', error);
      return 0; // Fallback count
    }
  }

  /**
   * Record a new visit and increment the counter if this is a new session
   */
  async recordVisit(): Promise<number> {
    try {
      // Clear any existing session flag to ensure we always count this visit
      sessionStorage.removeItem(VISITOR_SESSION_KEY);
      
      // Check if this is first visit this session
      const hasVisitedThisSession = sessionStorage.getItem(VISITOR_SESSION_KEY);

      if (!hasVisitedThisSession) {
        // Mark this session as visited
        sessionStorage.setItem(VISITOR_SESSION_KEY, 'true');
        
        // Increment the counter
        const newCount = await this.incrementCounter();
        console.log('Incremented visitor count to:', newCount);
        return newCount;
      } else {
        // Just get the current count
        return this.getVisitorCount();
      }
    } catch (error) {
      console.error('Error recording visit:', error);
      return this.getVisitorCount();
    }
  }

  /**
   * Fetch the visitor count from the API
   */
  private async fetchCountFromAPI(): Promise<number> {
    try {
      const url = `${this.baseUrl}/api/visitor-count`;
      console.log('Fetching visitor count from API:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch visitor count: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received visitor count from API:', data);
      this.cachedCount = data.count;
      this.lastFetchTime = Date.now();
      return data.count;
    } catch (error) {
      console.error('Error fetching visitor count from API:', error);
      return 0; // Fallback count
    }
  }

  /**
   * Increment the visitor counter on the server
   */
  private async incrementCounter(): Promise<number> {
    try {
      const url = `${this.baseUrl}/api/visitor-count`;
      console.log('Incrementing visitor count via API:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to increment visitor count: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received incremented visitor count from API:', data);
      this.cachedCount = data.count;
      this.lastFetchTime = Date.now();
      return data.count;
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
      return this.getVisitorCount();
    }
  }
}

// Create a singleton instance
const visitorCounterService = new VisitorCounterService();
export default visitorCounterService; 