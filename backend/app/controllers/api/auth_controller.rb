require_relative '../../lib/jwt_service'

class Api::AuthController < ApplicationController
  # ログイン処理
  # ユーザー名とパスワードを受け取り、認証を行う
  def login
    # ユーザー名でユーザーを検索
    user = User.find_by(name: params[:user][:name])

    # ユーザーが見つかり、パスワードが正しい場合
    if user&.authenticate(params[:user][:password])
      # ユーザーIDをエンコードしてトークンを生成
      token = JwtService.encode(user_id: user.id)
      # トークンをJSONで返す
      render json: { token: token }
    else
      # 認証に失敗した場合は、エラーメッセージと共に401を返す
      render json: { error: '認証情報が正しくありません' }, status: :unauthorized
    end
  end
end