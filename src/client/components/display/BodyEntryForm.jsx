import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header.jsx';
import * as actions from '../../actions/actions';

const mapStateToProps = store => ({
 
});

const mapDispatchToProps = dispatch => ({

});

class BodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyType : 'none',
      rawType : 'Text (text/plain)',
    }
    this.bodyTypeChangeHandler = this.bodyTypeChangeHandler.bind(this);
    this.rawTypeChangeHandler = this.rawTypeChangeHandler.bind(this);
  }

  componentDidMount () {
  
  }

  bodyTypeChangeHandler (e) {
    let value = e.target.value
    this.setState({
      bodyType : value
    },() => {
      if(value === 'x-www-form-urlencoded') {
        this.props.updateContentTypeHeader(value);
      } else if (value === 'raw') {
        this.props.updateContentTypeHeader('text/plain');
      } else if (value === 'none') {
        this.props.updateContentTypeHeader(undefined);
      }
    })
  }

  rawTypeChangeHandler (e) {
    let value = e.target.value
    this.setState({
      rawType : value
    },() => {
      let contentTypeHeader;
      switch(value){
        case 'Text (text/plain)' : {
          contentTypeHeader = 'text/plain';
          break;
        }
        case 'JSON (application/json)' : {
          contentTypeHeader = 'application/json';
          break;
        }
        case 'Javascript (application/javascript)' : {
          contentTypeHeader = 'application/javascript';
          break;
        }
        case 'XML (application/xml)' : {
          contentTypeHeader = 'application/xml';
          break;
        }
        case 'XML (text/xml)' : {
          contentTypeHeader = 'text/xml';
          break;
        }
        case 'HTML (text/html)' : {
          contentTypeHeader = 'text/html';
          break;
        }
      }
      this.props.updateContentTypeHeader(contentTypeHeader);
    })
  }

  render() {
    // console.log(this.state);

    let styles = {
      'display' : this.props.method === 'GET' ? 'none' : 'flex',
      'flexDirection' : 'column'
    }
    let rawTypeStyles = {
      'display' : this.state.bodyType === 'raw' ? 'block' : 'none',
    }
    let bodyInputStyles = {
      'display' : this.state.bodyType === 'raw' ? 'block' : 'none',
    }

    return(
      <div style={styles}>

        <div onChange={(e) => this.bodyTypeChangeHandler(e)}>
          Body Type:
          <input name='bodyType' type='radio' value='none' defaultChecked={true}></input>none
          <input name='bodyType' type='radio' value='x-www-form-urlencoded'></input>x-www-form-urlencoded
          <input name='bodyType' type='radio' value='raw'></input>raw
        </div>

        <select onChange={(e) => this.rawTypeChangeHandler(e)} style={rawTypeStyles} >
          Raw Type:
          <option value='Text (text/plain)'>Text (text/plain)</option>
          <option value='JSON (application/json)'>JSON (application/json</option>
          <option value='Javascript (application/javascript)'>Javascript (application/javascript)</option>
          <option value='XML (application/xml)'>XML (application/xml)</option>
          <option value='XML (text/xml)'>XML (text/xml)</option>
          <option value='HTML (text/html)'>HTML (text/html)</option>
        </select>

        <textarea type='text' placeholder='Body' onChange={(e) => {
          this.props.updateBody(e.target.value)
        }} style={bodyInputStyles}></textarea>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyEntryForm);