import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Bar } from "react-chartjs-2";

Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
});

const BarGraph = (props) => {
  const [dataPoints, updateData] = useState(props.dataPoints);
  const [chartData, updateChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Response (ms)",
        data: [],
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
  });

  const dataUpdater = (labelArr, dataArr) => {
    return {
      labels: labelArr,
      datasets: [
        {
          label: "Response (ms)",
          data: dataArr,
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
    };
  };

  useEffect(() => updateData(props.dataPoints));

  useEffect(() => {
    const urls = dataPoints.length ? dataPoints.map((point) => point.url) : [];
    const times = props.dataPoints.length
      ? dataPoints.map((point) => point.timeReceived - point.timeSent)
      : [];
    const updatedChart = dataUpdater(urls, times);
    console.log(urls.length, "  ", chartData.labels.length);
    if (chartData.labels.length !== urls.length) {
      console.log(chartData.labels);
      updateChart(updatedChart);
    }
  }, [dataPoints]);

  return (
    <div id="chartContainer" className="chart">
      <Bar
        data={chartData}
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
