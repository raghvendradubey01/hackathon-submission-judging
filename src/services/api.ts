/**
 * Real REST API client with Bearer token authentication and offline fallback
 */

const API_BASE = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('hackforge_jwt_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('hackforge_jwt_token', token);
    } else {
      localStorage.removeItem('hackforge_jwt_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await res.json();
      return json;
    } catch (err: any) {
      // In purely offline client-side preview, fallback gracefully
      return {
        success: false,
        error: err.message || 'Network request failed',
      };
    }
  }

  // Auth
  public async login(email: string) {
    const res = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  public async getMe() {
    return this.request('/auth/me');
  }

  // Events
  public async getEvent() {
    return this.request('/events');
  }

  public async updateSchedule(schedule: any) {
    return this.request('/events/schedule', {
      method: 'PUT',
      body: JSON.stringify(schedule),
    });
  }

  public async toggleEmbargo() {
    return this.request('/events/embargo/toggle', { method: 'POST' });
  }

  // Submissions
  public async getSubmissions(publicOnly = true) {
    return this.request(`/submissions?public=${publicOnly}`);
  }

  public async saveSubmission(payload: any, asDraft = false) {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify({ ...payload, asDraft }),
    });
  }

  // Judging & Rubrics
  public async getRubric() {
    return this.request('/rubric');
  }

  public async updateRubric(criteria: any[]) {
    return this.request('/rubric', {
      method: 'PUT',
      body: JSON.stringify({ criteria }),
    });
  }

  public async getAssignments() {
    return this.request('/judging/assignments');
  }

  public async submitScore(payload: any) {
    return this.request('/judging/scores', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async runAssignmentBatch(reviewsPerProject = 3) {
    return this.request('/judging/assign-batch', {
      method: 'POST',
      body: JSON.stringify({ reviewsPerProject }),
    });
  }

  // Leaderboard
  public async getLeaderboard() {
    return this.request('/leaderboard');
  }

  // Community
  public async castVote(submissionId: string, voteType: string, creditsSpent: number) {
    return this.request('/votes', {
      method: 'POST',
      body: JSON.stringify({ submissionId, voteType, creditsSpent }),
    });
  }

  public async addComment(submissionId: string, content: string) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify({ submissionId, content }),
    });
  }
}

export const api = new ApiClient();
