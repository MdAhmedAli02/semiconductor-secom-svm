import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "secom_svm_model.pkl"

model = joblib.load(MODEL_PATH)

print("SVM model loaded successfully!")