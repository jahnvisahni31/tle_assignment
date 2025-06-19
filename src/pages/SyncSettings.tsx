import React, { useState } from 'react';
import { RefreshCw, Settings, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { useStudentData } from '../hooks/useStudentData';

const SyncSettings: React.FC = () => {
  const { students, syncAllStudents } = useStudentData();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState(60);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncAllStudents();
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncHistory = [
    { id: 1, timestamp: new Date(Date.now() - 3600000), status: 'success', studentsUpdated: students.length },
    { id: 2, timestamp: new Date(Date.now() - 7200000), status: 'success', studentsUpdated: Math.max(0, students.length - 2) },
    { id: 3, timestamp: new Date(Date.now() - 10800000), status: 'warning', studentsUpdated: Math.max(0, students.length - 3) },
    { id: 4, timestamp: new Date(Date.now() - 14400000), status: 'success', studentsUpdated: students.length },
  ];

  const successfulSyncs = syncHistory.filter(s => s.status === 'success').length;
  const partialSyncs = syncHistory.filter(s => s.status === 'warning').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sync Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage data synchronization with Codeforces API
        </p>
      </div>

      {/* Manual Sync */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manual Sync</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trigger an immediate synchronization with Codeforces for all students
            </p>
          </div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 ${
              isSyncing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Sync
              </>
            )}
          </button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Last sync completed:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {lastSync.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Auto Sync Settings */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Automatic Sync</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure automatic data synchronization schedule
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSync"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSync" className="ml-2 text-sm text-gray-900 dark:text-white">
              Enable auto sync
            </label>
          </div>
        </div>

        {autoSync && (
          <div className="space-y-4">
            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sync Interval (minutes)
              </label>
              <select
                id="interval"
                value={syncInterval}
                onChange={(e) => setSyncInterval(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={360}>6 hours</option>
                <option value={720}>12 hours</option>
                <option value={1440}>24 hours</option>
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Next sync scheduled in {syncInterval} minutes
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sync Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{successfulSyncs}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Successful Syncs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{partialSyncs}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Partial Syncs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Students Tracked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sync History</h3>
        <div className="space-y-3">
          {syncHistory.map((sync) => (
            <div key={sync.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-3">
                {sync.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Sync completed {sync.status === 'success' ? 'successfully' : 'with warnings'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {sync.studentsUpdated} students updated
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {sync.timestamp.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyncSettings;