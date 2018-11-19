import React, {Component} from 'react';
import store from '../../store';
import { connect } from 'react-redux';


const mapStateToProps = store => ({
  reqRes : store.business.reqResArray,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: reqRes => {
    dispatch(actions.reqResAdd(reqRes));
  }
});

class Graph extends Component {
  constructor(props) {
    super(props);
    
    let state = {

    };
  }

  addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach(dataset => {
      dataset.data.push(data);
    });

    chart.update();
  }

  componentDidMount() {
    const context = document.querySelector('#line-chart');
    this.setState({
      lineChart : new Chart(context, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Live Count Test",
              data: [],
              lineTension: 0.1,
              fill: false,
              backgroundColor: 'rgba(119, 119, 244, 0.1)',
              borderColor: 'rgba(46, 0, 255, 1)',
            },
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      }),
    });
    
  }

  render() {
    // console.log('props >>>>>>>>>>', this.props.reqRes[0].response.events);
    // this.addData(this.state.lineChart, 'label1', 888 );
    return (
      <div style={{'width': '50%', 'height': '50%'}}>
        <div>Chart</div>
        <canvas id='line-chart'></canvas>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);