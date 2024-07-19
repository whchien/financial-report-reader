from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    gross_profit_margin: str
    net_profit_margin: str
    working_capital: str
    current_ratio: str
    quick_ratio: str
    debt_to_equity_ratio: str
    inventory_turnover: str
    total_asset_turnover: str
    return_on_equity: str
    return_on_assets: str
    operating_cash_flow: str


class UploadDocResponse(BaseModel):
    filename: str
    file_id: str


class AnalyzeRequest(BaseModel):
    username: str
    filename: str
