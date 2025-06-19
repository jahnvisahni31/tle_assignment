import React, { useState } from 'react';
import { Search, Plus, Download, RefreshCw, User, Calendar, Trophy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudentData } from '../hooks/useStudentData';
import AddStudentModal from '../components/AddStudentModal';

const Students: React.FC = () => {
  const { students, loading, error, syncStudent, addStudent } = useStudentData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [syncingStudents, setSyncingStudents] = useState<Set<string>>(new Set());

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.codeforcesHandle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !student.isInactive) ||
                         (filterStatus === 'inactive' && student.isInactive);
    
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const csvData = filteredStudents.map(student => ({
      Name: student.name,
      Email: student.email,
      'Codeforces Handle': student.codeforcesHandle,
      'Current Rating': student.currentRating,
      'Max Rating': student.maxRating,
      Status: student.isInactive ? 'Inactive' : 'Active',
      'Last Sync': new Date(student.lastDataSync).toLocaleDateString()
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  const handleSyncStudent = async (studentId: string) => {
    setSyncingStudents(prev => new Set(prev).add(studentId));
    try {
      await syncStudent(studentId);
    } catch (err) {
      console.error('Failed to sync student:', err);
    } finally {
      setSyncingStudents(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  const handleAddStudent = (studentData: any) => {
    addStudent(studentData);
    setIsAddModalOpen(false);
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Students</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage student profiles and track their Codeforces progress
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Link
                    to={`/students/${student.id}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                  >
                    {student.name}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{student.codeforcesHandle}
                    </p>
                    <a
                      href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  student.isInactive 
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                }`}>
                  {student.isInactive ? 'Inactive' : 'Active'}
                </div>
                <button
                  onClick={() => handleSyncStudent(student.id)}
                  disabled={student.isDataSyncing || syncingStudents.has(student.id)}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                  title="Sync Codeforces data"
                >
                  <RefreshCw className={`h-4 w-4 ${(student.isDataSyncing || syncingStudents.has(student.id)) ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Current Rating</span>
                <div className="text-right">
                  <span className={`font-bold text-lg ${getRatingColor(student.currentRating)}`}>
                    {student.currentRating}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getRatingTitle(student.currentRating)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Max Rating</span>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className={`font-semibold ${getRatingColor(student.maxRating)}`}>
                    {student.maxRating}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Last sync: {new Date(student.lastDataSync).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
};

export default Students;