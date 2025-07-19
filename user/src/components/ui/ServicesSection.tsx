import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Collapsible from "./Collapsible";
import { Service } from "../../types/types";

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

  // Animation variants for the section header
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for collapsible items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  // Function to render subtitles with proper line breaks
  const renderSubtitles = (subtitles: string[] | undefined) => {
    if (!subtitles || subtitles.length === 0) {
      return <p className="text-gray-700">ไม่มีข้อมูลเพิ่มเติม</p>;
    }
    return subtitles.map((text, index) => (
      <p
        key={index}
        className={`text-gray-700 ${index > 0 ? 'mt-2' : ''} whitespace-normal break-words`}
      >
        {text || '\u00A0'} {/* ใช้ non-breaking space สำหรับค่าว่าง */}
      </p>
    ));
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            การบริการและค่าบริการ
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            ค่าบริการโดยทั่วไปจะมีเรทราคาที่แตกต่างกันออกไป
            ทั้งนี้ขึ้นอยู่กับรายละเอียดของงานแต่ละประเภท
            โดยคิดค่าบริการจากราคาเริ่มต้น - สูงสุดของงานประเภทนั้นๆ
            และไม่เกินไปกว่านั้น
            ซึ่งจะประเมินจากรายละเอียดที่ลูกค้าแจ้งตามต้องการ
            และผู้ประเมินจะคิดค่าบริการตามความยาก - ง่าย อย่างเหมาะสม
          </p>
        </motion.div>
        <div>
          {services.map((service, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
            >
              <Collapsible
                title={service.title}
                icon={service.icon}
                isOpen={expandedService === index}
                onToggle={() => toggleService(index)}
              >
                <AnimatePresence>
                  {expandedService === index && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, maxHeight: 0 }}
                      animate={{ opacity: 1, maxHeight: 1000 }}
                      exit={{ opacity: 0, maxHeight: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-visible"
                    >
                      <div className="p-1 text-gray-700">
                        <div className="mb-2 mt-[-0.5rem]">
                          {renderSubtitles(service.subtitles)}
                        </div>
                        <p className="font-bold">รายละเอียด :</p>
                        <ul className="list-disc pl-5 mt-2 mb-2">
                          {service.features.map((feature, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                            >
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                        {service.timeline && (
                          <p className="mt-2">
                            <span className="font-bold">ระยะเวลา:</span> {service.timeline}
                          </p>
                        )}
                        {service.revisions && (
                          <p className="mt-2">
                            <span className="font-bold">จำนวนครั้งแก้ไข:</span> {service.revisions}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Collapsible>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;