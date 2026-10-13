class CreateCompensationPackages < ActiveRecord::Migration[8.1]
  def change
    create_table :compensation_packages do |t|
      t.references :employee, null: false, foreign_key: true
      t.string :currency, null: false, limit: 3
      t.date :effective_from, null: false
      t.date :effective_to
      t.string :change_reason

      t.timestamps
    end

    add_index :compensation_packages,
              [:employee_id, :effective_from],
              unique: true
  end
end
