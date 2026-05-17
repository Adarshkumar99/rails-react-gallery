module Api
  module V1
    class AlbumsController < ApplicationController
    	before_action :authenticate_user!, except: [:index, :show]
      before_action :set_album, only: [:update, :destroy, :edit]

      def index
      	@albums = Album.public_albums.includes(:user, cover_image_attachment: :blob)
      	render json: @albums.map { |album|
      		{
      			id: album.id,
      			title: album.title,
      			cover_image_url: album.cover_image.attached? ? url_for(album.cover_image) : nil,
      			photos_count: album.photos_count,
            is_private: album.is_private,
            is_owner: user_signed_in? && album.user_id == current_user.id,
      			user: { email: album.user.email }
      		}
      	}
      end

      def create
        album = current_user.albums.new(album_params)
        if album.save
          render json: album, status: :created
        else
          render json: album.errors, status: :unprocessable_entity
        end
      end

      def edit
      end

      def update
        if @album.update(album_params)
          render json: @album
        else
          render json: @album.errors, status: :unprocessable_entity
        end
      end

      def show
      	@album = Album.find_by(id: params[:id])
      	if @album.nil?
      	  render json: { error: "Album not found" }, status: :not_found
      	  return
      	end
      	render json: {
      		id: @album.id,
      		title: @album.title,
      		cover_image_url: @album.cover_image.attached? ? url_for(@album.cover_image) : nil,
      		is_private: @album.is_private,
          is_owner: user_signed_in? && @album.user_id == current_user.id, #this will help frontend to decide whether to show edit/delete buttons
      		photos: @album.photos.map { |photo|
      			{
      				id: photo.id,
      				image_url: photo.image.attached? ? url_for(photo.image) : nil
      			}
      		}
      	}
      end

      def destroy
        @album.destroy
        render json: { message: "Album deleted successfully" }
      end

      def my_albums
      	@albums = current_user.albums.includes(cover_image_attachment: :blob).order(created_at: :desc)
      	render json: @albums.map { |album|
      		{
      			id: album.id,
      			title: album.title,
      			cover_image_url: album.cover_image.attached? ? url_for(album.cover_image) : nil,
      			photos_count: album.photos_count,
            is_private: album.is_private,
            is_owner: user_signed_in? && album.user_id == current_user.id
      		}
      	}
      end

      private

      def set_album
        @album = current_user.albums.find(params[:id])
      end

      def album_params
        params.require(:album).permit(:title, :cover_image, :is_private)
      end
    end
  end
end