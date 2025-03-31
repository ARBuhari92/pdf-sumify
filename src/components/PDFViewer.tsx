
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PDFViewerProps {
  file: File;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // If no API key is found, show the input
      setShowApiKeyInput(true);
    }
  }, []);
  
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

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key");
      return;
    }
    
    localStorage.setItem('openai_api_key', apiKey.trim());
    setShowApiKeyInput(false);
    toast.success("API key saved successfully");
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
      
      {showApiKeyInput && (
        <div className="mb-4 p-3 border rounded-md bg-amber-50">
          <h3 className="text-sm font-medium mb-2">OpenAI API Key Required</h3>
          <p className="text-xs text-gray-600 mb-2">
            Enter your OpenAI API key to generate summaries. Your key is stored only in your browser.
          </p>
          <div className="flex space-x-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="text-xs"
            />
            <Button size="sm" onClick={saveApiKey}>
              <Key className="h-3 w-3 mr-1" /> Save
            </Button>
          </div>
        </div>
      )}
      
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
