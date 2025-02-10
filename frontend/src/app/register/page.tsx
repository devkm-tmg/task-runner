'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState(''); // ユーザー名の入力を保持するstate
  const [password, setPassword] = useState(''); // パスワードの入力を保持するstate
  const [errors, setErrors] = useState<string[]>([]); // エラーメッセージの配列を保持するstate

  // フォーム送信時に呼ばれる処理
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // デフォルトのフォーム送信動作を防ぐ
    setErrors([]); // 送信前にエラーをリセット

    // APIリクエストを送信して、新しいユーザーを作成
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: { name, password }, // フォームの値をリクエストボディに送信
      }),
    });

    const data = await res.json(); // レスポンスをJSONとして取得

    // 成功した場合は、成功メッセージを表示
    if (res.ok) {
      setErrors(['ユーザーが作成されました']); // メッセージのみ表示
    } else {
      setErrors(data.errors || ['エラーが発生しました']); // エラーがあればエラーメッセージを表示
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">アカウント作成</h1>

        {errors.length > 0 && (
          <div className="mb-4">
            {errors.map((error, index) => (
              <p key={index} className={`text-center ${error === 'ユーザーが作成されました' ? 'text-green-600' : 'text-red-600'}`}>
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-lg text-gray-600">名前:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)} // 名前の入力値をstateに保存
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
              onChange={(e) => setPassword(e.target.value)} // パスワードの入力値をstateに保存
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            登録
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}