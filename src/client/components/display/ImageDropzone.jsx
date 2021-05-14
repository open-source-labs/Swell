import React from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone({ onFileChange }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>image {file.name} uploaded</li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input id="wsFileInput" {...getInputProps()} />
        <input
          className="ml-1 mr-1 input is-small"
          id="wsDragNdrop"
          placeholder={`Drag 'n' drop your image here, or click to select a file`}
          onFileChange={onFileChange(acceptedFiles)}
        />
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}
