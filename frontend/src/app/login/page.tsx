'use client'; // クライアントサイドで実行されることを明示

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // useRouterフックをインポート
import Link from 'next/link'; // Linkコンポーネントをインポート（ページ遷移用）

export default function LoginPage() {
  const [name, setName] = useState(''); // 入力された名前を保持するstate
  const [password, setPassword] = useState(''); // 入力されたパスワードを保持するstate
  const [message, setMessage] = useState(''); // エラーメッセージを保持するstate
  const router = useRouter(); // useRouterフックの使用

  useEffect(() => {
    // ログイン状態の確認
    const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得

    // トークンがない場合はログインページにリダイレクト
    if (!token) {
      router.push('/login'); 
    } else {
      // トークンがあればユーザー情報を取得するAPIリクエスト
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // トークンをAuthorizationヘッダーにセット
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('認証エラー'); // レスポンスが正常でない場合はエラーをスロー
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem('token'); // トークンを削除
          router.push('/login'); // エラーが発生した場合、ログインページにリダイレクト
        });
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // フォーム送信時のページリロードを防止
    setMessage(''); // エラーメッセージをリセット

    try {
      // ログインリクエストを送信
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { name, password }, // ユーザー名とパスワードを送信
        }),
      });

      const data = await res.json(); // レスポンスをJSONとして取得

      if (res.ok) {
        localStorage.setItem('token', data.token); // 成功した場合はトークンをローカルストレージに保存
        setMessage('ログイン成功');
        router.push('/dashboard'); // ログイン成功後にダッシュボードへリダイレクト
      } else {
        setMessage(data.error || 'ログインに失敗しました'); // エラーメッセージを表示
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('ネットワークエラーが発生しました。'); // ネットワークエラーの表示
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">ログイン</h1>

        {message && <p className="text-center text-red-600">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-lg text-gray-600">名前:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)} // 名前入力をstateに反映
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg text-gray-600">パスワード:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // パスワード入力をstateに反映
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            ログイン
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          アカウントがない場合は{' '}
          <Link href="/register" className="text-indigo-600 hover:underline">
            アカウント作成
          </Link>
        </p>
      </div>
    </div>
  );
}