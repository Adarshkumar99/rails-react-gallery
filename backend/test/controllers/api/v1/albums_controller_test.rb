require "test_helper"
module Api
  module V1
    class AlbumsControllerTest < ActionDispatch::IntegrationTest
 
      # ─────────────────────────────────────────
      # SETUP
      # ─────────────────────────────────────────
      def setup
        @user       = users(:one) 
        @other_user = users(:two)
        @album      = albums(:public_one)
      end
 
      # ─────────────────────────────────────────
      # INDEX  GET /api/v1/albums
      # ─────────────────────────────────────────
      test "index: returns 200 and public albums without auth" do
        get api_v1_albums_url
        assert_response :success
 
        json = JSON.parse(response.body)
        assert json.is_a?(Array)
      end
 
      test "index: response has required keys" do
        get api_v1_albums_url
        json = JSON.parse(response.body)
 
        json.each do |album|
          assert_includes album.keys, "id"
          assert_includes album.keys, "title"
          assert_includes album.keys, "cover_image_url"
          assert_includes album.keys, "photos_count"
          assert_includes album.keys, "user"
          assert_includes album["user"].keys, "email"
        end
      end
 
      test "index: does not return private albums" do
        private_album = albums(:private_one)
 
        get api_v1_albums_url
        json = JSON.parse(response.body)
        ids  = json.map { |a| a["id"] }
 
        assert_not_includes ids, private_album.id
      end
 
      # ─────────────────────────────────────────
      # SHOW  GET /api/v1/albums/:id
      # ─────────────────────────────────────────
      test "show: returns album with photos without auth" do
        get api_v1_album_url(@album)
        assert_response :success
 
        json = JSON.parse(response.body)
        assert_equal @album.id,    json["id"]
        assert_equal @album.title, json["title"]
        assert_includes json.keys, "photos"
        assert_includes json.keys, "is_private"
      end
 
      test "show: returns 404 for non-existent album" do
        get api_v1_album_url(id: 999_999)
        # controller me find_by use ho raha hai — ensure error handling hai
        assert_response :not_found
      end
 
      # ─────────────────────────────────────────
      # CREATE  POST /api/v1/albums
      # ─────────────────────────────────────────
      test "create: authenticated user can create album" do
        assert_difference("Album.count", 1) do
          post api_v1_albums_url,
               params:  { album: { title: "New Album", is_private: false } },
               headers: auth_headers(@user),
               as:      :json
        end
        assert_response :created
      end
 
      test "create: returns album data on success" do
        post api_v1_albums_url,
             params:  { album: { title: "My Trip", is_private: true } },
             headers: auth_headers(@user),
             as:      :json
 
        json = JSON.parse(response.body)
        assert_equal "My Trip", json["title"]
      end
 
      test "create: returns 422 when title is blank" do
        post api_v1_albums_url,
             params:  { album: { title: "" } },
             headers: auth_headers(@user),
             as:      :json
 
        assert_response :unprocessable_entity
      end
 
      test "create: unauthenticated user gets 401" do
        post api_v1_albums_url,
             params: { album: { title: "Hacker Album" } },
             as:     :json
 
        assert_response :unauthorized
      end
 
      # ─────────────────────────────────────────
      # UPDATE  PATCH /api/v1/albums/:id
      # ─────────────────────────────────────────
      test "update: owner can update album" do
        patch api_v1_album_url(@album),
              params:  { album: { title: "Updated Title" } },
              headers: auth_headers(@user),
              as:      :json
 
        assert_response :success
        assert_equal "Updated Title", JSON.parse(response.body)["title"]
      end
 
      test "update: non-owner cannot update album" do
        patch api_v1_album_url(@album),
              params:  { album: { title: "Stolen Title" } },
              headers: auth_headers(@other_user),
              as:      :json
 
        # set_album uses current_user.albums.find → raises RecordNotFound
        assert_response :not_found
      end
 
      test "update: unauthenticated user gets 401" do
        patch api_v1_album_url(@album),
              params: { album: { title: "No Auth" } },
              as:     :json
 
        assert_response :unauthorized
      end
 
      test "update: returns 422 on invalid params" do
        patch api_v1_album_url(@album),
              params:  { album: { title: "" } },
              headers: auth_headers(@user),
              as:      :json
 
        assert_response :unprocessable_entity
      end
 
      # ─────────────────────────────────────────
      # DESTROY  DELETE /api/v1/albums/:id
      # ─────────────────────────────────────────
      test "destroy: owner can delete album" do
        album = albums(:deletable)
 
        assert_difference("Album.count", -1) do
          delete api_v1_album_url(album),
                 headers: auth_headers(@user)
        end
        assert_response :success
        assert_equal "Album deleted successfully",
                     JSON.parse(response.body)["message"]
      end
 
      test "destroy: non-owner cannot delete album" do
        delete api_v1_album_url(@album),
               headers: auth_headers(@other_user)
 
        assert_response :not_found
      end
 
      test "destroy: unauthenticated user gets 401" do
        delete api_v1_album_url(@album)
        assert_response :unauthorized
      end
 
      # ─────────────────────────────────────────
      # MY_ALBUMS  GET /api/v1/albums/my_albums
      # ─────────────────────────────────────────
      test "my_albums: returns only current user albums" do
        get my_albums_api_v1_albums_url, headers: auth_headers(@user)
 
        assert_response :success
        json = JSON.parse(response.body)
        assert json.is_a?(Array)
 
        json.each do |album|
          assert_includes album.keys, "id"
          assert_includes album.keys, "title"
          assert_includes album.keys, "photos_count"
          assert_includes album.keys, "cover_image_url"
        end
      end
 
      test "my_albums: does not return other user albums" do
        other_album = albums(:other_user_album)
 
        get my_albums_api_v1_albums_url, headers: auth_headers(@user)
        json = JSON.parse(response.body)
        ids  = json.map { |a| a["id"] }
 
        assert_not_includes ids, other_album.id
      end
 
      test "my_albums: unauthenticated user gets 401" do
        get my_albums_api_v1_albums_url
        assert_response :unauthorized
      end

    end
  end
end
 