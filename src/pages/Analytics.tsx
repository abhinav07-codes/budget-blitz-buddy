
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExpenseChart from '@/components/ExpenseChart';
import { useExpense } from '@/contexts/ExpenseContext';

const Analytics = () => {
  const { getMonthlyExpenses } = useExpense();
  const monthlyExpenses = getMonthlyExpenses();
  
  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total spent this month</p>
          </div>
          <ExpenseChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
