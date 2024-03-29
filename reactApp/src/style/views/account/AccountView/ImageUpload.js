import React, { useState, useRef } from "react";

const ImageUpload = () => {
  const [, setImage] = useState("");
  const inputFile = useRef(null);

  const handleFileUpload = e => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      console.log("fileType", fileType); //ex: zip, rar, jpg, svg etc.

      setImage(files[0]);
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  //console.log(image);
  return (
    <div>
      <input
        style={{ display: "none" }}
        accept=".png,.jpg"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      <div className="button" onClick={onButtonClick}>
        Lae Pilt
      </div>
    </div>
  );
};

export default ImageUpload;
