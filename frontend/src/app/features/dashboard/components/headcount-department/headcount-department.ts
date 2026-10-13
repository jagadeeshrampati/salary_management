import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-headcount-department',
  imports: [BaseChartDirective],
  templateUrl: './headcount-department.html',
  styleUrl: './headcount-department.scss',
})
export class HeadcountDepartment {
  readonly departments = input<
    { department: string; count: number }[]
  >([]);

  readonly barChartType: 'bar' = 'bar';

  // get barChartData(): ChartConfiguration<'bar'>['data'] {
  //   const rows = this.departments();
  //   console.log(this.departments(), 'departments')
  //   return {
  //     labels: rows.map((row) => row.department),
  //     datasets: [
  //       {
  //         label: 'Employees',
  //         data: rows.map((row) => row.count),
  //         borderRadius: 6,
  //       },
  //     ],
  //   };
  // }

  readonly barChartData = computed(() => {
    const rows = this.departments();

    return {
      labels: rows.map((row) => row.department),
      datasets: [
        {
          label: 'Employees',
          data: rows.map((row) => row.count),
          borderRadius: 6,
        },
      ],
    };
  });

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };
}


