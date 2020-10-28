/* eslint-disable lines-between-class-members */
import React, { useState, useEffect } from "react";
import TextCodeAreaEditable from './TextCodeAreaEditable';

const GRPCBodyStream = (props) => {
  const [showError, setError] = useState(null);
  // event handler that allows the client to delete a stream body
  // eslint-disable-next-line lines-between-class-members
  const deleteStream = (id) => {
    if (props.newRequestStreams.streamsArr.length === 1) {
      setError("Error: Must have at least one stream body");
      return;
    }
    const streamsArr = [...props.newRequestStreams.streamsArr];
    const streamContent = [...props.newRequestStreams.streamContent];
    // delete the query from the streamContent arr and the stream body from streamsArr
    streamContent.splice(id, 1);
    streamsArr.splice(id, 1);
    // reassign the id num of each subsequent stream body in the streamsArr after the deletion
    for (let i = id; i < streamsArr.length; i++) {
      streamsArr[i].id = i;
    }
    // update the state in the store
    props.setNewRequestStreams({
      ...props.newRequestStreams,
      streamsArr,
      count: streamsArr.length,
      streamContent,
    });
  };

  useEffect(() => {
    if (showError) setError(null);
  }, [props.newRequestStreams]);

  // grabs the query based on the stream id/number
  const streamContentID =
    props.newRequestStreams.streamContent[props.stream.id];
  // if none or the first stream query in the array
  const streamBody = (
    <TextCodeAreaEditable
      value={`${streamContentID || ""}`}
      theme = "neo grpc"
      mode="application/json"
      onChange={(editor, data, value) => props.changeHandler(props.stream.id, value)}
    />
  );
  
  // displays the stream number & delete btn next to the stream body for client or bidirectionbal streaming
  let streamNum;
  let deleteStreamBtn;
  if (
    props.selectedStreamingType === "CLIENT STREAM" ||
    props.selectedStreamingType === "BIDIRECTIONAL"
  ) {
    streamNum = (
      <span>
        Stream {props.streamNum + 1}
      </span>
    );
    deleteStreamBtn = (
      <button
        className="delete"
        onClick={() => deleteStream(props.stream.id)}
        id={props.stream.id}
      ></button>
    );
  }

  // pseudocode for the return section:
  // renders the stream body (and the stream number if for client or bidirectional stream)
  return (
    <div>
      <div className="warningMessage">{showError}</div>
      <div >
        <div>
          {deleteStreamBtn}
          {streamNum}
        </div>
        {streamBody}
      </div>
    </div>
  );
};

export default GRPCBodyStream;
