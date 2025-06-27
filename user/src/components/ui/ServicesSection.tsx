import React, { useState } from 'react';
import Collapsible from './Collapsible';
import { Service } from '../../types/types';

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">การบริการและค่าบริการ</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            ค่าบริการโดยทั่วไปจะมีเรทราคาที่แตกต่างกันออกไป ทั้งนี้ขึ้นอยู่กับรายละเอียดของงานแต่ละประเภท
            โดยคิดค่าบริการจากราคาเริ่มต้น - สูงสุดของงานประเภทนั้นๆ และไม่เกินไปกว่านั้น
            ซึ่งจะประเมินจากรายละเอียดที่ลูกค้าแจ้งตามต้องการ และผู้ประเมินจะคิดค่าบริการตามความยาก - ง่าย อย่างเหมาะสม
          </p>
        </div>
        <div className="space-y-6">
          {services.map((service, index) => (
            <Collapsible
              key={index}
              title={service.title}
              isOpen={expandedService === index}
              onToggle={() => toggleService(index)}
              icon={service.icon}
            >
              <p className="mb-2">{service.description}</p>
              <ul className="list-disc pl-5 mb-2">
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <p>Timeline: {service.timeline}</p>
              <p>Revisions: {service.revisions}</p>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;