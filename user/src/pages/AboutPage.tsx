import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Animation variants for section
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Animation variants for text
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
  },
};

// Animation variants for image
const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.3 },
  },
};

// Animation variants for quote
const quoteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
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
          {/* Logo: Positioned above content on mobile and iPad */}
          <motion.div
            className="flex justify-center lg:justify-start lg:pl-8 order-first lg:order-last"
            variants={imageVariants}
          >
            <img
              src="/Logo D.svg"
              alt="DsignMe Logo"
              className="w-full max-w-[120px] sm:max-w-[160px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[350px] h-auto object-contain"
              loading="lazy"
              onError={() => console.warn("Failed to load logo image")}
            />
          </motion.div>

          {/* About Content and Button */}
          <motion.div
            className="space-y-6 sm:space-y-8 max-w-lg mx-auto lg:mx-0 order-last lg:order-first"
            variants={textVariants}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 border-b-4 border-gray-900 w-full pb-2">
              DsignMe Studio
            </h1>
            <div className="space-y-4 text-base sm:text-lg text-gray-600">
              <p>
                ทีมนักออกแบบและสาขาอาชีพที่เกี่ยวข้องกับกาตลาดและธุรกิจ
                โดยคัดเลือกจากประสบการณ์ด้วยความเชี่ยวชาญ
                เพื่อส่งเสริมผู้ประกอบการ และธุรกิจ
                ด้วยสาขาอาชีพการสื่อสารแบรนด์ที่ช่วย
                ให้ประกอบธุรกิจในทุกอุตสาหกรรมได้อย่าง “ไร้ความกังวล”
              </p>
              <p>
                พวกเราทำงานผ่านแนวคิดจาก ”คนรุ่นใหม่”
                ใส่ใจความต้องการของแบรนด์ธุรกิจเป็นส่วนสำคัญ ด้วยประสบการณ์กว่า
                3 ปี ในด้านการออกแบบกราฟิก
              </p>
              <motion.blockquote
                className="border-l-4 border-gray-900 pl-4 italic text-gray-700"
                variants={quoteVariants}
              >
                “เพื่อให้อัตลักษณ์ของแบรนด์คุณ ถูกเผยให้จดจำด้วยเอกลักษณ์”
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
        </div>
      </div>
    </motion.section>
  );
};

export default AboutPage;