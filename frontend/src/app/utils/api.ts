// APIのベースURLを取得。環境変数が設定されていなければ、ローカルのバックエンドURLを使用
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// 認証情報を含むfetchリクエストを送信する関数
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // ブラウザ環境ではローカルストレージからトークンを取得
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // ヘッダー設定
  const headers = {
    'Content-Type': 'application/json', // JSON形式のリクエストとレスポンス
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // トークンがあれば、Authorizationヘッダーにセット
  };

  // fetchリクエストを送信
  const res = await fetch(`${API_URL}${url}`, {
    ...options, // 任意のオプションをマージ
    headers, // ヘッダーを追加
  });

  // レスポンスのJSONを返す
  return res.json();
};