import { useEffect, useState } from "react";
import api from "../api/axios";

function AddExpense() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [splits, setSplits] = useState([]);
  const [message, setMessage] = useState("");

  
  // Load groups on mount
  useEffect(() => {
    api.get("/groups")
      .then((res) => setGroups(res.data))
      .catch(console.error);
  }, []);

  // When group is selected, load users
  useEffect(() => {
    if (selectedGroupId) {
      api.get(`/groups/${selectedGroupId}`)
        .then((res) => {
          setGroupUsers(res.data.users);
          setPaidBy(""); // reset paidBy
          setSplits(res.data.users.map(u => ({ user_id: u.id, percentage: 0 })));
        })
        .catch(console.error);
    }
  }, [selectedGroupId]);

  const handleSplitChange = (index, value) => {
    const updated = [...splits];
    updated[index].percentage = parseFloat(value);
    setSplits(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        description,
        amount: parseFloat(amount),
        paid_by: parseInt(paidBy),
        split_type: splitType,
        splits: splitType === "percentage" ? splits : [],
      };

      await api.post(`/groups/${selectedGroupId}/expenses`, payload);
      setMessage("✅ Expense added!");
      setDescription("");
      setAmount("");
      setPaidBy("");
      setSplitType("equal");
      setSplits([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add expense");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-xl font-bold text-center text-gray-700">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Paid by</option>
          {groupUsers.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select
          value={splitType}
          onChange={(e) => setSplitType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="equal">Equal</option>
          <option value="percentage">Percentage</option>
        </select>

        {splitType === "percentage" && (
          <div className="space-y-2">
            {groupUsers.map((u, idx) => (
              <div key={u.id} className="flex justify-between items-center">
                <label>{u.name}</label>
                <input
                  type="number"
                  value={splits[idx]?.percentage || ""}
                  onChange={(e) => handleSplitChange(idx, e.target.value)}
                  className="border p-1 rounded w-20"
                  placeholder="%"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </form>

      {message && <div className="text-center text-green-600 font-semibold">{message}</div>}
    </div>
  );
}

export default AddExpense;
