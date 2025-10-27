import { useState } from 'react';
import { makeUserAdmin } from '../lib/firebaseService';

const MakeAdmin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await makeUserAdmin(email);
      setMessage(`Successfully made ${email} an admin.`);
    } catch (error) {
        if(error instanceof Error) {
            setMessage(error.message);
        }
    }
  };

  return (
    <div>
      <h2>Make User Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          required
        />
        <button type="submit">Make Admin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MakeAdmin;
