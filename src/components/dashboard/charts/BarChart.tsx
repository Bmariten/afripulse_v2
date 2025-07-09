import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: { month: string; revenue: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-md shadow-md">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-primary">{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const BarChartComponent = ({ data }: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(13, 148, 136, 0.1)' }} />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        <Bar dataKey="revenue" fill="#0d9488" name="Monthly Revenue" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
