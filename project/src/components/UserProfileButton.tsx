import React, { useState, useRef, useEffect } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileButtonProps {
  user: UserProfile;
  onClick: () => void;
}

function UserProfileButton({ user, onClick }: UserProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700 hidden md:block">
          {user.name}
        </span>
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
            {user.name.charAt(0)}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
          <button
            onClick={() => {
              onClick();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Profile Settings</span>
          </button>
          <div className="h-px bg-gray-200 my-1" />
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfileButton;