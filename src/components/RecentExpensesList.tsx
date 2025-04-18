
import React from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Card } from '@/components/ui/card';
import { getCategoryColor } from '@/data/mockData';
import { ShoppingBag, Coffee, Car, Home, Film, MoreHorizontal } from 'lucide-react';
import { ExpenseCategory } from '@/types';

const CategoryIcon: React.FC<{ category: ExpenseCategory }> = ({ category }) => {
  const color = getCategoryColor(category);
  
  const iconStyle = {
    color: color,
  };
  
  switch (category) {
    case 'food':
      return <Coffee style={iconStyle} className="h-5 w-5" />;
    case 'travel':
      return <Car style={iconStyle} className="h-5 w-5" />;
    case 'bills':
      return <Home style={iconStyle} className="h-5 w-5" />;
    case 'entertainment':
      return <Film style={iconStyle} className="h-5 w-5" />;
    case 'shopping':
      return <ShoppingBag style={iconStyle} className="h-5 w-5" />;
    default:
      return <MoreHorizontal style={iconStyle} className="h-5 w-5" />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.getTime() >= today.getTime()) {
    return 'Today';
  } else if (date.getTime() >= yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const RecentExpensesList: React.FC = () => {
  const { expenses } = useExpense();
  
  // Get the 5 most recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Expenses</h3>
      <div className="space-y-2">
        {recentExpenses.map(expense => (
          <Card key={expense.id} className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary p-2">
                <CategoryIcon category={expense.category} />
              </div>
              <div>
                <p className="font-medium">{expense.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
              </div>
            </div>
            <p className="font-semibold text-expense">${expense.amount.toFixed(2)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentExpensesList;
