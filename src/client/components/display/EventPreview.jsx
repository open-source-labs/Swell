import React, { useState } from "react";
import dropDownArrow from "../../../assets/icons/caret-down-tests.svg";
import dropDownArrowUp from "../../../assets/icons/caret-up-tests.svg";

const EventPreview = ({ contents }) => {

  const [showPreview, setShowPreview] = useState(false);
  const handleShowPreview = () => setShowPreview(!showPreview);

  return (
    <div>
      <div
        className="is-rest-invert show-hide-event cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center"
        onClick={() => {
          handleShowPreview();
        }}
      >
      {showPreview === true &&
        <>
          <span>Hide Preview</span>
          <span className="icon is-medium is-align-self-center show-hide-event-icon">
            <img
              alt=''
              src={dropDownArrowUp}
              className="is-awesome-icon"
              aria-hidden="false"
            />
          </span>
        </>
      }
      {showPreview === false &&
        <>
          <span>View Preview</span>
          <span className="icon is-medium is-align-self-center show-hide-event-icon">
            <img
              alt=''
              src={dropDownArrow}
              className="is-awesome-icon"
              aria-hidden="false"
            />
          </span>
        </>
      }
      </div>
      {showPreview === true &&
      <div
        className='is-full'
        style={{height: '100vh'}}

      >
        <iframe 
        srcDoc={JSON.parse(contents)}
        title='output'
        width='100%'
        height='100%'
        />
      </div>
      }
    </div>
    )
  }

  export default EventPreview;