import { use, Suspense } from 'react';
import { fetchApi } from './api';
import { Checkbox } from './_components/checkbox';

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
      <div className='grid grid-cols-3 gap-2'>
        {data.result.map((prefecture) => (
          <Checkbox key={prefecture.prefCode}>
            {prefecture.prefCode}: {prefecture.prefName}
          </Checkbox>
        ))}
      </div>
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
