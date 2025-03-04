class Api::SubTasksController < ApplicationController
    before_action :set_main_task
    before_action :set_sub_task, only: [:update, :destroy]

    # GET /api/main_tasks/:main_task_id/sub_tasks
    def index
    # メインタスクに紐づくサブタスク一覧をソート順で取得
    render json: @main_task.sub_tasks.order(:sort)
    end

    # POST /api/main_tasks/:main_task_id/sub_tasks
    def create
    @sub_task = @main_task.sub_tasks.new(sub_task_params)

    if @sub_task.save
        render json: @sub_task, status: :created
    else
        render json: @sub_task.errors, status: :unprocessable_entity
    end
    end

    # PATCH/PUT /api/main_tasks/:main_task_id/sub_tasks/:id
    def update
    if @sub_task.update(sub_task_params)
        render json: @sub_task
    else
        render json: @sub_task.errors, status: :unprocessable_entity
    end
    end

    # DELETE /api/main_tasks/:main_task_id/sub_tasks/:id
    def destroy
    @sub_task.destroy
    head :no_content
    end

    private

    def set_main_task
    @main_task = MainTask.find(params[:main_task_id])
    end

    def set_sub_task
    @sub_task = @main_task.sub_tasks.find(params[:id])
    end

    def sub_task_params
    params.require(:sub_task).permit(:name, :completed, :sort)
    end
end