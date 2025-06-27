import React from 'react';
import { TrendingUp, Scale, Users, Award } from 'lucide-react';

const Services: React.FC = () => {
  const serviceItems = [
    {
      id: 1,
      title: 'เพิ่มมูลค่าให้แบรนด์',
      subtitle: 'ช่วยออกแบบและ เสริมทักษะให้มีมุมมอง การออกแบบให้ดีขึ้น ด้วยประสบการณ์',
      icon: TrendingUp,
    },
    {
      id: 2,
      title: 'เปลี่ยนเรื่องยากให้เป็น “เรื่องง่าย”',
      subtitle: 'ด้วยคอร์สที่หลากหลาย และ บริการ ที่ช่วยให้มีธุรกิจเป็นของตัวเองได้เร็ว',
      icon: Scale,
    },
    {
      id: 3,
      title: 'พูดคุย ปรึกษา แลกเปลี่ยนความคิด',
      subtitle: 'ระหว่างคอมมูนิตี้ ที่สนใจเรื่องเดียวกัน และ ปรึกษากับเราได้เช่นกัน',
      icon: Users,
    },
    {
      id: 4,
      title: 'มีความรู้ และประสบการณ์จริง',
      subtitle: 'ผ่านการสอนทริคต่างๆ และคอร์สพร้อม แบบฝึกหัด ที่คัดกรองเนื้อหาอย่างดี',
      icon: Award,
    },
  ];

  return (
    <section id="services" className="py-6 sm:py-8 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            เลือกใช้ DsignMe ดียังไง ?
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {serviceItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-row min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
              aria-label={`Service: ${item.title}`}
            >
              <div className="w-24 sm:w-32 flex items-center justify-center bg-gray-800">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;