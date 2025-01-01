import { use, Suspense, useMemo } from 'react';
import { fetchApi } from './api';
import { useQueryState } from 'nuqs';
import { PREFECTURE_CODE } from './constants/param-keys';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { prefectureParser } from './lib/utils';

export function PopulationGraphPromise() {
  const [prefectureCodes] = useQueryState(PREFECTURE_CODE, prefectureParser);
  const populationDataPromise = useMemo(
    () =>
      Promise.all(
        prefectureCodes.map((prefCode) =>
          fetchApi({
            path: 'api/v1/population/composition/perYear',
            prefCode,
          })
        )
      ),
    [prefectureCodes]
  );

  return (
    <Suspense fallback={<p className='text-center'>Loading...</p>}>
      <PopulationGraph dataPromise={populationDataPromise} />
    </Suspense>
  );
}

type ApiResponse = {
  message: string;
  result: {
    boundaryYear: number;
    data: {
      label: string;
      data: {
        year: number;
        value: number;
        rate: number;
      }[];
    }[];
  };
};

type Props = {
  dataPromise: Promise<ApiResponse[]>;
};

function PopulationGraph({ dataPromise }: Props) {
  const data = use(dataPromise);

  return (
    <ResponsiveContainer height={400} width='80%'>
      <LineChart>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='year'
          label={{
            value: '年度',
            style: { fontSize: '12px' },
            position: 'insideBottomRight',
            offset: -4,
          }}
          tick={{ fontSize: 10 }}
        />
        <YAxis
          label={{
            value: '人口',
            style: { fontSize: '12px' },
            position: 'insideTopLeft',
            offset: 10,
          }}
          orientation='left'
          tickFormatter={(value) => `${value / 10000}万人`}
          tick={{ fontSize: 10 }}
        />
        <Tooltip />
        <Legend />
        {data.map((prefectureData, index) => (
          <Line
            key={index}
            type='monotone'
            dataKey='value'
            data={prefectureData.result.data[index].data}
            name={prefectureData.result.data[index].label}
            stroke='#8884d8'
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
