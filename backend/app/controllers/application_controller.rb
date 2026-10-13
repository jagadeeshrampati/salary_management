class ApplicationController < ActionController::API
  include Pagy::Method

  rescue_from ActiveRecord::RecordNotFound do
    render json: {
      error: "Employee not found"
    }, status: :not_found
  end
end
