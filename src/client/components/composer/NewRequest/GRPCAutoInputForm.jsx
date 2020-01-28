import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'
import GRPCBodyEntryForm from "./GRPCBodyEntryForm.jsx";

class GRPCAutoInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      // ***MOCK DATA***
      services: [
        {
          name: 'BookService',
          messages: [
            {
              name: "Book",
              def: {
                isbn: 'int64',
                title: 'string',
                author: 'string',
              }
            },
            {
              name: "GetBookRequest",
              def: {
                isbn: 'int64'
              }
            },
            {
              name: "GetBookViaAuthor",
              def: {
                author: 'string',
              }
            }
          ],
          rpcs: [
            {
              name: "GetBook",
              type: 'UNARY',
              req: 'GetBookRequest',
              res: 'Book'
            },
            {
              name: "GetBooksViaAuthor",
              type: 'SERVER STREAM',
              req: 'GetBookViaAuthor',
              res: 'Book'
            },
            {
              name: "GetGreatestBook",
              type: 'CLIENT STREAM',
              req: 'GetBookRequest',
              res: 'Book'
            },
            {
              name: "GetBooks",
              type: 'BIDIRECTIONAL',
              req: 'GetBookRequest',
              res: 'Book'
            },
          ]
        },
        {
          name: 'DogService',
          messages: [
            {
              name: "Info",
              def: {
                name: 'string',
                breed: 'string'
              }
            },
            {
              name: "GetAge",
              def: {
                age: 'string'
              }
            }
          ],
          rpcs: [
            {
              name: "GetInfo",
              type: 'UNARY',
              req: 'GetAge',
              res: 'Info',
            },
            {
              name: "GetBackground",
              type: 'BIDIRECTIONAL',
              req: 'GetAge',
              res: 'Info'
            },
          ]
        }
      ],
      selectedService: null,
      selectedRequest: null,
      selectedStreamingType: null,
      selectedQuery: null
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
    this.setState({ 
      ...this.state,
      selectedService: serviceName
   });
  }

  setRequest() {
    const sel = document.getElementById('dropdownRequest');
    const opt = sel.options[sel.selectedIndex];
    const requestName = opt.text;
    this.setState({ 
      ...this.state,
      selectedRequest: requestName
    }, () => {
      const selectedService = this.state.selectedService;
      const selectedRequest = this.state.selectedRequest;
      const services = this.state.services;
      let streamingType;
      for (const service of services) {
        if (service.name === selectedService ) {
          for (const rpc of service.rpcs) {
            if (rpc.name === selectedRequest) {
              streamingType = rpc.type;
            }
          }
        }
      }
      this.setState({ 
        selectedStreamingType: streamingType
      }, () => {
        let req;
        let results = [];
        for (const service of services) {
          if (service.name === selectedService ) {
            for (const rpc of service.rpcs) {
              if (rpc.name === selectedRequest) {
                req = rpc.req
              }
            }
            for (const message of service.messages) {
              if (message.name === req) {
                for (const key in message.def) {
                  results.push(`${key}: ${message.def[key]}`)
                }
              }
            }
          }
        }
        if (results.length === 1) {
          results = results[0];
        } else {
          for (const result of results) {
            results = results + ', ' + result;
          }
        }
        this.setState({ 
          selectedQuery: results
        })
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

    let services = this.state.services;
    const servicesList =[];
    for (let i = 0; i < services.length; i++) {
      servicesList.push(<option key={i} value={i}>{services[i].name}</option>)
    }

    let selectedService = this.state.selectedService;
    const rpcsList = [];
    for (const service of services) {
      if (service.name === selectedService) {
        for (let i = 0; i < service.rpcs.length; i++) {
          rpcsList.push(<option key={i} value={i}>{service.rpcs[i].name}</option>)
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
          selectedService={this.state.selectedService}
          selectedRequest={this.state.selectedRequest}
          selectedQuery={this.state.selectedQuery}
          selectedStreamingType={this.state.selectedStreamingType}
        /> 

      </div>
    );
  }
}

export default GRPCAutoInputForm;

