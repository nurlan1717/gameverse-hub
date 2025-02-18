import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  User, Bell, DollarSign, Star, CreditCard,
  Lock, Wallet, Shield, FileText, Settings,
  Library, ChevronRight
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
    name: "Epic Rewards",
    icon: <Star size={20} strokeWidth={1.5} />,
    key: "rewards",
    path: "/profile/rewards"
  },
  {
    name: "Subscriptions",
    icon: <CreditCard size={20} strokeWidth={1.5} />,
    key: "subscriptions",
    path: "/profile/subscriptions"
  },
  {
    name: "Password & Security",
    icon: <Lock size={20} strokeWidth={1.5} />,
    key: "security",
    path: "/profile/security"
  },
  {
    name: "In-Game Currency",
    icon: <Wallet size={20} strokeWidth={1.5} />,
    key: "currency",
    path: "/profile/currency"
  },
  {
    name: "Parental Controls",
    icon: <Shield size={20} strokeWidth={1.5} />,
    key: "parental",
    path: "/profile/parental"
  },
  {
    name: "EULA History",
    icon: <FileText size={20} strokeWidth={1.5} />,
    key: "eula",
    path: "/profile/eula"
  },
  {
    name: "Apps & Accounts",
    icon: <Settings size={20} strokeWidth={1.5} />,
    key: "apps",
    path: "/profile/apps"
  }
];

function UserSetting() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getCurrentKey = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item ? item.key : "account";
  };

  return (
    <div className="w-full md:w-72 bg-white min-h-screen border-r border-gray-100 py-6 px-3">
      <div className="px-4 mb-6">
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
              >
                <motion.div
                  className={`relative flex items-center px-4 py-3 rounded-lg cursor-pointer
                    ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
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
    </div>
  );
}

export default UserSetting;