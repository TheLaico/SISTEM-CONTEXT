import Breadcrumb from '../../components/Breadcrumb.tsx'
import CardFour from '../../components/CardFour.tsx'
import CardOne from '../../components/CardOne.tsx'
import CardThree from '../../components/CardThree.tsx'
import CardTwo from '../../components/CardTwo.tsx'
import ChartFour from '../../components/ChartFour.tsx'
import ChartOne from '../../components/ChartOne.tsx'
import ChartThree from '../../components/ChartThree.tsx'
import ChartTwo from '../../components/ChartTwo.tsx'

const ECommerce = () => {
  return (
    <>
      <Breadcrumb pageName="Dashboard" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-3">
          <CardOne />
        </div>
        <div className="col-span-12 xl:col-span-3">
          <CardTwo />
        </div>
        <div className="col-span-12 xl:col-span-3">
          <CardFour />
        </div>
        <div className="col-span-12 xl:col-span-3">
          <CardThree />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mt-4">
        <div className="col-span-12 xl:col-span-8">
          <ChartFour />
        </div>
        <div className="col-span-12 xl:col-span-4 grid gap-4">
          <ChartOne />
          <ChartTwo />
          <ChartThree />
        </div>
      </div>
    </>
  )
}

export default ECommerce
