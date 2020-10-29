import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Bar } from "react-chartjs-2";

import * as actions from "../../actions/actions";


//neccessary for graph styling due to CSP
Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
});

const mapDispatchToProps = (dispatch) => ({
  saveCurrentResponseData: (reqRes) => {
    dispatch(actions.saveCurrentResponseData(reqRes));;
  },
  clearGraph: () => {
    store.default.dispatch(actions.clearGraph());
  }
});



const BarGraph = (props) => {
  const { dataPoints } = props
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
            labelString: "Response time",
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
  const dataUpdater = (labelArr, dataArr, BGsArr, bordersArr, reqResArr) => {
    return {
      labels: labelArr,
      datasets: [
        {
          label: "Response Time",
          data: dataArr,
          backgroundColor: BGsArr,
          borderColor: bordersArr,
          borderWidth: 1,
          maxBarThickness: 300,
          reqRes: reqResArr,
        },
      ],
    };
  };

  //helper function that returns chart options object
  const optionsUpdater = (arr) => {
    //Event labels and Y-axis title disappear after one request
    const showLabels = arr.length >= 0 ? false : true;
    return {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: showLabels, //boolean
            },
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: showLabels, //boolean
            },
          },
        ],
      },
      animation: {
        duration: 500,
      },
      maintainAspectRatio: false, //necessary for keeping chart within container
    };
  };

  // testing click handling
  const getElementAtEvent = element => {
    // get the response data corresponding to the clicked element
    const index = element[0]._index
    const reqResToSend = element[0]._chart.config.data.datasets[0].reqRes[index]
    // send the data to the response panel
    props.saveCurrentResponseData(reqResToSend);
  }
  

  useEffect(() => {
    let urls, times, BGs, borders, reqResObjs;
    if (dataPoints.length) {
      //extract arrays from data point properties to be used in chart data/options that take separate arrays
      urls = dataPoints.map((point) => {
        // regex to get just the main domain 
        if (point.url.charAt(0).toLowerCase() === "h") {
          const domain = point.url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
          // if point.url is lengthy, just return the domain and the end of the uri string
          return `${domain} ${(point.url.length > domain.length + 8) ? `- ..${point.url.slice(point.url.length - 8, point.url.length)}` : ""}`
        } 
        // if grpc, just return the server IP
        return `${point.url}`
        });
      times = dataPoints.map((point) => point.timeReceived - point.timeSent);
      BGs = dataPoints.map((point) => "rgba(" + point.color + ", 0.2)");
      borders = dataPoints.map((point) => "rgba(" + point.color + ", 1)");
      reqResObjs = dataPoints.map((point) => point.reqRes);
      //show graph upon receiving data points
      toggleShow(true);
    } else {
      //hide graph when no data points
      toggleShow(false);
    }
    //update state with updated dataset
    updateChart(dataUpdater(urls, times, BGs, borders, reqResObjs));
    //conditionally update options based on length of dataPoints array
    if (!dataPoints.length || dataPoints.length > 3)
      updateOptions(optionsUpdater(dataPoints));
  }, [dataPoints]);

  const chartClass = show ? "chart" : "chart-closed";

  return (
    <div id="chartContainer" className={`border-top pt-1 ${chartClass}`}>
      <Bar 
      data={chartData} 
      width={50} 
      height={200} 
      options={chartOptions} 
      getElementAtEvent={getElementAtEvent}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BarGraph);
