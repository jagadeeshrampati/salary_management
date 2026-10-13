# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Seed the ACME salary management application

require "date"

# -------------------------
# 1. Admin
# -------------------------

admin = Admin.find_or_create_by!(email: "admin@acme.example") do |record|
  record.name = "ACME Admin"
end

puts "Admin ready: #{admin.email}"

# -------------------------
# 2. Reference data
# -------------------------

countries = [
  { code: "IN", currency: "INR", departments: ["Engineering", "HR", "Finance", "Sales", "Operations"] },
  { code: "US", currency: "USD", departments: ["Engineering", "HR", "Finance", "Sales", "Operations"] },
  { code: "GB", currency: "GBP", departments: ["Engineering", "HR", "Finance", "Sales", "Operations"] },
  { code: "DE", currency: "EUR", departments: ["Engineering", "HR", "Finance", "Sales", "Operations"] },
  { code: "SG", currency: "SGD", departments: ["Engineering", "HR", "Finance", "Sales", "Operations"] }
]

first_names = %w[
  Aarav Aditi Arjun Ananya David Emma Ethan Olivia Liam Noah
  Sophia James Amelia Lucas Mia Daniel Grace Henry Isabella
  Rahul Priya Vikram Neha Karan Sneha
]

last_names = %w[
  Sharma Patel Kumar Singh Gupta Reddy Mehta Shah
  Smith Johnson Brown Wilson Taylor Davis Miller Anderson
  Martin Clark Lewis Walker Hall Young Allen
]

job_titles = {
  "Engineering" => ["Software Engineer", "Senior Software Engineer", "Engineering Manager"],
  "HR" => ["HR Executive", "HR Business Partner", "HR Manager"],
  "Finance" => ["Accountant", "Financial Analyst", "Finance Manager"],
  "Sales" => ["Sales Executive", "Account Manager", "Sales Manager"],
  "Operations" => ["Operations Analyst", "Operations Specialist", "Operations Manager"]
}

# Annual base salary ranges, expressed in each country's currency.
salary_ranges = {
  "INR" => (600_000..2_400_000),
  "USD" => (60_000..180_000),
  "GBP" => (40_000..120_000),
  "EUR" => (45_000..130_000),
  "SGD" => (60_000..160_000)
}

# -------------------------
# 3. Generate 10,000 employees
# -------------------------

employee_count = 10_000
batch_size = 500
today = Date.current

employee_count.times.each_slice(batch_size) do |indexes|
  Employee.transaction do
    indexes.each do |index|
      employee_number = index + 1
      country = countries[index % countries.length]
      department = country[:departments][(index / countries.length) % country[:departments].length]

      first_name = first_names[index % first_names.length]
      last_name = last_names[(index * 7) % last_names.length]
      employee_code = format("ACME%05d", employee_number)

      # Deterministic, unique email for repeatable seeds.
      email = "employee#{employee_number}@acme.example"

      employee = Employee.find_or_initialize_by(employee_code: employee_code)

      status =
        if employee_number % 100 == 0
          "terminated"
        elsif employee_number % 50 == 0
          "on_leave"
        else
          "active"
        end
      employee.assign_attributes(
        first_name: first_name,
        last_name: last_name,
        email: email,
        country_code: country[:code],
        department: department,
        job_title: job_titles.fetch(department)[index % job_titles.fetch(department).length],
        status: status
      )

      employee.save!

      # Keep existing compensation history on subsequent seed runs.
      next if employee.compensation_packages.exists?

      currency = country[:currency]
      range = salary_ranges.fetch(currency)

      base_salary = range.begin + ((employee_number * 7_919) % (range.end - range.begin + 1))
      hra = (base_salary * 0.20).round(2)
      special_allowance = (base_salary * 0.10).round(2)
      bonus = (base_salary * 0.10).round(2)
      employer_pf = (base_salary * 0.12).round(2)

      # Historical package: starts one year before the current package.
      previous_start = today - 730
      current_start = today - 365

      previous_package = employee.compensation_packages.create!(
        currency: currency,
        effective_from: previous_start,
        effective_to: current_start,
        change_reason: "Initial seeded compensation"
      )

      current_package = employee.compensation_packages.create!(
        currency: currency,
        effective_from: current_start,
        effective_to: nil,
        change_reason: "Annual compensation revision"
      )

      [
        [previous_package, base_salary * 0.90],
        [current_package, base_salary]
      ].each do |package, current_base|
        components = [
          ["basic_salary", "fixed_earnings", current_base],
          ["hra", "fixed_earnings", current_base * 0.20],
          ["special_allowance", "fixed_earnings", current_base * 0.10],
          ["performance_bonus", "variable_earnings", current_base * 0.10],
          ["employer_pf", "employer_contribution", current_base * 0.12]
        ]

        components.each do |component_type, category, amount|
          package.compensation_items.create!(
            component_type: component_type,
            category: category,
            amount: amount.round(2)
          )
        end
      end
    end
  end

  puts "Processed employee indexes #{indexes.first + 1}–#{indexes.last + 1}"
end

puts "Seed complete."
puts "Admins: #{Admin.count}"
puts "Employees: #{Employee.count}"
puts "Compensation packages: #{CompensationPackage.count}"
puts "Compensation items: #{CompensationItem.count}"
