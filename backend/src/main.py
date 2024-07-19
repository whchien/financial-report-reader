import os

from src.api_types import AnalysisResponse, AnalyzeRequest, UploadDocResponse
from src.config import DATA_DIR, DIMENSIONS, KEY_METRICS, SAVE_DIR
from src.reader import ReportReader
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import time
from src.utils import text_to_uuid

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the specific domain of your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload_file/")
async def post_upload_file(file_upload: UploadFile = File(...)) -> UploadDocResponse:
    try:
        contents = await file_upload.read()
        logger.info(file_upload.filename)

        file_id = text_to_uuid(file_upload.filename)

        os.makedirs(DATA_DIR / file_id, exist_ok=True)
        os.makedirs(SAVE_DIR / file_id, exist_ok=True)

        save_to = DATA_DIR / file_id / file_upload.filename
        with open(save_to, "wb") as f:
            f.write(contents)
        time.sleep(5)
        return UploadDocResponse(filename=file_upload.filename, file_id=file_id)
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")


@app.post("/analyze_report/")
async def post_analyze(analyze_request: AnalyzeRequest) -> AnalysisResponse:
    try:
        logger.info("Starting the Financial Report Reader")
        file_id = text_to_uuid(analyze_request.filename)
        reader = ReportReader(analyze_request.filename,
                              DATA_DIR / file_id,
                              SAVE_DIR / file_id,
                              DIMENSIONS)
        reader.run()

        answers = {}
        for metric in KEY_METRICS:
            query_text = f"What is the {metric} of this company?"
            response = reader.ask(query_text)
            answers[metric.lower().replace(" ", "_")] = str(response)
            logger.info("{}: {}", metric, response)
        # time.sleep(5)
        # res = AnalysisResponse(
        #     gross_profit_margin="test",
        #     net_profit_margin="test",
        #     working_capital="test",
        #     current_ratio="test",
        #     quick_ratio="test",
        #     debt_to_equity_ratio="test",
        #     inventory_turnover="test",
        #     total_asset_turnover="test",
        #     return_on_equity="test",
        #     return_on_assets="test",
        #     operating_
        #     ="test",
        # )
        # time.sleep(5)

        return AnalysisResponse(**answers)
    except Exception as e:
        logger.error(f"Error analyzing report: {e}")
        raise HTTPException(status_code=500, detail="Report analysis failed")


@app.get("/")
async def main():
    content = "Uvicorn running on http://127.0.0.1:8000/docs"
    return HTMLResponse(content=content)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)