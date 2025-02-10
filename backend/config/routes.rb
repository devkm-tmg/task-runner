Rails.application.routes.draw do
  # `api` 名前空間内のルーティングを定義
  namespace :api do
    post 'register', to: 'register#create'
    post 'auth/login', to: 'auth#login'
    get 'users/me', to: 'users#me'
    resource :user, only: [:show]
    resources :users, only: []
  end
end