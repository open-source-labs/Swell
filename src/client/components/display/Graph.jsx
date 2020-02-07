import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Chart } from 'chart.js';

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
      currentTime: Date.now(),
      timeSet: false,
      oldestDataPointTimeReceived: 0,
      timeFromNowToDisplay: 30000,
    };
    this.updateTimeFromNowToDisplay = this.updateTimeFromNowToDisplay.bind(this);
  }

  componentDidMount() {
    // set up lineChart
    const context = document.querySelector('#line-chart');
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.canvas.width = '100%';
    ctx.canvas.height = '50%';
    this.lineChart = new Chart(context, {
      type: 'scatter',
      data: {
        datasets: [],
      },
      options: {
        animation: {
          duration: 0,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) { //data
              let hoverLabel = data.datasets[tooltipItem.datasetIndex].label;
              return hoverLabel;
            }
          }
        },
        maintainAspectRatio: false,
          showLines: true,
          scales: {
            xAxes: [
              {
                type: 'linear',
                position: 'bottom',
                ticks: {
                  // beginAtZero: true,
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
      this.lineChart.data.datasets = [];
      this.lineChart.update();
      if (openRequestCount > 6) { this.lineChart.options.legend.display = false } //removes legend when over 6 keys
      if (openRequestCount <= 6) { this.lineChart.options.legend.display = true } //resets legend when under 7 keys

      this.setState(
        {
          currentTime: Date.now(),
          timeSet: true,
        },
        () => {
          this.updateGraphWithStoreData();
        },
      );
    }
    else {
      this.updateGraphWithStoreData();
    }
  }

  updateGraphWithStoreData() {
    let newEventCounter = 0;
    let newOldestDataPointTimeReceived = Number.MAX_SAFE_INTEGER;

    const newDataSets = [];
    this.props.reqResArray.forEach((reqRes, index) => {
      if ((reqRes.response.events && reqRes.timeReceived > this.state.currentTime) ||
        (reqRes.response.messages || reqRes.request.messages)) {
        // create dataset...
        let backgroundColor;
        let borderColor;
        let pointBorderColor;
        let pointHoverBackgroundColor;
        let pointHoverBorderColor;
        switch (index % 6) {
          case 0: {
            backgroundColor = 'rgba(21,183,143, .1)';
            borderColor = 'rgb(21,183,143, .9)';
            pointBorderColor = 'rgb(21,183,143)';
            pointHoverBackgroundColor = 'rgba(21,183,143)'
            pointHoverBorderColor = 'rgba(21,183,143)'
            break;
          }
          case 1: {
            backgroundColor = 'rgba(0,161,147, .1)'
            borderColor = 'rgba(0,161,147, .9)'
            pointBorderColor = 'rgb(0,161,147)'
            pointHoverBackgroundColor = 'rgba(0,161,147)'
            pointHoverBorderColor = 'rgba(0,161,147)'
            break;
          }
          case 2: {
            backgroundColor = 'rgba(0,116,131, .1)'
            borderColor = 'rgba(0,116,131, .9)'
            pointBorderColor = 'rgb(0,116,131)'
            pointHoverBackgroundColor = 'rgba(0,116,131,1)'
            pointHoverBorderColor = 'rgba(0,116,131,1)'
            break;
          }
          case 3: {
            backgroundColor = 'rgba(0,155,191, .1)'
            borderColor = 'rgba(0,155,191, .9)'
            pointBorderColor = 'rgb(0,155,191)'
            pointHoverBackgroundColor = 'rgba(0,155,191,1)'
            pointHoverBorderColor = 'rgba(0,155,191,1)'
            break;
          }
          case 4: {
            backgroundColor = 'rgba(0,137,208, .1)'
            borderColor = 'rgba(0,137,208, .9)'
            pointBorderColor = 'rgb(0,137,208)'
            pointHoverBackgroundColor = 'rgba(0,137,208,1)'
            pointHoverBorderColor = 'rgba(0,137,208,1)'
            break;
          }
          case 5: {
            backgroundColor = 'rgba(49,87,192, .1)'
            borderColor = 'rgba(49,87,192, .9)'
            pointBorderColor = 'rgb(49,87,192)'
            pointHoverBackgroundColor = 'rgba(49,87,192,1)'
            pointHoverBorderColor = 'rgba(49,87,192,1)'
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
          pointHoverBackgroundColor,
          pointHoverBorderColor,
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          pointHitRadius: 10,
        };

        // populate events
        switch (reqRes.connectionType) {
          case 'SSE': {
            reqRes.response.events.forEach((event) => {
              if (Date.now() - event.timeReceived < this.state.timeFromNowToDisplay) {

                //to determine if the graph needs to update
                if (event.timeReceived < newOldestDataPointTimeReceived) {
                  newOldestDataPointTimeReceived = event.timeReceived;
                }
                newEventCounter += 1;
                dataSet.data.push({
                  x: event.timeReceived - reqRes.timeSent,
                  y: index,
                });
              }
            });
            break;
          }

          case 'plain': {
            reqRes.response.events.forEach((event) => {
              if (Date.now() - reqRes.timeReceived < this.state.timeFromNowToDisplay) {

                if (reqRes.timeReceived < newOldestDataPointTimeReceived) {
                  newOldestDataPointTimeReceived = reqRes.timeReceived;
                }

                newEventCounter += 1;
                dataSet.data.push({
                  x: reqRes.timeReceived - reqRes.timeSent,
                  y: index,
                });
              }
            });
            break;
          }

          case 'WebSocket': {
            reqRes.response.messages.forEach(message => {
              if (Date.now() - message.timeReceived < this.state.timeFromNowToDisplay) {
                if (message.timeReceived < newOldestDataPointTimeReceived) {
                  newOldestDataPointTimeReceived = message.timeReceived;
                }
                newEventCounter += 1;
                dataSet.data.push({
                  x: message.timeReceived - reqRes.timeSent,
                  y: index,
                });
              }
            });
            reqRes.request.messages.forEach(message => {
              if (Date.now() - message.timeReceived < this.state.timeFromNowToDisplay) {
                if (message.timeReceived < newOldestDataPointTimeReceived) {
                  newOldestDataPointTimeReceived = message.timeReceived;
                }
                newEventCounter += 1;
                dataSet.data.push({
                  x: message.timeReceived - reqRes.timeSent,
                  y: index,
                });
              }
            });
            break;
          }
          default:
            console.log('Invalid connection type');
        }
        newDataSets.push(dataSet);
      }
    });

    if (this.state.eventCounter !== newEventCounter || this.state.oldestDataPointTimeReceived !== newOldestDataPointTimeReceived) {
      this.setState(
        {
          eventCounter: newEventCounter,
          oldestDataPointTimeReceived: newOldestDataPointTimeReceived
        },
        () => {
          this.lineChart.data.datasets = newDataSets;
          this.lineChart.update();
        },
      );
    }
  }

  updateTimeFromNowToDisplay(e) {
    this.setState({
      timeFromNowToDisplay: e.target.value
    });
  }

  render() {
    let chartDisplayStyles = {
      'display': this.state.eventCounter > 0 ? 'block' : 'none',
    }
    let warningDisplayStyles = {
      'display': this.state.eventCounter === 0 ? 'block' : 'none',
    }

    return (
      <div>
        <div style={warningDisplayStyles} className={'warningContainer'}>
          <div className={'warning'}>
            Please add a request and hit the "Send" button to see response timing information.
          </div>
        </div>
        <canvas className="chart" style={chartDisplayStyles} id="line-chart" />
        <div className={'chartTime'} style={chartDisplayStyles}>
          <select onChange={this.updateTimeFromNowToDisplay} className={'chartTimeSelect'} defaultValue={30000} >
            <option value={10000}>Past 10 seconds</option>
            <option value={30000}>Past 30 seconds</option>
            <option value={60000}>Past 1 minute</option>
            <option value={300000}>Past 5 minutes</option>
            <option value={Number.MAX_SAFE_INTEGER}>All results</option>
          </select>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Graph);
