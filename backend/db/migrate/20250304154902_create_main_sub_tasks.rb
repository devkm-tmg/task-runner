class CreateMainSubTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :main_sub_tasks do |t|
      t.references :main_task, null: false, foreign_key: true
      t.references :sub_task, null: false, foreign_key: true

      t.timestamps
    end
  end
end
