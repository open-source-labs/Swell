import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Chart } from "chart.js";

// Chart.platform.disableCSSInjection = true;

const mapStateToProps = (store) => ({
  dataPoints: store.business.dataPoints,
});

const BarGraph = (props) => {
  const [data, updateData] = useState(props.dataPoints);
  let divs = data.map((elem) => <h1>{elem.url}</h1>);
  useEffect(() => {
    updateData(props.dataPoints);
  });

  console.log("bar graph rendering");

  return (
    <div style={{ display: "block" }} className="warningContainer">
      <div className="warning">HELLO?????? {divs}</div>
    </div>
  );
};

export default connect(mapStateToProps)(BarGraph);
