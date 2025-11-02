import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'done';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    } else {
      setUserId(session.user.id);
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: userId,
            title: newTask,
            priority: newPriority,
            status: 'pending',
          },
        ])
        .select();

      if (error) {
        console.error('Error adding task:', error);
      } else {
        setTasks([...data, ...tasks]);
        setNewTask('');
        setNewPriority('medium');
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'in-progress' | 'done') => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)));
    }
  };

  const handleUpdatePriority = async (id: string, newPriority: 'low' | 'medium' | 'high') => {
    const { error } = await supabase
      .from('tasks')
      .update({ priority: newPriority })
      .eq('id', id);

    if (error) {
      console.error('Error updating priority:', error);
    } else {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, priority: newPriority } : task)));
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 text-center mb-12">
            Your Tasks
          </h1>

          <div className="mb-12">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-blue-50 rounded-lg border-l-4 border-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-700 font-medium mb-3">{task.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <select
                          value={task.priority}
                          onChange={(e) => handleUpdatePriority(task.id, e.target.value as 'low' | 'medium' | 'high')}
                          className={`px-3 py-1 rounded text-sm font-semibold cursor-pointer border-0 ${getPriorityColor(task.priority)}`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value as 'pending' | 'in-progress' | 'done')}
                          className={`px-3 py-1 rounded text-sm font-semibold cursor-pointer border-0 ${getStatusColor(task.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 transition-colors self-start md:self-center"
                      title="Delete task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8 space-y-4 bg-gray-50 p-6 rounded-lg">
            <label className="block text-lg font-semibold text-gray-700">
              Add New Task
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter task title"
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-lg"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={handleAddTask}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
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
