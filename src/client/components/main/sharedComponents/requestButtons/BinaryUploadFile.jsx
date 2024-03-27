import React, { useState, useRef, useEffect } from 'react';
import fs from 'fs'
import style from '../../../../../assets/style/App.scss'
// interface 


const BinaryUploadFile = (props) => {
  const [binaryData, setBinaryData] = useState(null);

  const {
    newRequestBodySet,
    newRequestBody,
    newRequestHeadersSet,
    newRequestHeaders,
  } = props;

  // handleFileChange reads file uploaded, converts to binary, and stores in state
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBinaryData(reader.result); // Store binary data in state
      };
      
      reader.readAsArrayBuffer(file) // Read file as Buffer
    }


  };

  const handleSubmit = (e) => {
    e.preventDefault();
    newRequestBodySet({
      ...newRequestBody,
      bodyContent: binaryData,
      bodyType: 'binary',
      rawType: '',
      JSONFormatted: false
    });
  };

  return (
    <form style ={{marginTop:'3px'}} onSubmit={handleSubmit}>
      <input type="file" id="chooseFileBinary" className='button no-border-please is-small is-outlined is-primary mr-3' onChange={handleFileChange} />
      <input type="submit" id="uploadFileBinary" className='button is-small is-primary-100 add-request-button no-border-please' value="Upload File" />
    </form>
  );
};

export default BinaryUploadFile;