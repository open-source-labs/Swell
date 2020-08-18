import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Chart } from "chart.js";

Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
});

const BarGraph = (props) => {
  const [data, updateData] = useState(props.dataPoints);
  let divs = data.map((elem) => <h1>{elem.url}</h1>);

  useEffect(() => {
    updateData(props.dataPoints);
  });

  let barChart;

  useEffect(() => {
    const context = document.querySelector("#bar-chart");
    const ctx = document.querySelector("canvas").getContext("2d");
    ctx.canvas.width = "100%";
    ctx.canvas.height = "50%";

    const urls = data.map((elem) => elem.url);
    const times = data.map((elem) =>
      Math.abs(elem.timeReceived - elem.timeSent)
    );
    if (context.barChart) {
      console.log("destroying");
      barChart.destroy();
    }
    barChart = new Chart(context, {
      type: "bar",
      data: {
        labels: urls,
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
      },

      options: {
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
          duration: 0,
        },
        maintainAspectRatio: false,
        hoverBorderWidth: false,
      },
    });
  });

  return (
    <div>
      <div style={{ display: "none" }} className="warningContainer"></div>
      <div>
        <canvas className="chart" style={{ display: "block" }} id="bar-chart" />
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(BarGraph);
