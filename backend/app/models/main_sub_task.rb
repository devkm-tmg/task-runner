class MainSubTask < ApplicationRecord
  belongs_to :main_task
  belongs_to :sub_task
end