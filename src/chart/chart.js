// Chart.js
import dayjs from 'dayjs';
import './chart.css';
import React, { useEffect, useState } from 'react';
import solardata from '../data/solardata.json';
// import makeDate from './makeDate';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Surface,
  Symbols,
} from 'recharts';

console.log(solardata.every);
console.log(JSON.stringify('연월일시'));

const tabs = [
  {
    label: '수평면일사량',
    key: '보정수평면일사량',
    content: '수평면일사량(W/㎡)',
  },
  {
    label: '패널면일사량',
    key: '보정패널면일사량',
    content: '패널면일사량(w/m2)',
  },
  { label: '패널온도', key: '보정패널온도', content: '패널온도(°C)' },
  { label: '기온', key: '보정기온', content: '기온(°C)' },
  { label: '강수량', key: '강수량', content: '강수량(mm)' },
];

const loadData = [...solardata];
console.log(loadData);
// const loadData = () => JSON.parse(JSON.stringify(solardata));
// console.log(loadData);
export default function Chart() {
  // const chartDay = makeDate(chartData);
  const [tabInfo, setTabInfo] = useState({
    label: '수평면일사량',
    key: '보정수평면일사량',
    content: '수평면일사량(W/㎡)',
  });
  const [chartDayData, setChartDayData] = useState([]);

  const [currentBtn, setCurrentBtn] = useState('수평면일사량');

  const handleClickTabInfo = (label) => {
    const index = tabs.findIndex((info) => info.label === label);
    setTabInfo({ ...tabs[index] });
    setCurrentBtn(label);
  };

  const renderCustomizedLegend = ({ payload }) => {
    return (
      <div className="customized-legend">
        {payload.map((entry) => {
          const { dataKey, color, value } = entry;
          // console.log(entry);

          const style = {
            marginRight: 10,
            color: '#AAA',
            display: value === '태양광발전량' ? 'none' : 'inline-block',
          };

          return (
            <span className="legend-item" key={dataKey} style={style}>
              <Surface width={10} height={10} viewBox="0 0 10 10">
                <Symbols cx={5} cy={5} type="square" size={50} fill={color} />
              </Surface>
              <span>{dataKey}</span>
            </span>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    fetch(
      'http://http://222.239.231.149:8080/dashboard/solaseado/data/solardata.json'
    )
      .then((res) => res.json())
      .then((data) => {
        setChartDayData(data);
      });
    if (Object.keys(chartDay).length > 0) {
      const tempDay = [];
      // 일자에 해당 하는 데이터들을 평균값 내서 새롭게 변수에다 넣는 코드
      Object.entries(chartDay).forEach(([data]) => {
        let tempSolarMin =
          Math.floor(data.reduce((p, c) => p + c.최소발전량, 0) * 100) / 100; // Math.floor(x) : 주어진 수 이하의 가장 큰 정수 반환
        let tempSolarMax =
          Math.floor(data.reduce((p, c) => p + c.최대발전량, 0) * 100) / 100;
        let tempSolarAve =
          Math.floor(data.reduce((p, c) => p + c.평균발전량, 0) * 100) / 100;
        let tempSolarRadi =
          Math.floor(data.reduce((p, c) => p + c.보정수평면일사량, 0) * 100) /
          100;
        let tempSolarRadiPanel =
          Math.floor(data.reduce((p, c) => p + c.보정패널면일사량, 0) * 100) /
          100;
        let tempTemperature =
          Math.floor(data.reduce((p, c) => p + c.보정기온, 0) * 100) / 100;
        let tempPanel =
          Math.floor(data.reduce((p, c) => p + c.보정패널온도, 0) * 100) / 100;
        let precipitation =
          Math.floor(data.reduce((p, c) => p + c.강수량, 0) * 100) / 100;

        const tempAvgData = {
          date: dayjs(date).format('DD[일] HH[시]'),
          최소발전량: tempSolarMin,
          최대발전량: tempSolarMax,
          평균발전량: tempSolarAve,
          보정수평면일사량: tempSolarRadi,
          보정패널면일사량: tempSolarRadiPanel,
          보정기온: tempTemperature,
          보정패널온도: tempPanel,
          강수량: precipitation,
        };
        tempDay.push(tempAvgData);
      });
      setChartDayData([...tempDay]);
    }
  }, [chartDay]);
  console.log(chartDay);

  return (
    <div className="chart">
      <div className="charttitle">
        <span className="chartname">기상&발전량 예측 정보(중기)</span>
        <span className="uptime">2022.09.21 12:10</span>
        <section
          style={{ position: 'absolute', top: 0, right: 10, zIndex: 1000 }}
        >
          {tabs.map((info) => (
            <button
              key={info.label}
              className={
                'chartBtn' + (currentBtn === info.label ? ' active' : '')
              }
              onClick={() => handleClickTabInfo(info.label)}
            >
              {info.label}
            </button>
          ))}
        </section>
      </div>
      <ResponsiveContainer>
        <ComposedChart
          className="text"
          data={chartDayData}
          margin={{
            top: 30,
            right: 20,
            bottom: 10,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#d5d5d5" />
          <XAxis dataKey="date" stroke="#6b6b6b" strokeWidth={2} />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#6b6b6b"
            strokeWidth={2}
            label={{
              value: '발전량(MW)',
              offset: 15,
              angle: 0,
              position: 'top',
            }}
          />
          <Tooltip position={{ y: 100 }} />
          <Legend
            verticalAlign="bottom"
            iconType="square"
            className="legend"
            content={renderCustomizedLegend}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            strokeWidth={2}
            label={{
              value: tabInfo.content,
              offset: 15,
              angle: 0,
              position: 'top',
            }}
          />
          <Area
            yAxisId="left"
            name="태양광발전량"
            dataKey="최대발전량"
            stroke="#eaa621"
            fill="#eaa621"
            fillOpacity={1}
            type="monotone"
            dot={false}
            activeDot={false}
          />
          <Area
            yAxisId="left"
            name="태양광발전량"
            dataKey="최소발전량"
            stroke="#eaa621"
            fill="#e9e9e9"
            fillOpacity={1}
            type="monotone"
            dot={false}
            activeDot={false} // 커서 올릴때 라인에 원 모양이 보이는것
          />
          <Bar
            fill="#328dac"
            className="barStyle"
            yAxisId="right"
            dataKey={tabInfo.key}
          />
          <Line
            yAxisId="left"
            name="평균예측발전량"
            dataKey="평균발전량"
            stroke="#e35642"
            strokeWidth={2}
            type="monotone"
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
