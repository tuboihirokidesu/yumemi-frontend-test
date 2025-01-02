import { useQueryState } from "nuqs"
import { Suspense, use, useEffect, useMemo, useState } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { fetchApi } from "./api"
import { PREFECTURE_CODE } from "./constants/param-keys"
import { prefectureParser } from "./lib/utils"

export function PopulationGraphPromise() {
  const [prefectureCodes] = useQueryState(PREFECTURE_CODE, prefectureParser)
  const populationDataPromise = useMemo(
    () =>
      Promise.all(
        prefectureCodes.map((prefCode) =>
          fetchApi({
            path: "api/v1/population/composition/perYear",
            prefCode,
          }),
        ),
      ),
    [prefectureCodes],
  )

  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <PopulationGraph
        dataPromise={populationDataPromise}
        prefectureCodes={prefectureCodes}
      />
    </Suspense>
  )
}

type ApiResponse = {
  message: string
  result: {
    boundaryYear: number
    data: {
      label: string
      data: {
        year: number
        value: number
        rate: number
      }[]
    }[]
  }
}

type Props = {
  dataPromise: Promise<ApiResponse[]>
  prefectureCodes: string[]
}

async function getPrefectureNames(prefectureCodes: string[]) {
  const response = await fetchApi({ path: "api/v1/prefectures" })
  const prefectureMap = response.result.reduce(
    (
      acc: Record<number, string>,
      pref: { prefCode: number; prefName: string },
    ) => {
      acc[pref.prefCode] = pref.prefName
      return acc
    },
    {},
  )
  return prefectureCodes.map((code) => prefectureMap[parseInt(code)])
}

function PopulationGraph({ dataPromise, prefectureCodes }: Props) {
  const data = use(dataPromise)
  const [prefectureNames, setPrefectureNames] = useState<string[]>([])

  useEffect(() => {
    getPrefectureNames(prefectureCodes).then(setPrefectureNames)
  }, [prefectureCodes])

  const allYears = extractAllYears(data)
  const mergedData = createMergedData(allYears, data)

  return (
    <ResponsiveContainer height={400} width="80%">
      <LineChart data={mergedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          label={{
            value: "年度",
            style: { fontSize: "12px" },
            position: "insideBottomRight",
            offset: -4,
          }}
          tick={{ fontSize: 10 }}
        />
        <YAxis
          label={{
            value: "人口",
            style: { fontSize: "12px" },
            position: "insideTopLeft",
            offset: 8,
          }}
          orientation="left"
          tickFormatter={(value) => `${value / 10000}万人`}
          tick={{ fontSize: 10 }}
        />
        <Tooltip />
        <Legend />
        {data.map((_, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={`value${index}`}
            name={prefectureNames[index]}
            stroke={`hsl(${(index * 137) % 360}, 70%, 50%)`}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function extractAllYears(data: ApiResponse[]): Set<number> {
  const allYears = new Set<number>()
  data.forEach((prefData) => {
    prefData.result.data[0].data.forEach((yearData) => {
      allYears.add(yearData.year)
    })
  })
  return allYears
}

function createMergedData(allYears: Set<number>, data: ApiResponse[]) {
  return Array.from(allYears)
    .sort((a, b) => a - b)
    .map((year) => {
      const yearEntry: { [key: string]: number | undefined } = { year }

      data.forEach((prefData, index) => {
        const prefValue = prefData.result.data[0].data.find(
          (d) => d.year === year,
        )?.value
        yearEntry[`value${index}`] = prefValue
      })

      return yearEntry
    })
}
