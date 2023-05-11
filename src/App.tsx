import ExcelUploader from './components/FileUploader';

export default function App() {
  function handleFileLoaded(data: any[][]) {
    return data
  }
  return (
    <div>
      <head className='bg-zinc-400 rounded h-40'>
        <h1>Convert table excel</h1>
      </head>
      <ExcelUploader onFileLoaded={handleFileLoaded} />
    </div>
  );
}