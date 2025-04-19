
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpense } from '@/contexts/ExpenseContext';
import ExpenseForm from '@/components/ExpenseForm';
import { getCategoryColor } from '@/data/mockData';
import { format } from 'date-fns';

const Expenses = () => {
  const { expenses } = useExpense();
  
  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <ExpenseForm />
      </div>
      
      <div className="space-y-4">
        {sortedExpenses.map(expense => (
          <Card key={expense.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <h3 className="font-medium">{expense.title}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  />
                  <span className="text-sm text-muted-foreground capitalize">
                    {expense.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <span className="text-lg font-semibold">
                ${expense.amount.toFixed(2)}
              </span>
            </CardContent>
          </Card>
        ))}
        
        {sortedExpenses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No expenses recorded yet. Add your first expense to get started!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Expenses;
