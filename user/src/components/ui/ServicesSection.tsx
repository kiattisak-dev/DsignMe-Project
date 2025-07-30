"use client";

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

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const renderDescription = (description: string[]) => {
    return description.map((line, index) => (
      <p
        key={index}
        className={`whitespace-pre-line break-words text-gray-700`}
      >
        {line.trim() === "" ? "\u00A0" : line}
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
            ค่าบริการโดยทั่วไปจะมีเรทราคาที่แตกต่างกันออกไป ทั้งนี้ขึ้นอยู่กับรายละเอียดของงานแต่ละประเภท
            โดยคิดค่าบริการจากราคาเริ่มต้น - สูงสุดของงานประเภทนั้นๆ และไม่เกินไปกว่านั้น
            ซึ่งจะประเมินจากรายละเอียดที่ลูกค้าแจ้งตามต้องการ และผู้ประเมินจะคิดค่าบริการตามความยาก - ง่าย อย่างเหมาะสม
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
                        <div className="mb-2 mt-[-0.5rem] flex flex-col gap-2">
                          {service.description.length > 0 ? (
                            renderDescription(service.description)
                          ) : (
                            <p className="text-gray-700">ไม่มีคำอธิบาย</p>
                          )}
                        </div>

                        {service.features.length > 0 && (
                          <div className="mt-4">
                            <p className="font-bold mb-2">รายละเอียด :</p>
                            <div className="flex flex-col gap-2">
                              {service.features.map((feature, i) => (
                                <motion.p
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.1 }}
                                >
                                  {`${i + 1}. ${feature}`}
                                </motion.p>
                              ))}
                            </div>
                          </div>
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