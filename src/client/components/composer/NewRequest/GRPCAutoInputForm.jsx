import React, { useState, useEffect } from "react";
import GRPCBodyEntryForm from "./GRPCBodyEntryForm.jsx";

const GRPCAutoInputForm = (props) => {
  //component state for toggling show/hide
  const [show, toggleShow] = useState(true);
  //component state for service and request dropdown
  const [serviceNameOption, selectServiceOption] = useState("Select Service");
  const [requestNameOption, selectRequestOption] = useState("Select Request");

  const {
    selectedService,
    selectedRequest,
    services,
    streamsArr,
    streamContent,
    selectedPackage,
    selectedStreamingType,
    selectedServiceObj,
  } = props.newRequestStreams;

  // event handler for changes made to the Select Services dropdown list
  const setService = (e) => {
    selectServiceOption(e.target.value);
    const serviceName =
      e.target.value !== "Select Service" ? e.target.value : null;
    const serviceObj = services.find((ser) => ser.name === e.target.value);
    // clears all stream query bodies except the first one
    props.clearStreamBodies();
    // the selected service name is saved in state of the store, mostly everything else is reset
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedService: serviceName,
      selectedServiceObj: serviceObj,
    });
  };

  // event handler for changes made to the Select Requests dropdown list
  const setRequest = (e) => {
    selectRequestOption(e.target.value);
    const requestName =
      e.target.value !== "Select Request" ? e.target.value : null;
    props.clearStreamBodies();

    // clears all stream bodies except the first when switching from client/directional stream to something else
    const newStreamsArr = [streamsArr[0]];
    const newStreamContent = [streamContent[0]];

    // the selected request name is saved in state of the store
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedPackage: null,
      selectedRequest: requestName,
      selectedStreamingType: null,
      streamContent: newStreamContent,
      streamsArr: newStreamsArr,
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
    const message = selectedServiceObj.messages.find(
      (msg) => msg.name === rpc.req
    );

    //declare empty results obj that will become the initial query
    const results = {};
    // push each key/value pair of the message definition into the results obj
    for (const key in message.def) {
      // if message type is a nested message (message.def.nested === true)
      if (message.def[key].nested) {
        for (const submess of selectedServiceObj.messages) {
          if (submess.name === message.def[key].dependent) {
            // define obj for the submessage definition
            const subObj = {};
            for (const subKey in submess.def) {
              subObj[subKey] = submess.def[subKey].type.slice(5).toLowerCase();
            }
            results[key] = subObj;
            break;
          }
        }
      } else {
        results[key] = message.def[key].type.slice(5).toLowerCase();
      }
    }
    //shally copy streamsArr and streamCopy to reassign in store
    const streamsArrCopy = [...streamsArr];
    const streamContentCopy = [...streamContent];

    // push JSON formatted query in streamContent arr
    const queryJSON = JSON.stringify(results, null, 4);
    if (streamsArrCopy[0] !== "") {
      streamsArrCopy[0].query = queryJSON;
    }
    // remove initial empty string then push new query to stream content arr
    streamContentCopy.pop();
    streamContentCopy.push(queryJSON);

    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedPackage: selectedServiceObj.packageName,
      selectedStreamingType: rpc.type,
      streamsArr: streamsArrCopy,
      streamContent: streamContentCopy,
      initialQuery: queryJSON,
    });
  }, [selectedRequest]);

  const bodyContainerClass = show
    ? "dropdownService"
    : "composer_bodyform_container-closed";

  //default options shown for services and request dropdowns
  const servicesList = [
    <option key="default" value="Select Service">
      Select Service
    </option>,
  ];
  const rpcsList = [
    <option key="default" value="Select Request">
      Select Request
    </option>,
  ];

  // autopopulates the service dropdown list
  if (services) {
    services.forEach((ser, i) => {
      servicesList.push(
        <option key={i} value={ser.name}>
          {ser.name}
        </option>
      );
    });
  }
  // autopopulates the request dropdown list
  if (selectedServiceObj) {
    for (let i = 0; i < selectedServiceObj.rpcs.length; i++) {
      rpcsList.push(
        <option key={i} value={selectedServiceObj.rpcs[i].name}>
          {selectedServiceObj.rpcs[i].name}
        </option>
      );
    }
  }

  return (
    <div>
      <label
        className='composer_subtitle' >
          <div className="label-text" id="cookie-click">Stream</div>
          <div className="toggle">
            <input type="checkbox" name="check" className="toggle-state" onClick={() => toggleShow(!show)}/>
            <div className="indicator_body" />
          </div>
        </label>
      <select
        id="dropdownService"
        value={serviceNameOption}
        onChange={setService}
        name="dropdownService"
        className={bodyContainerClass}
      >
        {servicesList}
      </select>

      <select
        id="dropdownRequest"
        value={requestNameOption}
        onChange={setRequest}
        name="dropdownRequest"
        className={bodyContainerClass}
      >
        {rpcsList}
      </select>

      <GRPCBodyEntryForm
        newRequestStreams={props.newRequestStreams}
        setNewRequestStreams={props.setNewRequestStreams}
        selectedPackage={selectedPackage}
        selectedService={selectedService}
        selectedRequest={selectedRequest}
        selectedStreamingType={selectedStreamingType}
      />
    </div>
  );
};

export default GRPCAutoInputForm;
