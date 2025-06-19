interface CodeforcesUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId?: number;
    problemsetName?: string;
    index: string;
    name: string;
    type: string;
    points?: number;
    rating?: number;
    tags: string[];
  };
  author: {
    contestId?: number;
    members: Array<{
      handle: string;
      name?: string;
    }>;
    participantType: string;
    ghost: boolean;
    room?: number;
    startTimeSeconds?: number;
  };
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points?: number;
}

interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

interface CodeforcesApiResponse<T> {
  status: 'OK' | 'FAILED';
  comment?: string;
  result?: T;
}

class CodeforcesApiService {
  private baseUrl = 'https://codeforces.com/api';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CodeforcesApiResponse<T> = await response.json();
      
      if (data.status === 'FAILED') {
        throw new Error(data.comment || 'Codeforces API request failed');
      }
      
      if (!data.result) {
        throw new Error('No result data received from Codeforces API');
      }

      this.cache.set(cacheKey, { data: data.result, timestamp: Date.now() });
      return data.result;
    } catch (error) {
      console.error(`Codeforces API error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getUserInfo(handles: string[]): Promise<CodeforcesUser[]> {
    if (handles.length === 0) return [];
    
    const handlesParam = handles.join(';');
    return this.makeRequest<CodeforcesUser[]>(`/user.info?handles=${handlesParam}`);
  }

  async getUserSubmissions(handle: string, from?: number, count?: number): Promise<CodeforcesSubmission[]> {
    let endpoint = `/user.status?handle=${handle}`;
    
    if (from !== undefined) {
      endpoint += `&from=${from}`;
    }
    
    if (count !== undefined) {
      endpoint += `&count=${count}`;
    }
    
    return this.makeRequest<CodeforcesSubmission[]>(endpoint);
  }

  async getUserRatingHistory(handle: string): Promise<CodeforcesRatingChange[]> {
    return this.makeRequest<CodeforcesRatingChange[]>(`/user.rating?handle=${handle}`);
  }

  async getContestList(gym?: boolean): Promise<any[]> {
    let endpoint = '/contest.list';
    if (gym !== undefined) {
      endpoint += `?gym=${gym}`;
    }
    return this.makeRequest<any[]>(endpoint);
  }

  async getContestStandings(contestId: number, from?: number, count?: number, handles?: string[]): Promise<any> {
    let endpoint = `/contest.standings?contestId=${contestId}`;
    
    if (from !== undefined) {
      endpoint += `&from=${from}`;
    }
    
    if (count !== undefined) {
      endpoint += `&count=${count}`;
    }
    
    if (handles && handles.length > 0) {
      endpoint += `&handles=${handles.join(';')}`;
    }
    
    return this.makeRequest<any>(endpoint);
  }

  async getProblems(): Promise<any> {
    return this.makeRequest<any>('/problemset.problems');
  }

  // Utility methods for data processing
  getSubmissionsByVerdict(submissions: CodeforcesSubmission[], verdict: string): CodeforcesSubmission[] {
    return submissions.filter(sub => sub.verdict === verdict);
  }

  getSubmissionsByTimeRange(submissions: CodeforcesSubmission[], startTime: number, endTime: number): CodeforcesSubmission[] {
    return submissions.filter(sub => 
      sub.creationTimeSeconds >= startTime && sub.creationTimeSeconds <= endTime
    );
  }

  getRecentSubmissions(submissions: CodeforcesSubmission[], days: number = 30): CodeforcesSubmission[] {
    const cutoffTime = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
    return submissions.filter(sub => sub.creationTimeSeconds >= cutoffTime);
  }

  getSubmissionHeatmapData(submissions: CodeforcesSubmission[], days: number = 365): Array<{ date: string; count: number }> {
    const cutoffTime = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
    const recentSubmissions = submissions.filter(sub => sub.creationTimeSeconds >= cutoffTime);
    
    const submissionsByDate = new Map<string, number>();
    
    recentSubmissions.forEach(sub => {
      const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
      submissionsByDate.set(date, (submissionsByDate.get(date) || 0) + 1);
    });
    
    const result: Array<{ date: string; count: number }> = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      result.push({
        date: dateString,
        count: submissionsByDate.get(dateString) || 0
      });
    }
    
    return result;
  }

  getProblemsSolvedByRating(submissions: CodeforcesSubmission[]): Map<number, number> {
    const solvedProblems = new Set<string>();
    const ratingCounts = new Map<number, number>();
    
    submissions
      .filter(sub => sub.verdict === 'OK')
      .forEach(sub => {
        const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!solvedProblems.has(problemKey) && sub.problem.rating) {
          solvedProblems.add(problemKey);
          const rating = Math.floor(sub.problem.rating / 100) * 100; // Group by hundreds
          ratingCounts.set(rating, (ratingCounts.get(rating) || 0) + 1);
        }
      });
    
    return ratingCounts;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const codeforcesApi = new CodeforcesApiService();
export type { CodeforcesUser, CodeforcesSubmission, CodeforcesRatingChange };