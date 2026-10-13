# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_13_133225) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "admins", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
  end

  create_table "compensation_items", force: :cascade do |t|
    t.bigint "compensation_package_id", null: false
    t.string "component_type", null: false
    t.string "category", null: false
    t.decimal "amount", precision: 14, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["compensation_package_id", "component_type"], name: "index_compensation_items_on_package_and_type", unique: true
    t.index ["compensation_package_id"], name: "index_compensation_items_on_compensation_package_id"
  end

  create_table "compensation_packages", force: :cascade do |t|
    t.bigint "employee_id", null: false
    t.string "currency", limit: 3, null: false
    t.date "effective_from", null: false
    t.date "effective_to"
    t.string "change_reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id", "effective_from"], name: "index_compensation_packages_on_employee_id_and_effective_from", unique: true
    t.index ["employee_id"], name: "index_compensation_packages_on_employee_id"
  end

  create_table "employees", force: :cascade do |t|
    t.string "employee_code", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", null: false
    t.string "country_code", limit: 2, null: false
    t.string "department", null: false
    t.string "job_title", null: false
    t.string "status", default: "active", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_code", "department"], name: "index_employees_on_country_code_and_department"
    t.index ["email"], name: "index_employees_on_email", unique: true
    t.index ["employee_code"], name: "index_employees_on_employee_code", unique: true
    t.index ["status"], name: "index_employees_on_status"
  end

  add_foreign_key "compensation_items", "compensation_packages"
  add_foreign_key "compensation_packages", "employees"
end
