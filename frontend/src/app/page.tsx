export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-700">Task Runner</h1>
      <p className="mt-4 text-lg text-gray-600">Next.js × Rails でタスク管理！</p>
      <a 
        href="/login" 
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        ログイン
      </a>
    </div>
  );
}
