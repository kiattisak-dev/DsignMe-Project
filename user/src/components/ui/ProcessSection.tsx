import React from 'react';
import { motion } from 'framer-motion';
import Collapsible from './Collapsible';
import { ProcessStep } from '../../types/types';

interface ProcessSectionProps {
  process?: ProcessStep[];
}

const ProcessSection: React.FC<ProcessSectionProps> = () => {
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2, ease: 'easeOut' },
    }),
  };

  const processSteps = [
    {
      step: 1,
      title: 'กรอกรายละเอียดที่ต้องการให้ออกแบบ',
      bullets: [
        'แจ้งรายละเอียดงานที่ชัดเจนถึงการออกแบบ ที่ทางกราฟฟิกสามารถเข้าใจได้ง่าย จะทำให้ได้งานตรงกับความต้องการที่สุด',
        'แนบภาพประกอบทั้งภาพ Reference ที่ต้องการ หรือภาพสเก็ตซ์ เพื่ออ้างอิงในการออกแบบต่อไป',
        'ในกรณีที่ต้องการออกแบบ เช่น Ci, Packaging หรือ Ads Content คุณจำเป็นต้องมี Logo อยู่แล้ว หากยังไม่มี แนะนำให้ผ่านการออกแบบ ให้เรียบร้อยหลังจาก นั้นจึงจะเข้าสู่การออกแบบ ต่อไป',
      ],
    },
    {
      step: 2,
      title: 'ชำระเงินเพื่อจองคิวออกแบบ',
      bullets: [
        'ชำระเงินเต็มจำนวนเพื่อจองคิวการออกแบบ',
        'โปรดกรอก ชื่อ ที่อยู่ และเบอร์โทรศัพท์ ในวันที่ทำการชำระเงิน เพื่อทำใบเสนอราคาต่อไป',
      ],
    },
    {
      step: 3,
      title: 'ออกแบบตามวันเวลาที่ระบุในใบเสนอราคา',
      bullets: [
        'การออกแบบโดยทั่วไประยะเวลาจะอยู่ที่ 10 - 20 วันทำการ หลังจากทำการชำระเงิน (ทั้งนี้ขึ้นอยู่ กับรายละเอียดของงาน ที่ผ่านการประเมินใน ใบเสนอราคา)',
        'เริ่มนับวันหลังจากวันที่ชำระเงิน เช่น ทำการชำระเงิน “วันจันทร์” จะนับวัน “วันอังคาร” เป็นวันแรก',
        'การนับวันทำการไม่รวมวันอาทิตย์ และวันหยุด นักขัตฤกษ์',
      ],
    },
  ];

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">ขั้นตอนการให้บริการ</h2>
        </motion.div>
        <div>
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
            >
              <Collapsible
                title={`Step ${step.step}: ${step.title}`}
                isCollapsible={false}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="list-disc pl-6 space-y-2 text-gray-800">
                    {step.bullets.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              </Collapsible>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
