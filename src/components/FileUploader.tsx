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

  const renderTable = () => {
    if (tableData.length === 0) return null;

    const headers = tableData[0];
    const filteredHeaders = headers.filter(header => header.startsWith("Questionário"));
    const questionarioHeaders = headers.filter(header => header.startsWith("Questionário"));
    const nomeHeaders = ["Nome", "Sobrenome"];

    const filteredData = tableData.slice(1).map(row => {
      const dataRow: Record<string, any> = {};
      let nomeCompleto = '';
      for (let i = 0; i < headers.length; i++) {
        if (nomeHeaders.includes(headers[i])) {
          nomeCompleto += row[i] + ' ';
        } else if (questionarioHeaders.includes(headers[i])) {
          if (typeof row[i] === 'string') {
            const valor = row[i].trim();
            dataRow[headers[i]] = valor !== '-' ? parseInt(valor) : 0;
          } else {
            dataRow[headers[i]] = row[i];
          }
        }
      }
      dataRow['Nome Completo'] = nomeCompleto.trim();
      return dataRow;
    });
    
    const sortedData = filteredData.map(row => {
      const notas = questionarioHeaders.map(header => row[header]);
      const sortedNotas = notas.sort((a, b) => b - a);
      const numNotas = sortedNotas.length;
      const numNotas75Percent = Math.floor(numNotas * 0.75);
      const notas75Percent = sortedNotas.slice(0, numNotas75Percent);
      const somaNotas75Percent = notas75Percent.reduce((acc, nota) => acc + nota, 0);
      const mediaNotas75Percent = somaNotas75Percent / notas75Percent.length;
      return { 'Nome Completo': row['Nome Completo'], 'Média': mediaNotas75Percent * 0.2 };
    });
    
      console.table(sortedData);

    return (
      <table>
  <thead>
    <tr>
      <th>Nome Completo</th>
      <th>Média</th>
    </tr>
  </thead>
  <tbody>
    {sortedData.map((row, index) => (
      <tr key={index}>
        <td>{row['Nome Completo']}</td>
        <td>{row['Média']}</td>
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
