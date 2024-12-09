import { Question } from '../types';

const NETLIFY_API_URL = '/.netlify/functions';

export async function deployToNetlify(questions: Record<string, Question>) {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions }),
    });

    if (!response.ok) {
      throw new Error('Deployment failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Deployment error:', error);
    throw error;
  }
}