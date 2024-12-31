export const apiEndpoint =
  'https://yumemi-frontend-engineer-codecheck-api.vercel.app';

export const fetchApi = async (path: string) => {
  try {
    const response = await fetch(`${apiEndpoint}/${path}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ',
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch API error:', error);
    throw error;
  }
};
