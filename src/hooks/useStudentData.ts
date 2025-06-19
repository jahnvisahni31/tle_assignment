import { useState, useEffect } from 'react';
import { studentDataService, Student } from '../data/studentData';

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStudents = () => {
    setStudents(studentDataService.getStudents());
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        // Wait a bit for initial sync to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        refreshStudents();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();

    // Refresh students every 30 seconds
    const interval = setInterval(refreshStudents, 30000);
    return () => clearInterval(interval);
  }, []);

  const syncStudent = async (studentId: string) => {
    try {
      await studentDataService.syncStudentData(studentId);
      refreshStudents();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to sync student');
    }
  };

  const syncAllStudents = async () => {
    try {
      await studentDataService.syncAllStudents();
      refreshStudents();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to sync all students');
    }
  };

  const addStudent = (studentData: Parameters<typeof studentDataService.addStudent>[0]) => {
    const newStudent = studentDataService.addStudent(studentData);
    refreshStudents();
    return newStudent;
  };

  const updateStudent = (id: string, updates: Parameters<typeof studentDataService.updateStudent>[1]) => {
    const updatedStudent = studentDataService.updateStudent(id, updates);
    refreshStudents();
    return updatedStudent;
  };

  const deleteStudent = (id: string) => {
    const success = studentDataService.deleteStudent(id);
    if (success) {
      refreshStudents();
    }
    return success;
  };

  return {
    students,
    loading,
    error,
    syncStudent,
    syncAllStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents
  };
};