import React, { Component } from "react";
import uuid from "uuid/v4"; // (Universally Unique Identifier)--generates a unique ID
import HeaderEntryForm from "./HeaderEntryForm.jsx";
import BodyEntryForm from "./BodyEntryForm.jsx";
import GraphQLBodyEntryForm from "./GraphQLBodyEntryForm.jsx";
import GRPCProtoEntryForm from "./GRPCProtoEntryForm.jsx";
import FieldEntryForm from "./FieldEntryForm.jsx";
import CookieEntryForm from "./CookieEntryForm.jsx";
import historyController from "../../../controllers/historyController";

class ComposerNewRequest extends Component {
  constructor(props) {
    super(props);
    this.addNewRequest = this.addNewRequest.bind(this);
    this.handleSSEPayload = this.handleSSEPayload.bind(this);
  }

  requestValidationCheck() {
    let validationMessage;
    //Error conditions...
    if (this.props.newRequestFields.gRPC) {
      return true;
    }
    if (/https?:\/\/$|wss?:\/\/$/.test(this.props.newRequestFields.url)) {
      //if url is only http/https/ws/wss://
      validationMessage = "Please enter a valid URI.";
    }
    if (!/(https?:\/\/)|(wss?:\/\/)/.test(this.props.newRequestFields.url)) {
      //if url doesn't have http/https/ws/wss://
      validationMessage = "Please enter a valid URI.";
    } else if (
      !this.props.newRequestBody.JSONFormatted &&
      this.props.newRequestBody.rawType === "application/json"
    ) {
      validationMessage = "Please fix JSON body formatting errors.";
    } else if (this.props.newRequestFields.method === "QUERY") {
      if (
        this.props.newRequestFields.url &&
        !this.props.newRequestBody.bodyContent
      ) {
        validationMessage = "Missing body.";
      }
    }
    return validationMessage || true;
  }

  handleSSEPayload(e) {
    this.props.setNewRequestSSE(e.target.checked);
  }

  addNewRequest() {
    const validated = this.requestValidationCheck();
    if (validated === true) {
      let reqRes;
      const protocol = this.props.newRequestFields.gRPC
        ? ""
        : this.props.newRequestFields.url.match(/(https?:\/\/)|(wss?:\/\/)/)[0];
      // HTTP && GRAPHQL QUERY & MUTATION REQUESTS
      if (
        !/wss?:\/\//.test(this.props.newRequestFields.protocol) &&
        !this.props.newRequestFields.gRPC
      ) {
        let URIWithoutProtocol = `${
          this.props.newRequestFields.url.split(protocol)[1]
        }/`;
        const host = protocol + URIWithoutProtocol.split("/")[0];
        let path = `/${URIWithoutProtocol.split("/")
          .splice(1)
          .join("/")
          .replace(/\/{2,}/g, "/")}`;
        if (path.charAt(path.length - 1) === "/" && path.length > 1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/https?:\//g, "http://");
        let historyBodyContent;
        if (document.querySelector("#gqlBodyEntryTextArea")) {
          historyBodyContent = document.querySelector("#gqlBodyEntryTextArea")
            .value;
        } //grabs the input value in case tab was last key pressed
        else if (this.props.newRequestBody.bodyContent) {
          historyBodyContent = this.props.newRequestBody.bodyContent;
        } else historyBodyContent = "";
        let historyBodyVariables;
        if (document.querySelector("#gqlVariableEntryTextArea")) {
          historyBodyVariables = document.querySelector(
            "#gqlVariableEntryTextArea"
          ).value;
        } //grabs the input value in case tab was last key pressed
        else historyBodyVariables = "";
        reqRes = {
          id: uuid(),
          created_at: new Date(),
          protocol: this.props.newRequestFields.url.match(/https?:\/\//)[0],
          host,
          path,
          url: this.props.newRequestFields.url,
          graphQL: this.props.newRequestFields.graphQL,
          gRPC: this.props.newRequestFields.gRPC,
          timeSent: null,
          timeReceived: null,
          connection: "uninitialized",
          connectionType: null,
          checkSelected: false,
          protoPath: this.props.protoPath,
          request: {
            method: this.props.newRequestFields.method,
            headers: this.props.newRequestHeaders.headersArr.filter(
              (header) => header.active && !!header.key
            ),
            cookies: this.props.newRequestCookies.cookiesArr.filter(
              (cookie) => cookie.active && !!cookie.key
            ),
            body: historyBodyContent,
            bodyType: this.props.newRequestBody.bodyType,
            bodyVariables: historyBodyVariables,
            rawType: this.props.newRequestBody.rawType,
            isSSE: this.props.newRequestSSE.isSSE,
          },
          response: {
            headers: null,
            events: null,
          },
          checked: false,
          minimized: false,
          tab: this.props.currentTab,
        };
      }
      // GraphQL Subscriptions
      else if (this.props.newRequestFields.graphQL) {
        let URIWithoutProtocol = `${
          this.props.newRequestFields.url.split(protocol)[1]
        }/`;
        const host = protocol + URIWithoutProtocol.split("/")[0];
        let path = `/${URIWithoutProtocol.split("/")
          .splice(1)
          .join("/")
          .replace(/\/{2,}/g, "/")}`;
        if (path.charAt(path.length - 1) === "/" && path.length > 1) {
          path = path.substring(0, path.length - 1);
        }
        path = path.replace(/wss?:\//g, "ws://");
        let historyBodyContent;
        if (document.querySelector("#gqlBodyEntryTextArea")) {
          historyBodyContent = document.querySelector("#gqlBodyEntryTextArea")
            .value;
        } //grabs the input value in case tab was last key pressed
        else if (this.props.newRequestBody.bodyContent) {
          historyBodyContent = this.props.newRequestBody.bodyContent;
        } else historyBodyContent = "";
        let historyBodyVariables;
        if (document.querySelector("#gqlVariableEntryTextArea")) {
          historyBodyVariables = document.querySelector(
            "#gqlVariableEntryTextArea"
          ).value;
        } //grabs the input value in case tab was last key pressed
        else historyBodyVariables = "";
        reqRes = {
          id: uuid(),
          created_at: new Date(),
          protocol: "ws://",
          host,
          path,
          url: this.props.newRequestFields.url,
          graphQL: this.props.newRequestFields.graphQL,
          gRPC: this.props.newRequestFields.gRPC,
          timeSent: null,
          timeReceived: null,
          connection: "uninitialized",
          connectionType: null,
          checkSelected: false,
          request: {
            method: this.props.newRequestFields.method,
            headers: this.props.newRequestHeaders.headersArr.filter(
              (header) => header.active && !!header.key
            ),
            cookies: this.props.newRequestCookies.cookiesArr.filter(
              (cookie) => cookie.active && !!cookie.key
            ),
            body: historyBodyContent,
            bodyType: this.props.newRequestBody.bodyType,
            bodyVariables: historyBodyVariables,
            rawType: this.props.newRequestBody.rawType,
          },
          response: {
            headers: null,
            events: null,
          },
          checked: false,
          minimized: false,
          tab: this.props.currentTab,
        };
      }
      // gRPC requests
      else if (this.props.newRequestFields.gRPC) {
        // saves all stream body queries to history & reqres request body
        let streamQueries = "";
        for (
          let i = 0;
          i < this.props.newRequestStreams.streamContent.length;
          i++
        ) {
          // quries MUST be in this format, do NOT edit template literal unless necessary
          streamQueries += `${this.props.newRequestStreams.streamContent[i]}
          
`;
        }
        // define array to hold client query strings
        let queryArrStr = this.props.newRequestStreams.streamContent;
        let queryArr = [];
        // scrub client query strings to remove line breaks
        // convert strings to objects and push to array
        for (let i = 0; i < queryArrStr.length; i += 1) {
          let query = queryArrStr[i];
          let regexVar = /\r?\n|\r|↵/g;
          query = query.replace(regexVar, "");
          queryArr.push(JSON.parse(query));
        }
        // grabbing streaming type to set method in reqRes.request.method
        const grpcStream = document.getElementById("stream").innerText;
        // create reqres obj to be passed to controller for further actions/tasks
        reqRes = {
          id: uuid(),
          created_at: new Date(),
          protocol: "",
          url: this.props.newRequestFields.url,
          graphQL: this.props.newRequestFields.graphQL,
          gRPC: this.props.newRequestFields.gRPC,
          timeSent: null,
          timeReceived: null,
          connection: "uninitialized",
          connectionType: null,
          checkSelected: false,
          request: {
            method: grpcStream,
            headers: this.props.newRequestHeaders.headersArr.filter(
              (header) => header.active && !!header.key
            ),
            body: streamQueries,
            bodyType: this.props.newRequestBody.bodyType,
            rawType: this.props.newRequestBody.rawType,
          },
          response: {
            cookies: [],
            headers: {},
            stream: null,
            events: [],
          },
          checked: false,
          minimized: false,
          tab: this.props.currentTab,
          service: this.props.newRequestStreams.selectedService,
          rpc: this.props.newRequestStreams.selectedRequest,
          packageName: this.props.newRequestStreams.selectedPackage,
          streamingType: this.props.newRequestStreams.streamingType,
          queryArr: queryArr,
          initialQuery: this.props.newRequestStreams.initialQuery,
          streamsArr: this.props.newRequestStreams.streamsArr,
          streamContent: this.props.newRequestStreams.streamContent,
          servicesObj: this.props.newRequestStreams.services,
          protoPath: this.props.newRequestStreams.protoPath,
          protoContent: this.props.newRequestStreams.protoContent,
        };
      }
      // WEBSOCKET REQUESTS
      else {
        reqRes = {
          id: uuid(),
          created_at: new Date(),
          protocol: this.props.newRequestFields.url.match(/wss?:\/\//)[0],
          url: this.props.newRequestFields.url,
          timeSent: null,
          timeReceived: null,
          connection: "uninitialized",
          connectionType: "WebSocket",
          checkSelected: false,
          request: {
            method: "WS",
            messages: [],
          },
          response: {
            messages: [],
          },
          checked: false,
          tab: this.props.currentTab,
        };
      }

      // add request to history
      historyController.addHistoryToIndexedDb(reqRes);
      this.props.reqResAdd(reqRes);

      //reset for next request
      this.props.setNewRequestHeaders({
        headersArr: [],
        count: 0,
      });

      this.props.setNewRequestStreams({
        ...this.props.newRequestStreams,
      });

      this.props.setNewRequestCookies({
        cookiesArr: [],
        count: 0,
      });

      this.props.setNewRequestBody({
        ...this.newRequestBody,
        bodyContent: "",
        bodyVariables: "",
        bodyType: "raw",
        rawType: "Text (text/plain)",
        JSONFormatted: true,
      });

      this.props.setNewRequestFields({
        ...this.props.newRequestFields,
        method: this.props.newRequestFields.method,
        protocol: "",
        url: "http://",
        graphQL: this.props.newRequestFields.graphQL,
        gRPC: this.props.newRequestFields.gRPC,
      });

      if (this.props.newRequestFields.gRPC) {
        this.props.setNewRequestBody({
          ...this.newRequestBody,
          bodyType: "GRPC",
          rawType: "",
        });
        this.props.setNewRequestFields({
          ...this.props.newRequestFields,
          url: this.props.newRequestFields.url,
        });
      }

      if (this.props.newRequestFields.graphQL) {
        this.props.setNewRequestBody({
          ...this.newRequestBody,
          bodyType: "GQL",
          rawType: "",
        });
      }

      if (this.props.newRequestFields.protocol === "ws://") {
        this.props.setNewRequestFields({
          protocol: "ws://",
          url: "ws://",
        });
      }
      this.props.setNewRequestSSE(false);
    } else {
      this.props.setComposerWarningMessage(validated);
      this.props.setComposerDisplay("Warning");
    }
  }

  render() {
    let HeaderEntryFormStyle = {
      //trying to change style to conditional created strange duplication effect when continuously changing protocol
      display: !/wss?:\/\//.test(this.props.newRequestFields.protocol)
        ? "block"
        : "none",
    };
    let SubmitButtonClassName = "composer_submit";
    if (
      /wss?:\/\//.test(this.props.newRequestFields.protocol) &&
      !this.props.newRequestFields.graphQL &&
      !this.props.newRequestFields.gRPC
    ) {
      SubmitButtonClassName += " ws";
    } else if (this.props.newRequestFields.graphQL) {
      SubmitButtonClassName += " gql";
    } else if (this.props.newRequestFields.gRPC) {
      SubmitButtonClassName += " grpc";
    } else {
      SubmitButtonClassName += " http";
    }
    return (
      <div
        tabIndex={0}
        style={{ display: "flex", flexDirection: "column", outline: "none" }}
      >
        <h1 className="composer_title">Create New Request</h1>

        <FieldEntryForm
          // addRequestProp={this.addNewRequest}
          newRequestFields={this.props.newRequestFields}
          newRequestHeaders={this.props.newRequestHeaders}
          newRequestStreams={this.props.newRequestStreams}
          newRequestBody={this.props.newRequestBody}
          setNewRequestFields={this.props.setNewRequestFields}
          setNewRequestHeaders={this.props.setNewRequestHeaders}
          setNewRequestStreams={this.props.setNewRequestStreams}
          setNewRequestCookies={this.props.setNewRequestCookies}
          setNewRequestBody={this.props.setNewRequestBody}
        />
        <HeaderEntryForm
          stylesObj={HeaderEntryFormStyle}
          newRequestHeaders={this.props.newRequestHeaders}
          newRequestStreams={this.props.newRequestStreams}
          newRequestBody={this.props.newRequestBody}
          newRequestFields={this.props.newRequestFields}
          setNewRequestHeaders={this.props.setNewRequestHeaders}
          setNewRequestStreams={this.props.setNewRequestStreams}
        />
        {this.props.newRequestFields.method &&
          !/wss?:\/\//.test(this.props.newRequestFields.protocol) &&
          !this.props.newRequestFields.gRPC && (
            <CookieEntryForm
              newRequestCookies={this.props.newRequestCookies}
              newRequestBody={this.props.newRequestBody}
              setNewRequestCookies={this.props.setNewRequestCookies}
            />
          )}
        {!this.props.newRequestFields.graphQL &&
          !this.props.newRequestFields.gRPC &&
          this.props.newRequestFields.method !== "GET" &&
          !/wss?:\/\//.test(this.props.newRequestFields.protocol) && (
            <BodyEntryForm
              newRequestHeaders={this.props.newRequestHeaders}
              newRequestBody={this.props.newRequestBody}
              setNewRequestHeaders={this.props.setNewRequestHeaders}
              setNewRequestBody={this.props.setNewRequestBody}
            />
          )}
        {this.props.newRequestFields.graphQL && (
          <GraphQLBodyEntryForm
            newRequestBody={this.props.newRequestBody}
            setNewRequestBody={this.props.setNewRequestBody}
          />
        )}
        {this.props.newRequestFields.gRPC && (
          <GRPCProtoEntryForm
            newRequestStreams={this.props.newRequestStreams}
            setNewRequestStreams={this.props.setNewRequestStreams}
          />
        )}
        {/* SSE CHeckbox, update newRequestSSE in store */}
        {!this.props.newRequestFields.graphQL &&
          !this.props.newRequestFields.gRPC &&
          !/wss?:\/\//.test(this.props.newRequestFields.protocol) && (
            <div className="composer_subtitle_SSE">
              <input
                type="checkbox"
                onChange={this.handleSSEPayload}
                checked={this.props.newRequestSSE.isSSE}
              />
              Server Sent Events
            </div>
          )}
        <button
          className={SubmitButtonClassName}
          onClick={this.addNewRequest}
          type="button"
        >
          Add New Request
        </button>
      </div>
    );
  }
}

export default ComposerNewRequest;
