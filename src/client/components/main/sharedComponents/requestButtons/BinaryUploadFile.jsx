import React, { useState, useRef, useEffect } from 'react';
import fs from 'fs'
// interface 


const BinaryUploadFile = () => {
  const [binaryData, setBinaryData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBinaryData(reader.result); // Store binary data in state
      };
      reader.readAsBinaryString(file); // Read file as binary string
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a TextEncoder instance
    const textEncoder = new TextEncoder();

    // Convert the binary string to binary data
    const data = textEncoder.encode(binaryData);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <input type="submit" value="Upload File" />
    </form>
  );
};

export default BinaryUploadFile;