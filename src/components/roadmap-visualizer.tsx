'use client';

import React from 'react';
import {Card, CardContent} from '@/components/ui/card';

interface RoadmapVisualizerProps {
  careerPath: string;
}

export const RoadmapVisualizer: React.FC<RoadmapVisualizerProps> = ({
  careerPath,
}) => {
  // Placeholder data for the roadmap
  const roadmapSteps = [
    `Step 1: Obtain a Bachelor's Degree in ${careerPath}-related field`,
    'Step 2: Gain practical experience through internships',
    `Step 3: Develop ${careerPath}-specific skills`,
    'Step 4: Build a professional portfolio',
    'Step 5: Network with industry professionals',
  ];

  return (
    <CardContent>
      <h3 className="text-xl font-semibold mb-4">
        Career Path: {careerPath}
      </h3>
      <ul className="list-disc pl-5">
        {roadmapSteps.map((step, index) => (
          <li key={index} className="mb-2">
            {step}
          </li>
        ))}
      </ul>
    </CardContent>
  );
};
