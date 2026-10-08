import { useState } from "react";

function Prediction() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/predict-file",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Prediction failed."
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">

      {/* Upload Section */}
      <section className="prediction-upload panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              SVM INFERENCE
            </span>

            <h3>Run Quality Prediction</h3>
          </div>

          <span className="panel-tag">
            RBF SVM
          </span>
        </div>

        <div className="prediction-upload-area">

          <div className="upload-icon">
            ↑
          </div>

          <h3>
            Upload SECOM Dataset
          </h3>

          <p>
            Upload a CSV containing the required SECOM
            measurement features.
          </p>

          <label className="upload-button">
            Choose CSV File

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {file && (
            <div className="selected-file">
              <span>SELECTED FILE</span>

              <strong>
                {file.name}
              </strong>
            </div>
          )}

        </div>

        <button
          className="predict-button"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading
            ? "RUNNING SVM..."
            : "RUN SVM PREDICTION"}
        </button>

        {error && (
          <div className="prediction-error">
            {error}
          </div>
        )}
      </section>

      {/* Results */}
      {result && (
        <>
          <section className="prediction-stats">

            <div className="stat-card">
              <span className="stat-label">
                TOTAL SAMPLES
              </span>

              <strong>
                {result.total_samples.toLocaleString()}
              </strong>

              <span className="stat-detail">
                Processed by SVM
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                PREDICTED PASS
              </span>

              <strong>
                {result.pass}
              </strong>

              <span className="stat-detail">
                Quality accepted
              </span>
            </div>

            <div className="stat-card accent-card">
              <span className="stat-label">
                PREDICTED FAIL
              </span>

              <strong>
                {result.fail}
              </strong>

              <span className="stat-detail">
                Quality failure
              </span>
            </div>

          </section>

          <section className="panel prediction-results">

            <div className="panel-header">
              <div>
                <span className="eyebrow">
                  INFERENCE OUTPUT
                </span>

                <h3>
                  Sample Predictions
                </h3>
              </div>

              <span className="panel-tag">
                {result.total_samples} RESULTS
              </span>
            </div>

            <div className="results-list">

              {result.predictions.map(
                (prediction, index) => (
                  <div
                    className="prediction-row"
                    key={index}
                  >
                    <span className="sample-number">
                      #{index + 1}
                    </span>

                    <span className="sample-label">
                      Sample {index + 1}
                    </span>

                    <span
                      className={
                        prediction === "PASS"
                          ? "prediction-pass"
                          : "prediction-fail"
                      }
                    >
                      {prediction}
                    </span>
                  </div>
                )
              )}

            </div>

          </section>
        </>
      )}

    </div>
  );
}

export default Prediction;