import { useState } from 'react';
import { authAPI } from '../api/authAPI';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email.includes('@')) return alert('Enter a valid email');

    setIsLoading(true);
    try {
      await authAPI.requestPasswordReset(email);
      setMessage('Password reset link sent to your email');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        <Button type="submit">
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  );
}
