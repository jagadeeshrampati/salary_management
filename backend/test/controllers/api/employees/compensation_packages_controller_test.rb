require "test_helper"

class Api::Employees::CompensationPackagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee = Employee.create!(
      employee_code: "TEST001",
      first_name: "Test",
      last_name: "Employee",
      email: "test001@example.com",
      country_code: "IN",
      department: "Engineering",
      job_title: "Software Engineer",
      status: "active"
    )

    @old_package = @employee.compensation_packages.create!(
      currency: "INR",
      effective_from: Date.new(2025, 1, 1)
    )

    @old_package.compensation_items.create!(
      component_type: "basic_salary",
      category: "fixed_earnings",
      amount: "800000.00"
    )
  end

  test "creates a package and closes the previous package" do
    assert_difference("CompensationPackage.count", 1) do
      assert_difference("CompensationItem.count", 1) do
        post api_employee_compensation_packages_path(@employee),
             params: valid_params,
             as: :json
      end
    end

    assert_response :created

    @old_package.reload
    assert_equal Date.new(2026, 1, 1), @old_package.effective_to

    body = response.parsed_body
    assert_equal "INR", body.dig("data", "currency")
    assert_equal BigDecimal("900000.00"), BigDecimal(body.dig("data", "total_annual_compensation"))
  end

  test "rolls back when a compensation item is invalid" do
    invalid_params = valid_params.deep_dup
    invalid_params[:compensation_package][:items][0][:amount] = "-100"

    assert_no_difference("CompensationPackage.count") do
      assert_no_difference("CompensationItem.count") do
        post api_employee_compensation_packages_path(@employee),
             params: invalid_params,
             as: :json
      end
    end

    assert_response :unprocessable_entity

    # The previous package must remain open after rollback.
    assert_nil @old_package.reload.effective_to
  end

  test "rejects a package without items" do
    params = valid_params.deep_dup
    params[:compensation_package][:items] = []

    post api_employee_compensation_packages_path(@employee),
         params: params,
         as: :json

    assert_response :unprocessable_entity
    assert_nil @old_package.reload.effective_to
  end

  test "returns not found for an unknown employee" do
    post api_employee_compensation_packages_path(employee_id: -1),
         params: valid_params,
         as: :json

    assert_response :not_found
  end

  private

  def valid_params
    {
      compensation_package: {
        currency: "INR",
        effective_from: "2026-01-01",
        change_reason: "Annual salary revision",
        items: [
          {
            component_type: "basic_salary",
            category: "fixed_earnings",
            amount: "900000.00"
          }
        ]
      }
    }
  end
end
