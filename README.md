# Semiconductor Failure Prediction using SVM

## 📌 Overview

This project uses **Machine Learning to predict semiconductor manufacturing failures** using the **UCI SECOM dataset**.

The goal is to classify manufacturing samples into two classes:

* `-1` → Pass
* `1` → Fail

The project covers the complete workflow from **exploratory data analysis and preprocessing to SVM model training, hyperparameter tuning, evaluation, and model saving**.

---

## 🎯 Problem Statement

Semiconductor manufacturing processes generate a large number of measurements from different sensors and process parameters.

The objective of this project is to use these measurements to build a machine learning model that can predict whether a manufacturing sample will be classified as **Pass or Fail**.

A particular challenge is that the dataset is **highly imbalanced**, with far fewer Fail samples than Pass samples.

---

## 📊 Dataset

The project uses the **UCI SECOM (Semiconductor Manufacturing) dataset**.

### Dataset characteristics

* **1567 samples**
* **590 measurement features**
* `Time` column
* `Pass/Fail` target
* Contains missing values
* Highly imbalanced target classes

### Target distribution

| Class | Meaning | Samples |
| ----- | ------- | ------: |
| `-1`  | Pass    |    1463 |
| `1`   | Fail    |     104 |

The `Time` column is excluded from the machine learning features.

During preprocessing, **116 constant features** were identified and removed, leaving **474 useful measurement features**.

---

## 🔍 Exploratory Data Analysis

The first notebook, `01_eda.ipynb`, is used to understand and prepare the dataset.

The analysis includes:

* Dataset dimensions and information
* Pass/Fail class distribution
* Missing-value analysis
* Statistical summary
* Constant-feature detection
* Time-column analysis
* Feature and target separation
* Removal of constant features

The dataset contains a significant number of missing values, so missing-value handling is required before training the model.

---

## 🤖 Machine Learning Approach

The main algorithm used in this project is **Support Vector Machine (SVM)**.

Two SVM kernels were explored:

### Linear SVM

A linear kernel was tested as a baseline to determine how well a linear decision boundary could separate the two classes.

### RBF SVM

An **RBF (Radial Basis Function)** kernel was also tested because the relationship between the semiconductor measurements and the Pass/Fail classes may not be linearly separable.

The experiments included different values of:

* `C`
* `gamma`

Because of the class imbalance, `class_weight="balanced"` was used.

---

## ⚙️ Preprocessing

The final model uses a Scikit-learn Pipeline containing:

```text
Raw Features
     ↓
Median Imputation
     ↓
Standard Scaling
     ↓
RBF SVM
```

### Missing values

Missing measurements are replaced using **median imputation**.

### Feature scaling

`StandardScaler` is used because SVM is sensitive to differences in feature scale.

Keeping preprocessing inside the final Pipeline ensures that the preprocessing steps are handled correctly during cross-validation.

---

## 🔧 Hyperparameter Tuning

`GridSearchCV` with **5-fold cross-validation** was used to find suitable values for `C` and `gamma`.

The **F1-score** was used as the tuning metric because the dataset has a strong Pass/Fail class imbalance.

### Best parameters

```text
C = 0.1
gamma = 0.001
```

### Best cross-validation F1-score

```text
0.1982
```

---

## 📈 Final Results

The final tuned SVM was evaluated on an unseen test set containing **314 samples**.

### Overall

| Metric        |    Result |
| ------------- | --------: |
| Test Accuracy | **82.8%** |

### Classification Report

| Class       | Precision | Recall | F1-score |
| ----------- | --------: | -----: | -------: |
| Pass (`-1`) |      0.95 |   0.86 |     0.90 |
| Fail (`1`)  |      0.15 |   0.33 |     0.21 |

### Confusion Matrix

```text
              Predicted
              Pass   Fail

Actual Pass    253    40
Actual Fail     14     7
```

The model correctly identified **7 of the 21 actual Fail samples** in the test set.

This demonstrates an important limitation of the current model: although the overall accuracy is 82.8%, detecting the minority **Fail** class remains difficult.

---

## 💾 Model

The final trained Pipeline is saved using `joblib`:

```text
models/secom_svm_model.pkl
```

The saved model was loaded again and successfully used to make predictions, confirming that the trained model can be reused without retraining.

---

## 📁 Project Structure

```text
semiconductor-secom-svm/
│
├── data/
│   ├── uci-secom.csv
│   └── README.md
│
├── figures/
│
├── models/
│   └── secom_svm_model.pkl
│
├── notebooks/
│   ├── 01_eda.ipynb
│   └── 02_svm_model.ipynb
│
├── reports/
│   └── figures/
│
├── src/
│   └── __init__.py
│
├── .gitignore
├── requirements.txt
└── README.md
```

### Notebook description

* **`01_eda.ipynb`** → Dataset exploration and preparation
* **`02_svm_model.ipynb`** → SVM experiments, hyperparameter tuning, final evaluation, and model saving

---

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd semiconductor-secom-svm
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the environment

**Windows:**

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the notebooks

Open the notebooks in this order:

```text
01_eda.ipynb
        ↓
02_svm_model.ipynb
```

The first notebook explores the dataset, while the second trains and evaluates the SVM model.

---

## ⚠️ Limitations

The main limitation is the strong imbalance between Pass and Fail samples.

The current model performs considerably better on the Pass class than on the Fail class. Therefore, **accuracy alone is not sufficient to judge the model**, and metrics such as Fail-class recall and F1-score are important.

---

## 🚀 Future Improvements

Possible improvements include:

* Testing other machine learning algorithms
* Improving minority-class handling
* Feature selection and dimensionality reduction
* Exploring additional hyperparameter combinations
* Comparing different classification techniques
* Improving detection of the Fail class

---

## 🛠️ Technologies

* **Python**
* **Pandas**
* **NumPy**
* **Scikit-learn**
* **Matplotlib**
* **Seaborn**
* **Jupyter Notebook**
* **Joblib**
