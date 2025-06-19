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
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1-555-0101',
    codeforcesHandle: 'alice_codes',
    currentRating: 1547,
    maxRating: 1689,
    isInactive: false,
    lastDataSync: '2024-01-15T10:30:00Z',
    isDataSyncing: false,
    lastSubmissionDate: '2024-01-14T15:45:00Z'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '+1-555-0102',
    codeforcesHandle: 'bob_solver',
    currentRating: 1892,
    maxRating: 1934,
    isInactive: false,
    lastDataSync: '2024-01-15T09:15:00Z',
    isDataSyncing: false,
    lastSubmissionDate: '2024-01-15T08:20:00Z'
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    phone: '+1-555-0103',
    codeforcesHandle: 'charlie_cf',
    currentRating: 1234,
    maxRating: 1456,
    isInactive: true,
    lastDataSync: '2024-01-10T14:20:00Z',
    isDataSyncing: false,
    lastSubmissionDate: '2023-12-20T12:30:00Z',
    inactivityDetectedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    phone: '+1-555-0104',
    codeforcesHandle: 'wonder_coder',
    currentRating: 2156,
    maxRating: 2234,
    isInactive: false,
    lastDataSync: '2024-01-15T11:45:00Z',
    isDataSyncing: false,
    lastSubmissionDate: '2024-01-15T10:15:00Z'
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@example.com',
    phone: '+1-555-0105',
    codeforcesHandle: 'mission_code',
    currentRating: 1678,
    maxRating: 1789,
    isInactive: false,
    lastDataSync: '2024-01-15T08:30:00Z',
    isDataSyncing: false,
    lastSubmissionDate: '2024-01-14T16:45:00Z'
  },
  {
    id: '6',
    name: 'Fiona Gallagher',
    email: 'fiona.gallagher@example.com',
    phone: '+1-555-0106',
    codeforcesHandle: 'fiona_dev',
    currentRating: 1345,
    maxRating: 1456,
    isInactive: true,
    lastDataSync: '2024-01-12T13:20:00Z',
    isDataSyncing: false,
    lastSubmissionDate: '2023-12-25T09:15:00Z',
    inactivityDetectedAt: '2024-01-08T00:00:00Z'
  }
];

export const generateRatingHistory = (currentRating: number) => {
  const history = [];
  let rating = Math.max(800, currentRating - 200);
  
  for (let i = 1; i <= 15; i++) {
    const change = Math.floor(Math.random() * 100) - 40;
    rating = Math.max(800, Math.min(3000, rating + change));
    history.push({
      contest: `Contest ${i}`,
      rating: rating,
      change: change
    });
  }
  
  return history;
};

export const generateSubmissionData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      day: date.getDate().toString(),
      submissions: Math.floor(Math.random() * 10)
    });
  }
  
  return data;
};