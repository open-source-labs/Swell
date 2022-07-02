/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';

/**
 * Previous imports say that all these are necessary, even though most aren't
 * being used?
 *
 * @todo Look into this.
 */
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart, Line } from 'react-chartjs-2';

import { appDispatch } from '../../toolkit-refactor/store';
import { responseDataSaved } from '../toolkit-refactor/reqRes/reqResSlice';
import {
  graphCleared,
  graphUpdated,
} from '../../toolkit-refactor/graphPoints/graphPointsSlice';

//necessary for graph styling due to CSP
//Chart.platform.disableCSSInjection = true;

/**@todo switch to use hooks? */
const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
  currentResponse: store.business.currentResponse,
});

/**@todo switch to use hooks? */
const mapDispatchToProps = (dispatch) => ({
  updateGraph: (reqRes) => {
    dispatch(graphUpdated(reqRes));
  },

  clearGraph: (id) => {
    dispatch(graphCleared(id));
  },

  responseDataSaved: (reqRes) => {
    dispatch(responseDataSaved(reqRes, 'bargraph'));
  },
});

const BarGraph = (props) => {
  const { dataPoints, currentResponse, responseDataSaved, clearGraph } = props;

  const [chartURL, setChartURL] = useState('');
  const [host, setHost] = useState(null);

  //state for showing graph, depending on whether there are data points or not.
  //must default to true, because graph will not render if initial container's display is 'none'
  const [visible, setVisible] = useState(true);
  //Default state for chart data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  //default state for chart options
  const [chartOptions, setChartOptions] = useState({
    scales: {
      x: {
        type: 'linear',
        ticks: {
          beginAtZero: true,
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: chartURL,
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
    maintainAspectRatio: false,
  });

  //helper function that returns chart data object
  const dataUpdater = (labelArr, timesArr, BGsArr, bordersArr, reqResArr) => {
    return {
      labels: labelArr,
      datasets: [
        {
          label: 'Response Time (ms)',
          data: timesArr,
          backgroundColor: BGsArr,
          borderColor: bordersArr,
          borderWidth: 1,
          fill: false,
          lineTension: 0,
          maxBarThickness: 300,
          reqRes: reqResArr,
        },
      ],
    };
  };

  //helper function that returns chart options object
  //update: Might be able to get rid of this function, but it's not used anywhere else
  // const optionsUpdater = (arr) => {
  //   return {
  //     scales: {
  //       yAxes: [
  //         {
  //           scaleLabel: {
  //             display: true, //boolean
  //             labelString: chartURL,
  //           },
  //           ticks: {
  //             beginAtZero: true,
  //           },
  //         },
  //       ],
  //       xAxes: [
  //         {
  //           // scaleLabel: {
  //           //   display: true,
  //           // },
  //         },
  //       ],
  //     },
  //     // animation: {
  //     //   duration: 50,
  //     // },
  //     maintainAspectRatio: false, //necessary for keeping chart within container
  //   };
  // };

  // click handling to load response data in the response panel
  const getElementAtEvent = (element) => {
    if (!element.length) return;
    // get the response data corresponding to the clicked element
    const index = element[0]._index;
    const reqResToSend =
      element[0]._chart.config.data.datasets[0].reqRes[index];
    // send the data to the response panel
    responseDataSaved(reqResToSend);
  };

  useEffect(() => {
    const { id, host } = currentResponse;
    setHost(host?.slice(7));

    let url;
    let urls;
    let times;
    let BGs;
    let borders;
    let reqResObjs;
    if (dataPoints[id]?.length) {
      const point = dataPoints[id][0];
      // if grpc, just return the server IP
      if (point.reqRes.gRPC) url = `${point.url}`;
      // if point.url is lengthy, just return the domain and the end of the uri string
      const domain = point.url
        .replace('http://', '')
        .replace('https://', '')
        .split(/[/?#]/)[0];
      url = `${domain} ${
        point.url.length > domain.length + 8
          ? `- ..${point.url.slice(point.url.length - 8, point.url.length)}`
          : ''
      }`;

      setChartURL(url);

      //extract arrays from data point properties to be used in chart data/options that take separate arrays
      urls = dataPoints[id].map((point, index) => index + 1);
      times = dataPoints[id].map(
        (point) => point.timeReceived - point.timeSent
      );
      BGs = dataPoints[id].map((point) => 'rgba(' + point.color + ', 0.2)');
      borders = dataPoints[id].map((point) => 'rgba(' + point.color + ', 1)');
      reqResObjs = dataPoints[id].map((point) => point.reqRes);
      //show graph upon receiving data points
      setVisible(true);
    } else {
      setHost(null);
      //hide graph when no data points
      setVisible(false);
    }
    //update state with updated dataset
    setChartData(dataUpdater(urls, times, BGs, borders, reqResObjs));
    //conditionally update options based on length of dataPoints array
    // updateOptions(optionsUpdater(dataPoints[id]));
  }, [dataPoints, currentResponse, chartURL]);

  const chartClass = visible ? 'chart' : 'chart-closed';
  const isDark = useSelector((state) => state.ui.isDark);

  return (
    <div>
      <div
        id="chartContainer"
        className={`border-top pt-1 ${chartClass} ${
          isDark ? 'is-dark-100' : ''
        }`}
      >
        <Line
          data={chartData}
          width={50}
          height={200}
          options={chartOptions}
          // getElementAtEvent={getElementAtEvent}
        />
      </div>
      <div className="is-flex is-justify-content-center">
        <button
          className={`${
            isDark ? 'is-dark-200' : ''
          } button is-small add-header-or-cookie-button clear-chart-button mb-3`}
          onClick={() => {
            clearGraph(currentResponse.id);
            setChartURL('');
          }}
        >
          Clear Response Metrics
          {host && (
            <span>
              {' '}
              - <b>{host}</b>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BarGraph);
