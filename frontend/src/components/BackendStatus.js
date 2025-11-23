import React, { useEffect, useState } from "react";

function BackendStatus() {
  const [backendData, setBackendData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your live Django backend
    fetch("https://connectu.pythonanywhere.com/api/test/")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data.message || "Backend responded successfully!");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setBackendData("Error connecting to backend");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Backend Connection Test</h2>
      {loading ? <p>Loading...</p> : <p>{backendData}</p>}
    </div>
  );
}

export default BackendStatus;