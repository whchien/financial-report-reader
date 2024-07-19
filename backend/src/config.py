from pathlib import Path

KEY_METRICS = [
    "Gross Profit Margin",
    "Net Profit Margin",
    "Working Capital",
    "Current Ratio",
    "Quick Ratio",
    "Debt to Equity Ratio",
    "Inventory Turnover",
    "Total Asset Turnover",
    "Return on Equity",
    "Return on Assets",
    "Operating Cash Flow",
]

ROOT_DIR = Path(__file__).parent.parent
DATA_DIR = ROOT_DIR / "./tmp/"
SAVE_DIR = ROOT_DIR / "./tmp/storage/"
DIMENSIONS = 1536
