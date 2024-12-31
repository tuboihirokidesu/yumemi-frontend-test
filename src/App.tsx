import { use, Suspense } from 'react';
import { fetchApi } from './api';

type ApiResponse = {
  message: string;
  result: {
    prefCode: number;
    prefName: string;
  }[];
};

function Prefectures({ dataPromise }: { dataPromise: Promise<ApiResponse> }) {
  const data = use(dataPromise);

  return (
    <div className='p-4'>
      <p className='text-lg font-bold'>{data.message}</p>
      <ul className='list-disc pl-5'>
        {data.result.map((prefecture) => (
          <li key={prefecture.prefCode} className='text-base'>
            {prefecture.prefCode}: {prefecture.prefName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const dataPromise = fetchApi('api/v1/prefectures');
  return (
    <Suspense fallback={<p className='text-center'>Loading...</p>}>
      <Prefectures dataPromise={dataPromise} />
    </Suspense>
  );
}
