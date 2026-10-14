class Admin < ApplicationRecord
  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :name, presence: true
  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: { with: URI::MailTo::EMAIL_REGEXP }

  has_many :audits, as: :user, class_name: "Audited::Audit", dependent: :nullify

end