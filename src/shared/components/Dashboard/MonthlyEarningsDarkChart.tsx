import { Box } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

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

function MonthlyEarningsDarkChart() {
  return (
    <Box
      bg="gray.950"
      //bg="radial-gradient(circle at top, #222228ff, #0a0a0aff 70%)"
      p="24px"
      borderRadius="12px"
      color="#fff"
      width="100%"
      >
      <h2 style={{color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: "20px"}}>Ganhos Mensais</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" tickFormatter={value => `R$${value}`} />
          <Tooltip
            contentStyle={{
              background: "#222", border: "none", color: "#fff"
            }}
            labelStyle={{ color: "#fff" }}
            cursor={{ fill: "#333" }}
            formatter={(value) => [`R$${value}`, "Ganhos"]}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar dataKey="earnings" fill="#4f8cff" radius={[8, 8, 0, 0]} name="Ganhos" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MonthlyEarningsDarkChart;