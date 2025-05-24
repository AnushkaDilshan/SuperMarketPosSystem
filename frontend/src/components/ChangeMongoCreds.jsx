import React, { useState } from 'react';

export default function ChangeMongoCreds() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/update-env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div>
      <h2>Update MongoDB Credentials</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Mongo Username" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mongo Password" type="password" required />
        <button type="submit">Update</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
