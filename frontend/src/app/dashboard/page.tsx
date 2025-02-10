'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [username, setUsername] = useState(''); // ユーザー名を保持するためのstate
  const router = useRouter(); // `useRouter` フックを使ってページ遷移を管理

  // ログイン状態の確認とユーザー名の取得
  useEffect(() => {
    const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得

    if (!token) {
      router.push('/login'); // トークンがない場合、ログインページにリダイレクト
    } else {
      // ユーザー情報を取得するためにAPIリクエストを送信
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // トークンをヘッダーに追加
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('認証エラー'); // レスポンスが正常でない場合はエラーをスロー
          }
          return response.json(); // JSON形式でレスポンスを処理
        })
        .then((data) => {
          setUsername(data.name); // ユーザー名をstateに設定
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem('token'); // トークンが無効な場合は削除
          router.push('/login'); // ログインページにリダイレクト
        });
    }
  }, [router]); // `router`が変更されるたびに実行されるように依存配列に設定

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('token'); // ローカルストレージからトークンを削除
    router.push('/login'); // ログインページにリダイレクト
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center">ダッシュボード</h1>
        {username && ( // ユーザー名が存在する場合のみ表示
          <div className="text-center mt-4">
            <p>ようこそ、{username}さん！</p> {/* ユーザー名を表示 */}
            <button
              onClick={handleLogout} // ログアウトボタンがクリックされたときにhandleLogoutが実行される
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;