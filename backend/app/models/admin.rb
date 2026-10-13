class Admin < ApplicationRecord
end

class Admin < ApplicationRecord
  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :name, presence: true
  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: { with: URI::MailTo::EMAIL_REGEXP }

end