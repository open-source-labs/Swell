import React, { useState } from 'react';
import { type $TSFixMe, type NewRequestStreams } from '~/types';
import GRPCBodyStream from './GRPCBodyStream';

interface Props {
  newRequestStreams: NewRequestStreams;
  newRequestStreamsSet: React.Dispatch<React.SetStateAction<NewRequestStreams>>;
  selectedService: string | null;
  selectedRequest: string | null;
  selectedStreamingType: string | null;
  history: $TSFixMe;
}

const GRPCBodyEntryForm: React.FC<Props> = (props) => {
  const [show, toggleShow] = useState<boolean>(true);

  // add additional streams only for CLIENT or BIDIRECTIONAL streaming
  const addStream = (): void => {
    const streamsArr = structuredClone(props.newRequestStreams.streamsArr);
    const streamContent = structuredClone(
      props.newRequestStreams.streamContent
    );
    // save query of initial stream body
    const firstBodyQuery: $TSFixMe = props.newRequestStreams.initialQuery;
    // construct new stream body obj & push into the streamsArr
    const newStream: $TSFixMe = {};
    newStream.id = props.newRequestStreams.count;
    newStream.query = firstBodyQuery;
    streamsArr.push(newStream);
    // push query of initial stream body into streamContent array
    streamContent.push(firstBodyQuery);
    // update mew state in the store
    props.newRequestStreamsSet({
      ...props.newRequestStreams,
      streamsArr,
      count: streamsArr.length,
      streamContent,
    });
  };

  // event handler that updates state in the store when typing into the stream query body
  const onChangeUpdateStream = (streamID: $TSFixMe, value: $TSFixMe) => {
    // props.saveChanges(false);
    const streamsArr = [...props.newRequestStreams.streamsArr];
    const streamContent = [...props.newRequestStreams.streamContent];
    for (let i = 0; i < streamsArr.length; i++) {
      if (streamsArr[i].id === streamID) {
        streamsArr[streamID] = { ...streamsArr[streamID], query: value };
        streamContent[streamID] = value;
        props.newRequestStreamsSet({
          ...props.newRequestStreams,
          streamsArr,
          streamContent,
        });
      }
    }
  };

  // for each stream body in the streamArr, render the GRPCBodyStream component
  const streamArr = props.newRequestStreams.streamsArr.map(
    (stream: $TSFixMe, index: $TSFixMe) => (
      <GRPCBodyStream
        newRequestStreams={props.newRequestStreams}
        newRequestStreamsSet={props.newRequestStreamsSet}
        selectedPackage={props.newRequestStreams.selectedPackage}
        selectedService={props.selectedService}
        selectedRequest={props.selectedRequest}
        selectedStreamingType={props.selectedStreamingType}
        changeHandler={onChangeUpdateStream}
        stream={stream}
        key={index}
        streamNum={index}
        history={props.history}
      />
    )
  );

  //if client stream or bidirectional, the add stream btn will be rendered below the stream bodies
  let addStreamBtn;
  if (
    props.selectedStreamingType === 'CLIENT STREAM' ||
    props.selectedStreamingType === 'BIDIRECTIONAL'
  ) {
    addStreamBtn = (
      <button
        className="button is-small add-header-or-cookie-button"
        onClick={addStream}
      >
        Add Stream
      </button>
    );
  }
  /*
    pseudocode for the return section
     - first div renders the arrow button along with the title "Body"
     - renders the stream bodies depending on how many there are in the streamArr
     - if client stream or bidirectional, the add stream btn will be rendered below the stream bodies
     */
  return (
    <div className="mt-1">
      <div className="composer-section-title">Body</div>
      <section>{streamArr}</section>
      {addStreamBtn}
    </div>
  );
};

export default GRPCBodyEntryForm;
