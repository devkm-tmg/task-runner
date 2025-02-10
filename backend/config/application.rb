require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    # Rails 8.0のデフォルト設定をロード
    config.load_defaults 8.0

    # APIモードに設定
    config.api_only = true

    # 自動ロード対象からassetsとtasksを除外
    config.autoload_lib(ignore: %w[assets tasks])

    # クロスサイトリクエストフォージェリ（CSRF）保護を無効化
    config.action_controller.allow_forgery_protection = false

    # libディレクトリをeager load対象に追加
    config.eager_load_paths += %W(#{config.root}/lib)
  end
end