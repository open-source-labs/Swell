/* eslint-disable lines-between-class-members */
import React from "react";

const GRPCBodyStream = (props) => {
  // event handler that allows the client to delete a stream body
  // eslint-disable-next-line lines-between-class-members
  const deleteStream = (id) => {
    const streamsArr = props.newRequestStreams.streamsArr;
    const streamContent = props.newRequestStreams.streamContent;
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
  let streamNum;
  let streamBody;
  let deleteStreamBtn;
  // grabs the query based on the stream id/number
  const streamContent = props.newRequestStreams.streamContent[props.stream.id];
  // if none or the first stream query in the array
  if (props.stream.id === 1) {
    streamBody = (
      <textarea
        value={`${streamContent || ""}`}
        className="composer_textarea grpc"
        id="grpcBodyEntryTextArea"
        type="text"
        placeholder="Type query"
        rows={4}
        onChange={(e) => props.changeHandler(props.stream.id, e.target.value)}
      />
    );
  } else {
    // for subsequent stream query
    streamBody = (
      <textarea
        value={streamContent}
        className="composer_textarea grpc"
        id="grpcBodyEntryTextArea"
        type="text"
        placeholder="Type query"
        rows={4}
        onChange={(e) => props.changeHandler(props.stream.id, e.target.value)}
      />
    );
  }
  // displays the stream number & delete btn next to the stream body for client or bidirectionbal streaming
  if (
    props.selectedStreamingType === "CLIENT STREAM" ||
    props.selectedStreamingType === "BIDIRECTIONAL"
  ) {
    streamNum = (
      <input
        defaultValue={` Stream ${props.streamNum + 1}`}
        className="stream-number"
        type="text"
        readOnly="readonly"
      />
    );
    deleteStreamBtn = (
      <button
        className="delete-stream-btn"
        onClick={() => deleteStream(props.stream.id)}
        id={props.stream.id}
      >
        &times;
      </button>
    );
  }
  // pseudocode for the return section:
  // renders the stream body (and the stream number if for client or bidirectional stream)
  return (
    <div style={{ display: "flex" }}>
      <div>
        {deleteStreamBtn}
        {streamNum}
      </div>
      {streamBody}
    </div>
  );
};

export default GRPCBodyStream;
