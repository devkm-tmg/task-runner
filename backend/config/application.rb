require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
    config.autoload_lib(ignore: %w[assets tasks])
  end
end
