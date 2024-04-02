/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dropDownArrow from '../../../../assets/icons/caret-down-tests.svg';
import dropDownArrowUp from '../../../../assets/icons/caret-up-tests.svg';

interface Props {
  contents: string;
  className?: string;
}

const EventPreview: React.FC<Props> = ({ contents }) => {
  const [showPreview, setShowPreview] = useState(false);
  const handleShowPreview = () => setShowPreview(!showPreview);
  const isDark = useSelector((state: any) => state.ui.isDark);
  
  // Added modification to make the text white when dark mode is selected
  const modifiedContents = isDark
    ? `<style>body { color: white; }</style>${JSON.parse(contents)}`
    : JSON.parse(contents);

  return (
    <div>
      <div
        className={`${
          isDark ? 'is-dark-200' : ''
        } is-rest-invert show-hide-event cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center`}
        onClick={() => {
          handleShowPreview();
        }}
      >
        {showPreview === true && (
          <>
            <span>Hide Preview</span>
            <span className="icon is-medium is-align-self-center show-hide-event-icon">
              <img
                alt=""
                src={dropDownArrowUp}
                className="is-awesome-icon"
                aria-hidden="false"
              />
            </span>
          </>
        )}
        {showPreview === false && (
          <>
            <span>View Preview</span>
            <span className="icon is-medium is-align-self-center show-hide-event-icon">
              <img
                alt=""
                src={dropDownArrow}
                className="is-awesome-icon"
                aria-hidden="false"
              />
            </span>
          </>
        )}
      </div>
      {showPreview === true && (
        <div
          style={{ height: '100vh' }}
          className={`${isDark ? 'is-dark-400' : ''} is-full`}
        >
          <iframe
            srcDoc={modifiedContents}
            title="output"
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

export default EventPreview;
