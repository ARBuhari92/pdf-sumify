
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get the total number of pages
    const numPages = pdf.numPages;
    let fullText = '';
    
    // Iterate through each page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Extract the text items
      const strings = textContent.items.map((item: any) => item.str);
      const pageText = strings.join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function summarizeText(text: string): Promise<string> {
  // This is a simple extractive summarization function
  // In a real app, you might want to use an AI service for better summarization
  
  // Split text into sentences
  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .filter(sentence => sentence.trim().length > 20); // Filter out short sentences
  
  if (sentences.length === 0) {
    return "No extractable content found in the document.";
  }
  
  // If very few sentences, return them all
  if (sentences.length <= 5) {
    return sentences.join(' ');
  }
  
  // Simple keyword frequency analysis
  const wordFrequency: Record<string, number> = {};
  const stopWords = ["the", "and", "a", "to", "of", "in", "is", "that", "it", "with", "as", "for", "on", "was", "be", "by", "not", "are", "this", "or", "an", "at", "but", "if", "from"];
  
  sentences.forEach(sentence => {
    const words = sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
      
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
  });
  
  // Score sentences by keyword frequency
  const sentenceScores = sentences.map(sentence => {
    let score = 0;
    const words = sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
      
    words.forEach(word => {
      if (wordFrequency[word]) {
        score += wordFrequency[word];
      }
    });
    
    // Normalize by sentence length to avoid bias towards longer sentences
    return { sentence, score: score / words.length };
  });
  
  // Sort by score and take top sentences (about 30% of original)
  sentenceScores.sort((a, b) => b.score - a.score);
  const numSentencesToKeep = Math.max(3, Math.ceil(sentences.length * 0.3));
  const topSentences = sentenceScores.slice(0, numSentencesToKeep);
  
  // Sort back to original order for coherence
  const originalOrderSentences = topSentences
    .map(item => item.sentence)
    .filter((sentence, index, self) => self.indexOf(sentence) === index); // Remove duplicates
  
  return originalOrderSentences.join(' ');
}
