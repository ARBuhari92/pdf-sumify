
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SummaryViewProps {
  summary: string;
  isLoading: boolean;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, isLoading }) => {
  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'pdf-summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            <span>Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
          <div className="mt-6">
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          <span>Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{summary}</p>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={downloadSummary}
            className="bg-pdf-primary hover:bg-pdf-dark"
          >
            <ArrowDown className="mr-2 h-4 w-4" /> Download Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryView;
