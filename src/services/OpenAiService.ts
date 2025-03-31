interface OpenAICompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generateSummaryWithOpenAI(text: string): Promise<string> {
  // Check if text is too long and truncate if necessary
  // OpenAI has token limits (roughly 4 chars = 1 token)
  const maxChars = 15000; // Conservative limit for GPT models
  const truncatedText = text.length > maxChars 
    ? text.substring(0, maxChars) + "..."
    : text;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPEN_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes text. Provide a concise, well-structured summary of the text.'
          },
          {
            role: 'user',
            content: `Please summarize the following text from a PDF document:\n\n${truncatedText}`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as OpenAICompletionResponse;
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate summary with OpenAI. Please check your API key and try again.');
  }
}