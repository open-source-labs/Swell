import React from "react";
import { useDropzone } from "react-dropzone";
import TextCodeAreaEditable from "../composer/NewRequest/TextCodeAreaEditable";

export default function ImageDropzone({ onFileChange }) {
  console.log("onfilechange==>", onFileChange);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  console.log("accepted files=>", acceptedFiles);

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>image {file.name} uploaded</li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <input
          className="ml-1 mr-1 input is-small"
          placeholder={`Drag 'n' drop your image here, or click to select a file`}
        />
      </div>
      <aside>
        {/* <h4>Files</h4> */}
        <ul>{files}</ul>
      </aside>
    </section>
  );
}
