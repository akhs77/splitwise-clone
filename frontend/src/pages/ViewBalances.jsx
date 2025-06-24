import { useEffect, useState } from "react";
import api from "../api/axios";

function ViewBalances() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [balances, setBalances] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [message, setMessage] = useState("");

  // Fetch all groups
  useEffect(() => {
    api.get("/groups")
      .then((res) => setGroups(res.data))
      .catch(console.error);
  }, []);

  // Fetch all users and build ID → name map
  useEffect(() => {
    api.get("/users")
      .then((res) => {
        const map = {};
        res.data.forEach((user) => {
          map[user.id] = user.name;
        });
        setUserMap(map);
      })
      .catch(console.error);
  }, []);

  // Fetch balances for the selected group
  useEffect(() => {
    if (selectedGroupId) {
      api.get(`/groups/${selectedGroupId}/balances`)
        .then((res) => {
          setBalances(res.data || []);
          setMessage("");
        })
        .catch((err) => {
          console.error(err);
          setMessage("❌ Failed to fetch balances");
        });
    }
  }, [selectedGroupId]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-xl font-bold text-center text-gray-700">Group Balances</h2>

      <select
        value={selectedGroupId}
        onChange={(e) => setSelectedGroupId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Group</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      {message && <div className="text-center text-red-600">{message}</div>}

      {balances.length > 0 ? (
        <ul className="space-y-2">
          {balances.map((b, idx) => (
            <li key={idx} className="text-gray-800">
              {userMap[b.from_user_id] || `User ${b.from_user_id}`} owes ₹{b.amount.toFixed(2)} to {userMap[b.to_user_id] || `User ${b.to_user_id}`}

            </li>
          ))}
        </ul>
      ) : selectedGroupId && !message ? (
        <p className="text-center text-gray-500 mt-4">No balances yet.</p>
      ) : null}
    </div>
  );
}

export default ViewBalances;
