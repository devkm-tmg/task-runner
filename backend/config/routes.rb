Rails.application.routes.draw do
  namespace :api do
    post 'register', to: 'register#create'
    post 'auth/login', to: 'auth#login'
    get 'users/me', to: 'users#me'
    resource :user, only: [:show]
    resources :users, only: []
    resources :main_tasks, only: [:index, :show, :create, :update, :destroy] do
      resources :sub_tasks, only: [:index, :create, :update, :destroy]
    end
  end
end
