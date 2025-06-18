// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabel =
    ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'][strength - 1] ||
    '';
  const strengthColors = [
    'bg-red-500',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-blue-500',
    'bg-green-600',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6)
      return toast.error('Password must be at least 6 characters');
    if (!/[A-Z]/.test(password))
      return toast.error('Password must include an uppercase letter');
    if (!/[a-z]/.test(password))
      return toast.error('Password must include a lowercase letter');
    if (!/[0-9]/.test(password))
      return toast.error('Password must include a number');
    if (password !== confirmPassword)
      return toast.error('Passwords do not match');

    setIsLoading(true);
    try {
      console.log(token, password);
      await authAPI.resetPassword({ token, newPassword: password });

      toast.success('Password reset successful! Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🔐 Reset Password
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[36px] text-sm text-blue-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Password Strength Meter */}
        {password && (
          <div className="mb-2">
            <div className="h-2 w-full rounded bg-gray-200">
              <div
                className={`h-2 rounded ${strengthColors[strength - 1]}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-gray-600">
              Strength: {strengthLabel}
            </p>
          </div>
        )}

        <div className="relative">
          <Input
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
