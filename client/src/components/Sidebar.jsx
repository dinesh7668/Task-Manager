import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineCalendar,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineCheckCircle
} from 'react-icons/hi';

/**
 * Sidebar - Navigation sidebar with links, theme toggle, and user info
 */
export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/tasks', icon: HiOutlineCollection, label: 'Tasks' },
    { to: '/calendar', icon: HiOutlineCalendar, label: 'Calendar' },
  ];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
          <HiOutlineCheckCircle className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            Taskify
          </h1>
          <p className="text-xs text-dark-400">Taskify</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 shadow-sm'
                  : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'
              }`
            }
          >
            <Icon className="text-xl" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-2 border-t border-white/5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-all duration-200 text-neutral-500 hover:bg-white/5"
        >
          {isDark ? <HiOutlineSun className="text-xl text-warning-400" /> : <HiOutlineMoon className="text-xl text-primary-400" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User info + Logout */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-neutral-200">{user?.name}</p>
            <p className="text-xs truncate text-neutral-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-danger-500/10 text-dark-400 hover:text-danger-500 transition-colors"
            title="Logout"
          >
            <HiOutlineLogout className="text-lg" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl shadow-lg lg:hidden" style={{ background: 'rgba(17,17,17,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <HiOutlineMenu className="text-xl text-neutral-300" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 glass-card border-r border-dark-200 dark:border-dark-700/50 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 flex flex-col glass-card z-50 lg:hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
              >
                <HiOutlineX className="text-lg" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
