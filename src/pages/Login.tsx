import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add Supabase authentication logic here
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg text-2xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 py-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
