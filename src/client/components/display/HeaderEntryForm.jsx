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

  componentDidUpdate () {
    this.checkForContentTypeHeader();
  }

  checkForContentTypeHeader () {
    //if user has selected a bodyType or rawType in body...
    if (this.props.contentTypeHeader) {
      //try to find a header that has key of content-type
      let foundHeader = this.state.headers.find(header => {
        return header.key.toLowerCase() === 'content-type'
      });

      if(foundHeader) {
        if(foundHeader.value !== this.props.contentTypeHeader) {
          let filtered = this.state.headers.filter(header => {
            return header.key !== 'content-type';
          });

          this.setState({
            headers: filtered
          }, () => {
            console.log(this.state.headers);
          });
        }
      }
      if(!foundHeader) {
        console.log('NO CONTENT TYPE HEADER FOUND');
        //create new header
        let headersDeepCopy = JSON.parse(JSON.stringify(this.state.headers));

        headersDeepCopy.unshift({
          id : this.state.count,
          active : true,
          key : 'content-type',
          value : this.props.contentTypeHeader,
        })
        
        this.setState({
          headers: headersDeepCopy,
          count: this.state.count+1,
        }, () => {
          this.props.updateHeaders(this.state.headers);
        });
      }
    }
    //remove content-type header
    else {
      if(this.state.headers.find(header => header.key === 'content-type')){
        this.setState({
          headers: JSON.parse(JSON.stringify(this.state.headers)).filter(header => header.key != 'content-type'),
        }, () => {
          this.props.updateHeaders(this.state.headers);
        });
      }
    }
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

      let emptyHeadersCount = this.state.headers.map(header => {
        return (!header.key && !header.value) ? 1 : 0
      }).reduce((acc, cur) => {
        return acc + cur;
      });
      

      if (emptyHeadersCount === 0) {
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
      return (<Header content={header} changeHandler={this.onChangeUpdateHeader} key={index} Key={header.key} value={header.value}></Header>)
    });
    return(
      <div>
        {headersArr}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderEntryForm);