class Api::UsersController < ApplicationController
  # `me` アクションにアクセスする前にユーザー認証を行う
  before_action :authenticate_user!, only: [:me]

  # 現在のユーザー情報を返す
  # `@current_user` は `authenticate_user!` コールバックでセットされる
  def me
    # 現在認証されているユーザー情報を JSON 形式で返す
    render json: @current_user
  end
end