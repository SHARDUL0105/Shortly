import { useState } from "react";
import ShortenForm from "../components/ShortenForm";
import ResultCard from "../components/ResultCard";

export default function HomePage() {
  const [result, setResult] = useState(null);

  return (
    <div className="home-page">
      <div className="hero">
        <h1>🔗 Shortly</h1>
        <p>Shorten. Share. Track. All in one place.</p>
      </div>
      <ShortenForm onResult={setResult} />
      {result && <ResultCard result={result} />}
    </div>
  );
}
