class Photo < ApplicationRecord
  belongs_to :album, counter_cache: true
  has_one_attached :image
end
