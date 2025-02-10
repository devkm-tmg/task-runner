if ENV['JWT_SECRET_KEY'].nil? || ENV['JWT_SECRET_KEY'].empty?
    # ランダムな秘密鍵を生成
    ENV['JWT_SECRET_KEY'] = SecureRandom.hex(64)
    puts "Generated a new JWT_SECRET_KEY: #{ENV['JWT_SECRET_KEY']}"
end