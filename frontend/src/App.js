// App.js
import React, { useState } from 'react';
import FileForm from './components/FileForm';
import AnalysisResult from './components/AnalysisResult';
import './index.css';

function App() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const handleFileUploadSuccess = (filename) => {
        console.log("File upload success callback called with filename:", filename);
        setFileUploaded(true);
        setUploadedFileName(filename);
    };

    const handleFileChange = () => {
        setFileUploaded(false);
    };

    return (
        <div className="App">
            <header className="w-full py-4 bg-gray-800 text-white text-center">
                <span>Hi, this is Will Chien 🧋 My other projects: <a href="https://github.com/whchien" className="inline font-medium text-blue-600 underline dark:text-blue-500 underline-offset-2 decoration-600 dark:decoration-500 decoration-solid hover:no-underline">GitHub</a></span>
            </header>

            <div className="flex flex-col items-center justify-start min-h-screen pt-5">
                <FileForm
                    onFileUploadSuccess={handleFileUploadSuccess}
                    onFileChange={handleFileChange}
                />
                {fileUploaded && <AnalysisResult filename={uploadedFileName} />}
            </div>
        </div>
    );
}

export default App;
