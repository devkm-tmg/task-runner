class User < ApplicationRecord
  # ユーザー名(name)が必須であり、かつ一意であることを確認
  # 名前がすでに使用されている場合、カスタムメッセージでエラーを返す
  validates :name, presence: true, uniqueness: { message: 'この名前は既に使用されています' }

  # パスワード(password)が必須で、最低6文字以上であることを確認
  # パスワードが6文字未満の場合、カスタムメッセージでエラーを返す
  validates :password, presence: true, length: { minimum: 6, message: 'パスワードは6文字以上にしてください' }

  # `has_secure_password` を使って、パスワードのハッシュ化と認証機能を提供
  has_secure_password
end
