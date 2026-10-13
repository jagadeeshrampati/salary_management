module Employees
  class IndexQuery
    SORTABLE_COLUMNS = %w[
      employee_code
      first_name
      last_name
      department
      country_code
      status
    ].freeze

    DEFAULT_LIMIT = 20
    MAX_LIMIT = 100

    def initialize(params)
      @params = params
    end

    def call
      scope = Employee.all
      scope = apply_search(scope)
      scope = apply_filters(scope)
      scope = apply_sorting(scope)
      scope
    end

    def page
      positive_integer(:page, 1)
    end

    def limit
      [positive_integer(:limit, DEFAULT_LIMIT), MAX_LIMIT].min
    end

    private

    def apply_search(scope)
      search = @params[:search].to_s.strip
      return scope if search.blank?

      pattern = "%#{Employee.sanitize_sql_like(search)}%"

      scope.where(
        "employee_code ILIKE :pattern OR first_name ILIKE :pattern " \
        "OR last_name ILIKE :pattern OR email ILIKE :pattern",
        pattern: pattern
      )
    end

    def apply_filters(scope)
      if @params[:country_code].present?
        scope = scope.where(country_code: @params[:country_code].to_s.upcase)
      end

      scope = scope.where(department: @params[:department]) if @params[:department].present?
      scope = scope.where(status: @params[:status]) if @params[:status].present?

      scope
    end

    def apply_sorting(scope)
      column = @params[:sort_by].to_s
      column = "employee_code" unless SORTABLE_COLUMNS.include?(column)

      direction = @params[:direction].to_s.downcase
      direction = %w[asc desc].include?(direction) ? direction : "asc"

      scope.order(column => direction, id: :asc)
    end

    def positive_integer(key, default)
      value = @params[key].to_s
      return default unless value.match?(/\A\d+\z/)

      number = value.to_i
      number.positive? ? number : default
    end
  end
end