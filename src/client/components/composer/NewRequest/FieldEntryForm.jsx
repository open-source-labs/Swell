/* eslint-disable default-case */
import React, { useRef } from "react";
import ProtocolSelect from "./ProtocolSelect.jsx";

const FieldEntryForm = ({warningMessage, setComposerWarningMessage, setNewRequestFields, newRequestFields, 
  setNewRequestBody, newRequestBody,	setNewRequestHeaders, newRequestStreams, newRequestHeaders:  { headersArr } }) => {
  // this.handleKeyPress = this.handleKeyPress.bind(this); <-- never used?

  const onChangeHandler = (e, property, network) => {
    const value = e.target.value;
    if (warningMessage.uri) {
      const warningMessage = { ...warningMessage };
      delete warningMessage.uri;
      setComposerWarningMessage({ ...warningMessage });
    }
    switch (property) {
      case "url": {
        const url = value;
        if (network === 'rest') {
          setNewRequestFields({
            ...newRequestFields,
            restUrl: url,
            url,
          });
        }
        if (network === 'ws') {
          setNewRequestFields({
            ...newRequestFields,
            wsUrl: url,
            url,
          });
        }
        if (network === 'graphQL') {
          setNewRequestFields({
            ...newRequestFields,
            gqlUrl: url,
            url,
          });
        }
        if (network === 'grpc') {
          setNewRequestFields({
            ...newRequestFields,
            grpcUrl: url,
            url,
          });
        }
        break;
      }
      case "protocol": {
        setComposerWarningMessage({});

        if (network === 'graphQL') {
          //if graphql
          setNewRequestFields({
            ...newRequestFields,
            protocol: "",
            url: newRequestFields.gqlUrl,
            method: "QUERY",
            graphQL: true,
            gRPC: false,
            network: 'graphQL'
          });
          setNewRequestBody({
            //when switching to GQL clear body
            ...newRequestBody,
            bodyType: "GQL",
            bodyContent: `query {

}`,
            bodyVariables: ""
          });
          break;
        } else if (network === 'rest') {
          //if http/s
          setNewRequestFields({
            ...newRequestFields,
            protocol: "",
            url: newRequestFields.restUrl,
            method: "GET",
            graphQL: false,
            gRPC: false,
            network: 'rest'
          });
          setNewRequestBody({
            //when switching to http clear body
            ...newRequestBody,
            bodyType: "none",
            bodyContent: ``,
          });
          break;
        } else if (network === 'grpc') {
          //if gRPC
          setNewRequestFields({
            ...newRequestFields,
            protocol: "",
            url: newRequestFields.grpcUrl,
            method: "",
            graphQL: false,
            gRPC: true,
            network: 'grpc'
          });
          setNewRequestBody({
            //when switching to gRPC clear body
            ...newRequestBody,
            bodyType: "GRPC",
            bodyContent: ``,
          });
          break;
        } else if (network === 'ws') {
          //if ws
          setNewRequestFields({
            ...newRequestFields,
            protocol: value,
            url: newRequestFields.wsUrl,
            method: "",
            graphQL: false,
            gRPC: false,
            network: 'ws'
          });
          setNewRequestBody({
            ...newRequestBody,
            bodyType: "none",
            bodyContent: "",
          });
        }
        //removes Content-Type Header
        const filtered = headersArr.filter(
          (header) => header.key.toLowerCase() !== "content-type"
        );
        setNewRequestHeaders({
          headersArr: filtered,
          count: filtered.length,
        });
        break;
      }
      case "method": {
        const methodReplaceRegex = new RegExp(
          `${newRequestFields.method}`,
          "mi"
        );
        let newBody = "";
        if (!newRequestFields.graphQL && !newRequestFields.gRPC) {
          //if one of 5 http methods (get, post, put, patch, delete)
          setNewRequestBody({
            ...newRequestBody,
            bodyType: "raw",
            bodyContent: "",
          });
        }
        // GraphQL features
        else if (value === "QUERY") {
          //if switching to graphQL = true
          if (!newRequestFields.graphQL)
            newBody = `query {

}`;
          else
            newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
              ? newRequestBody.bodyContent.replace(
                  methodReplaceRegex,
                  "query"
                )
              : `query ${newRequestBody.bodyContent}`;

          setNewRequestBody({
            ...newRequestBody,
            bodyContent: newBody,
            bodyIsNew: false,
          });
        } else if (value === "MUTATION") {
          newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
            ? newRequestBody.bodyContent.replace(
                methodReplaceRegex,
                "mutation"
              )
            : `mutation ${newRequestBody.bodyContent}`;

          setNewRequestBody({
            ...newRequestBody,
            bodyContent: newBody,
            bodyIsNew: false,
          });
        } else if (value === "SUBSCRIPTION") {
          newBody = methodReplaceRegex.test(newRequestBody.bodyContent)
            ? newRequestBody.bodyContent.replace(
                methodReplaceRegex,
                "subscription"
              )
            : `subscription ${newRequestBody.bodyContent}`;

          setNewRequestBody({
            ...newRequestBody,
            bodyContent: newBody,
            bodyIsNew: false,
          });
        }

        //always set new method
        setNewRequestFields({
          ...newRequestFields,
          method: value,
          protocol: value === "SUBSCRIPTION" ? "ws://" : "",
          // url: value === "SUBSCRIPTION" ? "ws://" : "https://",
        });
      }
    }
  };

  const borderColor = warningMessage.uri ? "red" : "white";
  const inputEl = useRef(null);
  const grpcStreamLabel = newRequestStreams.selectedStreamingType || 'STREAM' 
  return(
		<div>
			<ProtocolSelect
        currentProtocol={newRequestFields.protocol}
        onChangeHandler={onChangeHandler}
        graphQL={newRequestFields.graphQL}
        gRPC={newRequestFields.gRPC}
        setComposerWarningMessage={setComposerWarningMessage}
      />
		
		<div>

			{/* below conditional method selection rendering for http/s */}
			{newRequestFields.network === 'rest' && (
				<div className="composer_method_url_container">
					<select
						style={{ display: "block" }}
						value={newRequestFields.method}
						className="composer_method_select http"
						onChange={(e) => {
							onChangeHandler(e, "method");
						}}
					>
						<option value="GET">GET</option>
						<option value="POST">POST</option>
						<option value="PUT">PUT</option>
						<option value="PATCH">PATCH</option>
						<option value="DELETE">DELETE</option>
					</select>
					<input
					className="composer_url_input"
					type="text"
					placeholder="URL"
					style={{ borderColor }}
					value={newRequestFields.restUrl}
					onChange={(e) => {
						onChangeHandler(e, "url", newRequestFields.network);
					}}
					ref={(input) => {
						inputEl.current = input;
					}}
					/>
				</div>
			)}

			{/* below conditional rendering for ws */}
			{newRequestFields.network === 'ws' && (
				<input
				className="composer_url_input"
				type="text"
				placeholder="URL"
				style={{ borderColor }}
				value={newRequestFields.wsUrl}
				onChange={(e) => {
					onChangeHandler(e, "url", newRequestFields.network);
				}}
				ref={(input) => {
					inputEl.current = input;
				}}
				/>
			)}

			{/* below conditional method selection rendering for graphql */}
			{newRequestFields.network === 'graphQL' && (
				<div className="composer_method_url_container">
					<select
						style={{ display: "block" }}
						value={newRequestFields.method}
						className="composer_method_select gql"
						onChange={(e) => {
							onChangeHandler(e, "method");
						}}
					>
						<option value="QUERY">QUERY</option>
						<option value="MUTATION">MUTATION</option>
						<option value="SUBSCRIPTION">SUBSCRIPTION</option>
					</select>
					<input
          className="composer_url_input"
          type="text"
          placeholder="URL"
          style={{ borderColor }}
          value={newRequestFields.gqlUrl}
          onChange={(e) => {
            onChangeHandler(e, "url", newRequestFields.network);
          }}
          ref={(input) => {
            inputEl.current = input;
          }}
          />
				</div>
			)}

        {/* gRPC stream type button */}
        {newRequestFields.network === 'grpc' && (
          <div className="composer_method_url_container">
						<button
							style={{ display: "block" }}
							id="stream"
							value="STREAM"
							className="composer_method_select grpc"
						>
							{grpcStreamLabel}
						</button>
						<input
						className="composer_url_input"
						type="text"
						placeholder="URL"
						style={{ borderColor }}
						value={newRequestFields.grpcUrl}
						onChange={(e) => {
							onChangeHandler(e, "url", newRequestFields.network);
						}}
						ref={(input) => {
							inputEl.current = input;
						}}
						/>
					</div>
        )}

      </div>

      {warningMessage.uri && (
        <div className="warningMessage">{warningMessage.uri}</div>
      )}

		</div>
	)
};

export default FieldEntryForm;