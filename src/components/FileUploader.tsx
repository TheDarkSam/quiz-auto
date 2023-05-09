import { useState } from 'react';
import * as XLSX from 'xlsx';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [sheetData, setSheetData] = useState([]);

  const handleFileUpload = (event) => {
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
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const dataInSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setSheetData(dataInSheet);
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
        Drop file here
      </div>
      <button onClick={handleFileSubmit}>Submit</button>
      {sheetData.length > 0 && (
        <table>
          <thead>
            <tr>
              {sheetData[0].map((cellData) => (
                <th key={cellData}>{cellData}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.slice(1).map((rowData, index) => (
              <tr key={index}>
                {rowData.map((cellData, index) => (
                  <td key={index}>{cellData}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FileUploader;
