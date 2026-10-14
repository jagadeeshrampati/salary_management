class Api::Employees::CompensationPackagesController < ApplicationController
  def index
    employee = Employee.find(params[:employee_id])

    packages = employee.compensation_packages
                       .includes(:compensation_items)
                       .order(effective_from: :desc)

    render json: { data: packages }
  end

  def create
    employee = Employee.find(params[:employee_id])
    attributes = compensation_package_params
    items = attributes.delete(:items)

    if items.blank?
      return render json: {
        errors: ["At least one compensation item is required"]
      }, status: :unprocessable_entity
    end

    package = nil

    admin = Admin.find_by!(email: "admin@acme.example")

    ActiveRecord::Base.transaction do
      Audited.audit_class.as_user(admin) do
        current_package = employee.compensation_packages
                                  .where(effective_to: nil)
                                  .order(effective_from: :desc)
                                  .first
  
        # Close the previous package when the new one takes effect.
        current_package&.update!(
          effective_to: attributes[:effective_from]
        )
        package = employee.compensation_packages.create!(attributes)
  
        items.each do |item|
          package.compensation_items.create!(item)
        end
      end
    end

    render json: { data: package.as_json }, status: :created

  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: e.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  private

  def compensation_package_params
    params.require(:compensation_package).permit(
      :currency,
      :effective_from,
      :change_reason,
      items: [:component_type, :category, :amount]
    )
  end
end
