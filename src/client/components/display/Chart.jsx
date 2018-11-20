import React, {Component} from 'react';

class Graph extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const context = document.querySelector('#line-chart');
    const ctx = document.querySelector("canvas").getContext("2d");
    ctx.canvas.width = 300;
    ctx.canvas.height = 40;

    const lineChart = new Chart(context, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          datasets: [
            {
              label: "2018",
              data: [10, 8, 6, 5, 12, 8, 16, 17, 6, 7, 6, 10],
              lineTension: 0.1,
              fill: false,
              backgroundColor: 'rgba(119, 119, 244, 0.1)',
              borderColor: 'rgba(46, 0, 255, 1)',
            },
            {
              label: "2017",
              data: [3, 5, 9, 4, 17, 3, 8, 4, 12, 14, 9, 11],
              lineTension: 0.2,
              fill: false,
              backgroundColor: 'rgba(244, 119, 119, 0.1)',
              borderColor: 'rgba(255, 0, 46, 1)',
              responsive: true,
              maintainAspectRatio: true
            }
          ]
        },
      });
  }

  render() {
    return (
      <div>
        <canvas id='line-chart'></canvas>
      </div>
    )
  }
}

export default Graph;