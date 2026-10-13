
require "test_helper"

class Api::DashboardControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee = Employee.create!(
      employee_code: "DASH001",
      first_name: "Alice",
      last_name: "Smith",
      email: "dash001@example.com",
      country_code: "IN",
      department: "Engineering",
      job_title: "Developer",
      status: "active"
    )

    package = @employee.compensation_packages.create!(
      currency: "INR",
      effective_from: Date.current - 30.days
    )

    package.compensation_items.create!(
      component_type: "basic_salary",
      category: "fixed_earnings",
      amount: "800000.00"
    )

    package.compensation_items.create!(
      component_type: "performance_bonus",
      category: "variable_earnings",
      amount: "100000.00"
    )
  end

  test "returns dashboard summary and analytics" do
    get "/api/dashboard"

    assert_response :success

    data = response.parsed_body.fetch("data")

    assert_equal Employee.count, data.dig("summary", "total_employees")
    assert_equal 1, data.dig("summary", "active_employees")

    department = data.fetch("headcount_by_department")
      .find { |row| row["department"] == "Engineering" }

    assert_equal 1, department["count"]

    average = data.fetch("average_compensation_by_department")
      .find do |row|
        row["department"] == "Engineering" &&
          row["currency"] == "INR"
      end

    assert_equal "900000.0",
                 BigDecimal(average["average_annual_compensation"]).to_s("F")

    basic_salary = data.fetch("component_breakdown")
      .find do |row|
        row["currency"] == "INR" &&
          row["component_type"] == "basic_salary"
      end

    assert_equal "800000.0",
                 BigDecimal(basic_salary["total_annual_amount"]).to_s("F")
  end
end
