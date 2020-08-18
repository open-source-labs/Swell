import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Chart } from "chart.js";

Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
});

const BarGraph = (props) => {
  const [data, updateData] = useState(props.dataPoints);

  let times;
  let urls;

  let barChart = useRef(null);

  const redrawChart = () => {
    if (times && urls) {
      // if (barChart) {
      //   console.log("should be destroying");
      //   barChart.destroy();
      // }
      // const context = document.querySelector("#bar-chart");
      const ctx = document.querySelector("canvas").getContext("2d");
      ctx.canvas.width = "100%";
      ctx.canvas.height = "50%";

      barChart = new Chart(ctx, {
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
            // duration: 0,
          },
          maintainAspectRatio: true,
        },
      });
      console.log(barChart);
    }
  };

  useEffect(() => {
    updateData(props.dataPoints);
    urls = data.map((elem) => elem.url);
    times = data.map((elem) => elem.timeReceived - elem.timeSent);
    redrawChart();
  });

  // const graphRender = barChart ? (
  //   barChart && (
  //     <div>
  //       <div id="chartContainer">
  //         <canvas
  //           className="chart"
  //           style={{ display: "block" }}
  //           id="bar-chart"
  //         />
  //       </div>
  //     </div>
  //   )
  // ) : (
  //   <div style={{ display: "block" }} className="warningContainer">
  //     warning
  //   </div>
  // );

  return (
    <div>
      <div id="chartContainer">
        <canvas
          ref={barChart}
          className="chart"
          style={{ display: "block" }}
          id="bar-chart"
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(BarGraph);
