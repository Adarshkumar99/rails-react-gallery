class AddIsPrivateToAlbums < ActiveRecord::Migration[8.1]
  def change
    add_column :albums, :is_private, :boolean, default: false, null: false
  end
end
