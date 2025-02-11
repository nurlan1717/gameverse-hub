import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User, Bell, DollarSign, Star, CreditCard,
  Lock, Wallet, Shield, FileText, Settings,
  Library
} from "lucide-react";

const menuItems = [
  { name: "Account Settings", icon: <User size={20} />, key: "account", path: "/profile" },
  { name: "Email Preferences", icon: <Bell size={20} />, key: "email", path: "/profile/email" },
  { name: "Payment Management", icon: <DollarSign size={20} />, key: "payment", path: "/profile/payment" },
  { name: "Library", icon: <Library size={20} />, key: "library", path: "/profile/library" },
  { name: "Epic Rewards", icon: <Star size={20} />, key: "rewards", path: "/profile/rewards" },
  { name: "Subscriptions", icon: <CreditCard size={20} />, key: "subscriptions", path: "/profile/subscriptions" },
  { name: "Password & Security", icon: <Lock size={20} />, key: "security", path: "/profile/security" },
  { name: "In-Game Currency", icon: <Wallet size={20} />, key: "currency", path: "/profile/currency" },
  { name: "Parental Controls", icon: <Shield size={20} />, key: "parental", path: "/profile/parental" },
  { name: "EULA History", icon: <FileText size={20} />, key: "eula", path: "/profile/eula" },
  { name: "Apps & Accounts", icon: <Settings size={20} />, key: "apps", path: "/profile/apps" },
];

const UserSettings = () => {
  const [selected, setSelected] = useState("account");

  return (
    <div className="w-64 bg-gray-100 mt-2 min-h-screen p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <Link to={item.path}
            key={item.key}>
            <motion.li
              key={item.key}
              onClick={() => setSelected(item.key)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
              ${selected === item.key ? "bg-black text-white" : "hover:bg-gray-200"}`}
              whileTap={{ scale: 0.95 }}
            >
              <a className="flex items-center w-full">
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            </motion.li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default UserSettings;
