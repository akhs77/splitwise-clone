import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateGroup from "./pages/CreateGroup";
import AddExpense from "./pages/AddExpense";
import ViewBalances from "./pages/ViewBalances";
import UserBalances from "./pages/UserBalances";
import ChatBot from "./pages/ChatBot";


function App() {
  return (
    <Router>
      
      <div className="min-h-screen w-full bg-blue-400 ">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 shadow p-4 flex justify-center space-x-6 ">
          <Link to="/" className="text-white font-semibold hover:underline">
            Create Group
          </Link>
          <Link to="/add-expense" className="text-white font-semibold hover:underline">
            Add Expense
          </Link>
          <Link to="/view-balances" className="text-white font-semibold hover:underline">
            View Balances
          </Link>
          <Link to="/user-balances" className="text-white font-semibold hover:underline">
             My Balances
          </Link>
          <Link to="/chat" className="text-white font-semibold hover:underline">
          🤖 Ask Chatbot
          </Link>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<CreateGroup />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/view-balances" element={<ViewBalances />} />
          <Route path="/user-balances" element={<UserBalances />} />
          <Route path="/chat" element={<ChatBot />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
