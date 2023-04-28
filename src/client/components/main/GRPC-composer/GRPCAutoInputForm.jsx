/* eslint-disable  */
// Note: Do not enable eslint for this file because it will change the useEffect dependencies and break the tests.
import React, { useState, useEffect } from 'react';
import GRPCBodyEntryForm from './GRPCBodyEntryForm.jsx';
import GRPCServiceOrRequestSelect from './GRPCServiceOrRequestSelect.jsx';

const GRPCAutoInputForm = (props) => {
  //component state for toggling show/hide
  const [show, toggleShow] = useState(true);
  //component state for service and request dropdown
  const [serviceOption, setServiceOption] = useState('Select Service');
  const [requestOption, setRequestOption] = useState('Select Request');

  const {
    selectedService,
    selectedRequest,
    services,
    streamsArr,
    streamContent,
    selectedPackage,
    selectedStreamingType,
    selectedServiceObj,
    protoContent,
    initialQuery,
  } = props.newRequestStreams;

  // event handler for changes made to the Select Services dropdown list
  const setService = (e) => {
    setServiceOption(e.target.textContent);
    const serviceName =
      e.target.textContent !== 'Select Service' ? e.target.textContent : null;
    const serviceObj = services.find(
      (ser) => ser.name === e.target.textContent
    );
    // clears all stream query bodies except the first one
    let streamsArr = [props.newRequestStreams.streamsArr[0]];
    let streamContent = [''];
    setRequestOption('Select Request');
    // the selected service name is saved in state of the store, mostly everything else is reset
    props.newRequestStreamsSet({
      ...props.newRequestStreams,
      selectedService: serviceName,
      selectedServiceObj: serviceObj,
      selectedRequest: null,
      selectedStreamingType: null,
      selectedPackage: null,
      streamsArr,
      streamContent,
    });
  };

  // event handler for changes made to the Select Requests dropdown list
  const setRequest = (e) => {
    //update component state
    setRequestOption(e.target.textContent);
    //clear streams array and content except first index
    const newStreamsArr = [streamsArr[0]];
    const newStreamContent = [streamContent[0]];

    let requestName = e.target.textContent;
    //clear stream bodies and set request to null if none selected
    if (e.target.textContent === 'Select Request') {
      newStreamContent[0] = '';
      requestName = null;
    }

    // clears all stream bodies except the first when switching from client/directional stream to something else

    // the selected request name is saved in state of the store
    props.newRequestStreamsSet({
      ...props.newRequestStreams,
      selectedPackage: null,
      selectedRequest: requestName,
      selectedStreamingType: null,
      streamContent: newStreamContent,
      streamsArr: newStreamsArr,
      count: 1,
    });
  };

  useEffect(() => {
    //if no selected request or service object, return out and don't update
    if (!selectedRequest || !selectedServiceObj) return;
    //find rpc object that matches selectedRequest name
    const rpc = selectedServiceObj.rpcs.find(
      (rpc) => rpc.name === selectedRequest
    );
    //find message object that matches rpc request name
    const message = selectedServiceObj.messages.find((msg) => {
      if (msg && msg.name === rpc.req) return msg;
    });

    //declare empty results obj that will become the initial query
    const results = {};

    if (message) {
      // push each key/value pair of the message definition into the results obj
      for (const key in message.def) {
        // if message type is a nested message (message.def.nested === true)
        if (message.def[key].nested) {
          for (const submess of selectedServiceObj.messages) {
            if (submess.name === message.def[key].dependent) {
              // define obj for the submessage definition
              const subObj = {};
              for (const subKey in submess.def) {
                subObj[subKey] = submess.def[subKey].type
                  .slice(5)
                  .toLowerCase();
              }
              results[key] = subObj;
              break;
            }
          }
        } else {
          results[key] = message.def[key].type.slice(5).toLowerCase();
        }
      }
    }
    //shallow copy streamsArr and streamCopy to reassign in store
    const streamsArrCopy = [...streamsArr];
    const streamContentCopy = [...streamContent];

    // push JSON formatted query in streamContent arr
    const queryJSON = JSON.stringify(results, null, 4);
    if (streamsArrCopy[0] !== '') {
      streamsArrCopy[0].query = queryJSON;
    }
    // remove initial empty string then push new query to stream content arr
    streamContentCopy.pop();
    streamContentCopy.push(queryJSON);

    props.newRequestStreamsSet({
      ...props.newRequestStreams,
      selectedPackage: selectedServiceObj.packageName,
      selectedStreamingType: rpc.type,
      streamsArr: streamsArrCopy,
      streamContent: streamContentCopy,
      initialQuery: queryJSON,
    });
  }, [selectedRequest]);

  useEffect(() => {
    setServiceOption(selectedService || 'Select Service');
    setRequestOption(selectedRequest || 'Select Request');
  }, [streamContent]);

  //default options shown for services and request dropdowns
  // const servicesList = ['UNARY', 'CLIENT STREAM', 'SERVER STREAM', 'BI-DIRECTIONAL'];
  const servicesList = [];
  // const rpcsList = ['UNARY', 'CLIENT STREAM', 'SERVER STREAM', 'BI-DIRECTIONAL'];
  const rpcsList = [];

  // autopopulates the service dropdown list
  if (services) {
    services.forEach((ser, i) => {
      servicesList.push(ser.name);
    });
  }
  // autopopulates the request dropdown list
  if (selectedServiceObj) {
    for (let i = 0; i < selectedServiceObj.rpcs.length; i++) {
      rpcsList.push(selectedServiceObj.rpcs[i].name);
    }
  }

  return (
    <div>
      <div className="composer-section-title">Stream</div>
      <span>
        <GRPCServiceOrRequestSelect
          id={`${serviceOption.split(' ').join('-')}-button`}
          value={serviceOption}
          onClick={setService}
          items={servicesList}
        />
        {serviceOption !== 'Select Service' && (
          <GRPCServiceOrRequestSelect
            id={`${requestOption.split(' ').join('-')}-button`}
            value={requestOption}
            onClick={setRequest}
            items={rpcsList}
          />
        )}
      </span>
      <GRPCBodyEntryForm
        newRequestStreams={props.newRequestStreams}
        newRequestStreamsSet={props.newRequestStreamsSet}
        selectedPackage={selectedPackage}
        selectedService={selectedService}
        selectedRequest={selectedRequest}
        selectedStreamingType={selectedStreamingType}
        changesSaved={props.changesSaved}
        saveChanges={props.saveChanges}
      />
    </div>
  );
};

export default GRPCAutoInputForm;
