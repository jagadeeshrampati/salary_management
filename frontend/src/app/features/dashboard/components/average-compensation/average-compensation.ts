import { Component, computed, input, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-average-compensation',
  imports: [BaseChartDirective, FormsModule],
  templateUrl: './average-compensation.html',
  styleUrl: './average-compensation.scss',
})
export class AverageCompensation {
  readonly compensationData = input<
    {
      department: string;
      currency: string;
      average_annual_compensation: string;
    }[]
  >([]);

  readonly selectedCurrency = signal('INR');

  readonly chartType: 'bar' = 'bar';

  get currencies(): string[] {
    return [
      ...new Set(
        this.compensationData().map((item) => item.currency),
      ),
    ].sort();
  }

  readonly chartData = computed(() => {
    const currency = this.selectedCurrency();
    const rows = this.compensationData().filter(
      (item) => item.currency === currency,
    );

    return {
      labels: rows.map((item) => item.department),
      datasets: [
        {
          label: `Average annual compensation (${currency})`,
          data: rows.map((item) => Number(item.average_annual_compensation)),
          borderRadius: 6,
          maxBarThickness: 42,
        },
      ],
    };
  });

  // get chartData(): ChartConfiguration<'bar'>['data'] {
  //   const rows = this.compensationData().filter(
  //     (item) => item.currency === this.selectedCurrency,
  //   );

  //   return {
  //     labels: rows.map((item) => item.department),
  //     datasets: [
  //       {
  //         label: `Average annual compensation (${this.selectedCurrency})`,
  //         data: rows.map((item) =>
  //           Number(item.average_annual_compensation),
  //         ),
  //         borderRadius: 6,
  //         maxBarThickness: 42,
  //       },
  //     ],
  //   };
  // }

  readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y ?? 0;

            return `${this.selectedCurrency()} ${value.toLocaleString(
              'en-IN',
              { maximumFractionDigits: 2 },
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            Number(value).toLocaleString('en-IN'),
        },
      },
    },
  };
}
