import React, { useState, useRef, useEffect } from 'react';
import fs from 'fs'
// interface 


const BinaryUploadFile = () => {

  const test = (e :any) => {
    e.preventDefault();
    // Assuming you have a file path
    const filePath = e.target[0].value;

    // Read the file synchronously as binary
    const binaryData = fs.readFileSync(filePath, 'binary');

    // Log the binary data
    console.log(binaryData);
  }

  return (
    <form onSubmit = {(event) => test(event)}>
        <input type="file" id="myFile" name="filename"/>
        <input type="submit" value='Upload File' />
    </form>
  )
}

export default BinaryUploadFile;