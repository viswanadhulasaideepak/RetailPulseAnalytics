import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 6200 },
  { month: "Mar", sales: 5200 },
  { month: "Apr", sales: 7800 },
  { month: "May", sales: 6400 },
  { month: "Jun", sales: 8900 },
];

const SalesChart = () => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <XAxis dataKey="month" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#6366F1"
          fill="#6366F1"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;