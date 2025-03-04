class SubTask < ApplicationRecord
    has_many :main_sub_tasks, dependent: :destroy
    has_many :main_tasks, through: :main_sub_tasks
  
    validates :name, presence: true
  end