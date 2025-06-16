import React from 'react';

const Services: React.FC = () => {
  const serviceItems = [
    {
      id: 1,
      title: 'เพิ่มมูลค่าให้แบรนด์',
      subtitle: 'ช่วยออกแบบและ เสริมทักษะให้มีมุมมอง การออกแบบให้ดีขึ้น ด้วยประสบการณ์',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'เปลี่ยนเรื่องยากให้เป็น “เรื่องง่าย”',
      subtitle: 'ด้วยคอร์สที่หลากหลาย และ บริการ ที่ช่วยให้มีธุรกิจเป็นของตัวเองได้เร็ว',
      image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'พูดคุย ปรึกษา แลกเปลี่ยนความคิด',
      subtitle: 'ระหว่างคอมมูนิตี้ ที่สนใจเรื่องเดียวกัน และ ปรึกษากับเราได้เช่นกัน',
      image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      title: 'มีความรู้ และประสบการณ์จริง',
      subtitle: 'ผ่านการสอนทริคต่างๆ และคอร์สพร้อม แบบฝึกหัด ที่คัดกรองเนื้อหาอย่างดี',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

   return (
    <section id="services" className="py-6 sm:py-8 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Why Choose Our Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {serviceItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col min-h-[300px] sm:min-h-[350px]"
              aria-label={`Service: ${item.title}`}
            >
              <div className="w-full h-48 sm:h-56 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              </div>
              <div className="flex-1 p-4 sm:p-5 bg-white flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3">
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