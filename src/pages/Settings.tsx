
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useExpense } from '@/contexts/ExpenseContext';
import { ExpenseCategory } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { dailyLimit, updateDailyLimit, categoryLimits, updateCategoryLimit } = useExpense();
  const [selectedCategory, setSelectedCategory] = React.useState<ExpenseCategory>('food');
  const [categoryAmount, setCategoryAmount] = React.useState('');
  const [newDailyLimit, setNewDailyLimit] = React.useState(dailyLimit.limit.toString());

  const handleDailyLimitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newDailyLimit);
    if (!isNaN(amount) && amount > 0) {
      updateDailyLimit(amount);
    }
  };

  const handleCategoryLimitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(categoryAmount);
    if (!isNaN(amount) && amount > 0) {
      updateCategoryLimit(selectedCategory, amount);
      setCategoryAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daily Spending Limit</CardTitle>
          <CardDescription>Set your daily budget target</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDailyLimitUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                min="0"
                step="0.01"
                value={newDailyLimit}
                onChange={(e) => setNewDailyLimit(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <Button type="submit">Update Daily Limit</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Limits</CardTitle>
          <CardDescription>Set spending limits for each category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCategoryLimitUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={selectedCategory}
                onValueChange={(value: ExpenseCategory) => setSelectedCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="bills">Bills</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={categoryAmount}
                onChange={(e) => setCategoryAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <Button type="submit">Update Category Limit</Button>
          </form>

          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Current Category Limits</h4>
            <div className="space-y-2">
              {categoryLimits.map((limit) => (
                <div
                  key={limit.category}
                  className="flex justify-between items-center p-2 rounded bg-secondary/20"
                >
                  <span className="capitalize">{limit.category}</span>
                  <span>${limit.limit.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
