Rails.application.config.middleware.insert_before 0, Rack::Cors do
  # 許可するオリジン（アクセス元）を指定
  allow do
    origins 'https://task-runner-one.vercel.app/', 'http://localhost:4000'

    # CORSの設定で、リソース（APIエンドポイント）の共有を許可
    resource '*', 
      headers: :any, 
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end