import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { HorizontalBar } from "react-chartjs-2";
import * as store from "../../store";
import * as actions from "../../actions/actions";


//necessary for graph styling due to CSP
Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
  currentResponse: store.business.currentResponse
});

const mapDispatchToProps = (dispatch) => ({
  saveCurrentResponseData: (reqRes) => {
    dispatch(actions.saveCurrentResponseData(reqRes));
  },
  updateGraph: (reqRes) => {
    dispatch(actions.updateGraph(reqRes));
  },
  clearGraph: (id) => {
    store.default.dispatch(actions.clearGraph(id));
  }
});

const BarGraph = (props) => {
  const { dataPoints, currentResponse } = props

  const [ host, setHost ] = useState(null)
  //state for showing graph, depending on whether there are datapoints or not.
  //must default to true, because graph will not render if initial container's display is 'none'
  const [show, toggleShow] = useState(true);
  //Default state for chart data
  const [chartData, updateChart] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  //default state for chart options
  const [chartOptions, updateOptions] = useState({
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "why",
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            display: true,
          },
        },
      ],
    },
    animation: {
      duration: 500, //buggy animation, get rid of transition
    },
    maintainAspectRatio: false,
  });

  //helper function that returns chart data object
  const dataUpdater = (labelArr, timesArr, BGsArr, bordersArr, reqResArr) => {
    return {
      labels: labelArr,
      datasets: [
        {
          label: "Response Time",
          data: timesArr,
          backgroundColor: BGsArr,
          borderColor: bordersArr,
          borderWidth: 1,
          maxBarThickness: 300,
          reqRes: reqResArr,
        },
      ],
    };
  };

  // click handling to load response data
  const getElementAtEvent = element => {
    if (!element.length) return;
    // get the response data corresponding to the clicked element
    const index = element[0]._index
    const reqResToSend = element[0]._chart.config.data.datasets[0].reqRes[index]
    // send the data to the response panel
    props.saveCurrentResponseData(reqResToSend);
  }
  

  useEffect(() => {
    const { id, host } = currentResponse
    setHost(host?.slice(7))

    let url, urls, times, BGs, borders, reqResObjs;
    if (dataPoints[id]?.length) {
      

      //extract arrays from data point properties to be used in chart data/options that take separate arrays
      urls = dataPoints[id].map((point, index) => index + 1);
      times = dataPoints[id].map((point) => point.timeReceived - point.timeSent);
      BGs = dataPoints[id].map((point) => "rgba(" + point.color + ", 0.2)");
      borders = dataPoints[id].map((point) => "rgba(" + point.color + ", 1)");
      reqResObjs = dataPoints[id].map((point) => point.reqRes);
      //show graph upon receiving data points
      toggleShow(true);
    } else {
      setHost(null)
      //hide graph when no data points
      toggleShow(false);
    }
    //update state with updated dataset
    updateChart(dataUpdater(urls, times, BGs, borders, reqResObjs));
    //conditionally update options based on length of dataPoints array
    // if (!dataPoints[id]?.length || dataPoints[id]?.length > 3)
    //   updateOptions(optionsUpdater(dataPoints[id]));
  }, [dataPoints, currentResponse]);

  // useEffect(updateGraph(currentResponse), [currentResponse])

  const chartClass = show ? "chart" : "chart-closed";
  const clearButtonTextAddition = currentResponse.host ? ` for ${currentResponse.host.slice(8)}` : ''
  return (
    <div>
    <div id="chartContainer" className={`border-top pt-1 ${chartClass}`}>
      <HorizontalBar 
      data={chartData} 
      width={50} 
      height={200} 
      options={chartOptions} 
      getElementAtEvent={getElementAtEvent}
      />
    </div>
    <div className="is-flex is-justify-content-center">
      <button className="button is-small add-header-or-cookie-button clear-chart-button mb-3" 
        onClick={() => {
          props.clearGraph(currentResponse.id)
        }}
        >
        Clear Response History 
        {host && 
          <span> - <b>{host}</b></span>
        }
      </button>
    </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BarGraph);
