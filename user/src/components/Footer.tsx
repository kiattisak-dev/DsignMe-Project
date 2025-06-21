import React from 'react';
import { Palette, Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <FaComment />, href: '#', label: 'Line' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
  ];

  const policyLinks = [
    { name: 'นโยบายความเป็นส่วนตัว', href: '#' },
    { name: 'นโยบายการจัดส่ง', href: '#' },
    { name: 'ข้อกำหนดในการใช้บริการ', href: '#' },
    { name: 'นโยบายการคืนเงิน', href: '#' },
    { name: 'การกำหนดลักษณะคุกกี้', href: '#' },
  ];

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        {/* Company Info */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold">DsignMe</span>
          </div>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-3 max-w-xl mx-auto">
            พวกเราคือกราฟิกดีไซน์เนอร์ เชี่ยวชาญด้านการออกแบบ 
            ที่มีประสบการณ์มากกว่า 4 ปี ที่สามารถช่วยส่งเสริมธุรกิจด้วยการ 
            ออกแบบที่ดีที่สุดให้กับธุรกิจคุณ
          </p>
        </div>

        {/* Contact and Social */}
        <div className="text-center mb-4">
          <p className="text-xl font-bold mb-3">ติดต่อเรา</p>
          <div className="flex justify-center space-x-6 mb-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-12 h-12 bg-gray-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                {social.icon}
              </a>
            ))}
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
              {index < policyLinks.length - 1 && <span className="mx-2 text-gray-600">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;