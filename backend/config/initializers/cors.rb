Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://task-runner-one.vercel.app', 'http://localhost:4000'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization'],
      max_age: 600,
      allow_headers: ['Content-Type', 'Authorization']
  end
end