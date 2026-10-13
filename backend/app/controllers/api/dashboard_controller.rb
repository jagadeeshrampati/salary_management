class Api::DashboardController < ApplicationController
  def show
    active_employees = Employee.where(status: "active")
    packages = current_packages

    render json: {
      data: {
        summary: {
          total_employees: Employee.count,
          active_employees: active_employees.count
        },
        headcount_by_department: active_employees
          .group(:department)
          .order(:department)
          .count
          .map { |department, count|
            { department: department, count: count }
          },
        headcount_by_country: active_employees
          .group(:country_code)
          .order(:country_code)
          .count
          .map { |country, count|
            { country_code: country, count: count }
          },
        average_compensation_by_department: average_compensation(packages),
      }
    }
  end

  private

  def current_packages
    CompensationPackage
      .joins(:employee)
      .where(employees: { status: "active" })
      .where(
        "compensation_packages.effective_from <= :today " \
        "AND (compensation_packages.effective_to IS NULL " \
        "OR compensation_packages.effective_to > :today)",
        today: Date.current
      )
  end

  def average_compensation(packages)
    package_totals = packages
      .joins(:compensation_items)
      .group(
        "compensation_packages.id",
        "employees.department",
        "compensation_packages.currency"
      )
      .select(
        "compensation_packages.id AS package_id",
        "employees.department AS department",
        "compensation_packages.currency AS currency",
        "SUM(compensation_items.amount) AS total"
      )

    rows = ActiveRecord::Base.connection.select_all(
      "SELECT department, currency, AVG(total) AS average " \
      "FROM (#{package_totals.to_sql}) package_totals " \
      "GROUP BY department, currency " \
      "ORDER BY department, currency"
    )

    rows.map do |row|
      {
        department: row["department"],
        currency: row["currency"],
        average_annual_compensation:
          BigDecimal(row["average"]).round(2).to_s("F")
      }
    end
  end
end
