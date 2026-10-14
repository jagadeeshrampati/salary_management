class CompensationItem < ApplicationRecord
  audited
  COMPONENT_TYPES = %w[
    basic_salary
    hra
    special_allowance
    performance_bonus
    employer_pf
  ].freeze

  CATEGORIES = %w[
    fixed_earnings
    variable_earnings
    employer_contribution
  ].freeze

  belongs_to :compensation_package

  validates :component_type,
            presence: true,
            inclusion: { in: COMPONENT_TYPES },
            uniqueness: { scope: :compensation_package_id }

  validates :category,
            presence: true,
            inclusion: { in: CATEGORIES }

  validates :amount,
            numericality: { greater_than_or_equal_to: 0 }


  def as_json(options = {})
    {
      id: id,
      component_type: component_type,
      category: category,
      amount: amount.to_s("F")
    }
  end
end
