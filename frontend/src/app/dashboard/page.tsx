'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

const Dashboard = () => {
  const [username, setUsername] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // loading状態を追加
  const router = useRouter();

  // ログイン状態の確認とユーザー名、タスクの取得
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('認証エラー');
          }

          const data = await response.json(); // JSON型で取得
          console.log('API response:', data); // ユーザー情報のレスポンス
          setUsername(data.name); // ユーザー名を設定
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          router.push('/login');
        }
      };

      const fetchTasksData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main_tasks`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          const data: Task[] = await response.json(); // Task型にキャスト
          console.log('Tasks response:', data);
          if (Array.isArray(data)) {
            setTasks(data); // タスクが配列であればセット
          } else {
            console.error('Invalid data format for tasks:', data);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setLoading(false); // ローディング状態を解除
        }
      };

      fetchUserData();
      fetchTasksData();
    }
  }, [router]);

  // メインタスクがクリックされたときの処理
  const handleTaskClick = (taskId: number) => {
    router.push(`/task/${taskId}`); // メインタスク詳細画面へ遷移
  };

  // メインタスク作成フォーム送信処理
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main_tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newTaskName }),
      });

      if (!response.ok) {
        throw new Error('Error creating task');
      }

      const data: Task = await response.json(); // Task型でレスポンスをキャスト
      setTasks([...tasks, data]); // 新しく作成したタスクを追加
      setNewTaskName(''); // フォームをクリア
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center">ダッシュボード</h1>
        {username && (
          <div className="text-center mt-4">
            <p>ようこそ、{username}さん！</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              ログアウト
            </button>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold">メインタスクの作成</h2>
          <form onSubmit={handleCreateTask} className="mt-4">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="新しいタスク名"
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              タスクを作成
            </button>
          </form>
        </div>

        <div className="task-list mt-8">
          <h2 className="text-xl font-semibold">メインタスク一覧</h2>
          {loading ? (
            <p>タスクを読み込み中...</p>
          ) : tasks.length === 0 ? (
            <p>まだタスクがありません。</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="task-item p-4 my-2 bg-gray-200 rounded cursor-pointer"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="task-name">{task.name}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;