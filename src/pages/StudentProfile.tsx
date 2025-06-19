import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, TrendingUp, Activity, Mail, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStudentData } from '../hooks/useStudentData';

const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const { students, loading, syncStudent } = useStudentData();
  const [syncing, setSyncing] = React.useState(false);
  
  const student = students.find(s => s.id === id);

  const handleSync = async () => {
    if (!student) return;
    setSyncing(true);
    try {
      await syncStudent(student.id);
    } catch (err) {
      console.error('Failed to sync student:', err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Not Found</h2>
        <Link to="/students" className="mt-4 text-blue-600 hover:text-blue-500">
          Back to Students
        </Link>
      </div>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 2100) return 'text-red-600 dark:text-red-400';
    if (rating >= 1900) return 'text-orange-600 dark:text-orange-400';
    if (rating >= 1600) return 'text-purple-600 dark:text-purple-400';
    if (rating >= 1400) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 1200) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRatingTitle = (rating: number) => {
    if (rating >= 2100) return 'International Master';
    if (rating >= 1900) return 'Candidate Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1400) return 'Specialist';
    if (rating >= 1200) return 'Pupil';
    return 'Newbie';
  };

  // Process rating history from Codeforces data
  const ratingHistory = React.useMemo(() => {
    if (!student.codeforcesData?.ratingHistory) {
      return [];
    }
    
    return student.codeforcesData.ratingHistory.slice(-15).map((change, index) => ({
      contest: `Contest ${index + 1}`,
      rating: change.newRating,
      change: change.newRating - change.oldRating
    }));
  }, [student.codeforcesData]);

  // Process submission data for heatmap
  const submissionData = React.useMemo(() => {
    if (!student.codeforcesData?.submissions) {
      return [];
    }

    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const daySubmissions = student.codeforcesData.submissions.filter(sub => {
        const subDate = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
        return subDate === dateString;
      });

      last30Days.push({
        day: date.getDate().toString(),
        submissions: daySubmissions.length
      });
    }
    
    return last30Days;
  }, [student.codeforcesData]);

  // Recent activity from submissions
  const recentActivity = React.useMemo(() => {
    if (!student.codeforcesData?.submissions || !student.codeforcesData?.ratingHistory) {
      return [];
    }

    const activities = [];
    
    // Add recent contests from rating history
    const recentContests = student.codeforcesData.ratingHistory.slice(-3);
    recentContests.forEach(contest => {
      activities.push({
        type: 'contest',
        name: contest.contestName,
        rating: contest.newRating > contest.oldRating ? `+${contest.newRating - contest.oldRating}` : `${contest.newRating - contest.oldRating}`,
        time: new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
      });
    });

    // Add recent submissions
    const recentSubmissions = student.codeforcesData.submissions
      .slice(0, 5)
      .map(sub => ({
        type: 'submission',
        name: `${sub.problem.name}`,
        verdict: sub.verdict || 'Unknown',
        time: new Date(sub.creationTimeSeconds * 1000).toLocaleDateString()
      }));

    activities.push(...recentSubmissions);
    
    return activities.slice(0, 4);
  }, [student.codeforcesData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/students"
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getRatingTitle(student.currentRating)} • @{student.codeforcesHandle}
              </p>
              <a
                href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSync}
            disabled={student.isDataSyncing || syncing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(student.isDataSyncing || syncing) ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            student.isInactive 
              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
          }`}>
            {student.isInactive ? 'Inactive' : 'Active'}
          </div>
        </div>
      </div>

      {/* Profile Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Rating</p>
              <p className={`text-3xl font-bold ${getRatingColor(student.currentRating)}`}>
                {student.currentRating}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Rating</p>
              <p className={`text-3xl font-bold ${getRatingColor(student.maxRating)}`}>
                {student.maxRating}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Sync</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(student.lastDataSync).toLocaleDateString()}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating History</h3>
            <a
              href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>View on Codeforces</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="contest" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Submission Activity (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={submissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar 
                dataKey="submissions" 
                fill="#10B981" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'contest' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activity.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.type === 'contest' ? `Rating change: ${activity.rating}` : `Verdict: ${activity.verdict}`}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          )) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent activity data available. Try syncing the student's data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;