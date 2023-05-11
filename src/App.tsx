import ExcelUploader from './components/FileUploader';

export default function App() {
  function handleFileLoaded(data: any[][]) {
    console.log(data);
  }
  return (
    <div>
      <ExcelUploader onFileLoaded={handleFileLoaded} />
    </div>
  );
}