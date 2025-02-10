Rails.application.config.middleware.insert_before 0, Rack::Cors do
  # 許可するオリジン（アクセス元）を指定
  # ここでは、`task-runner.vercel.app`（本番環境）と `localhost:4000`（開発環境）からのリクエストを許可
  allow do
    origins 'https://task-runner.vercel.app', 'http://localhost:4000'

    # CORSの設定で、リソース（APIエンドポイント）の共有を許可
    resource '*', 
      headers: :any, 
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end