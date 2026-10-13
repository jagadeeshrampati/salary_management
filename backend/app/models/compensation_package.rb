class CompensationPackage < ApplicationRecord
  normalizes :currency, with: ->(value) { value.strip.upcase }

  belongs_to :employee

  has_many :compensation_items, dependent: :destroy

  validates :currency,
            presence: true,
            format: { with: /\A[A-Z]{3}\z/ }

  validates :effective_from, presence: true

  validates :effective_to,
            comparison: { greater_than: :effective_from },
            if: -> { effective_to.present? && effective_from.present? }

  validate :effective_period_does_not_overlap

  def total_compensation
    compensation_items.sum(:amount)
  end

  def total_by_category(category)
    compensation_items.where(category: category).sum(:amount)
  end

  def as_json(options = {})
    {
      id: id,
      currency: currency,
      effective_from: effective_from,
      effective_to: effective_to,
      change_reason: change_reason,
      total_annual_compensation: total_compensation.to_s("F"),
      items: compensation_items.map(&:as_json)
    }
  end

  private

  def effective_period_does_not_overlap
    return unless employee && effective_from

    overlapping_packages = employee.compensation_packages
                                    .where.not(id: id)
                                    .where("effective_from < ?", effective_to || Date.new(9999, 12, 31))
                                    .where(
                                      "effective_to IS NULL OR effective_to > ?",
                                      effective_from
                                    )

    return unless overlapping_packages.exists?

    errors.add(:base, "Compensation periods must not overlap")
  end
end