import { ChangeEvent, useState } from 'react';
import * as XLSX from 'xlsx'

function FileUploader() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    setFile(uploadedFile);
  };

  const handleFileSubmit = () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      console.log(workbook);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <div
        onDrop={handleFileDrop}
        onDragOver={(event) => event.preventDefault()}
        style={{ width: 200, height: 200, backgroundColor: 'gray' }}
      >
        Arraste o arquivo aqui
      </div>
      <button onClick={handleFileSubmit}>Submit</button>
    </div>
  );
}

export default FileUploader;
