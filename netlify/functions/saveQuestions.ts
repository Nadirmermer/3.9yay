import { Handler } from '@netlify/functions';
import { Question } from '../../src/types';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const questions: Record<string, Question> = JSON.parse(event.body || '{}');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questions),
    };
  } catch (error) {
    console.error('Error saving questions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Sorular kaydedilirken bir hata oluştu' }),
    };
  }
};