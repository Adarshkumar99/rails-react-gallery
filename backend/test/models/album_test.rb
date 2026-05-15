require "test_helper"

class AlbumTest < ActiveSupport::TestCase

  def setup
    @user = users(:one)

    @album = Album.new(
      title: "Vacation Album",
      is_private: false,
      user: @user
    )
  end

  # ─────────────────────────────────────────
  # VALIDATIONS
  # ─────────────────────────────────────────

  test "should be valid with valid attributes" do
    assert @album.valid?
  end

  test "should require title" do
    @album.title = nil

    assert_not @album.valid?
    assert_includes @album.errors[:title], "can't be blank"
  end

  test "should belong to user" do
    @album.user = nil

    assert_not @album.valid?
  end

  # ─────────────────────────────────────────
  # SCOPES
  # ─────────────────────────────────────────

  test "public_albums scope returns only public albums" do
    public_album  = albums(:public_one)
    private_album = albums(:private_one)

    results = Album.public_albums

    assert_includes results, public_album
    assert_not_includes results, private_album
  end

  test "private_albums scope returns only private albums" do
    public_album  = albums(:public_one)
    private_album = albums(:private_one)

    results = Album.private_albums

    assert_includes results, private_album
    assert_not_includes results, public_album
  end

  # ─────────────────────────────────────────
  # ASSOCIATIONS
  # ─────────────────────────────────────────

  test "destroying album should destroy associated photos" do
    album = albums(:public_one)

    Photo.create!(
      album: album
    )

    assert_difference("Photo.count", -2) do
      album.destroy
    end
  end
end