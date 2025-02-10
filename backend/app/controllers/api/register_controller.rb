class Api::RegisterController < ApplicationController
  # 新規ユーザー登録処理
  # ユーザー名とパスワードを受け取り、新しいユーザーを作成
  def create
    # パラメータから user の name と password を取得
    user_params = params.require(:user).permit(:name, :password)
    # 新しいユーザーオブジェクトを作成
    user = User.new(user_params)

    # ユーザーが正常に保存できた場合
    if user.save
      # ユーザー作成成功メッセージを返す
      render json: { message: 'ユーザー作成成功' }, status: :created
    else
      # バリデーションエラーが発生した場合、エラーメッセージを返す
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end