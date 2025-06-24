import { useState } from "react";
import api from "../api/axios";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [userNames, setUserNames] = useState([""]);
  const [message, setMessage] = useState("");

  const handleUserNameChange = (index, value) => {
    const updated = [...userNames];
    updated[index] = value;
    setUserNames(updated);
  };

  const addUserField = () => setUserNames([...userNames, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create users
      const createdUsers = await Promise.all(
        userNames.map((name) =>
          api.post("/users/", { name }).then((res) => res.data)
        )
      );

      // 2. Extract user IDs
      const userIds = createdUsers.map((user) => user.id);

      // 3. Create group with user IDs
      const res = await api.post("/groups", {
        name: groupName,
        user_ids: userIds,
      });

      setMessage(`✅ Group '${res.data.name}' created!`);
      setGroupName("");
      setUserNames([""]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create group");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-xl font-bold text-center text-gray-700">Create Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Group name"
          className="w-full border p-2 rounded"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />

        <div className="space-y-2">
          {userNames.map((name, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`User ${idx + 1} name`}
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => handleUserNameChange(idx, e.target.value)}
              required
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addUserField}
          className="text-blue-500 underline text-sm"
        >
          Add another user
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Group
        </button>
      </form>

      {message && (
        <div className="text-center text-sm mt-4 text-green-600 font-medium">
          {message}
        </div>
      )}
    </div>
  );
}

export default CreateGroup;
// This component allows users to create a group by entering a group name and multiple user names.
// It handles the creation of users and the group in a single form submission.  

