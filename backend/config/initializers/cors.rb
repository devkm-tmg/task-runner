
Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
    origins 'https://task-ranner.vercel.app/'
    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options]
    end
end