import { cache } from 'react';

export const apiEndpoint =
  'https://yumemi-frontend-engineer-codecheck-api.vercel.app';

type Props = {
  path: 'api/v1/prefectures' | 'api/v1/population/composition/perYear';
  prefCode?: string;
};

export const fetchApi = cache(async ({ path, prefCode }: Props) => {
  try {
    const url =
      path === 'api/v1/population/composition/perYear' && prefCode
        ? `${apiEndpoint}/${path}?prefCode=${prefCode}`
        : `${apiEndpoint}/${path}`;

    const response = await fetch(url, {
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
    return { result: [] };
  }
});
