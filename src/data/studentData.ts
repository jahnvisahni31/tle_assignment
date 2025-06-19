import { codeforcesApi, CodeforcesUser, CodeforcesSubmission, CodeforcesRatingChange } from '../services/codeforcesApi';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  isInactive: boolean;
  lastDataSync: string;
  isDataSyncing: boolean;
  lastSubmissionDate: string;
  inactivityDetectedAt?: string;
  lastReminderSent?: string;
  codeforcesData?: {
    user: CodeforcesUser;
    submissions: CodeforcesSubmission[];
    ratingHistory: CodeforcesRatingChange[];
  };
}

// Initial student data with Codeforces handles
export const initialStudents: Omit<Student, 'currentRating' | 'maxRating' | 'lastSubmissionDate' | 'codeforcesData'>[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1-555-0101',
    codeforcesHandle: 'tourist', // Using real Codeforces handles for demo
    isInactive: false,
    lastDataSync: new Date().toISOString(),
    isDataSyncing: false
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '+1-555-0102',
    codeforcesHandle: 'Petr',
    isInactive: false,
    lastDataSync: new Date().toISOString(),
    isDataSyncing: false
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    phone: '+1-555-0103',
    codeforcesHandle: 'Benq',
    isInactive: false,
    lastDataSync: new Date().toISOString(),
    isDataSyncing: false
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    phone: '+1-555-0104',
    codeforcesHandle: 'jiangly',
    isInactive: false,
    lastDataSync: new Date().toISOString(),
    isDataSyncing: false
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@example.com',
    phone: '+1-555-0105',
    codeforcesHandle: 'Um_nik',
    isInactive: false,
    lastDataSync: new Date().toISOString(),
    isDataSyncing: false
  }
];

class StudentDataService {
  private students: Student[] = [];
  private syncInProgress = new Set<string>();

  constructor() {
    this.initializeStudents();
  }

  private async initializeStudents() {
    this.students = initialStudents.map(student => ({
      ...student,
      currentRating: 0,
      maxRating: 0,
      lastSubmissionDate: new Date().toISOString()
    }));

    // Sync initial data
    await this.syncAllStudents();
  }

  async syncStudentData(studentId: string): Promise<void> {
    if (this.syncInProgress.has(studentId)) {
      return;
    }

    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    this.syncInProgress.add(studentId);
    student.isDataSyncing = true;

    try {
      // Fetch user info
      const [userInfo] = await codeforcesApi.getUserInfo([student.codeforcesHandle]);
      
      // Fetch submissions (last 1000)
      const submissions = await codeforcesApi.getUserSubmissions(student.codeforcesHandle, 1, 1000);
      
      // Fetch rating history
      const ratingHistory = await codeforcesApi.getUserRatingHistory(student.codeforcesHandle);

      // Update student data
      student.currentRating = userInfo.rating || 0;
      student.maxRating = userInfo.maxRating || 0;
      student.lastDataSync = new Date().toISOString();
      
      // Find last submission date
      if (submissions.length > 0) {
        const lastSubmission = submissions.reduce((latest, current) => 
          current.creationTimeSeconds > latest.creationTimeSeconds ? current : latest
        );
        student.lastSubmissionDate = new Date(lastSubmission.creationTimeSeconds * 1000).toISOString();
      }

      // Check for inactivity (no submissions in last 30 days)
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
      const recentSubmissions = submissions.filter(sub => sub.creationTimeSeconds >= thirtyDaysAgo);
      
      if (recentSubmissions.length === 0 && submissions.length > 0) {
        student.isInactive = true;
        if (!student.inactivityDetectedAt) {
          student.inactivityDetectedAt = new Date().toISOString();
        }
      } else {
        student.isInactive = false;
        student.inactivityDetectedAt = undefined;
      }

      // Store Codeforces data
      student.codeforcesData = {
        user: userInfo,
        submissions,
        ratingHistory
      };

    } catch (error) {
      console.error(`Failed to sync data for student ${student.name}:`, error);
      throw error;
    } finally {
      student.isDataSyncing = false;
      this.syncInProgress.delete(studentId);
    }
  }

  async syncAllStudents(): Promise<void> {
    // Instead of using Promise.all, sync students sequentially with delays to avoid rate limiting
    for (const student of this.students) {
      try {
        await this.syncStudentData(student.id);
        // Add a 500ms delay between requests to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to sync student ${student.name}:`, error);
        // Continue with next student even if one fails
      }
    }
  }

  getStudents(): Student[] {
    return [...this.students];
  }

  getStudent(id: string): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  addStudent(studentData: Omit<Student, 'id' | 'currentRating' | 'maxRating' | 'lastSubmissionDate' | 'codeforcesData'>): Student {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      currentRating: 0,
      maxRating: 0,
      lastSubmissionDate: new Date().toISOString()
    };

    this.students.push(newStudent);
    
    // Sync data for new student
    this.syncStudentData(newStudent.id).catch(error => {
      console.error(`Failed to sync new student ${newStudent.name}:`, error);
    });

    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const studentIndex = this.students.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      return null;
    }

    const oldHandle = this.students[studentIndex].codeforcesHandle;
    this.students[studentIndex] = { ...this.students[studentIndex], ...updates };

    // If Codeforces handle changed, trigger sync
    if (updates.codeforcesHandle && updates.codeforcesHandle !== oldHandle) {
      this.syncStudentData(id).catch(error => {
        console.error(`Failed to sync updated student:`, error);
      });
    }

    return this.students[studentIndex];
  }

  deleteStudent(id: string): boolean {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }

    this.students.splice(index, 1);
    return true;
  }

  getActiveStudents(): Student[] {
    return this.students.filter(s => !s.isInactive);
  }

  getInactiveStudents(): Student[] {
    return this.students.filter(s => s.isInactive);
  }

  getAverageRating(): number {
    if (this.students.length === 0) return 0;
    const totalRating = this.students.reduce((sum, student) => sum + student.currentRating, 0);
    return Math.round(totalRating / this.students.length);
  }

  getStudentsByRatingRange(minRating: number, maxRating: number): Student[] {
    return this.students.filter(s => s.currentRating >= minRating && s.currentRating <= maxRating);
  }
}

export const studentDataService = new StudentDataService();