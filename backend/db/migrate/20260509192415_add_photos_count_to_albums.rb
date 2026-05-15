class AddPhotosCountToAlbums < ActiveRecord::Migration[8.1]
  def change
     add_column :albums, :photos_count, :integer, default: 0, null: false
  end
end
