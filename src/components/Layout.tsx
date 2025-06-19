import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, BarChart3, Settings, Moon, Sun, Code2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Sync Settings', href: '/sync', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 pb-4 shadow-lg">
          <div className="flex h-16 shrink-0 items-center">
            <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              Student Progress
            </span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={toggleTheme}
              className="group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {isDark ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-72">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;