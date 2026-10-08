import { useEffect, useState } from "react";
import Prediction from "./Prediction";
import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");

  const [dataset, setDataset] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/dataset").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:8000/api/metrics").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:8000/api/model").then((res) =>
        res.json()
      ),
    ])
      .then(([datasetData, metricsData, modelData]) => {
        setDataset(datasetData);
        setMetrics(metricsData);
        setModel(modelData);
      })
      .catch((error) => {
        console.error("Backend connection error:", error);
      });
  }, []);

  if (!dataset || !metrics || !model) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Connecting to SVM engine...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">S</div>

          <div>
            <h2>SECOM</h2>
            <span>ANALYTICS</span>
          </div>
        </div>

        <nav>
          <a
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </a>

          <a
            className={page === "predictions" ? "active" : ""}
            onClick={() => setPage("predictions")}
          >
            Predictions
          </a>

          <a
            className={page === "performance" ? "active" : ""}
            onClick={() => setPage("performance")}
          >
            Model Performance
          </a>

          <a
            className={page === "eda" ? "active" : ""}
            onClick={() => setPage("eda")}
          >
            Dataset / EDA
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>SVM Engine Ready</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">

        {/* =====================================================
            PREDICTIONS PAGE
        ===================================================== */}

        {page === "predictions" ? (
          <>
            <header className="topbar">
              <div>
                <span className="eyebrow">
                  SEMICONDUCTOR QUALITY INTELLIGENCE
                </span>

                <h1>Predictions</h1>
              </div>

              <div className="model-badge">
                <span className="status-dot"></span>
                {model.model} · {model.kernel}
              </div>
            </header>

            <Prediction />
          </>
        ) : page === "performance" ? (

          /* =====================================================
             MODEL PERFORMANCE PAGE
          ===================================================== */

          <>
            <header className="topbar">
              <div>
                <span className="eyebrow">
                  SEMICONDUCTOR QUALITY INTELLIGENCE
                </span>

                <h1>Model Performance</h1>
              </div>

              <div className="model-badge">
                <span className="status-dot"></span>
                {model.model} · {model.kernel}
              </div>
            </header>

            <section className="stats-grid">
              <div className="stat-card accent-card">
                <span className="stat-label">TEST ACCURACY</span>

                <strong>
                  {(metrics.accuracy * 100).toFixed(2)}%
                </strong>

                <span className="stat-detail">
                  Test-set performance
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">PRECISION</span>

                <strong>
                  {(metrics.precision * 100).toFixed(2)}%
                </strong>

                <span className="stat-detail">
                  Fail-class precision
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">RECALL</span>

                <strong>
                  {(metrics.recall * 100).toFixed(2)}%
                </strong>

                <span className="stat-detail">
                  Fail-class recall
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">F1 SCORE</span>

                <strong>
                  {(metrics.f1_score * 100).toFixed(2)}%
                </strong>

                <span className="stat-detail">
                  Fail-class F1 score
                </span>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel performance-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">MODEL</span>
                    <h3>Performance Overview</h3>
                  </div>

                  <span className="panel-tag">
                    RBF SVM
                  </span>
                </div>

                <div className="performance-main">
                  <div className="accuracy-ring">
                    <div>
                      <strong>
                        {(metrics.accuracy * 100).toFixed(1)}
                      </strong>

                      <span>%</span>

                      <small>ACCURACY</small>
                    </div>
                  </div>

                  <div className="metric-list">
                    <div className="metric-row">
                      <span>Accuracy</span>

                      <strong>
                        {(metrics.accuracy * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>Precision</span>

                      <strong>
                        {(metrics.precision * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>Recall</span>

                      <strong>
                        {(metrics.recall * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>F1 Score</span>

                      <strong>
                        {(metrics.f1_score * 100).toFixed(2)}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      CLASSIFICATION
                    </span>

                    <h3>Confusion Matrix</h3>
                  </div>

                  <span className="panel-tag">
                    TEST SET
                  </span>
                </div>

                <div className="confusion-matrix">
                  <div className="matrix-label"></div>
                  <div className="matrix-label">PRED PASS</div>
                  <div className="matrix-label">PRED FAIL</div>

                  <div className="matrix-label">
                    ACTUAL PASS
                  </div>

                  <div className="matrix-cell">
                    {metrics.confusion_matrix[0][0]}
                  </div>

                  <div className="matrix-cell">
                    {metrics.confusion_matrix[0][1]}
                  </div>

                  <div className="matrix-label">
                    ACTUAL FAIL
                  </div>

                  <div className="matrix-cell">
                    {metrics.confusion_matrix[1][0]}
                  </div>

                  <div className="matrix-cell">
                    {metrics.confusion_matrix[1][1]}
                  </div>
                </div>
              </div>
            </section>

            <section className="info-grid">
              <div className="info-card">
                <span className="eyebrow">
                  MODEL TYPE
                </span>

                <h3>Support Vector Machine</h3>

                <p>
                  The deployed model uses an{" "}
                  <strong>RBF kernel</strong> for
                  classification.
                </p>

                <div className="info-number">
                  <span>KERNEL</span>
                  <strong>RBF</strong>
                </div>
              </div>

              <div className="info-card">
                <span className="eyebrow">
                  CLASS WEIGHT
                </span>

                <h3>Balanced Classification</h3>

                <p>
                  The final SVM uses balanced class weights
                  to account for the Pass / Fail imbalance.
                </p>

                <div className="info-number">
                  <span>MODE</span>
                  <strong>BALANCED</strong>
                </div>
              </div>

              <div className="info-card">
                <span className="eyebrow">
                  TEST DATA
                </span>

                <h3>Evaluation Set</h3>

                <p>
                  Model performance is evaluated using the
                  held-out test dataset.
                </p>

                <div className="info-number">
                  <span>SAMPLES</span>
                  <strong>314</strong>
                </div>
              </div>
            </section>

            <footer>
              <span>
                SECOM ANALYTICS · SEMICONDUCTOR QUALITY INTELLIGENCE
              </span>

              <span>
                SVM · RBF · FASTAPI
              </span>
            </footer>
          </>

        ) : page === "eda" ? (

          /* =====================================================
             DATASET / EDA PAGE
          ===================================================== */

          <>
            <header className="topbar">
              <div>
                <span className="eyebrow">
                  SEMICONDUCTOR QUALITY INTELLIGENCE
                </span>

                <h1>Dataset / EDA</h1>
              </div>

              <div className="model-badge">
                <span className="status-dot"></span>
                SECOM DATASET
              </div>
            </header>

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">
                  TOTAL SAMPLES
                </span>

                <strong>
                  {dataset.samples.toLocaleString()}
                </strong>

                <span className="stat-detail">
                  SECOM records
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  ORIGINAL FEATURES
                </span>

                <strong>
                  {dataset.original_features}
                </strong>

                <span className="stat-detail">
                  Measurement features
                </span>
              </div>

              <div className="stat-card accent-card">
                <span className="stat-label">
                  FINAL FEATURES
                </span>

                <strong>
                  {dataset.final_features}
                </strong>

                <span className="stat-detail">
                  After constant-feature removal
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  MISSING VALUES
                </span>

                <strong>
                  {dataset.missing_values.toLocaleString()}
                </strong>

                <span className="stat-detail">
                  Before preprocessing
                </span>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel distribution-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      TARGET
                    </span>

                    <h3>Pass / Fail Distribution</h3>
                  </div>

                  <span className="panel-tag">
                    {dataset.samples.toLocaleString()} RECORDS
                  </span>
                </div>

                <div className="distribution">
                  <div className="distribution-number">
                    <strong>{dataset.pass}</strong>
                    <span>PASS</span>
                  </div>

                  <div className="distribution-bar">
                    <div
                      className="pass-bar"
                      style={{
                        width: `${
                          (dataset.pass / dataset.samples) * 100
                        }%`,
                      }}
                    ></div>

                    <div
                      className="fail-bar"
                      style={{
                        width: `${
                          (dataset.fail / dataset.samples) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="distribution-number fail-number">
                    <strong>{dataset.fail}</strong>
                    <span>FAIL</span>
                  </div>
                </div>

                <div className="distribution-footer">
                  <div>
                    <span className="legend-dot pass-dot"></span>
                    Pass records
                  </div>

                  <div>
                    <span className="legend-dot fail-dot"></span>
                    Fail records
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      FEATURES
                    </span>

                    <h3>Feature Reduction</h3>
                  </div>

                  <span className="panel-tag">
                    PREPROCESSING
                  </span>
                </div>

                <div className="performance-main">
                  <div className="accuracy-ring">
                    <div>
                      <strong>
                        {
                          dataset.original_features -
                          dataset.final_features
                        }
                      </strong>

                      <small>REMOVED</small>
                    </div>
                  </div>

                  <div className="metric-list">
                    <div className="metric-row">
                      <span>Original features</span>

                      <strong>
                        {dataset.original_features}
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>Final features</span>

                      <strong>
                        {dataset.final_features}
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>Removed</span>

                      <strong>
                        {
                          dataset.original_features -
                          dataset.final_features
                        }
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>Missing values</span>

                      <strong>
                        {dataset.missing_values.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="info-grid">
              <div className="info-card">
                <span className="eyebrow">
                  DATASET
                </span>

                <h3>SECOM Manufacturing Data</h3>

                <p>
                  The application uses the SECOM dataset
                  for semiconductor manufacturing quality
                  classification.
                </p>

                <div className="info-number">
                  <span>ROWS</span>
                  <strong>{dataset.samples}</strong>
                </div>
              </div>

              <div className="info-card">
                <span className="eyebrow">
                  PREPROCESSING
                </span>

                <h3>Constant Features</h3>

                <p>
                  Features with no variation were removed
                  before training the SVM.
                </p>

                <div className="info-number">
                  <span>REMOVED</span>

                  <strong>
                    {
                      dataset.original_features -
                      dataset.final_features
                    }
                  </strong>
                </div>
              </div>

              <div className="info-card">
                <span className="eyebrow">
                  MISSING DATA
                </span>

                <h3>Imputation</h3>

                <p>
                  Missing measurements are handled by the
                  model's median-imputation pipeline.
                </p>

                <div className="info-number">
                  <span>STATUS</span>
                  <strong>HANDLED</strong>
                </div>
              </div>
            </section>

            <footer>
              <span>
                SECOM ANALYTICS · SEMICONDUCTOR QUALITY INTELLIGENCE
              </span>

              <span>
                DATASET · EDA · SVM
              </span>
            </footer>
          </>

        ) : (

          /* =====================================================
             DASHBOARD PAGE
          ===================================================== */

          <>
            <header className="topbar">
              <div>
                <span className="eyebrow">
                  SEMICONDUCTOR QUALITY INTELLIGENCE
                </span>

                <h1>Control Center</h1>
              </div>

              <div className="model-badge">
                <span className="status-dot"></span>
                {model.model} · {model.kernel}
              </div>
            </header>

            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">
                  MACHINE LEARNING ANALYSIS
                </span>

                <h2>
                  SECOM Process
                  <br />
                  <span>Monitor</span>
                </h2>

                <p>
                  Semiconductor manufacturing quality analysis
                  powered by an RBF-based Support Vector Machine.
                </p>

                <div className="hero-tags">
                  <span>RBF SVM</span>
                  <span>474 FEATURES</span>
                  <span>1,567 SAMPLES</span>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-glow glow-blue"></div>
                <div className="hero-glow glow-pink"></div>
                <div className="hero-glow glow-violet"></div>

                <div className="orbit orbit-a"></div>
                <div className="orbit orbit-b"></div>
                <div className="orbit orbit-c"></div>

                <div className="core-chip">
                  <div className="core-inner">
                    <span>SVM</span>
                    <small>RBF CORE</small>
                  </div>
                </div>

                <div className="signal-node node-a">
                  <strong>474</strong>
                  <span>FEATURES</span>
                </div>

                <div className="signal-node node-b">
                  <strong>82.80%</strong>
                  <span>ACCURACY</span>
                </div>

                <div className="signal-node node-c">
                  <strong>1,567</strong>
                  <span>SAMPLES</span>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">
                  TOTAL SAMPLES
                </span>

                <strong>
                  {dataset.samples.toLocaleString()}
                </strong>

                <span className="stat-detail">
                  SECOM records
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  FINAL FEATURES
                </span>

                <strong>
                  {dataset.final_features}
                </strong>

                <span className="stat-detail">
                  from {dataset.original_features} measurements
                </span>
              </div>

              <div className="stat-card accent-card">
                <span className="stat-label">
                  MODEL ACCURACY
                </span>

                <strong>
                  {(metrics.accuracy * 100).toFixed(2)}%
                </strong>

                <span className="stat-detail">
                  Test-set accuracy
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  DATASET FAILURES
                </span>

                <strong>{dataset.fail}</strong>

                <span className="stat-detail">
                  Actual failure labels
                </span>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel distribution-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      DATASET
                    </span>

                    <h3>Quality Distribution</h3>
                  </div>

                  <span className="panel-tag">
                    1,567 RECORDS
                  </span>
                </div>

                <div className="distribution">
                  <div className="distribution-number">
                    <strong>{dataset.pass}</strong>
                    <span>PASS</span>
                  </div>

                  <div className="distribution-bar">
                    <div
                      className="pass-bar"
                      style={{
                        width: `${
                          (dataset.pass / dataset.samples) * 100
                        }%`,
                      }}
                    ></div>

                    <div
                      className="fail-bar"
                      style={{
                        width: `${
                          (dataset.fail / dataset.samples) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="distribution-number fail-number">
                    <strong>{dataset.fail}</strong>
                    <span>FAIL</span>
                  </div>
                </div>

                <div className="distribution-footer">
                  <div>
                    <span className="legend-dot pass-dot"></span>
                    Pass records
                  </div>

                  <div>
                    <span className="legend-dot fail-dot"></span>
                    Fail records
                  </div>
                </div>
              </div>

              <div className="panel performance-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      MODEL
                    </span>

                    <h3>Performance</h3>
                  </div>

                  <span className="panel-tag">
                    RBF SVM
                  </span>
                </div>

                <div className="performance-main">
                  <div className="accuracy-ring">
                    <div>
                      <strong>
                        {(metrics.accuracy * 100).toFixed(1)}
                      </strong>

                      <span>%</span>

                      <small>ACCURACY</small>
                    </div>
                  </div>

                  <div className="metric-list">
                    <div className="metric-row">
                      <span>Accuracy</span>

                      <strong>
                        {(metrics.accuracy * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>Precision</span>

                      <strong>
                        {(metrics.precision * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>Recall</span>

                      <strong>
                        {(metrics.recall * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div className="metric-row">
                      <span>F1 Score</span>

                      <strong>
                        {(metrics.f1_score * 100).toFixed(2)}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="info-grid">
              <div className="info-card">
                <span className="eyebrow">
                  PREPROCESSING
                </span>

                <h3>Feature Pipeline</h3>

                <p>
                  Constant features were removed, leaving{" "}
                  <strong>{dataset.final_features}</strong>{" "}
                  usable features.
                </p>

                <div className="info-number">
                  <span>REMOVED</span>

                  <strong>
                    {
                      dataset.original_features -
                      dataset.final_features
                    }
                  </strong>
                </div>
              </div>

              <div className="info-card">
                <span className="eyebrow">
                  DATA QUALITY
                </span>

                <h3>Missing Values</h3>

                <p>
                  Dataset contains{" "}
                  <strong>
                    {dataset.missing_values.toLocaleString()}
                  </strong>{" "}
                  missing measurements before preprocessing.
                </p>

                <div className="info-number">
                  <span>STATUS</span>
                  <strong>IMPUTED</strong>
                </div>
              </div>

              <div className="info-card">
                <span className="eyebrow">
                  CLASS BALANCE
                </span>

                <h3>Pass / Fail Ratio</h3>

                <p>
                  Pass: <strong>{dataset.pass}</strong> · Fail:{" "}
                  <strong>{dataset.fail}</strong>
                </p>

                <div className="mini-balance">
                  <div
                    style={{
                      width: `${
                        (dataset.pass / dataset.samples) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </section>

            <footer>
              <span>
                SECOM ANALYTICS · SEMICONDUCTOR QUALITY INTELLIGENCE
              </span>

              <span>
                SVM · RBF · FASTAPI
              </span>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export default App;