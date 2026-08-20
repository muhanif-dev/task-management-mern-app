import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
}

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Search & Pagination States
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  const fetchTasks = async () => {
    try {
      const response = await API.get(`/tasks?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      if (response.data.success) {
        setTasks(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to fetch tasks');
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);

    try {
      const response = await API.post('/tasks', { title, description });
      if (response.data.success) {
        setTitle('');
        setDescription('');
        setPage(1); // Jump to first page to see the new task
        fetchTasks();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const response = await API.patch(`/tasks/${id}`, { completed: !currentStatus });
      if (response.data.success) {
        setTasks(tasks.map((t) => (t._id === id ? response.data.data : t)));
      }
    } catch (err: any) {
      setError('Failed to update task status');
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleUpdateTask = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      const response = await API.patch(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      if (response.data.success) {
        setEditingId(null);
        setTasks(tasks.map((t) => (t._id === id ? response.data.data : t)));
      }
    } catch (err: any) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await API.delete(`/tasks/${id}`);
      if (response.data.success) {
        fetchTasks(); // Refetch to correctly handle pagination offsets after deletion
      }
    } catch (err: any) {
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Create Task Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Task Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 font-medium"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task List Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
            {/* Search Bar */}
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to page 1 on search
                }}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks found.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center ${
                    task.completed ? 'bg-gray-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  {editingId === task._id ? (
                    <div className="w-full space-y-2 mr-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm text-gray-600"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateTask(task._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task._id, task.completed)}
                          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div>
                          <h3
                            className={`font-medium text-gray-900 ${
                              task.completed ? 'line-through text-gray-400' : ''
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 self-end sm:self-center">
                        <button
                          onClick={() => startEditing(task)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};