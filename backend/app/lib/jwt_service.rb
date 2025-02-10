class JwtService
  # JWTをエンコードする際に使用する秘密鍵
  HMAC_SECRET = ENV['JWT_SECRET_KEY']

  # ユーザーIDを使ってJWTトークンを生成する
  # @param user_id [Integer] ユーザーID
  # @return [String] JWTトークン
  def self.encode(user_id)
    # ペイロードにユーザーIDを含めてトークンを生成
    payload = { user_id: user_id }
    JWT.encode(payload, HMAC_SECRET)
  end

  # JWTトークンをデコードしてユーザーIDを取得する
  # @param token [String] JWTトークン
  # @return [Integer, nil] ユーザーID（デコード失敗時はnil）
  def self.decode(token)
    # JWTトークンをデコードし、ペイロード部分を取得
    decoded = JWT.decode(token, HMAC_SECRET, true, algorithm: 'HS256')

    # デコードしたペイロードからユーザーIDを取得
    decoded.first['user_id']
  rescue JWT::DecodeError
    # デコードエラーが発生した場合、nil を返す
    nil
  end
end