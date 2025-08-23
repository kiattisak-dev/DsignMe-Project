import React from "react";
import { FaLine } from "react-icons/fa"; // ✅ ดึง icon LINE จาก react-icons

const FloatingLineButton: React.FC = () => {
  return (
    <a
      href="https://lin.ee/c2HxJS1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="ติดต่อ LINE"
      className="
        fixed z-50
        right-4 bottom-6 sm:right-6 sm:bottom-8
        h-14 w-14 sm:h-16 sm:w-16
        rounded-full bg-green-500
        shadow-xl shadow-green-900/30
        flex items-center justify-center
        transition-transform duration-200
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-gray-900
        animate-bounce
      "
    >
      {/* ✅ ใช้ react-icons */}
      <FaLine className="w-10 h-10 text-white" />
    </a>
  );
};

export default FloatingLineButton;
