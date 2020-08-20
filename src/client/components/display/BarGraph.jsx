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
      // duration: 0,
    },
    maintainAspectRatio: false,
  });

  const dataUpdater = (labelArr, dataArr, BGsArr, bordersArr) => {
    return {
      labels: labelArr,
      datasets: [
        {
          label: "Roundtrip (ms)",
          data: dataArr,
          backgroundColor: BGsArr,
          borderColor: bordersArr,
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
        // duration: 0,
      },
      maintainAspectRatio: false,
    };
  };

  useEffect(() => {
    let urls, times, BGs, borders;
    if (dataPoints.length) {
      urls = dataPoints.map((point) => point.url);
      times = dataPoints.map((point) => point.timeReceived - point.timeSent);
      BGs = dataPoints.map((point) => "rgba(" + point.color + ", 0.2)");
      borders = dataPoints.map((point) => "rgba(" + point.color + ", 1)");
    }

    updateChart(dataUpdater(urls, times, BGs, borders));

    if (!dataPoints.length || dataPoints.length > 3)
      updateOptions(optionsUpdater(dataPoints));
  }, [dataPoints]);

  return (
    <div id="chartContainer" className="chart">
      <Bar data={chartData} width={50} height={100} options={chartOptions} />
    </div>
  );
};

export default connect(mapStateToProps)(BarGraph);
