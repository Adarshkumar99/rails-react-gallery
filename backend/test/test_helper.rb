ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "bcrypt"

module ActiveSupport
  class TestCase
    parallelize(workers: :number_of_processors)

    fixtures :all

    # Devise JWT auth helper
    def auth_headers(user)
      token = Warden::JWTAuth::UserEncoder
                .new
                .call(user, :user, nil)
                .first

      {
        "Authorization" => "Bearer #{token}",
        "Content-Type"  => "application/json"
      }
    end
  end
end