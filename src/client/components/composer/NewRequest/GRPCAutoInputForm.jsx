import React, { useState, useEffect, useRef } from "react";
import dropDownArrow from "../../../../assets/icons/arrow_drop_down_black_192x192.png";
import GRPCBodyEntryForm from "./GRPCBodyEntryForm.jsx";

const GRPCAutoInputForm = (props) => {
  const [show, toggleShow] = useState(true);

  const {
    selectedService,
    selectedRequest,
    services,
    streamsArr,
    streamContent,
    selectedStreamingType,
    selectedPackage,
  } = props.newRequestStreams;

  // event handler for changes made to the Select Services dropdown list
  const setService = () => {
    // grabs the name of the current selected option from the select services dropdown to be saved in the state of the store
    const dropdownService = document.getElementById("dropdownService");
    const serviceName =
      dropdownService.options[dropdownService.selectedIndex].text;
    // grabs the stream button next the URL and resets the text to "STREAM" after another service is selected
    document.getElementById("stream").innerText = "STREAM";
    // grabs the request dropdown list and resets it to the first option "Select Request"
    document.getElementById("dropdownRequest").selectedIndex = 0;
    // clears all stream query bodies except the first one
    props.clearStreamBodies();
    // the selected service name is saved in state of the store, mostly everything else is reset
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedService: serviceName,
    });
  };

  const setRequest = () => {
    // clears all stream bodies except the first when switching from client/directional stream to something else
    while (streamsArr.length > 1) {
      streamsArr.pop();
      streamContent.pop();
      props.newRequestStreams.count -= 1;
    }
    // update state in the store
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedPackage: null,
      selectedRequest: null,
      selectedStreamingType: null,
      streamContent,
      streamsArr,
    });
    // grabs the name of the current selected option from the select request dropdown to be saved in the state of the store
    const dropdownRequest = document.getElementById("dropdownRequest");
    const requestName =
      dropdownRequest.options[dropdownRequest.selectedIndex].text;
    // the selected request name is saved in state of the store
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      selectedRequest: requestName,
    });
  };

  useEffect(() => {
    console.log("useEffect 1");

    if (services) {
      // save the selected service/request and array of all the service objs in variables,
      // which is currently found in the state of the store

      let streamingType;
      let packageName;
      /*
  for each service obj in the services array, if its name matches the current selected service option then:
  - save the package name
  - iterate through the rpcs and if its name matches the current selected request then save its streaming type
  */
      for (const service of services) {
        if (service.name === selectedService) {
          packageName = service.packageName;
          for (const rpc of service.rpcs) {
            if (rpc.name === selectedRequest) {
              streamingType = rpc.type;
            }
          }
        }
      }
      // update button display for streaming type listed next to url
      const streamBtn = document.getElementById("stream");
      if (streamingType === undefined) {
        streamBtn.innerText = "STREAM";
      } else {
        streamBtn.innerText = streamingType;
      }
      // update the selected package name and streaming type in the state of the store
      props.setNewRequestStreams({
        ...props.newRequestStreams,
        selectedPackage: packageName,
        selectedStreamingType: streamingType,
      });
    }
  }, [selectedRequest]);

  useEffect(() => {
    console.log("useEffect 2");

    if (services) {
      let req;
      const results = {};
      /*
for each service obj in the services array, if its name matches the current selected service option then:
- iterate through the rpcs and if its name matches the current selected request then save the name of req/rpc
- iterate through the messages and if its name matches the saved req/rpc name,
then push each key/value pair of the message definition into the results array
*/
      for (const service of services) {
        if (service.name === selectedService) {
          for (const rpc of service.rpcs) {
            if (rpc.name === selectedRequest) {
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
      // set state in the store with updated content
      props.setNewRequestStreams({
        ...props.newRequestStreams,
        streamsArr,
        streamContent,
        initialQuery: queryJSON,
      });
    }
  }, [selectedRequest]);

  // arrow button used to collapse or open the Stream section
  const arrowClass = show
    ? "composer_subtitle_arrow-open"
    : "composer_subtitle_arrow-closed";
  const bodyContainerClass = show
    ? "composer_bodyform_container-open"
    : "composer_bodyform_container-closed";

  const servicesList = [];
  const rpcsList = [];
  // const dropdownService = useRef(null);
  // const dropdownRequest = useRef(null);

  // autopopulates the service dropdown list
  if (services) {
    for (let i = 0; i < services.length; i++) {
      servicesList.push(
        <option key={i} value={i}>
          {services[i].name}
        </option>
      );
    }
    // autopopulates the request dropdown list
    for (const service of services) {
      if (service.name === selectedService) {
        for (let i = 0; i < service.rpcs.length; i++) {
          rpcsList.push(
            <option key={i} value={i}>
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
        onChange={setService}
        // ref={dropdownService}
        name="dropdownService"
        className={"dropdownService " + bodyContainerClass}
      >
        <option value="services" defaultValue="">
          Select Service
        </option>
        {servicesList}
      </select>

      <select
        id="dropdownRequest"
        onChange={setRequest}
        // ref={dropdownRequest}
        name="dropdownRequest"
        className={"dropdownRequest " + bodyContainerClass}
      >
        <option value="requests" defaultValue="">
          Select Request
        </option>
        {rpcsList}
      </select>

      <GRPCBodyEntryForm
        newRequestStreams={props.newRequestStreams}
        setNewRequestStreams={props.setNewRequestStreams}
        selectedPackage={props.newRequestStreams.selectedPackage}
        selectedService={props.newRequestStreams.selectedService}
        selectedRequest={props.newRequestStreams.selectedRequest}
        selectedStreamingType={props.newRequestStreams.selectedStreamingType}
      />
    </div>
  );
};

export default GRPCAutoInputForm;
