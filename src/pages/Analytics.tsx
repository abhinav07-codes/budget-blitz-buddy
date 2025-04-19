
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExpenseChart from '@/components/ExpenseChart';
import { useExpense } from '@/contexts/ExpenseContext';
import TransactionsTable from '@/components/TransactionsTable';
import ServicesOverview from '@/components/ServicesOverview';
import StockSuggestions from '@/components/StockSuggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analytics = () => {
  const { getMonthlyExpenses } = useExpense();
  const monthlyExpenses = getMonthlyExpenses();
  
  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Services & Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ServicesOverview />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="stock-suggestions">Stock Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <TransactionsTable />
        </TabsContent>
        
        <TabsContent value="stock-suggestions" className="space-y-4">
          <StockSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
