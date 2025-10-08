import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme, VictoryTooltip } from "victory";

const data = [
  { month: "Jan", earnings: 2500 },
  { month: "Feb", earnings: 3000 },
  { month: "Mar", earnings: 2000 },
  { month: "Apr", earnings: 3500 },
  { month: "May", earnings: 4000 },
  { month: "Jun", earnings: 3800 },
  { month: "Jul", earnings: 4200 },
  { month: "Aug", earnings: 3900 },
  { month: "Sep", earnings: 4300 },
  { month: "Oct", earnings: 4500 },
  { month: "Nov", earnings: 4700 },
  { month: "Dec", earnings: 5000 }
];

function MonthlyEarningsChart() {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
    >
      <VictoryAxis
        tickValues={data.map((d) => d.month)}
        tickFormat={data.map((d) => d.month)}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x: number) => `R$${x}`}
      />
      <VictoryBar
        data={data}
        x="month"
        y="earnings"
        labels={({ datum }: { datum: { earnings: number } }) => `R$${datum.earnings}`}
        labelComponent={<VictoryTooltip />}
        style={{
          data: { fill: "#4f8cff" }
        }}
      />
    </VictoryChart>
  );
}

export default MonthlyEarningsChart;