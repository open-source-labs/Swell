/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../../toolkit-refactor/store';
import { fieldsReplaced } from '../../../toolkit-refactor/slices/newRequestFieldsSlice';

const TRPCMethodAndEndpointEntryForm = (props: any) => {
  const requestFields = useSelector(
    (state: RootState) => state.newRequestFields
  );
  const dispatch = useDispatch();
  const clearWarningIfApplicable = () => {
    if (props.warningMessage.uri) props.setWarningMessage({});
  };
  const urlChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearWarningIfApplicable();
    //update global redux store everytime user make changes to url
    const url: string = e.target.value;

    dispatch(
      fieldsReplaced({
        ...requestFields,
        url: url,
      })
    );
  };
  return (
    <>
      <div
        className="is-flex is-justify-content-center"
        style={{ padding: '10px' }}
      >
        <div id="tRPCButton" className="no-border-please button is-webrtc">
          <span>tRPC</span>
        </div>
        <input
          className="ml-1 input input-is-medium is-info"
          type="text"
          value={requestFields.url}
          placeholder="Enter your url here"
          onChange={(e) => {
            urlChangeHandler(e);
          }}
        />
      </div>
      {props.warningMessage.uri && (
        <div className="warningMessage">{props.warningMessage.uri}</div>
      )}
    </>
  );
};

export default TRPCMethodAndEndpointEntryForm;

