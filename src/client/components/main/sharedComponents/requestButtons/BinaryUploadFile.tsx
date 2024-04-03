import React, { useState, useRef, useEffect } from 'react';
import fs from 'fs'
import style from '../../../../../assets/style/App.scss'
import { NewRequestBody } from '../../../../../types';
import { NewRequestHeaders } from '../../../../../types';
import { any } from 'prop-types';
// interface 


interface Props {
  newRequestBodySet: (value: any) => void;
  newRequestBody: NewRequestBody;
  newRequestHeadersSet: (value: any) => void;
  newRequestHeaders: NewRequestHeaders;
}

const BinaryUploadFile = (props: Props)  => {
  const [binaryData, setBinaryData] = useState<ArrayBuffer | null>(null);
  // isChosen checks if file has been chosen
  const [isChosen, setIsChosen] = useState<boolean>(false);
  // isUploaded checks if 'Upload File' button has been clicked
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const {
    newRequestBodySet,
    newRequestBody,
    newRequestHeadersSet,
    newRequestHeaders,
  } = props;

  // handleFileChange reads file uploaded, converts to binary, and stores in state
  const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBinaryData(reader.result as ArrayBuffer); // Store binary data in state
      };
      
      reader.readAsArrayBuffer(file) // Read file as Buffer
    }


  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // once 'Upload File' clicked setIsUploaded to true
    setIsUploaded(true);
    // only if file has been chosen and then 'Upload File' clicked
    // setIsChosen to true
    if (binaryData) setIsChosen(true);
    newRequestBodySet({
      ...newRequestBody,
      bodyContent: binaryData,
      bodyType: 'binary'
    });
  };

  return (
    <div style ={{display:'flex'}}>
      <form style ={{marginTop:'7px'}} onSubmit={handleSubmit}>
        <input type="file" style = {{ padding:'4px 5px 6px 5px'}} id="chooseFileBinary" className='button is-small is-outlined is-primary mr-3' onChange={handleFileChange} />
        <input type="submit" id="uploadFileBinary" className='button is-small is-outlined is-primary' value="Upload File" />
      </form>
      <div id='isUploaded' style={{margin:'2px 0px 0px 15px', padding:'9px 5px 9px 5px'}}>
        {isUploaded
        ?
          isChosen 
          ?
            <h1>File Uploaded ✅</h1>
          :
            <h1>Must Choose File ⏸️</h1>
        :
          <h1>File Not Uploaded ❌</h1>
        }
      </div>
    </div>
  );
};

export default BinaryUploadFile;