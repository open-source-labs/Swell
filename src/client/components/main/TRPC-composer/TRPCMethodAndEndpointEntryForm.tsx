/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';

import { RootState } from '../../../toolkit-refactor/store';
import { fieldsReplaced } from '../../../toolkit-refactor/slices/newRequestFieldsSlice';

const TRPCMethodAndEndpointEntryForm = (props: any) => {
  const requestFields = useAppSelector(
    (state: RootState) => state.newRequestFields
  );
  
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

  const dispatch = useAppDispatch();
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
          className={`${
            isDark ? 'dark-address-input' : ''
          } ml-1 input input-is-medium is-info`}
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

