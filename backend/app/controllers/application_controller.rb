class ApplicationController < ActionController::API
  # 現在のユーザーを取得
  # トークンがデコード可能な場合、キャッシュして @current_user にセット
  def current_user
    @current_user ||= User.find_by(id: decoded_token['user_id']) if decoded_token
  end

  # Authorization ヘッダーを元にトークンをデコードして返す
  # JWTトークンの解析を行い、トークンの内容（ユーザーIDなど）を取得
  def decoded_token
    # Authorization ヘッダーが存在しない場合、nil を返す
    return nil unless request.headers['Authorization'].present?
  
    # "Bearer <token>" 形式からトークン部分を取得
    token = request.headers['Authorization'].split(' ').last
  
    begin
      # JWTをデコードして情報を取得
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base).first
      decoded
    rescue JWT::DecodeError => e
      # デコードエラーの場合は nil を返す
      nil
    end
  end

  # ユーザー認証を行う
  # トークンが正しいかを検証し、ユーザーをセット
  def authenticate_user!
    # Authorization ヘッダーからトークンを取得
    token = request.headers['Authorization']&.split(' ')&.last
    # トークンをデコードしてユーザーIDを取得
    decoded_token = JwtService.decode(token)
  
    if decoded_token && decoded_token['user_id']
      # ユーザーIDが存在すれば、ユーザーを検索して @current_user にセット
      @current_user = User.find(decoded_token['user_id'])
    else
      # 認証に失敗した場合は、401 Unauthorized を返す
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end