import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";

function App() {
    const [health, setHealth] = useState<string>("loading...");

  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(data => setHealth(JSON.stringify(data, null, 2)))
      .catch(() => setHealth("backend not reachable"));
  }, []);

  return (
    <>
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Campus Resale</h1>
          <span className="text-sm text-gray-500">Vite + React + Tailwind</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-medium">Backend health</h2>
          <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
            {health}
          </pre>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button className="rounded-xl border px-4 py-2 hover:bg-gray-100">Browse Listings</button>
            <button className="rounded-xl border px-4 py-2 hover:bg-gray-100">Create Listing</button>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}

export default App;
