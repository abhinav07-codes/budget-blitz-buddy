
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyLimitProgress from '@/components/DailyLimitProgress';
import ExpenseChart from '@/components/ExpenseChart';
import RecentExpensesList from '@/components/RecentExpensesList';
import CategoryLimitCard from '@/components/CategoryLimitCard';
import ExpenseForm from '@/components/ExpenseForm';
import SpendingTrends from '@/components/SpendingTrends';
import { useExpense } from '@/contexts/ExpenseContext';
import { cn } from '@/lib/utils';
import ImportTransactions from '@/components/ImportTransactions';
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const { categoryLimits, isLoading } = useExpense();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budget Dashboard</h2>
        <div className="flex gap-2">
          <ImportTransactions />
          <ExpenseForm />
        </div>
      </div>
      
      {isLoading ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-1 lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="expenses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expenses" className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Daily Limit</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyLimitProgress />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Spending Trends</CardTitle>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </CardHeader>
              <CardContent>
                <SpendingTrends />
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="expenses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expenses" className="space-y-4">
              <RecentExpensesList />
            </TabsContent>
            
            <TabsContent value="categories">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {categoryLimits.map(cl => (
                  <CategoryLimitCard key={cl.category} categoryLimit={cl} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseChart />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
