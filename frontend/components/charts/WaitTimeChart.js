import styled from 'styled-components'
import { Box, Typography } from '@material-ui/core'
import dynamic from 'next/dynamic'
import { dissoc } from 'ramda'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const Wrap = styled(Box)`
  background-color: #E1F8FF;
`

const Title = styled(Typography)`
  text-align: center;
  padding-top: 16px;
`

const Info = styled(Box)`
  display: flex;
  margin-top: -32px;
  padding-bottom: 16px;
  justify-content: center;
  visibility: ${(props) => props.visible ? 'visible' : 'hidden'};
  align-items: baseline;
`

const DiffWaitTime = styled(Typography)`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.palette.enable.main};
`

export const WaitTimeChart = ({ timespanMeanWaitTime, shortName, waitTime }) => {

  const currentHours = new Date().getHours()
  const regex = new RegExp(`^${currentHours}`)
  const currentTimespan = Object.keys(timespanMeanWaitTime).find(timespan => regex.test(timespan))
  const diffWaitTime = waitTime - timespanMeanWaitTime[currentTimespan]

  const options = {
    chart: {
      toolbar: {
        show: false
      }
    },
    colors: Object.keys(timespanMeanWaitTime).map((timespan => regex.test(timespan) ? '#00B7D0' : '#2B99FF')),
    plotOptions: {
      bar: {
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      offsetY: -20,
      enabled: true,
      style: {
        colors: ['#000']
      }
    },
    xaxis: {
      categories: Object.keys(timespanMeanWaitTime),
      labels: {
        rotateAlways: true
      }
    },
    yaxis: {
      show: false,
    },
    annotations: {
      points: [{
        x: currentTimespan,
        y: waitTime,
        label: {
          text: String(waitTime),
          offsetY: 0,
          offsetX: -16
        },
        marker: {
          size: 0
        },
        image: {
          path: '/star.png',
          width: 20,
          height: 20,
          offsetY: 10
        }
      }]
    }
  }

  const series = [
    {
      name: '待ち時間',
      data: Object.values(timespanMeanWaitTime)
    }
  ]

  return (
    <Wrap>
      <Title>{shortName}の待ち時間情報</Title>
      <Chart
        options={waitTime < 0 ? dissoc('annotations', options) : options}
        series={series}
        type="bar"
        width="100%"
        height={240}
      />
      <Info visible={waitTime < 0 ? false : true}>
        <Typography>ただいま、普段より</Typography>
        <DiffWaitTime>{Math.abs(diffWaitTime)}分</DiffWaitTime>
        <Typography>{diffWaitTime < 0 ? 'すいています' : 'こんでいます'}</Typography>
      </Info>
    </Wrap>
  )
}