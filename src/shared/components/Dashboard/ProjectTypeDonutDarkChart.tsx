import { Box } from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Design", value: 12 },
  { name: "Desenvolvimento", value: 28 },
  { name: "Consultoria", value: 10 },
  { name: "Outros", value: 5 }
];

const COLORS = ["#4f8cff", "#00d8a7", "#ffb347", "#e94f7a"];

function ProjectTypeDonutDarkChart() {
  return (
    <Box
      bg="gray.950"
      //bg="radial-gradient(circle at top, #222228ff, #0a0a0aff 70%)"
      p="24px"
      borderRadius="12px"
      color="#fff"
      width="100%"
      height="100%"
    >
      <h2 style={{color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: "20px"}}>Distribuição de Tipos de Projeto</h2>
      <ResponsiveContainer width="100%" height={350} style={{marginLeft: "auto", marginRight: "auto"}}>
        <PieChart>
          <Pie
            width="60%"
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#383838", border: "none", color: "#ffffff"
            }}
            labelStyle={{ color: "#ffffff" }}
            formatter={(value, name) => [`${value}`, `${name}`]}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ProjectTypeDonutDarkChart;