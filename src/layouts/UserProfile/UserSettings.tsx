import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  User, Bell, DollarSign, Star, CreditCard,
  Lock, Wallet, Shield, FileText, Settings,
  Library, ChevronRight, Menu, X
} from "lucide-react";

const menuItems = [
  {
    name: "Account Settings",
    icon: <User size={20} strokeWidth={1.5} />,
    key: "account",
    path: "/profile"
  },
  {
    name: "Email Preferences",
    icon: <Bell size={20} strokeWidth={1.5} />,
    key: "email",
    path: "/profile/email"
  },
  {
    name: "Payment Management",
    icon: <DollarSign size={20} strokeWidth={1.5} />,
    key: "payment",
    path: "/profile/payment"
  },
  {
    name: "Library",
    icon: <Library size={20} strokeWidth={1.5} />,
    key: "library",
    path: "/profile/library"
  },
  {
    name: "Game Rewards",
    icon: <Star size={20} strokeWidth={1.5} />,
    key: "rewards",
    path: "/profile/rewards"
  },
  {
    name: "Password & Security",
    icon: <Lock size={20} strokeWidth={1.5} />,
    key: "security",
    path: "/profile/security"
  },
];

function UserSetting() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const getCurrentKey = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item ? item.key : "account";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-20 left-2 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-100"
      >
        {isMenuOpen ? (
          <X size={24} className="text-gray-800" />
        ) : (
          <Menu size={24} className="text-gray-800" />
        )}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          x: isMenuOpen ? 0 : -320,
          width: "18rem",
        }}
        className={`
          fixed md:static left-0 top-0 h-screen z-40
          bg-white border-r border-gray-100 py-6 px-3
          md:transform-none md:w-72
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="pl-10 pt-14 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
        </div>

        <nav className="space-y-1">
          <AnimatePresence>
            {menuItems.map((item) => {
              const isActive = getCurrentKey() === item.key;
              const isHovered = hoveredItem === item.key;

              return (
                <Link
                  to={item.path}
                  key={item.key}
                  className="block"
                  onMouseEnter={() => setHoveredItem(item.key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={handleItemClick}
                >
                  <motion.div
                    className={`relative flex items-center px-4 py-3 rounded-lg cursor-pointer
                      ${isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute left-0 w-1 h-6 bg-blue-600 rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <span className={`mr-3 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                      {item.icon}
                    </span>

                    <span className="flex-1 text-sm font-medium">{item.name}</span>

                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight
                        size={16}
                        className={isActive ? "text-blue-600" : "text-gray-400"}
                      />
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
          </AnimatePresence>
        </nav>
      </motion.div>
    </>
  );
}

export default UserSetting;