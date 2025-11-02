import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Task {
  id: number;
  title: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Finish homework' },
    { id: 2, title: 'Call Aai' },
    { id: 3, title: 'Buy groceries' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
    setLoading(false);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask }]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-white flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">
            Your Tasks
          </h1>

          <div className="mb-12">
            <ul className="space-y-4">
              {tasks.map((task, index) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <span className="text-lg text-gray-700 font-medium">
                    {index + 1}. {task.title}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8 space-y-4">
            <label className="block text-lg font-semibold text-gray-700">
              New Task
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a new task"
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-lg"
              />
              <button
                onClick={handleAddTask}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 md:w-auto"
              >
                Add Task
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-4 px-6 bg-gray-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
