import { useEffect, useState } from "react";
import api from "../api/axios";

function UserBalances() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [balances, setBalances] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/users")
      .then((res) => {
        setUsers(res.data);
        const map = {};
        res.data.forEach((u) => {
          map[u.id] = u.name;
        });
        setUserMap(map);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      api.get(`/users/${selectedUserId}/balances`)
        .then((res) => {
          setBalances(res.data || []);
          setMessage("");
        })
        .catch((err) => {
          console.error(err);
          setMessage("❌ Failed to fetch balances");
        });
    }
  }, [selectedUserId]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-xl font-bold text-center text-gray-700">My Balances</h2>

      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      {message && <div className="text-center text-red-600">{message}</div>}

      {balances.length > 0 ? (
        <ul className="space-y-2">
          {balances.map((b, idx) => (
            <li key={idx} className="text-gray-800">
              {userMap[b.from_user_id]} owes {userMap[b.to_user_id]} ₹{b.amount}
            </li>
          ))}
        </ul>
      ) : selectedUserId && !message ? (
        <p className="text-center text-gray-500 mt-4">No balances yet.</p>
      ) : null}
    </div>
  );
}

export default UserBalances;
