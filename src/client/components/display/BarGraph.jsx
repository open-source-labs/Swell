import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Bar } from "react-chartjs-2";

//neccessary for graph styling due to CSP
Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
});

const BarGraph = ({ dataPoints }) => {
  const [chartData, updateChart] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  const [chartOptions, updateOptions] = useState({
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Roundtrip in milliseconds",
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            display: true,
          },
        },
      ],
    },
    animation: {
      duration: 0,
    },
    maintainAspectRatio: false,
  });

  const dataUpdater = (labelArr, dataArr) => {
    return {
      labels: labelArr,
      datasets: [
        {
          label: "Roundtrip (ms)",
          data: dataArr,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(235, 99, 132, 0.2)",
            "rgba(34, 162, 235, 0.2)",
            "rgba(235, 206, 86, 0.2)",
            "rgba(55, 192, 192, 0.2)",
            "rgba(133, 102, 255, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(235, 99, 132, 1)",
            "rgba(34, 162, 235, 1)",
            "rgba(235, 206, 86, 1)",
            "rgba(55, 192, 192, 1)",
            "rgba(133, 102, 255, 1)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderWidth: 1,
          maxBarThickness: 300,
        },
      ],
    };
  };

  const optionsUpdater = (arr) => {
    const showLabels = arr.length > 3 ? false : true;
    return {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: showLabels,
            },
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: showLabels,
            },
          },
        ],
      },
      animation: {
        duration: 0,
      },
      maintainAspectRatio: false,
    };
  };

  useEffect(() => {
    const urls = dataPoints.length ? dataPoints.map((point) => point.url) : [];

    const times = dataPoints.length
      ? dataPoints.map((point) => point.timeReceived - point.timeSent)
      : [];

    updateChart(dataUpdater(urls, times));

    if (!urls.length || urls.length > 3) updateOptions(optionsUpdater(urls));
  }, [dataPoints]);

  return (
    <div id="chartContainer" className="chart">
      <Bar data={chartData} width={50} height={100} options={chartOptions} />
    </div>
  );
};

export default connect(mapStateToProps)(BarGraph);
