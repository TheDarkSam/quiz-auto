import ExcelUploader from './components/FileUploader';

export default function App() {
  function handleFileLoaded(data: any[][]) {
    console.log(data);
  }
  return (
    <div>
      <h1>Upload de arquivo XLSX</h1>
      <ExcelUploader onFileLoaded={handleFileLoaded} />
    </div>
  );
}