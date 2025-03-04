class MainTask < ApplicationRecord
  belongs_to :user
  has_many :main_sub_tasks, dependent: :destroy
  has_many :sub_tasks, through: :main_sub_tasks

  validates :name, presence: true
end