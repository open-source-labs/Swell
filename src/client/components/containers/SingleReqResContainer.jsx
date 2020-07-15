import React, { Component } from "react";
import connectionController from "../../controllers/reqResController";
import OpenBtn from "../display/OpenBtn.jsx";
import CloseBtn from "../display/CloseBtn.jsx";
import RequestTabs from "../display/RequestTabs.jsx";
import ResponseContainer from "./ResponseContainer.jsx";
import WebSocketWindow from "../display/WebSocketWindow.jsx";
import dropDownArrow from "../../../assets/icons/arrow_drop_down_white_192x192.png";

class SingleReqResContainer extends Component {
  constructor(props) {
    super(props);
    this.removeReqRes = this.removeReqRes.bind(this);
    this.onCheckHandler = this.onCheckHandler.bind(this);
    this.minimize = this.minimize.bind(this);
  }

  onCheckHandler() {
    this.props.content.checked = !this.props.content.checked;
    this.props.reqResUpdate(this.props.content);
  }

  removeReqRes() {
    connectionController.closeReqRes(this.props.content.id);
    this.props.reqResDelete(this.props.content);
  }

  minimize() {
    this.props.content.minimized = !this.props.content.minimized;
    this.props.reqResUpdate(this.props.content);
  }

  renderStatusCode() {
    if (this.props.content.graphQL) {
      // graphql
      const statusCode = !this.props.content.response.events
        ? ""
        : this.props.content.response.events &&
          this.props.content.response.events.length
        ? JSON.parse(this.props.content.response.events[0]).statusCode
        : "";
      return !this.props.content.response.events
        ? ""
        : this.props.content.response.events &&
          this.props.content.response.events.length &&
          statusCode
        ? "Status: " + statusCode
        : "Status: 200";
    } else if (/wss?:\/\//.test(this.props.content.protocol)) {
      // ws - close codes
      return this.props.content.closeCode
        ? `Close Code: ${this.props.content.closeCode}`
        : "";
    } else {
      // http
      return this.props.content.response.headers &&
        this.props.content.response.headers[":status"]
        ? "Status: " + this.props.content.response.headers[":status"]
        : "";
    }
  }

  render() {
    const contentBody = [];

    if (
      /wss?:\/\//.test(this.props.content.protocol) &&
      !this.props.content.graphQL
    ) {
      contentBody.push(
        <WebSocketWindow
          key={0}
          outgoingMessages={this.props.content.request.messages}
          incomingMessages={this.props.content.response.messages}
          id={this.props.content.id}
          connection={this.props.content.connection}
        />
      );
    } else {
      contentBody.push(
        <RequestTabs requestContent={this.props.content.request} key={0} />
      );
      if (this.props.content.connection !== "uninitialized") {
        contentBody.push(
          <ResponseContainer
            content={this.props.content}
            connectionType={this.props.content.connectionType}
            reqResUpdate={this.props.reqResUpdate}
            key={1}
          />
        );
      }
    }

    const openButtonStyles = {
      display:
        this.props.content.connection === "uninitialized" ||
        this.props.content.connection === "closed" ||
        this.props.content.connection === "error"
          ? "block"
          : "none",
    };

    const closeButtonStyles = {
      display:
        this.props.content.connection === "pending" ||
        this.props.content.connection === "open"
          ? "block"
          : "none",
    };

    const errorStyles = {
      display: this.props.content.connection === "error" ? "block" : "none",
      color: "red",
    };

    const http2Display = {
      display: this.props.content.isHTTP2 ? "block" : "none",
    };

    let statusLight;

    switch (this.props.content.connection) {
      case "uninitialized":
        statusLight = <status-indicator />;
        break;
      case "pending":
        statusLight = <status-indicator intermediary pulse />;
        break;
      case "open":
        statusLight = <status-indicator positive pulse />;
        break;
      case "closed":
        statusLight = <status-indicator negative />;
        break;
      case "error":
        statusLight = <status-indicator negative />;
        break;
      default:
        console.log("not a valid connection for content object");
    }
    // TODO: remove later
    const arrowClass = !this.props.content.minimized
      ? "composer_subtitle_arrow-open"
      : "composer_subtitle_arrow-closed";
    return (
      <div>
        <div className="resreq_wrap" id={this.props.content.id}>
          <div className="title-row">
            <span
              className="primary-title highlighter title_reverse-offset"
              onClick={this.minimize}
            >
              <span>
                <img className={arrowClass} src={dropDownArrow}></img>
              </span>
              <pre>
                <p> </p>
              </pre>
              {this.props.content.request.method}
            </span>
            <span className="primary-title ">{this.props.content.url}</span>
          </div>
          {
            //----------------------------------------
            //Contitionally minimize the current reqRescontainer
            //----------------------------------------
            !this.props.content.minimized && (
              <>
                <div className="grid-7">
                  <div>
                    <input
                      id={this.props.content.id}
                      checked={this.props.content.checked}
                      className="reqres_select-radio"
                      name="resreq-select"
                      type="checkbox"
                      onChange={this.onCheckHandler}
                    />
                  </div>

                  <div className="btn-sm">
                    <OpenBtn
                      stylesObj={openButtonStyles}
                      content={this.props.content}
                      connectionStatus={this.props.content.connection}
                      reqResUpdate={this.props.reqResUpdate}
                    />
                    <CloseBtn
                      stylesObj={closeButtonStyles}
                      content={this.props.content}
                      connectionStatus={this.props.content.connection}
                    />
                  </div>

                  <div className="btn-sm">
                    <button
                      type="button"
                      className="btn resreq_remove"
                      onClick={this.removeReqRes}
                    >
                      Remove
                    </button>
                  </div>

                  <div>{statusLight}</div>

                  <span className="tertiary-title">
                    {this.props.content.connectionType}
                  </span>

                  {this.props.content.request.method === "SUBSCRIPTION" ||
                  /wss?:\/\//.test(this.props.content.protocol) ||
                  this.props.content.connectionType === "SSE" ? (
                    <></>
                  ) : (
                    <span
                      className="tertiary-title roundtrip"
                      title="The amount of time it takes to recieve response"
                    >
                      Roundtrip:{" "}
                      {this.props.content.connection === "open" ||
                      this.props.content.connection === "pending" ||
                      this.props.content.timeReceived === null
                        ? 0
                        : this.props.content.timeReceived -
                          this.props.content.timeSent}{" "}
                      ms
                    </span>
                  )}

                  <div className="tertiary-title">
                    {this.renderStatusCode()}
                  </div>
                </div>
                <div style={http2Display} className={"httptwo"}>
                  HTTP2 connection: Requests with the same host will share a
                  single HTTP2 connection.
                </div>

                <div style={errorStyles} className="networkerror">
                  There was a network error in connecting to endpoint.
                </div>
                {contentBody}
              </>
            )
          }
        </div>
      </div>
    );
  }
}

export default SingleReqResContainer;
