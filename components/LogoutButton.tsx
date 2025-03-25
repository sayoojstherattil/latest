"use client"

import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('authToken');
    // Force full page reload to reset all state
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
      aria-label="Logout"
    >
      Logout
    </button>
  );
};

export default LogoutButton;