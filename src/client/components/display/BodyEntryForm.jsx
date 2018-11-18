import React, { Component } from 'react';
import WWWForm from './WWWForm.jsx';

class BodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.bodyTypeChangeHandler = this.bodyTypeChangeHandler.bind(this);
    this.rawTypeChangeHandler = this.rawTypeChangeHandler.bind(this);
  }

  bodyTypeChangeHandler (e) {
    switch (e.target.value) {
      case 'x-www-form-urlencoded' : {
        this.props.updateContentTypeHeader(e.target.value);
        break
      }
      case 'raw' : {
        this.props.updateContentTypeHeader('text/plain');
        break
      }
      case 'none' : {
        this.props.updateContentTypeHeader('');
        break;
      }
    }
  }

  rawTypeChangeHandler (e) {
    this.props.updateContentTypeHeader(e.target.value);
  }

  render() {
    let styles = {
      'display' : this.props.method === 'GET' ? 'none' : 'flex',
      'flexDirection' : 'column'
    }

    let rawTypeStyles = {
      'display' : this.props.contentTypeHeader.includes('/') ? 'block' : 'none',
    }

    let bodyEntryArea = (() => {
      switch (this.props.contentTypeHeader) {
        case 'x-www-form-urlencoded' :{
          return (<WWWForm updateBody={this.props.updateBody}/>)
        }
        case 'raw' : {
          return (
            <textarea type='text' placeholder='Body' onChange={(e) => {
              this.props.updateBody(e.target.value)
            }} ></textarea>
          )
        }
      }
    })()
  
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
          <option value='text/plain'>Text (text/plain)</option>
          <option value='application/json'>JSON (application/json</option>
          <option value='application/javascript'>Javascript (application/javascript)</option>
          <option value='application/xml'>XML (application/xml)</option>
          <option value='text/xml'>XML (text/xml)</option>
          <option value='text/html'>HTML (text/html)</option>
        </select>

        {bodyEntryArea}

      </div>
    )
  }
}

export default BodyEntryForm;