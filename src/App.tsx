import { use, Suspense } from 'react';
import { fetchApi } from './api';
import { Checkbox } from './_components/checkbox';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { PREFECTURE_CODE } from './constants/param-keys';
type ApiResponse = {
  message: string;
  result: {
    prefCode: number;
    prefName: string;
  }[];
};

const prefectureParser = parseAsArrayOf(parseAsString).withDefault([]);

function Prefectures({ dataPromise }: { dataPromise: Promise<ApiResponse> }) {
  const data = use(dataPromise);
  const [prefectureCodes, setPrefectureCodes] = useQueryState(
    PREFECTURE_CODE,
    prefectureParser
  );

  const handleCheckboxChange = (prefCode: string) => {
    setPrefectureCodes((prev) =>
      prev.includes(prefCode)
        ? prev.filter((code) => code !== prefCode)
        : [...prev, prefCode]
    );
  };

  return (
    <div className='p-4'>
      <p className='text-lg font-bold'>{data.message}</p>
      <div className='grid grid-cols-3 gap-2'>
        {data.result.map((prefecture) => (
          <Checkbox
            key={prefecture.prefCode}
            isSelected={prefectureCodes.includes(
              prefecture.prefCode.toString()
            )}
            onChange={() =>
              handleCheckboxChange(prefecture.prefCode.toString())
            }
          >
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
