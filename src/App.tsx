/* eslint-disable unicorn/filename-case */

import { PopulationGraphPromise } from "./population-graph"
import { PrefecturesPromise } from "./prefectures"

export default function App() {
  return (
    <>
      <PrefecturesPromise />
      <PopulationGraphPromise />
    </>
  )
}
