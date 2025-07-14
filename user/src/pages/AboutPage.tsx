import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animation variants for section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Animation variants for text
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 },
  },
};

// Animation variants for image
const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.3 },
  },
};

// Animation variants for quote
const quoteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.4 },
  },
};

const AboutPage: React.FC = () => {
  return (
    <motion.section
      className="min-h-screen flex items-center justify-center bg-gray-50 pt-12 md:pt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Side: About Content and Button */}
          <motion.div
            className="space-y-6 sm:space-y-8 max-w-lg mx-auto lg:mx-0"
            variants={textVariants}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 border-b-4 border-gray-900 w-full pb-2">
              เกี่ยวกับเรา
            </h1>
            <div className="space-y-4 text-base sm:text-lg text-gray-600">
              <p>
                สมบูรณ์แบบ เอ็นเตอร์ไพรส์ เป็นบริษัทออกแบบกราฟิกที่มีความตั้งใจที่จะเป็นพลังสนับสนุนธุรกิจขนาดเล็กด้วยการออกแบบ โดยมีทัศนคติว่า
                ‘ทุกธุรกิจขนาดเล็กจะต้องสามารถเข้าถึงการออกแบบที่ดีได้’ เราเชื่อว่าการออกแบบช่วยให้ธุรกิจดีขึ้นได้ในหลาย ๆ ด้าน
                ทั้งในแง่ของภาพลักษณ์และยอดขาย
              </p>
              <p>
                พวกเราเป็นทีมงานคนรุ่นใหม่ นำทีมโดยกราฟิกดีไซเนอร์ที่มีประสบการณ์ด้านการออกแบบกราฟิกมามากกว่า 5 ปี
                พวกเราพร้อมที่จะซัพพอร์ตธุรกิจของคุณด้วยงานออกแบบ ไม่ว่าคุณจะทำธุรกิจอะไร งานของคุณจะได้รับการออกแบบอย่างดีที่สุด
                เพราะการออกแบบที่สมบูรณ์เริ่มต้นที่สมบูรณ์แบบ
              </p>
              <motion.blockquote
                className="border-l-4 border-gray-900 pl-4 italic text-gray-700"
                variants={quoteVariants}
              >
                “พวกเราทำงานกันเป็นทีม โดยทีมกราฟิกของเราจะช่วยกันระดมความคิด เพื่อให้งานของคุณได้รับการออกแบบอย่างดีที่สุด”
              </motion.blockquote>
            </div>
            <div className="text-center lg:text-left">
              <Link
                to="/contact"
                className="inline-block bg-black text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 text-base sm:text-lg"
              >
                ติดต่อเรา
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Logo */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={imageVariants}
          >
            <img
              src="/Logo-Black.svg"
              alt="สมบูรณ์แบบ เอ็นเตอร์ไพรส์ Logo"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
              loading="lazy"
              onError={() => console.warn('Failed to load logo image')}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutPage;