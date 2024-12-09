import { Handler } from '@netlify/functions';
import { questions as defaultQuestions } from '../../src/data/questions';

export const handler: Handler = async () => {
  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(defaultQuestions),
    };
  } catch (error) {
    console.error('Error loading questions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Sorular yüklenirken bir hata oluştu' }),
    };
  }
};