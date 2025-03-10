class CreateMainTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :main_tasks do |t|
      t.string :name
      t.boolean :completed
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
