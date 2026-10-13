class Api::EmployeesController < ApplicationController
  def index
    query = Employees::IndexQuery.new(params)

    @pagy, employees = pagy(
      :offset,
      query.call,
      page: query.page,
      limit: query.limit
    )

    render json: {
      data: employees,
      pagination: {
        page: @pagy.page,
        limit: @pagy.limit,
        total: @pagy.count,
        total_pages: @pagy.pages
      }
    }
  end

  def show
    employee = Employee.find(params[:id])

    render json: {
      data: employee
    }
  end
end