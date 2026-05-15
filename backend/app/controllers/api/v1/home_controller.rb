module Api
  module V1
    class HomeController < ApplicationController

      def index
      	@albums = Album.public_albums.includes(:user, cover_image_attachment: :blob).last(4)
      	render json: {
      	  albums: @albums.map { |album|
      		  {
      			  id: album.id,
      			  title: album.title,
      			  cover_image_url: album.cover_image.attached? ? url_for(album.cover_image) : nil,
      			  photos_count: album.photos_count,
      			  user: { email: album.user.email }
      		  }
      	  },
      	  total_albums: Album.count,
          total_photos: Photo.count,
          total_user: User.count
        }
      end
    end
  end
end
