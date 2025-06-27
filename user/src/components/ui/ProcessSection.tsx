import React, { useState } from 'react';
import Collapsible from './Collapsible';
import { ProcessStep } from '../../types/types';

interface ProcessSectionProps {
  process: ProcessStep[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ process }) => {
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);

  const toggleProcess = (index: number) => {
    setExpandedProcess(expandedProcess === index ? null : index);
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">ขั้นตอนการให้บริการ</h2>
        </div>
        <div className="space-y-6">
          {process.map((step, index) => (
            <Collapsible
              key={index}
              title={`Step ${step.step}: ${step.title}`}
              isOpen={expandedProcess === index}
              onToggle={() => toggleProcess(index)}
            >
              <p>{step.description}</p>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;