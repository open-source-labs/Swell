import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Bar } from "react-chartjs-2";

Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
});

const BarGraph = (props) => {
  const [dataPoints, updateData] = useState(props.dataPoints);
  console.log(dataPoints);

  let times;

  useEffect(() => {
    updateData(props.dataPoints);
    times = dataPoints.map((point) => point.timeReceived - point.timeSent);
    console.log(times);
  });

  return (
    <div id="chartContainer" className="chart">
      <Bar
        data={{
          datasets: [
            {
              label: "Response (ms)",
              data: times,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }}
        width={50}
        height={100}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          animation: {
            // duration: 0,
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default connect(mapStateToProps)(BarGraph);
