import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import GRPCBodyEntryForm from "./GRPCBodyEntryForm.jsx";

class GRPCAutoInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    // need to bind the 'this' of the event handler to the component instance when it is being rendered
    this.toggleShow = this.toggleShow.bind(this);
    this.setService = this.setService.bind(this);
    this.setRequest = this.setRequest.bind(this);
  }
  // event handler on the arrow button that allows you to open/close the section 
  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }
  // event handler for changes made to the Select Services dropdown list
  setService() {
   // grabs the name of the current selected option from the select services dropdown to be saved in the state of the store
    const dropdownService = document.getElementById('dropdownService');
    const serviceName = dropdownService.options[dropdownService.selectedIndex].text;
    // grabs the stream button next the URL and resets the text to "STREAM" after another service is selected
    document.getElementById('stream').innerText = 'STREAM';
    // grabs the request dropdown list and resets it to the first option "Select Request"
    document.getElementById('dropdownRequest').selectedIndex = 0;
    // clear query body
    while (this.props.newRequestStreams.streamsArr.length > 1) {
      this.props.newRequestStreams.streamsArr.pop();
      this.props.newRequestStreams.streamContent.pop();
      this.props.newRequestStreams.count -= 1;
    }
    this.props.newRequestStreams.streamContent[0] = '';
    // the selected service name is saved in state of the store, mostly everything else is reset
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      // count: 0,
      // streamsArr: this.props.newRequestStreams.streamsArr,
      // streamContent: this.props.newRequestStreams.streamContent,
      // selectedPackage: null,
      // selectedRequest: null,
      // selectedStreamingType: null,
      // initialQuery: null,
      // queryArr: null,
      selectedService: serviceName
    });

  }
  // event handler for changes made to the Select Request dropdown list
  setRequest() {
    // clears all stream bodies except the first when switching from client/directional stream to something else
    while (this.props.newRequestStreams.streamsArr.length > 1) {
      this.props.newRequestStreams.streamsArr.pop();
      this.props.newRequestStreams.streamContent.pop()
      this.props.newRequestStreams.count -= 1;
    }
    // update state in the store
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      selectedPackage: null,
      selectedRequest: null,
      selectedStreamingType: null,
      streamContent: this.props.newRequestStreams.streamContent,
      streamsArr: this.props.newRequestStreams.streamsArr
    });
    // grabs the name of the current selected option from the select request dropdown to be saved in the state of the store
    const dropdownRequest = document.getElementById('dropdownRequest');
    const requestName = dropdownRequest.options[dropdownRequest.selectedIndex].text;
    // the selected request name is saved in state of the store
    this.props.setNewRequestStreams({
      ...this.props.newRequestStreams,
      selectedRequest: requestName
    });
    this.setState({
      ...this.state
    }, () => {
      // save the selected service/request and array of all the service objs in variables,
      // which is currently found in the state of the store
      const selectedService = this.props.newRequestStreams.selectedService;
      const selectedRequest = this.props.newRequestStreams.selectedRequest;
      const services = this.props.newRequestStreams.services;
      let streamingType;
      let packageName;
      /*
      for each service obj in the services array, if its name matches the current selected service option then: 
      - save the package name
      - iterate through the rpcs and if its name matches the current selected request then save its streaming type 
      */
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
      // update the selected package name and streaming type in the state of the store
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
        /* 
        for each service obj in the services array, if its name matches the current selected service option then:
        - iterate through the rpcs and if its name matches the current selected request then save the name of req/rpc
        - iterate through the messages and if its name matches the saved req/rpc name,
        then push each key/value pair of the message definition into the results array
        */
        for (const service of services) {
          if (service.name === selectedService ) {
            for (const rpc of service.rpcs) {
              if (rpc.name === selectedRequest) {
                req = rpc.req
              }
            }
            for (const message of service.messages) {
              if (message.name === req ) {
                for (const key in message.def) {
                  results.push(`"${key}": "${message.def[key].type.slice(5).toLowerCase()}"`)
                }
                break;
              }
            }
          }
        }
        const streamsArr = this.props.newRequestStreams.streamsArr;
        const streamContent = this.props.newRequestStreams.streamContent;
         // query for messages with single key:value pair
        if (results.length === 1) {
          query = results[0];
        }
        // query for messages with multiple key:value pairs
        else {
          for (let i = 0; i < results.length; i++) {
            query = `${query},
    ${results[i]}`
          }
          query = query.slice(1).trim();
        }
        // set query in streamsArr 
        if (streamsArr[0] !== '') {
          streamsArr[0].query = `{
    ${query}
}`;
        }
        // remove initial empty string then push new query to stream content arr
        streamContent.pop();
        streamContent.push(`{
    ${query}
}`);
        // set state in the store with updated content
        this.props.setNewRequestStreams({
          ...this.props.newRequestStreams,
          streamsArr: streamsArr,
          streamContent: streamContent,
          initialQuery: query
        });
      });
      // update button display for streaming type listed next to url
      const streamBtn = document.getElementById('stream')
      if (streamingType === undefined) {
        streamBtn.innerText = 'STREAM'
      } else {
        streamBtn.innerText = streamingType
      }
    });
  }
  
  render() {
    // arrow button used to collapse or open the Stream section
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

    let services = this.props.newRequestStreams.services;
    const servicesList =[];
    const rpcsList = [];
    // autopopulates the service dropdown list
    if (services) {
      for (let i = 0; i < services.length; i++) {
        servicesList.push(<option key={i} value={i}>{services[i].name}</option>)
      }
      let selectedService = this.props.newRequestStreams.selectedService;
          // autopopulates the request dropdown list
      for (const service of services) {
        if (service.name === selectedService) {
          for (let i = 0; i < service.rpcs.length; i++) {
            rpcsList.push(<option key={i} value={i}>{service.rpcs[i].name}</option>)
          }
        }
      }
    }
    /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Stream"
     - renders the dropdown lists for services and requests
     - the GRPCBodyEntryForm component renders the stream query bodies
     */
    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src={dropDownArrow}></img>
          Stream
        </div>

       <select id="dropdownService" onChange={this.setService} ref="dropdownService" name="dropdownService" className={'dropdownService ' + bodyContainerClass}>
          <option value="services" defaultValue="">Select Service</option>
          {servicesList}
        </select>

        <select id="dropdownRequest" onChange={this.setRequest} ref="dropdownRequest" name="dropdownRequest" className={'dropdownRequest ' + bodyContainerClass}>
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
