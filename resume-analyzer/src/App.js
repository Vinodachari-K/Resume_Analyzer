import React, { useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setResult(res.data.result);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

const data = [
  { name: "Score", value: result?.score || 0 },
  { name: "Remaining", value: 100 - (result?.score || 0) },
];

const skillData =
  result?.skills.map((skill) => ({
    name: skill,
    value: 1,
  })) || [];

return (
  <div style={styles.container}>
    <h1 style={styles.title}>Resume Analyzer</h1>

    <div style={styles.card}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button style={styles.button} onClick={handleUpload}>
        Upload Resume
      </button>
    </div>

    {result && (
      <div style={styles.resultCard}>
        <h2>Score: {result.score}</h2>

        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>

  {/* Pie Chart */}
  <PieChart width={250} height={250}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={80}
      dataKey="value"
    >
      <Cell fill="#00C49F" />
      <Cell fill="#FF8042" />
    </Pie>
    <Tooltip />
  </PieChart>

  {/* Bar Chart */}
  <BarChart width={300} height={250} data={skillData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#007bff" />
  </BarChart>

</div>

        <div style={styles.grid}>
          <div style={styles.box}>
            <h3>Skills</h3>
            <ul>
              {result.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={styles.box}>
            <h3>Missing Skills</h3>
            <ul>
              {result.missing_skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={styles.box}>
            <h3>Suggestions</h3>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

const styles = {
  container: {
    fontFamily: "Arial",
    textAlign: "center",
    background: "#f4f6f8",
    minHeight: "100vh",
    padding: "40px",
  },
  title: {
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "inline-block",
  },
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resultCard: {
    marginTop: "30px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  box: {
    width: "30%",
    textAlign: "left",
  },
};

export default App;