import React, { useState, useEffect } from "react";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_black_192x192.png";
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
  } = props.newRequestStreams;

  // event handler for changes made to the Select Services dropdown list
  const setService = (e) => {
    selectServiceOption(e.target.value)
    // clears all stream query bodies except the first one
    props.clearStreamBodies();
    // the selected service name is saved in state of the store, mostly everything else is reset
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedService: e.target.value,
    });
  };

  // event handler for changes made to the Select Requests dropdown list
  const setRequest = (e) => {
    selectRequestOption(e.target.value)

    // clears all stream bodies except the first when switching from client/directional stream to something else
    const newStreamsArr = [streamsArr[0]];
    const newStreamContent = [streamContent[0]];

    // the selected request name is saved in state of the store
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedPackage: null,
      selectedRequest: e.target.value,
      selectedStreamingType: null,
      newStreamContent,
      newStreamsArr,
    });
  };

  useEffect(() => {
    if (!services) return;
    // save the selected service/request and array of all the service objs in variables,
    // which is currently found in the state of the store
    let streamingType, packageName, req;
    const results = {};
    //   for each service obj in the services array, if its name matches the current selected service option then:
    //   - save the package name
    //   - iterate through the rpcs and if its name matches the current selected request then save its streaming type

    //  for each service obj in the services array, if its name matches the current selected service option then:
    //  - iterate through the rpcs and if its name matches the current selected request then save the name of req/rpc
    //  - iterate through the messages and if its name matches the saved req/rpc name,
    //  then push each key/value pair of the message definition into the results array

    for (const service of services) {
      if (service.name === selectedService) {
        packageName = service.packageName;
        for (const rpc of service.rpcs) {
          if (rpc.name === selectedRequest) {
            streamingType = rpc.type;
            req = rpc.req;
          }
        }
        for (const message of service.messages) {
          if (message.name === req) {
            for (const key in message.def) {
              // if message type is a nested message (message.def.nested === true)
              if (message.def[key].nested) {
                for (const submess of service.messages) {
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
            break;
          }
        }
      }
    }

    // push JSON formatted query in streamContent arr
    const queryJSON = JSON.stringify(results, null, 4);
    if (streamsArr[0] !== "") {
      streamsArr[0].query = queryJSON;
    }
    // remove initial empty string then push new query to stream content arr
    streamContent.pop();
    streamContent.push(queryJSON);

    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedPackage: packageName,
      selectedStreamingType: streamingType,
      streamsArr,
      streamContent,
      initialQuery: queryJSON,
    });
  }, [selectedRequest]);

  // arrow button used to collapse or open the Stream section
  const arrowClass = show
    ? "composer_subtitle_arrow-open"
    : "composer_subtitle_arrow-closed";
  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";

    //default options shown for services and request dropdowns
  const servicesList = [
    <option key="default" value="services">
      Select Service
    </option>
  ];
  const rpcsList = [
    <option key="default" value="requests">
      Select Request
    </option>
  ];

  // autopopulates the service dropdown list
  if (services) {
    for (let i = 0; i < services.length; i++) {
      servicesList.push(
        <option key={i} value={services[i].name}>
          {services[i].name}
        </option>
      );
    }
    // autopopulates the request dropdown list
    for (const service of services) {
      if (service.name === selectedService) {
        for (let i = 0; i < service.rpcs.length; i++) {
          rpcsList.push(
            <option key={i} value={service.rpcs[i].name}>
              {service.rpcs[i].name}
            </option>
          );
        }
      }
    }
  }

  return (
    <div>
      <div
        className="composer_subtitle"
        onClick={() => toggleShow(!show)}
        style={props.stylesObj}
      >
        <img className={arrowClass} src={dropDownArrow} />
        Stream
      </div>

      <select
        id="dropdownService"
        value={serviceNameOption}
        onChange={setService}
        name="dropdownService"
        className={"dropdownService " + bodyContainerClass}
      >
        {servicesList}
      </select>

      <select
        id="dropdownRequest"
        value={requestNameOption}
        onChange={setRequest}
        name="dropdownRequest"
        className={"dropdownRequest " + bodyContainerClass}
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
