import React, {Component} from 'react';
import Store from '../../store';
import { connect } from 'react-redux';
import { Chart } from 'chart.js';

const mapStateToProps = Store => ({
  reqRes : Store.business.reqResArray,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd : reqRes => {
    dispatch(actions.reqResAdd(reqRes));
  }
});

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineCharts: [],
    }
  }

  addData(chart, label, inputData, legend) {
    let i = 0;
    // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', chart.data.labels.length)
    if (chart.data.labels.length > 10) {
      i+=1;
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>grreater', i);
      chart.data.labels.push(label + i);
      chart.data.labels.splice(0, 1);
    } else {
      chart.data.labels.push(label);
    }

    chart.data.datasets.forEach( dataset => {
      dataset.data.push(inputData);
      dataset.label = legend;
    });

    chart.update();
  }

  componentDidMount() {
    const context = document.querySelector('#line-chart');
    const ctx = document.querySelector("canvas").getContext("2d");
    ctx.canvas.width = 30;
    ctx.canvas.height = 4;

    const lineChart = new Chart(context, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: '',
              data: [],
              lineTension: 0,
              backgroundColor: "rgba(13,217,192, 0.1)",
              borderColor: "rgba(13,217,192, 0.9)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgb(13,217,192)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 5,
              pointHitRadius: 10,
            }
          ]
        },
        options: {
          showLines: true,
          tooltips: {
            xPadding: 30
          },
          legend: {
            labels: {
              boxWidth: 11,
            }
          },
          scales: {
            yAxes: [{
              display: false,
              ticks: {
                beginAtZero: false,
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
              },
              ticks: {
                min: 0,
                max: 10 
              }
            }]
          }
        }
      });

      this.state.lineCharts.push(lineChart);
      console.log('option >>>>>>>>>>>>>>>>>>', lineChart.options);

  }

  componentDidUpdate(props){
    // console.log('Updated')
    // console.log('mapDispatchToProps', props)
    // 
    if (props.reqRes.length > 0) {

      // SETUP SWITCH STATEMENT****
      // Use protocol for if statement
      // Check messages for events
        if (props.reqRes[0].response.events && props.reqRes[0].response.events.length > 0) {
          // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> hit')
          // console.log('mapDispatchToProps >>>>>>>>>>>>>>>>>>>>>', props.reqRes[0].response.events[i].timeReceived)
          let timeString = props.reqRes[0].response.events[props.reqRes[0].response.events.length - 1].timeReceived - props.reqRes[0].timeSent;
          timeString = `${timeString} ms`
          console.log('?????', timeString)
          this.addData(this.state.lineCharts[0], timeString, props.reqRes[0].id, props.reqRes[0].url);
        }
      }
    
    // this.addData(lineChart, 'label1', 10);
  }

  render() {
    
    return (
      <div>
        <canvas id='line-chart'></canvas>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);