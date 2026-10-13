import { Component, input, computed } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-headcount-country',
  imports: [BaseChartDirective],
  templateUrl: './headcount-country.html',
  styleUrl: './headcount-country.scss',
})
export class HeadcountCountry {
  readonly countries = input<
    { country_code: string; count: number }[]
  >([]);

  readonly doughnutChartType: 'doughnut' = 'doughnut';

  // get doughnutChartData(): ChartConfiguration<'doughnut'>['data'] {
  //   const rows = this.countries();

  //   return {
  //     labels: rows.map((row) => row.country_code),
  //     datasets: [
  //       {
  //         data: rows.map((row) => row.count),
  //         borderWidth: 2,
  //         hoverOffset: 8,
  //       },
  //     ],
  //   };
  // }

  readonly doughnutChartData = computed(() => {
    const rows = this.countries();

    return {
      labels: rows.map((row) => row.country_code),
      datasets: [
        {
          data: rows.map((row) => row.count),
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  });


  readonly doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '65%',
  };
}
