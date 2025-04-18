
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpense } from '@/contexts/ExpenseContext';

const SpendingTrends: React.FC = () => {
  const { expenses } = useExpense();
  
  const chartData = useMemo(() => {
    // Get the past 7 days
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        key: date.toISOString().split('T')[0]
      });
    }
    
    // Group expenses by day
    const expensesByDay = days.map(day => {
      const dayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date).toISOString().split('T')[0];
        return expenseDate === day.key;
      });
      
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        name: day.label,
        date: day.key,
        amount: dayExpenses.length ? total : 0
      };
    });
    
    return expensesByDay;
  }, [expenses]);
  
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
          <XAxis dataKey="name" stroke="#888" fontSize={12} />
          <YAxis 
            stroke="#888" 
            fontSize={12} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#4FD1C5"
            strokeWidth={2}
            dot={{ stroke: '#4FD1C5', strokeWidth: 2, fill: '#4FD1C5' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingTrends;
