import * as XLSX from 'xlsx';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  onFileLoaded: (data: any[][]) => void;
};

export default function ExcelUploader({ onFileLoaded }: Props) {
  const [tableData, setTableData] = useState<any[][]>([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      const binaryStr = reader.result;
      if (typeof binaryStr === 'string') {
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setTableData(data);
        onFileLoaded(data);0
      }
    };
    acceptedFiles.forEach((file: any) => reader.readAsBinaryString(file));
  }, [onFileLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const renderTable = () => {
    if (tableData.length === 0) return null;

    const headers = tableData[0];
    const filteredHeaders = headers.filter((header: string) => header.startsWith('Nome'));
    const sobrenome = headers.filter((header: string) => header.startsWith('Sobrenome'));
    const questionario = headers.filter((header: string) => header.startsWith('Questionário'));
    filteredHeaders.push(sobrenome);
    filteredHeaders.push(questionario);

    return (
      <table>
        <thead>
          <tr>
            {filteredHeaders.map((header: string) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row: any[], index: number) => (
            <tr key={index}>
              {filteredHeaders.map((header: string) => (
                <td key={header}>{row[headers.indexOf(header)]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Arraste o arquivo aqui ...</p> : <p>Arraste o arquivo XLSX aqui, ou clique para selecionar o arquivo</p>}
      </div>
      {renderTable()}
    </div>
  );
}
