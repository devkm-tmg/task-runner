class CreateSubTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :sub_tasks do |t|
      t.string :name
      t.boolean :completed
      t.integer :sort

      t.timestamps
    end
  end
end
