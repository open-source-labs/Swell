import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import GRPCBodyEntryForm from "./GRPCBodyEntryForm.jsx";

class GRPCAutoInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.setService = this.setService.bind(this);
    this.setRequest = this.setRequest.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  setService() {
    const sel = document.getElementById('dropdownService');
    const opt = sel.options[sel.selectedIndex];
    const serviceName = opt.text;
    const streamBtn = document.getElementById('stream');
    streamBtn.innerText = 'STREAM';
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      selectedService: serviceName

    });
  }

  setRequest() {
    const sel = document.getElementById('dropdownRequest');
    const opt = sel.options[sel.selectedIndex];
    const requestName = opt.text;
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      selectedRequest: requestName
    });
    this.setState({
      ...this.state
    }, () => {
      const selectedService = this.props.newRequestStreams.selectedService;
      const selectedRequest = this.props.newRequestStreams.selectedRequest;
      const services = this.props.newRequestStreams.services;
      let streamingType;
      let packageName;
      for (const service of services) {
        if (service.name === selectedService ) {
          packageName = service.packageName;
          for (const rpc of service.rpcs) {
            if (rpc.name === selectedRequest) {
              streamingType = rpc.type;
            }
          }
        }
      }
      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
        selectedPackage: packageName,
        selectedStreamingType: streamingType
      });
      this.setState({
        ...this.state
      }, () => {
        let req;
        let results = [];
        let query = '';
        // let msgNameCheck = true;
        for (const service of services) {
          if (service.name === selectedService ) {
            for (const rpc of service.rpcs) {
              if (rpc.name === selectedRequest) {
                req = rpc.req
              }
            }
            for (const message of service.messages) {
              // console.log('service.messages: ', service.messages);
              if (message.name === req ) {
                for (const key in message.def) {
                  // results.push(`${key}: ${message.def[key]}`)
                  // console.log('key: ', key);
                  // console.log('message.def: ', message.def);
                  results.push(`"${key}": "${message.def[key].type.slice(5).toLowerCase()}"`)
                }
                break;
                // msgNameCheck = false;
              }
            }
          }
        }
        // console.log('results: ', results)
        let index = this.props.newRequestStreams.count - 1;
        // console.log('count in autoinput: ', count)
        if (results.length === 1) {
          query = results[0];
          if (this.props.newRequestStreams.streamsArr[index] !== '') {
            this.props.newRequestStreams.streamsArr[index].query = query;
          }
          if (this.props.newRequestStreams.streamsArr.length === 1) {
            this.props.newRequestStreams.streamContent.pop();
          }
          this.props.newRequestStreams.streamContent.push(`{
            ${query}
}`);
          this.props.setNewRequestStreams({
            ...this.props.newRequestStreams,
            streamsArr: this.props.newRequestStreams.streamsArr,
            streamContent: this.props.newRequestStreams.streamContent
          });
        }
        else {
          for (let i = 0; i < results.length; i++) {
            query =  `${query},
            ${results[i]}`
          }
          query = query.slice(1);
          if (this.props.newRequestStreams.streamsArr[index] !== '') {
            this.props.newRequestStreams.streamsArr[index].query = query;
          }
          if (this.props.newRequestStreams.streamsArr.length === 1) {
            this.props.newRequestStreams.streamContent.pop();
          }
          this.props.newRequestStreams.streamContent.push(`{${query}
}`);
        // console.log('streamContent arr: ', this.props.newRequestStreams.streamContent)
          this.props.setNewRequestStreams({
            ...this.props.newRequestStreams,
            streamsArr: this.props.newRequestStreams.streamsArr,
            streamContent: this.props.newRequestStreams.streamContent
          });
        }

      });
      const streamBtn = document.getElementById('stream')
      if (streamingType === undefined) {
        streamBtn.innerText = 'STREAM'
      } else {
        streamBtn.innerText = streamingType
      }
    });
  }

  render() {
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

    let services = this.props.newRequestStreams.services;
    const servicesList =[];
    const rpcsList = [];
    if (services) {
      for (let i = 0; i < services.length; i++) {
        servicesList.push(<option key={i} value={i}>{services[i].name}</option>)
      }

      // let selectedService = this.state.selectedService;
      let selectedService = this.props.newRequestStreams.selectedService;
      for (const service of services) {
        if (service.name === selectedService) {
          for (let i = 0; i < service.rpcs.length; i++) {
            rpcsList.push(<option key={i} value={i}>{service.rpcs[i].name}</option>)
          }
        }
      }
    }
    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src={dropDownArrow}></img>
          Stream
        </div>

       <select id="dropdownService" onChange={this.setService} name="dropdownService" className={'dropdownService ' + bodyContainerClass}>
          <option value="services" defaultValue="">Select Service</option>
          {servicesList}
        </select>

        <select id="dropdownRequest" onChange={this.setRequest} name="dropdownRequest" className={'dropdownRequest ' + bodyContainerClass}>
          <option value="requests" defaultValue="">Select Request</option>
          {rpcsList}
        </select>

        <GRPCBodyEntryForm
          newRequestStreams={this.props.newRequestStreams}
          setNewRequestStreams={this.props.setNewRequestStreams}
          selectedPackage={this.props.newRequestStreams.selectedPackage}
          selectedService={this.props.newRequestStreams.selectedService}
          selectedRequest={this.props.newRequestStreams.selectedRequest}
          selectedStreamingType={this.props.newRequestStreams.selectedStreamingType}
        />

      </div>
    );
  }
}

export default GRPCAutoInputForm;
