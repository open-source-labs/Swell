import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../actions/actions"
import * as store from "../../store";


function ResponseSize({ currentResponse }) {

  const dispatch = useDispatch();

    // Check if a headers exist. This is needed to start the application.
    if (!currentResponse ||
      !currentResponse.response ||
      !currentResponse.response.headers) 
    {
      return (null)
    }

  // Content length is received in different cases. Whichever is returned will be used as the length for the calculation.
  let length;
  if (currentResponse.response.headers["content-length"]) {
    length = "content-length"
  } else if (currentResponse.response.headers["Content-Length"]){
    length = "Content-Length"
  } else {
    return null;
  }

  // Converting content length octets into bytes
  const conversionFigure = 1023.89427;
  const octetToByteConversion =   currentResponse.response.headers[`${length}`] / conversionFigure

  
  const size =  Math.round((octetToByteConversion + Number.EPSILON) * 100) / 100

  const data = useSelector(store => store.business.dataobj); 

// Dispatch to redux store to be accessed by graphs
// store.default.dispatch(actions.saveCurrentResponseData(reqResObj));

    return (
        <div className='response-size-placement'>
          {`${size}kb`}
        </div>
        ) 
  }

export default ResponseSize
