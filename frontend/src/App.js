import React, { useEffect, useState } from "react";

function App() {
  const [backendData, setBackendData] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test/")
      .then(response => response.json())
      .then(data => setBackendData(data.message))
      .catch(error => console.error("Error fetching backend:", error));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>{backendData || "Loading connection..."}</h1>
    </div>
  );
}

export default App;
