module Api
  module V1
    class PhotosController < ApplicationController
      before_action :authenticate_user!

      def create
        album = current_user.albums.find_by(id: photo_params[:album_id])

        unless album
          return render json: { error: "Album not found" }, status: :not_found
        end

        photo = album.photos.new(image: photo_params[:image])

        if photo.save
          render json: {
            id: photo.id,
            image_url: url_for(photo.image)
          }, status: :created
        else
          render json: photo.errors.full_messages, status: :unprocessable_entity
        end
      end

      def destroy
      	photo = Photo.find_by(id: params[:id])
      	photo.destroy
        render json: { message: "Photo deleted successfully" }
      end

      private

      def photo_params
        params.require(:photo).permit(:album_id, :image)
      end
    end
  end
end