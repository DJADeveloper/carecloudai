class SessionManager {
  constructor() {
    this.currentSession = null;
    this.refreshPromise = null;
    this.lastRefreshTime = 0;
    this.REFRESH_COOLDOWN = 10000; // 10 seconds cooldown
    this.listeners = new Set();
  }

  addListener(callback) {
    this.listeners.add(callback);
    if (this.currentSession) {
      callback(this.currentSession);
    }
    return () => this.listeners.delete(callback);
  }

  notifyListeners(session) {
    this.currentSession = session;
    this.listeners.forEach(listener => listener(session));
  }

  async getSession() {
    const now = Date.now();
    
    // If we have a current session and it's not expired, return it
    if (this.currentSession && now - this.lastRefreshTime < this.REFRESH_COOLDOWN) {
      return { data: { session: this.currentSession }, error: null };
    }

    // If we're already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Create new refresh promise
    this.refreshPromise = (async () => {
      try {
        const { supabase } = await import('./supabase');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        this.lastRefreshTime = now;
        this.currentSession = data.session;
        this.notifyListeners(data.session);
        
        return { data, error: null };
      } catch (error) {
        console.warn('Session refresh failed:', error.message);
        return { data: { session: null }, error };
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }
}

// Create a singleton instance
const sessionManager = new SessionManager();
export default sessionManager; 