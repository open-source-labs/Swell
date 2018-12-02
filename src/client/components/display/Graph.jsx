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
    this.state = {
      // use the event counter as a 'hack' to force rerenders
      eventCounter: 0,
      currentTime: null,
      timeSet: false,
    };
  }

  componentDidMount() {
    // set up lineChart
    const context = document.querySelector('#line-chart');
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.canvas.width = '100%';
    ctx.canvas.height = 150;
    this.lineChart = new Chart(context, {
      type: 'scatter',
      data: {
        datasets: [],
      },
      options: {
        animation : {
          duration : 0,
        },
        maintainAspectRatio : false,
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
          yAxes: [{
            display: false,
          }]
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

    if (openRequestCount === 0 && this.state.timeSet) {
      this.setState({
        timeSet: false,
      });
    }
    else if (openRequestCount >= 1 && !this.state.timeSet) {
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
    }
    else {
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
        let backgroundColor;
        let borderColor;
        let pointBorderColor;
        switch (index) {
          case 0 : {
            backgroundColor = 'rgba(21,183,143, .1)';
            borderColor = 'rgb(21,183,143, .9)';
            pointBorderColor = 'rgb(21,183,143)';
            break;
          }
          case 1 : {
            backgroundColor = 'rgba(0,161,147, .1)'
            borderColor = 'rgba(0,161,147, .9)'
            pointBorderColor = 'rgb(0,161,147)'
            break;
          }
          case 2 : {
            backgroundColor = 'rgba(0,116,131, .1)'
            borderColor = 'rgba(0,116,131, .9)'
            pointBorderColor = 'rgb(0,116,131)'
            break;
          }
          case 3 : {
            backgroundColor = 'rgba(0,155,191, .1)'
            borderColor = 'rgba(0,155,191, .9)'
            pointBorderColor = 'rgb(0,155,191)'
            break;
          }
          case 4 : {
            backgroundColor = 'rgba(0,137,208, .1)'
            borderColor = 'rgba(0,137,208, .9)'
            pointBorderColor = 'rgb(0,137,208)'
            break;
          }
          case 5 : {
            backgroundColor = 'rgba(49,87,192, .1)'
            borderColor = 'rgba(49,87,192, .9)'
            pointBorderColor = 'rgb(49,87,192)'
            break;
          }
        }

        const dataSet = {
          label: reqRes.url,
          data: [],
          lineTension: 0,
          backgroundColor,
          borderColor,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor,
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
    let chartDisplayStyles = {
      'display' : this.state.eventCounter > 0 ? 'block' : 'none',
    }
    let warningDisplayStyles = {
      'display' : this.state.eventCounter === 0 ? 'block' : 'none',
    }

    return (
      <div>
        <div style={warningDisplayStyles} className={'warningContainer'}>
          <div className={'warning'}>
            Please add a request and hit the Open button to see response timing information.
          </div>
        </div>
        <canvas className={'chart'} style={chartDisplayStyles} id="line-chart" />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Graph);
