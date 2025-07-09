import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#0d9488', '#0f766e', '#115e59', '#134e4a', '#14532d'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-md shadow-md">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-sm text-primary">{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const PieChartComponent = ({ data }: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
