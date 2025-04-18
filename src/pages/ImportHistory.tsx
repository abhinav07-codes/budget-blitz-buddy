
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpense } from '@/contexts/ExpenseContext';
import ImportTransactions from '@/components/ImportTransactions';
import { Skeleton } from "@/components/ui/skeleton";

const ImportHistory: React.FC = () => {
  const { expenses, isLoading } = useExpense();
  
  // Filter expenses that were automatically imported
  const importedExpenses = expenses.filter(expense => 
    expense.notes?.includes('Auto-categorized') || 
    expense.notes?.includes('Automatically imported')
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Import History</h2>
        <ImportTransactions />
      </div>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : importedExpenses.length === 0 ? (
        <Card>
          <CardContent className="py-4">
            <p className="text-center text-muted-foreground">
              No imported transactions yet. Click "Import Transactions" to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Imported Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {importedExpenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="flex justify-between items-center border-b pb-2 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()} · {expense.category}
                    </p>
                    {expense.notes && (
                      <p className="text-xs text-muted-foreground">{expense.notes}</p>
                    )}
                  </div>
                  <p className="font-semibold text-expense">${expense.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImportHistory;
