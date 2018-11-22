import React, { Component } from 'react';
import WWWForm from './WWWForm.jsx';

class BodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastParseWasSuccess : true,
    }
    this.bodyTypeChangeHandler = this.bodyTypeChangeHandler.bind(this);
    this.rawTypeChangeHandler = this.rawTypeChangeHandler.bind(this);
  }

  bodyTypeChangeHandler (e) {
    switch (e.target.value) {
      case 'x-www-form-urlencoded' : {
        this.props.updateContentTypeHeader(e.target.value);
        this.props.updateBody("");
        break
      }
      case 'raw' : {
        this.props.updateContentTypeHeader('text/plain');
        this.props.updateBody("");
        break
      }
      case 'none' : {
        this.props.updateContentTypeHeader('');
        this.props.updateBody("");
        break;
      }
    }
  }

  rawTypeChangeHandler (e) {
    this.props.updateContentTypeHeader(e.target.value);
  }

  render() {
    let rawTypeStyles = {
      'display' : this.props.contentTypeHeader.includes('/') ? 'block' : 'none',
    }

    let bodyEntryArea = (() => {
      switch (this.props.contentTypeHeader) {
        //for none
        case '' : {
          return;
        }
        case 'x-www-form-urlencoded' :{
          return (<WWWForm updateBody={this.props.updateBody}/>)
        }
        case 'application/json' : {
          if (this.props.bodyContent === "") {
            this.props.updateBody({});
            return;
          }
          return (
            <div>
              <div>{this.state.lastParseWasSuccess ? 'JSON correctly formatted.' : 'JSON incorrectly formatted (double quotes only).'}</div>
              <textarea style={{'resize' : 'none'}} type='text' rows={8} value={this.state.lastParseWasSuccess ? JSON.stringify(this.props.bodyContent,undefined,4) : this.props.bodyContent} placeholder='Body' onChange={(e) => {
                let parsedValue;
                try {
                  parsedValue = JSON.parse(e.target.value);
                  this.setState({
                    lastParseWasSuccess : true,
                  })
                }
                catch (error) {
                  parsedValue = e.target.value;
                  this.setState({
                    lastParseWasSuccess : false,
                  })
                }
                this.props.updateBody(parsedValue);
              }}></textarea>
            </div>
          )
        }
        default : {
          return (
            <textarea style={{'resize' : 'none'}} type='text' placeholder='Body' rows={5} onChange={(e) => {
              this.props.updateBody(e.target.value)
            }} ></textarea>
          )
        }
      }
    })()
  
    return(
      <div style={this.props.stylesObj}>

        <div onChange={(e) => this.bodyTypeChangeHandler(e)}>
          Body Type:
          <input name='bodyType' type='radio' value='none' defaultChecked={true}></input>none
          <input name='bodyType' type='radio' value='x-www-form-urlencoded'></input>x-www-form-urlencoded
          <input name='bodyType' type='radio' value='raw'></input>raw
        </div>

        <select onChange={(e) => this.rawTypeChangeHandler(e)} style={rawTypeStyles} >
          Raw Type:
          <option value='text/plain'>Text (text/plain)</option>
          <option value='application/json'>JSON (application/json)</option>
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