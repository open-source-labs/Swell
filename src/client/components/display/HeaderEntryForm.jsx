import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header.jsx';
import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class HeaderEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      headers : [],
      count : 1,
    }
    this.onChangeUpdateHeader = this.onChangeUpdateHeader.bind(this);
  }

  componentDidMount () {
    this.addHeader ();
  }

  addHeader (cb) {
    let headersDeepCopy = JSON.parse(JSON.stringify(this.state.headers));

    headersDeepCopy.push({
      id : this.state.count,
      active : false,
      key : '',
      value : ''
    })

    this.setState({
      headers: headersDeepCopy,
      count: this.state.count+1,
    }, () => {
      if(cb) {
        cb()
      }
    });
  }


  onChangeUpdateHeader(id, field, value) {
    let headersDeepCopy = JSON.parse(JSON.stringify(this.state.headers));

    let indexToBeUpdated = undefined;
    for(let i = 0; i < headersDeepCopy.length; i++) {
      if (headersDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }

    headersDeepCopy[indexToBeUpdated][field] = value;

    //also switch checkbox if they are typing
    if(field === 'key' || field === 'value') {
      headersDeepCopy[indexToBeUpdated].active = true;
    }
    
    this.setState({
      headers: headersDeepCopy,
    }, () => {

      if (id === this.state.count - 1) {
        this.addHeader(() => {
          this.props.updateHeaders(this.state.headers);
        });
      } else {
        this.props.updateHeaders(this.state.headers);
      }
    })
  }

  render() {
    let headersArr = this.state.headers.map((header, index) => {
      return (<Header content={header} changeHandler={this.onChangeUpdateHeader} key={index}></Header>)
    });
    return(
      <div>
        HeaderEntryForm
        {headersArr}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderEntryForm);