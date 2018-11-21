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
    chart.data.labels.push(label);
    chart.data.datasets.forEach( dataset => {
      dataset.data.push(inputData);
      dataset.label = legend;
    });

    chart.update();
  }

  componentDidMount() {
    const context = document.querySelector('#line-chart');
    const ctx = document.querySelector("canvas").getContext("2d");
    ctx.canvas.width = 300;
    ctx.canvas.height = 40;

    const lineChart = new Chart(context, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: '',
              data: [],
              lineTension: 0.1,
              fill: true,
              backgroundColor: 'rgba(119, 119, 244, 0.1)',
              borderColor: 'rgba(46, 0, 255, 1)',
            }
          ]
        },
      });


      this.state.lineCharts.push(lineChart);
  }

  componentDidUpdate(props){
    // console.log('Updated')
    // console.log('mapDispatchToProps', props)
    if ( props.reqRes.length > 0) {
      this.addData(this.state.lineCharts[0], props.reqRes[0].timeReceived, props.reqRes[0].id, props.reqRes[0].url);
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