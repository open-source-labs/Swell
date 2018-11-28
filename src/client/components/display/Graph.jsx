import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Chart } from 'chart.js';
import Store from '../../store';

const mapStateToProps = Store => ({
  reqResArray: Store.business.reqResArray,
});

const mapDispatchToProps = dispatch => ({
  reqResAdd: (reqRes) => {
    dispatch(actions.reqResAdd(reqRes));
  },
});

class Graph extends Component {
  constructor(props) {
    super(props);
    // linechart cannot be stored in state...
    // as there is no way to make a duplicate of it due to circular structure
    (this.state = {
      // use the event counter as a 'hack' to force rerenders
      eventCounter: 0,
      currentTime: null,
      timeSet: false,
    });
  }

  componentDidMount() {
    // set up lineChart
    const context = document.querySelector('#line-chart');
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.canvas.width = 7;
    ctx.canvas.height = 1;
    this.lineChart = new Chart(context, {
      type: 'scatter',
      data: {
        datasets: [],
      },
      options: {
        showLines: true,
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  componentDidUpdate() {
    let openRequestCount = 0;
    this.props.reqResArray.forEach((reqRes) => {
      if (reqRes.connection === 'open' || reqRes.connection === 'pending') {
        openRequestCount += 1;
      }
    });

    // console.log(this.props.reqResArray);
    // console.log('openRequestCount',openRequestCount);
    // console.log(this.state.timeSet);

    if (openRequestCount === 0 && this.state.timeSet) {
      this.setState({
        timeSet: false,
      });
    } else if (openRequestCount >= 1 && !this.state.timeSet) {
      // console.log('Reset time and graph')
      this.lineChart.data.datasets = [];
      this.lineChart.update();

      this.setState(
        {
          currentTime: Date.now(),
          timeSet: true,
        },
        () => {
          // console.log(this.state.currentTime);
          this.updateGraphWithStoreData();
        },
      );
    } else {
      this.updateGraphWithStoreData();
    }
  }

  updateGraphWithStoreData() {
    // console.log('Updating graph');

    let newEventCounter = 0;
    const newDataSets = [];
    this.props.reqResArray.forEach((reqRes, index) => {
      if (reqRes.response.events && reqRes.timeReceived > this.state.currentTime) {
        // create dataset...
        const dataSet = {
          label: reqRes.url,
          data: [],
          lineTension: 0,
          backgroundColor: 'rgba(13,217,192, 0.1)',
          borderColor: 'rgba(13,217,192, 0.9)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgb(13,217,192)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          pointHitRadius: 10,
        };

        // populate events
        switch (reqRes.connectionType) {
          case 'SSE': {
            reqRes.response.events.forEach((event) => {
              newEventCounter += 1;
              dataSet.data.push({
                x: event.timeReceived - this.state.currentTime,
                y: index,
              });
            });
            break;
          }

          case 'plain': {
            reqRes.response.events.forEach(() => {
              newEventCounter += 1;
              dataSet.data.push({
                x: reqRes.timeReceived - this.state.currentTime,
                y: index,
              });
            });
            break;
          }
          default:
            console.log('Invalid connection type');
        }

        newDataSets.push(dataSet);
      }
    });

    // console.log('stateCounter', this.state.eventCounter);
    // console.log('newCounter', newEventCounter);
    // force a rerender...
    if (this.state.eventCounter !== newEventCounter) {
      this.setState(
        {
          eventCounter: newEventCounter,
        },
        () => {
          // console.log('Rerender');
          this.lineChart.data.datasets = newDataSets;
          this.lineChart.update();
        },
      );
    }
  }

  render() {
    return (
      <div>
        <canvas id="line-chart" />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Graph);
