class Api::TasksController < ApplicationController
    # ユーザー認証を行う
    before_action :authenticate_user!

    # ユーザーに関連するタスク一覧を返す
    def index
    # 現在のユーザーに関連するタスクを取得
    tasks = Task.where(user_id: @current_user.id)
    
    # タスクが見つからなければ空配列を返す
    render json: tasks
    end
end
