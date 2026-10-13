
require "test_helper"

class Api::EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee1 = create_employee(
      code: "ACME001",
      first_name: "Alice",
      last_name: "Smith",
      department: "Engineering",
      country_code: "IN",
      status: "active"
    )

    @employee2 = create_employee(
      code: "ACME002",
      first_name: "Bob",
      last_name: "Jones",
      department: "HR",
      country_code: "US",
      status: "on_leave"
    )

    @employee3 = create_employee(
      code: "ACME003",
      first_name: "Charlie",
      last_name: "Brown",
      department: "Engineering",
      country_code: "IN",
      status: "terminated"
    )
  end

  test "index returns employees and pagination metadata" do
    get api_employees_path

    assert_response :success

    body = response.parsed_body

    assert_equal 3, body.dig("pagination", "total")
    assert_equal 1, body.dig("pagination", "page")
    assert_equal 20, body.dig("pagination", "limit")
    assert_equal 1, body.dig("pagination", "total_pages")
    assert_equal 3, body["data"].length

    assert_equal "ACME001", body["data"].first["employee_code"]
  end

  test "search filters employees by name" do
    get api_employees_path, params: { search: "Alice" }

    assert_response :success

    body = response.parsed_body

    assert_equal 1, body.dig("pagination", "total")
    assert_equal "Alice", body.dig("data", 0, "first_name")
  end

  test "search is case insensitive" do
    get api_employees_path, params: { search: "alice" }

    assert_response :success

    assert_equal 1, response.parsed_body.dig("pagination", "total")
  end

  test "filters employees by country" do
    get api_employees_path, params: { country_code: "IN" }

    assert_response :success

    body = response.parsed_body

    assert_equal 2, body.dig("pagination", "total")
    assert body["data"].all? { |employee| employee["country_code"] == "IN" }
  end

  test "filters employees by department and status" do
    get api_employees_path,
        params: {
          department: "Engineering",
          status: "active"
        }

    assert_response :success

    body = response.parsed_body

    assert_equal 1, body.dig("pagination", "total")
    assert_equal "Alice", body.dig("data", 0, "first_name")
  end

  test "sorts employees by first name descending" do
    get api_employees_path,
        params: { sort_by: "first_name", direction: "desc" }

    assert_response :success

    names = response.parsed_body["data"].map { |employee| employee["first_name"] }

    assert_equal %w[Charlie Bob Alice], names
  end

  test "paginates employees" do
    get api_employees_path, params: { page: 2, limit: 2 }

    assert_response :success

    body = response.parsed_body

    assert_equal 3, body.dig("pagination", "total")
    assert_equal 2, body.dig("pagination", "page")
    assert_equal 2, body.dig("pagination", "limit")
    assert_equal 2, body.dig("pagination", "total_pages")
    assert_equal 1, body["data"].length
  end

  test "caps the requested page size at 100" do
    get api_employees_path, params: { limit: 500 }

    assert_response :success

    assert_equal 100, response.parsed_body.dig("pagination", "limit")
  end

  test "falls back to the default sort for an invalid sort column" do
    get api_employees_path, params: { sort_by: "invalid_column" }

    assert_response :success

    codes = response.parsed_body["data"].map { |employee| employee["employee_code"] }

    assert_equal %w[ACME001 ACME002 ACME003], codes
  end

  test "show returns an employee" do
    get api_employee_path(@employee1)

    assert_response :success

    body = response.parsed_body

    assert_equal @employee1.id, body.dig("data", "id")
    assert_equal "Alice Smith", body.dig("data", "full_name")
    assert_equal "ACME001", body.dig("data", "employee_code")
  end

  test "show does not expose compensation data" do
    get api_employee_path(@employee1)

    assert_response :success

    employee = response.parsed_body["data"]

    assert_not employee.key?("compensation_packages")
    assert_not employee.key?("salary")
  end

  test "show returns not found for an unknown employee" do
    get "/api/employees/-1"

    assert_response :not_found
    assert_equal "Employee not found", response.parsed_body["error"]
  end

  private

  def create_employee(code:, first_name:, last_name:, department:, country_code:, status:)
    Employee.create!(
      employee_code: code,
      first_name: first_name,
      last_name: last_name,
      email: "#{code.downcase}@example.com",
      country_code: country_code,
      department: department,
      job_title: "Test Engineer",
      status: status
    )
  end
end
