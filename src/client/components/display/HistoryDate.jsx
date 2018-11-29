import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../actions/actions';
import History from './History.jsx';

const mapStateToProps = store => ({
  history : store.business.history,
});

const mapDispatchToProps = dispatch => ({
})

class HistoryDate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let current = this.props.history.find(a => a.date === this.props.content.date);
    let histArray = current.history.map((history, i) => {
      return <History className="historyChild" content={history} key={i}></History>
    })

    return(
      <div className={'historyDate'}>
        <h1>{current.date}</h1>
        {histArray}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryDate);