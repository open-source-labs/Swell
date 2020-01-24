import React, { Component } from 'react';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

class GRPCAutoInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      // ***MOCK DATA***
      services: [
        {
          name: 'BookService',
          rpcs: [
            {
              name: 'GetBook',
              type: 'UNARY',
              definition: 'rpc GetBook (GetBookRequest) returns (Book) {}',
              messages: [
                {
                  name: 'Book',
                  definition: [
                    {
                      number: 1,
                      definition: 'int64 isbn = 1'
                    },
                    {
                      number: 2,
                      definition: 'string title = 2'
                    },
                    {
                      number: 3,
                      definition: 'string author = 3'
                    }
                  ]
                }
              ]
            },
            {
              name: 'GetBooksViaAuthor',
              type: 'BIDRECTIONAL',
              definition: 'rpc GetBooks (stream GetBookRequest) returns (stream Book) {}',
              messages: [
                {
                  name: 'Book',
                  definition: [
                    {
                      number: 1,
                      definition: 'int64 isbn = 1'
                    }
                  ]
                }
              ]
            }
          ]
        }, 
        {
          name: 'DogService',
          rpcs: [
            {
              name: 'GetDog',
              type: 'BIDIRECTIONAL',
              definition: 'rpc GetDog (stream GetDogRequest) returns (stream Dog) {}',
              messages: [
                {
                  name: 'Dog',
                  definition: [
                    {
                      number: 1,
                      definition: 'string name = 2'
                    },
                    {
                      number: 2,
                      definition: 'string type = 3'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      selectedService: null,
      selectedRequest: null,
      selectedStreamingType: null
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.setService = this.setService.bind(this);
    this.setRequest = this.setRequest.bind(this);
  }

    // waiting for server to work to test functionality of service and request dropdowns
    // componentDidMount() {
      // fetch(`/`)
      // .then(res => res.json())
      // .then(data => {
      //   const { services } = data;
      //   this.setState({
      //     ...this.state,
      //     services
      //   })
      // })
      // .catch((err) => { console.log(err) })
    // }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  setService() {
    const sel = document.getElementById('dropdownService');
    const opt = sel.options[sel.selectedIndex];
    const serviceName = opt.text;
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
      this.setState({ selectedStreamingType: streamingType });  
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
          <option value="services" selected="">Select Service</option>
          {servicesList}
        </select>

        <select id="dropdownRequest" onChange={this.setRequest} name="dropdownRequest" className={'dropdownRequest ' + bodyContainerClass}>
          <option value="requests" selected="">Select Request</option>
          {rpcsList}
        </select>
      </div>
    );
  }
}

export default GRPCAutoInputForm;