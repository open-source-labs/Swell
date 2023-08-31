import React from 'react';
import { useAppDispatch, useAppSelector } from '~/toolkit/store';

import { RequestWebRTC } from '../../../../types';
import TextCodeArea from '../sharedComponents/TextCodeArea';

import { newRequestWebRTCSet } from '../../../toolkit-refactor/slices/newRequestSlice';
import webrtcPeerController from '../../../controllers/webrtcPeerController';

const WebRTCServerEntryForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const newRequestWebRTC = useAppSelector(
    (store) => store.newRequest.newRequestWebRTC
  );

  return (
    <div className="mt-3">
      <div style={{ position: 'relative' }}>
        <TextCodeArea
          mode={'application/json'}
          value={newRequestWebRTC.webRTCOffer || ''}
          height={'85px'}
          onChange={(value, viewUpdate) => {
            dispatch(
              newRequestWebRTCSet({ ...newRequestWebRTC, webRTCOffer: value })
            );
          }}
          placeholder={'Click "Get Offer" or paste in Offer SDP'}
          readOnly={true}
        />
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.writeText(newRequestWebRTC.webRTCOffer);
          }}
        >
          Copy
        </button>
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.readText().then((text) =>
              dispatch(
                newRequestWebRTCSet({
                  ...newRequestWebRTC,
                  webRTCOffer: text,
                })
              )
            );
          }}
        >
          Paste
        </button>
        <button
          className="button is-normal is-primary-100 add-request-button no-border-please"
          style={{ margin: '10px' }}
          onClick={() => {
            webrtcPeerController.createOffer(newRequestWebRTC);
          }}
        >
          Get Offer
        </button>
      </div>
      {/* Code box for Answer */}
      <div style={{ position: 'relative' }}>
        <TextCodeArea
          mode={'application/json'}
          value={newRequestWebRTC.webRTCAnswer || ''}
          height={'85px'}
          onChange={(value, viewUpdate) => {
            dispatch(
              newRequestWebRTCSet({ ...newRequestWebRTC, webRTCAnswer: value })
            );
          }}
          placeholder={'Answer here'}
          readOnly={true}
        />
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.writeText(newRequestWebRTC.webRTCAnswer);
          }}
        >
          Copy
        </button>
        <button
          className="button is-small is-rest-invert"
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            width: '58px',
          }}
          onClick={() => {
            navigator.clipboard.readText().then((text) =>
              dispatch(
                newRequestWebRTCSet({
                  ...newRequestWebRTC,
                  webRTCAnswer: text,
                })
              )
            );
          }}
        >
          Paste
        </button>
        {/* ANSWER BUTTON IS WORK-IN-PROGRESS */}
        {/* <button
        id="webRTButton"
        className="button is-normal is-primary-100 add-request-button  no-border-please"
        style={{ margin: '10px' }}
        onClick={() => {
          createAnswer(newRequestWebRTC);
        }}
      >
        Get Answer
      </button> */}
        {/* {warningMessage ? <div>{warningMessage.body}</div> : null} */}
      </div>
    </div>
  );
};

export default WebRTCServerEntryForm;
