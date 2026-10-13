class CreateCompensationItems < ActiveRecord::Migration[8.1]
  def change
    create_table :compensation_items do |t|
      t.references :compensation_package, null: false, foreign_key: true
      t.string :component_type, null: false
      t.string :category, null: false
      t.decimal :amount, precision: 14, scale: 2, null: false

      t.timestamps
    end

    add_index :compensation_items,
              [:compensation_package_id, :component_type],
              unique: true,
              name: "index_compensation_items_on_package_and_type"
  end
end
