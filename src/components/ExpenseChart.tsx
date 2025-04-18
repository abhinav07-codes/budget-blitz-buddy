
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useExpense } from '@/contexts/ExpenseContext';
import { getCategoryColor } from '@/data/mockData';

interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

const ExpenseChart: React.FC = () => {
  const { getMonthlyExpenses } = useExpense();
  
  const chartData = useMemo(() => {
    const monthlyExpenses = getMonthlyExpenses();
    
    // Group by category
    const categoryTotals = monthlyExpenses.reduce<Record<string, number>>((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += expense.amount;
      return acc;
    }, {});
    
    // Convert to chart format
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: getCategoryColor(name)
    }));
  }, [getMonthlyExpenses]);
  
  // Don't render if there's no data
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-secondary/30 rounded-lg">
        <p className="text-muted-foreground">No expense data to display</p>
      </div>
    );
  }
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
