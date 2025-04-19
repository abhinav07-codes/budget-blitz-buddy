
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpense } from '@/contexts/ExpenseContext';
import ImportTransactions from '@/components/ImportTransactions';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ImportHistory = () => {
  const { expenses, isLoading } = useExpense();
  
  // Filter expenses that were imported
  const importedExpenses = expenses.filter(expense => expense.source && expense.source !== 'manual');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Import History</h2>
        <ImportTransactions />
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="py-4">
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ) : importedExpenses.length === 0 ? (
        <Card>
          <CardContent className="py-8">
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
            <div className="space-y-4">
              {importedExpenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="flex justify-between items-start p-4 rounded-lg bg-secondary/10"
                >
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">{expense.description || expense.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{expense.category}</Badge>
                      <Badge variant="outline">{expense.source}</Badge>
                    </div>
                  </div>
                  <p className="font-semibold">${expense.amount.toFixed(2)}</p>
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
