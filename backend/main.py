from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File
from model import model
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from io import StringIO

from preprocessing import FEATURE_COLUMNS
class PredictionRequest(BaseModel):
    features: list[float]
app = FastAPI(title="Semiconductor Quality Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Semiconductor Quality Prediction API is running!"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/api/model")
def model_info():
    return {
        "model": "SVM",
        "kernel": "RBF",
        "status": "loaded"
    }
@app.post("/api/predict")
def predict(request: PredictionRequest):
    if len(request.features) != 474:
        return {
            "error": f"Expected 474 features, received {len(request.features)}"
        }

    prediction = model.predict([request.features])[0]

    result = "FAIL" if prediction == 1 else "PASS"

    return {
        "prediction": result,
        "raw_prediction": int(prediction)
    }
@app.post("/api/predict-file")
async def predict_file(file: UploadFile = File(...)):
    contents = await file.read()

    df = pd.read_csv(StringIO(contents.decode("utf-8")))

    missing_columns = [
        column for column in FEATURE_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        return {
            "error": "Uploaded CSV is missing required SECOM features.",
            "missing_columns": missing_columns
        }

    X = df[FEATURE_COLUMNS]

    predictions = model.predict(X)

    pass_count = int((predictions == -1).sum())
    fail_count = int((predictions == 1).sum())

    return {
        "filename": file.filename,
        "total_samples": len(df),
        "pass": pass_count,
        "fail": fail_count,
        "predictions": [
            "FAIL" if prediction == 1 else "PASS"
            for prediction in predictions
        ]
    }
@app.get("/api/metrics")
def model_metrics():

    df = pd.read_csv("../data/uci-secom.csv")

    # Separate features and target
    X = df.drop(columns=["Time", "Pass/Fail"])
    y = df["Pass/Fail"]

    # Remove constant features
    constant_columns = X.columns[X.nunique() <= 1]
    X = X.drop(columns=constant_columns)

    # Use the same train-test split as our original project
    from sklearn.model_selection import train_test_split

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # Predict using the saved SVM pipeline
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, pos_label=1, zero_division=0)
    recall = recall_score(y_test, y_pred, pos_label=1, zero_division=0)
    f1 = f1_score(y_test, y_pred, pos_label=1, zero_division=0)

    cm = confusion_matrix(y_test, y_pred)

    return {
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "confusion_matrix": cm.tolist()
    }
@app.get("/api/dataset")
def dataset_info():

    df = pd.read_csv("../data/uci-secom.csv")

    # Original dataset information
    samples = len(df)

    original_features = len(
        df.drop(columns=["Time", "Pass/Fail"]).columns
    )

    # Remove constant features
    X = df.drop(columns=["Time", "Pass/Fail"])
    constant_columns = X.columns[X.nunique() <= 1]
    final_features = X.shape[1] - len(constant_columns)

    # Target distribution
    pass_count = int((df["Pass/Fail"] == -1).sum())
    fail_count = int((df["Pass/Fail"] == 1).sum())

    # Missing values
    missing_values = int(
        df.drop(columns=["Time", "Pass/Fail"]).isna().sum().sum()
    )

    return {
        "samples": samples,
        "original_features": original_features,
        "final_features": final_features,
        "pass": pass_count,
        "fail": fail_count,
        "missing_values": missing_values
    }