import React from "react";
import { FaInstagram, FaFacebookF, FaLine } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <FaLine className="w-10 h-10" />, href: "#", label: "Line" },
    { icon: <FaInstagram className="w-8 h-8" />, href: "#", label: "Instagram" },
    { icon: <FaFacebookF className="w-8 h-8" />, href: "#", label: "Facebook" },
  ];

  const policyLinks = [
    { name: "นโยบายความเป็นส่วนตัว", href: "#" },
    { name: "นโยบายการจัดส่ง", href: "#" },
    { name: "ข้อกำหนดในการใช้บริการ", href: "#" },
    { name: "นโยบายการคืนเงิน", href: "#" },
    { name: "การกำหนดลักษณะคุกกี้", href: "#" },
  ];

  const iconVariants = {
    initial: { scale: 1, color: "#ffffff" },
    hover: {
      scale: 1.2,
      color: "#d1d5db",
      filter: "grayscale(100%)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        {/* Company Info */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-3 mb-3">
            <img
              src="/Logo-White.svg"
              alt="DsignMe Logo"
              className="w-15 h-10"
            />
          </div>
          <p className="text-gray-400 mt-6 text-base md:text-md leading-relaxed mb-3 max-w-xl mx-auto">
            พวกเราคือกราฟิกดีไซน์เนอร์ เชี่ยวชาญด้านการออกแบบ
            ที่มีประสบการณ์มากกว่า 4 ปี ที่สามารถช่วยส่งเสริมธุรกิจด้วยการ
            ออกแบบที่ดีที่สุดให้กับธุรกิจคุณ
          </p>
        </div>

        {/* Contact and Social */}
        <div className="text-center mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center">
            {/* Contact and Social Icons Box */}
            <div className="mb-4 lg:mb-0 lg:mr-6">
              <p className="text-xl font-bold mb-3">ติดต่อเรา</p>
              <div className="flex justify-center space-x-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 flex items-center justify-center"
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            {/* QR Code Box */}
            <div className="flex justify-center">
              <img
                src="https://qr-official.line.me/gs/M_472lvzyx_BW.png?oat_content=qr"
                alt="QR Code"
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mb-3 max-w-md mx-auto">
          © 2025 DsignMe
        </div>

        {/* Policy Links */}
        <div className="text-center text-gray-400 text-sm max-w-md mx-auto">
          {policyLinks.map((link, index) => (
            <React.Fragment key={index}>
              <a
                href={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
              {index < policyLinks.length - 1 && (
                <span className="mx-2 text-gray-600">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;