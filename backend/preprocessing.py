import pandas as pd
from pathlib import Path


DATA_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "uci-secom.csv"
)


def get_training_features():
    df = pd.read_csv(DATA_PATH)

    # Separate features from target
    X = df.drop(columns=["Time", "Pass/Fail"])

    # Remove constant features using the same rule
    constant_columns = X.columns[X.nunique() <= 1]

    X = X.drop(columns=constant_columns)

    return X.columns.tolist()


FEATURE_COLUMNS = get_training_features()