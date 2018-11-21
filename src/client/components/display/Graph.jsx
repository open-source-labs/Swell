import React, {Component} from 'react';
import Store from '../../store';
import { connect } from 'react-redux';

const mapStateToProps = Store => ({
  reqRes : Store.business.reqResArray,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd : reqRes => {
    dispatch(actions.reqResAdd(reqRes));
  },
  reqResDelete : reqRes => {
    dispatch(actions.reqResDelete(reqRes));
  }
});

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineCharts: [],
      ctxWidth: 300,
      eventsLength: 0,
    }
  }

  addData(chart, label, inputData, legend) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach( dataset => {
      dataset.data.push(inputData);
      dataset.label = legend;
      if (this.props.reqRes[0].response.events.length === this.state.eventsLength + 1) {
        console.log('updated')
        this.setState({
          ctxWidth: this.state.ctxWidth + 150,
          eventsLength: this.state.eventsLength + 1,
        })

      }
    });
    chart.update();
  }

  componentDidMount() {
    const context = document.querySelector('#line-chart');
    const ctx = document.querySelector("canvas").getContext("2d");
    ctx.canvas.width = this.state.ctxWidth;
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
              fillColor: "rgba(rgb(212, 220, 236),0.2)",
              strokeColor: "rgb(212, 220, 236,1)",
              pointColor: "rgba(151,187,205,1)",
            }
          ]
        },
        options: {
          showLines: true,
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero:true,
                min: 0,
                max: 100  
              }
            }]
          }
        }
      });

      this.state.lineCharts.push(lineChart);
  }

  componentDidUpdate(props){
    console.log('Updated')
    console.log('mapDispatchToProps', props)
    if ( props.reqRes.length > 0) {
      this.addData(this.state.lineCharts[0], props.reqRes[0].timeReceived, props.reqRes[0].id, props.reqRes[0].url);
    }
    // this.addData(lineChart, 'label1', 10);
  }

  render() {
    return (
      <div className="chartWrapper">
          <canvas id='line-chart'></canvas>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);