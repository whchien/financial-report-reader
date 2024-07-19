// FileForm.js
import React, { useState } from 'react';


function FileForm({ onFileUploadSuccess, onFileChange }) {
    const [file, setFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const endpoint = process.env.REACT_APP_UPLOAD_ENDPOINT;

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setResponseMessage("");
            onFileChange()
        } else {
            setFile(null);
            setResponseMessage("Please select a PDF file.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setResponseMessage("No file selected or incorrect file type.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file_upload', file);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedFileName(data.filename);
                setResponseMessage(data.status);
                console.log("File uploaded successfully");
                onFileUploadSuccess(data.filename);
            } else {
                console.error("Failed to upload file.");
                setResponseMessage("Failed to upload file.");
            }

        } catch (error) {
            console.error(error);
            setResponseMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

        return  (
        <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">Annual Report Reader</h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Advanced AI tool to extract key financial metrics from PDF reports, such as Profit Margin and Operating Cash Flow.</p>

            <form onSubmit={handleSubmit} className="mb-4 max-w-xs mx-auto">
                <div className="m-4">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileInputChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                    />
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                    {loading && (
                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>
                    )}
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
            {responseMessage && <p className="text-green-500">{responseMessage}</p>}
            {uploadedFileName && <p className="text-gray-700 text-xs">✅ Document ready: {uploadedFileName}</p>}
        </div>
    );
}

export default FileForm;
