import React, { useState } from 'react';
import { X, User, Mail, Phone, Code } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (studentData: any) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.codeforcesHandle.trim()) newErrors.codeforcesHandle = 'Codeforces handle is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add student
    onAdd({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      codeforcesHandle: formData.codeforcesHandle.trim(),
      isInactive: false,
      lastDataSync: new Date().toISOString(),
      isDataSyncing: false
    });
    
    // Reset form
    setFormData({ name: '', email: '', phone: '', codeforcesHandle: '' });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Add New Student
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the student's information to add them to the system. Their Codeforces data will be synced automatically.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.name ? 'border-red-300 dark:border-red-600' : ''
                  }`}
                  placeholder="Enter full name"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.email ? 'border-red-300 dark:border-red-600' : ''
                  }`}
                  placeholder="Enter email address"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phone number"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="codeforcesHandle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Codeforces Handle
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="codeforcesHandle"
                  id="codeforcesHandle"
                  value={formData.codeforcesHandle}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.codeforcesHandle ? 'border-red-300 dark:border-red-600' : ''
                  }`}
                  placeholder="Enter Codeforces handle"
                />
                <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.codeforcesHandle && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.codeforcesHandle}</p>}
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:ml-3 sm:w-auto transition-colors duration-200"
              >
                Add Student
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto transition-colors duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;