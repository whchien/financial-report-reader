import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function AnalysisResult({ filename }) {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const endpoint = process.env.REACT_APP_ANALYZE_ENDPOINT;

    const handleAnalyze = async () => {
        setLoading(true);
        setResponseMessage("")
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: "be_verified",
                    filename: filename
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data);
                console.log("Analysis result:", data);
            } else {
                console.error("Failed to analyze report.");
                setResponseMessage("Failed to analyze report.");
            }

        } catch (error) {
            console.error(error);
            setResponseMessage("An error occurred.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleDownload = () => {
        if (!analysisResult) return;

        const ws = XLSX.utils.json_to_sheet([
            { Metric: 'gross_profit_margin', Result: analysisResult.gross_profit_margin },
            { Metric: 'net_profit_margin', Result: analysisResult.net_profit_margin },
            { Metric: 'working_capital', Result: analysisResult.working_capital },
            { Metric: 'current_ratio', Result: analysisResult.current_ratio },
            { Metric: 'quick_ratio', Result: analysisResult.quick_ratio },
            { Metric: 'debt_to_equity_ratio', Result: analysisResult.debt_to_equity_ratio },
            { Metric: 'inventory_turnover', Result: analysisResult.inventory_turnover },
            { Metric: 'total_asset_turnover', Result: analysisResult.total_asset_turnover },
            { Metric: 'return_on_equity', Result: analysisResult.return_on_equity },
            { Metric: 'return_on_assets', Result: analysisResult.return_on_assets },
            { Metric: 'operating_cash_flow', Result: analysisResult.operating_cash_flow },
        ]);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Analysis Result');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, 'analysis_result.xlsx');
    };

    return (
        <div className="text-center mt-4">
            <button
                onClick={handleAnalyze}
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                disabled={loading}
            >
                {loading && (
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                )}
                {loading ? "Analyzing..." : "Analyze Report"}
            </button>

            {responseMessage && <p className="text-red-500">{responseMessage}</p>}

            {analysisResult && (
                <div className="mb-4 max-w-s mx-auto">
                    <h2 className="text-xl font-bold mb-4">Analysis Result:</h2>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead>
                            <tr className="text-xs text-gray-700 uppercase bg-gray-50">
                                <th className="border border-gray-300 px-4 py-2">Metric</th>
                                <th className="border border-gray-300 px-4 py-2">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { metric: 'gross_profit_margin', value: analysisResult.gross_profit_margin },
                                { metric: 'net_profit_margin', value: analysisResult.net_profit_margin },
                                { metric: 'working_capital', value: analysisResult.working_capital },
                                { metric: 'current_ratio', value: analysisResult.current_ratio },
                                { metric: 'quick_ratio', value: analysisResult.quick_ratio },
                                { metric: 'debt_to_equity_ratio', value: analysisResult.debt_to_equity_ratio },
                                { metric: 'inventory_turnover', value: analysisResult.inventory_turnover },
                                { metric: 'total_asset_turnover', value: analysisResult.total_asset_turnover },
                                { metric: 'return_on_equity', value: analysisResult.return_on_equity },
                                { metric: 'return_on_assets', value: analysisResult.return_on_assets },
                                { metric: 'operating_cash_flow', value: analysisResult.operating_cash_flow },
                            ].map(({ metric, value }) => (
                                <tr key={metric}>
                                    <td className="border border-gray-300 px-4 py-2">{metric}</td>
                                    <td className="border border-gray-300 px-4 py-2">{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4">
                    <button
                        onClick={handleDownload}
                        class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        Download as Excel
                    </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalysisResult;
