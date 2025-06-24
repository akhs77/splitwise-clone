import { useState } from "react";
import api from "../api/axios";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    setAnswer("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/chatbot", { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-700">💬 Ask a Question</h2>

      <form onSubmit={handleAsk} className="space-y-4">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="E.g. How much does Akhila owe in Goa Trip?"
          className="w-full border rounded p-2"
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="bg-gray-100 border-l-4 border-green-500 p-4 text-gray-800 rounded">
          <strong>Answer:</strong> {answer}
        </div>
      )}

      {error && <div className="text-red-600 text-center">{error}</div>}
    </div>
  );
}

export default ChatBot;
