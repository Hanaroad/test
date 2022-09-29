// import dayjs from 'dayjs';

// // 일자별로 나누는 코드
// export default function makeDate(data) {
//   const sections = {};
//   data.forEach((chart) => {
//     const monthDate = dayjs(String(chart.연월일시)).format(
//       'YYYY-MM-DD HH:mm:ss'
//     );
//     if (Array.isArray(sections[monthDate])) {
//       sections[monthDate].push(chart);
//     } else {
//       sections[monthDate] = [chart];
//     }
//   });
//   return sections;
// }
