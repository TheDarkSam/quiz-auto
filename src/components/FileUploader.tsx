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
        onFileLoaded(data);
      }
    };
    acceptedFiles.forEach((file: any) => reader.readAsBinaryString(file));
  }, [onFileLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  tableData.shift()
  

    return (
        <>
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Arraste o arquivo aqui ...</p>
            ) : (
                <p>Arraste o arquivo XLSX aqui, ou clique para selecionar o arquivo</p>
            )}
        </div>
            <div>{tableData.map(item => (
                <p>{item}</p>
        ))}</div>
        </>

    );
  }

