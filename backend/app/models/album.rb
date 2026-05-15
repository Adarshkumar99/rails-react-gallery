class Album < ApplicationRecord
  belongs_to :user
  has_many :photos, dependent: :destroy
  has_one_attached :cover_image

  scope :public_albums, -> { where(is_private: false) }
  scope :private_albums, -> { where(is_private: true) }

  validates :title, presence: true
end
