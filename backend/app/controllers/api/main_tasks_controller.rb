class Api::MainTasksController < ApplicationController
    before_action :authenticate_user!
    before_action :set_main_task, only: [:show, :update, :destroy]

    # GET /api/main_tasks
    def index
        @main_tasks = MainTask.where(user_id: @current_user.id)  # @current_userを使用
        render json: @main_tasks
    end

    # GET /api/main_tasks/:id
    def show
        @task = MainTask.find_by(id: params[:id])
        if @task
            render json: @task
        else
            render json: { error: "Task not found" }, status: :not_found
        end
    end

    # POST /api/main_tasks
    def create
    @main_task = MainTask.new(main_task_params)
    @main_task.user = @current_user  # @current_userを使用

    if @main_task.save
        render json: @main_task, status: :created
    else
        render json: @main_task.errors, status: :unprocessable_entity
    end
    end

    # PATCH/PUT /api/main_tasks/:id
    def update
    if @main_task.update(main_task_params)
        render json: @main_task
    else
        render json: @main_task.errors, status: :unprocessable_entity
    end
    end

    # DELETE /api/main_tasks/:id
    def destroy
        @main_task.destroy
        head :no_content
    end

    private

    def set_main_task
        @main_task = MainTask.find_by(id: params[:id], user_id: @current_user.id)  # @current_userを使用
        if @main_task.nil?
            render json: { error: "Task not found" }, status: :not_found
        end
    end

    def main_task_params
    ms.require(:main_task).permit(:name, :completed)
    end
end
