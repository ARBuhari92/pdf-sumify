
import React, { useState } from 'react';
import { toast } from "sonner";
import FileUpload from '@/components/FileUpload';
import PDFViewer from '@/components/PDFViewer';
import SummaryView from '@/components/SummaryView';
import { extractTextFromPdf } from '@/services/PdfParser';
import { generateSummaryWithOpenAI } from '@/services/OpenAiService';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Index = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  const handleFileSelected = (file: File) => {
    setPdfFile(file);
    setSummary('');
  };

  const generateSummary = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file first");
      return;
    }

    if (!import.meta.env.VITE_OPEN_API_KEY) {
      toast.error("OpenAI API key not found in environment variables");
      return;
    }

    try {
      setIsGeneratingSummary(true);
      toast.info("Extracting text from PDF...");
      
      const extractedText = await extractTextFromPdf(pdfFile);
      
      toast.info("Generating summary with OpenAI...");
      const generatedSummary = await generateSummaryWithOpenAI(extractedText);
      
      setSummary(generatedSummary);
      toast.success("Summary generated successfully!");
    } catch (error) {
      console.error('Error generating summary:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to generate summary. Please try again.");
      }
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF-Sumify</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your PDF documents and get AI-powered summaries in seconds.
          </p>
        </header>

        {!pdfFile ? (
          <FileUpload onFileSelected={handleFileSelected} />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <PDFViewer file={pdfFile} />
              <div className="mt-6 flex flex-col items-center">
                <Button 
                  onClick={generateSummary} 
                  disabled={isGeneratingSummary}
                  className="bg-pdf-primary hover:bg-pdf-dark w-full md:w-auto"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Generate Summary
                </Button>
                <button 
                  onClick={() => setPdfFile(null)} 
                  className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Upload a different file
                </button>
              </div>
            </div>
            
            <div>
              <SummaryView 
                summary={summary} 
                isLoading={isGeneratingSummary} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
