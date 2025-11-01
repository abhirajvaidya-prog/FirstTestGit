import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-white flex items-center justify-center px-4">
      <div className="text-center space-y-12 max-w-4xl w-full">
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
          Welcome to My Task Manager
        </h1>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => navigate('/login')}
            className="w-64 py-6 px-8 bg-white text-blue-600 rounded-xl text-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Login
          </button>

          <button
            onClick={() => navigate('/signup')}
            className="w-64 py-6 px-8 bg-white text-blue-600 rounded-xl text-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Signup
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-64 py-6 px-8 bg-white text-blue-600 rounded-xl text-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
