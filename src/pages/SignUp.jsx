import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, isLoading, isAuthenticated, error } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) return;
    if (!email.includes('@')) return alert('Enter a valid email');
    if (password.length < 6)
      return alert('Password must be at least 6 characters');
    if (password !== confirmPassword) return alert('Passwords do not match');

    await register(name, email, password);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit">
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}
