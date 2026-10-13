class Employee < ApplicationRecord
  STATUSES = %w[
    active
    on_leave
    terminated
  ].freeze

  normalizes :employee_code, with: ->(value) { value.strip.upcase }
  normalizes :email, with: ->(value) { value.strip.downcase }
  normalizes :country_code, with: ->(value) { value.strip.upcase }

  has_many :compensation_packages,
           dependent: :restrict_with_exception

  validates :employee_code, presence: true, uniqueness: true
  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :first_name, :last_name, :department, :job_title,
            presence: true

  validates :country_code,
            presence: true,
            format: { with: /\A[A-Z]{2}\z/ }

  validates :status, inclusion: { in: STATUSES }

  def full_name
    "#{first_name} #{last_name}"
  end
end