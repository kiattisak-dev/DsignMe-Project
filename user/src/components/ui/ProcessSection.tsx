import React from 'react';
import { motion } from 'framer-motion';
import Collapsible from './Collapsible';
import { ProcessStep } from '../../types/types';

interface ProcessSectionProps {
  process: ProcessStep[];
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
      description:
        '- แจ้งรายละเอียดงานที่ชัดเจนถึงการออกแบบ ทีมงานกราฟิกสามารถเข้าใจได้ง่าย จะทำให้งานตรงกับความต้องการที่สุด\n' +
        '- แนบภาพประกอบทั้งภาพ Reference ที่ต้องการ หรือภาพสเก็ตซ์\n' +
        '- เพื่ออ้างอิงในการออกแบบต่อไปในกรณีที่ต้องการออกแบบ เช่น โลโก้ แบนเนอร์ ฯลฯ',
    },
    {
      step: 2,
      title: 'ชำระเงินเพื่อจองคิวออกแบบ',
      description:
        '- ชำระเงินเต็มจำนวนเพื่อจองคิวการออกแบบ\n' +
        '- ชำระเงินเต็มจำนวนเพื่อจองคิวการออกแบบ\n' +
        '- โปรดกรอก ชื่อ ที่อยู่ และเบอร์โทรศัพท์ ในวันที่ทำการชำระเงิน เพื่อทำใบเสนอราคาต่อไป',
    },
    {
      step: 3,
      title: 'ออกแบบตามวันเวลาที่ระบุในใบเสนอราคา',
      description:
        '- การออกแบบโดยทั่วไปจะใช้ระยะเวลาอยู่ที่ 10 – 20 วันทำการ ขึ้นอยู่กับความยากง่ายและคิวงานที่มีอยู่\n' +
        '- ทีมงานจะประเมินใบเสนอราคาตามเนื้องานที่ลูกค้าระบุ\n' +
        '- เมื่อสรุปแบบดีไซน์เสร็จ จะมีการส่งให้ลูกค้าตรวจสอบ “รอบแรก” “รอบที่สอง” จนถึง “รอบส่งมอบ”\n' +
        '- สามารถแจ้งแก้ไขรายละเอียดบางจุดได้ (ตามเงื่อนไขที่กำหนด)\n' +
        '- ในกรณีที่ลูกค้าต้องการให้ปรับ/รีวิว/วิเคราะห์ทุกคำสั่ง (ครั้ง) อาจมีค่าใช้จ่ายเพิ่มเติม',
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
                  {/* Preserve line breaks */}
                  <p style={{ whiteSpace: 'pre-line' }}>{step.description}</p>
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
