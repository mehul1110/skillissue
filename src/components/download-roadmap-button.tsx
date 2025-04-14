'use client';

import React from 'react';
import {Button} from '@/components/ui/button';

interface DownloadRoadmapButtonProps {
  roadmapContent: string;
}

export const DownloadRoadmapButton: React.FC<
  DownloadRoadmapButtonProps
> = ({roadmapContent}) => {
  const handleDownload = () => {
    const blob = new Blob([roadmapContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career_roadmap.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      Download Roadmap
    </Button>
  );
};
