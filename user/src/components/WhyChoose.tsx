import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Scale, Users, Award } from 'lucide-react';

const Services: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const serviceItems = [
    {
      id: 1,
      title: 'เพิ่มมูลค่าให้แบรนด์',
      subtitle: 'ออกแบบผ่านมุมมอง และทักษะเฉพาะของผู้เชี่ยวชาญ ด้วยประสบการณ์กว่า 4 ปี',
      icon: TrendingUp,
    },
    {
      id: 2,
      title: 'เปลี่ยนเรื่องยากให้เป็น “เรื่องง่าย”',
      subtitle: 'ด้วยบริการที่หลากหลาย และออกแบบมาเพื่อผู้ประกอบการ ช่วยให้มีธุรกิจหรือสร้างแบรนด์ได้เร็วภายใน 10 - 20 วัน',
      icon: Scale,
    },
    {
      id: 3,
      title: 'พูดคุย ปรึกษา แลกเปลี่ยนความคิด',
      subtitle: 'สอบถามพูดคุยรายละเอียด และใส่ใจในความต้องการ ก่อนออกแบบ เพื่อให้ได้งานในแบบที่ "คุณต้องการ"',
      icon: Users,
    },
    {
      id: 4,
      title: 'ราคาคุ้มค่า พร้อมความพึงพอใจ',
      subtitle: 'งบประมาณที่เหมาะสมกับงานออกแบบที่ใส่ใจ ด้วยทีมที่คัดสรรมาอย่างดี เฉพาะทาง',
      icon: Award,
    },
  ];

  return (
    <motion.section
      id="services"
      className="py-6 sm:py-8 lg:py-12 bg-white"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6 sm:mb-8 lg:mb-12"
          variants={titleVariants}
        >
          <h2 className="text-2xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-4">
            เลือกใช้ DsignMe ดียังไง ?
          </h2>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
        >
          {serviceItems.map((item) => (
            <motion.div
              key={item.id}
              className="relative overflow-hidden bg-black text-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-row min-h-[100px] sm:min-h-[250px] md:min-h-[200px]"
              aria-label={`Service: ${item.title}`}
              variants={cardVariants}
            >
              <div className="w-24 sm:w-32 flex items-center justify-center bg-black">
                <item.icon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
              </div>
              <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-center">
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-3">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Services;