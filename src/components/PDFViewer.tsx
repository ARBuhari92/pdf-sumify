
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PDFViewerProps {
  file: File;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    setUrl(fileUrl);
    
    // Clean up the URL when component unmounts
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

  const goToNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  if (!url) {
    return <div className="text-center py-10">Loading PDF...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">PDF Preview</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {currentPage}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextPage}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <iframe
          src={`${url}#page=${currentPage}`}
          className="w-full h-[500px]"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PDFViewer;
