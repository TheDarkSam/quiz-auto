import * as XLSX from 'xlsx';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
    onFileLoaded: (data: File[][]) => void;
};

export default function ExcelUploader({ onFileLoaded }: Props) {
    const [tableData, setTableData] = useState<string[][]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const reader = new FileReader();
        reader.onload = () => {
            const binaryStr = reader.result;
            if (typeof binaryStr === 'string') {
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data: File[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as File[][];
                const data2 = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                setTableData(data2 as string[][]);
                onFileLoaded(data);
            }
        };
        acceptedFiles.forEach((file: File) => reader.readAsBinaryString(file));
    }, [onFileLoaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const renderTable = () => {
        if (tableData.length === 0) return null;

        const headers = tableData[0];
        const questionarioHeaders = headers.filter(header => header.startsWith("Questionário"));
        const nomeHeaders = ["Nome", "Sobrenome"];

        interface DataRow {
          [key: string]: string | number;
        }

        const filteredData = tableData.slice(1).map(row => {
            const dataRow: DataRow = {};
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
            const sortedNotas = notas.sort((a, b) => Number(b) - Number(a));
            const numNotas = sortedNotas.length;
            const numNotas75Percent = Math.floor(numNotas * 0.75);
            const notas75Percent = sortedNotas.slice(0, numNotas75Percent);
            const somaNotas75Percent = notas75Percent.reduce((acc, nota) => Number(acc) + Number(nota), 0);
            const mediaNotas75Percent = Number(somaNotas75Percent) / notas75Percent.length;
            return { 'Nome Completo': row['Nome Completo'], 'Média': mediaNotas75Percent * 0.2 };
        });

        console.table(sortedData);

        return (
            <div className='flex min-h-screen flex-col gap-6 p-6'>
                <head className='bg-zinc-400 rounded h-40'>
                    <h1>Convert table excel</h1>
                </head>
    
                <main className='bg-zinc-400 rounded flex-1'>
                    <table className="w-full min-w-[400px]">
                        <thead>
                            <tr>
                                <th className="bg-gray-600 p-4 text-left text-gray-200 text-xl ease-linear rounded-t">
                                    Nome Completo
                                </th>
                                <th className="bg-gray-600 p-4 text-left text-gray-200 text-xl ease-linear rounded-t">
                                    Média
                                </th>
                            </tr>
                        </thead>
                        <tbody className="flex-col items-center justify-center gap-2 text-gray-100">
                            {sortedData.map((row, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-400' : 'bg-gray-500'}`} >
                                    <td className={" p-4 text-xl border-t-4 border-gray-950"}>
                                        {row['Nome Completo']}
                                    </td>
                                    <td className=" p-4 text-xl border-t-4 border-gray-950">{row['Média'].toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>   
            </div>

        );
    };

    return (
        <div>
            <div {...getRootProps()} className='bg-gray-400 w-52 p-3 rounded m-3'>
                <input {...getInputProps()} />
                {isDragActive ? <span>Arraste o arquivo aqui ...</span> : <span>Arraste o arquivo XLSX aqui, ou clique para selecionar o arquivo</span>}
            </div>
            {renderTable()}
        </div>
    );
}