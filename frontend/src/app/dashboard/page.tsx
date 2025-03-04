'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ログイン状態の確認とユーザー名、タスクの取得
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
    } else {
      // ユーザー情報の取得
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('認証エラー');
          }
          return response.json();
        })
        .then((data) => {
          console.log('API response:', data); // ユーザー情報のレスポンス
          setUsername(data.name); // ユーザー名を設定
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          router.push('/login');
        });

      // メインタスクの取得
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main_tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Tasks response:', data); // タスク情報のレスポンス
          if (Array.isArray(data)) {
            setTasks(data); // タスクが配列であればセット
          } else {
            console.error('Invalid data format for tasks:', data); // エラーハンドリング
          }
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
        })
        .finally(() => setLoading(false)); // ローディング状態を解除
    }
  }, [router]);

  // メインタスクがクリックされたときの処理
  const handleTaskClick = (taskId: string) => {
    router.push(`/task/${taskId}`); // メインタスク詳細画面へ遷移
  };

  // メインタスク作成フォーム送信処理
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main_tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newTaskName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]); // 新しく作成したタスクを追加
        setNewTaskName(''); // フォームをクリア
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
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
          {tasks.length === 0 ? (
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
