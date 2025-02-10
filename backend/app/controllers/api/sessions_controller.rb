class Api::SessionsController < ApplicationController
  # ログイン処理
  # ユーザー名とパスワードを受け取り、認証を行い、トークンを返す
  def create
    # リクエストパラメータのデバッグログ
    puts "Received params: #{params.inspect}"

    # ユーザー名でユーザーを検索
    user = User.find_by(name: params[:name])

    # ユーザーが見つからない場合、認証エラーを返す
    if user.nil?
      render json: { message: 'Invalid credentials' }, status: :unauthorized
      return
    end

    # パスワードが正しくない場合、認証エラーを返す
    unless user.authenticate(params[:password])
      render json: { message: 'Invalid credentials' }, status: :unauthorized
      return
    end

    # ユーザーIDを使ってトークンをエンコードして生成
    token = JwtService.encode({ user_id: user.id })

    # トークンをレスポンスとして返す
    render json: { token: token }
  rescue => e
    # 例外が発生した場合、エラーログに詳細を出力
    logger.debug "Error: #{e.message}"
    
    # 内部サーバエラーを返す
    render json: { message: 'Internal Server Error' }, status: :internal_server_error
  end
end