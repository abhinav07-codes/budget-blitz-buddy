
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useExpense } from '@/contexts/ExpenseContext';
import { CategoryLimit } from '@/types';
import { getCategoryColor } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CategoryLimitCardProps {
  categoryLimit: CategoryLimit;
}

const CategoryLimitCard: React.FC<CategoryLimitCardProps> = ({ categoryLimit }) => {
  const { category, limit, current } = categoryLimit;
  
  const percentage = Math.min((current / limit) * 100, 100);
  const isOverLimit = current > limit;
  const categoryColor = getCategoryColor(category);
  
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{categoryName}</span>
          <span className={isOverLimit ? "text-expense" : ""}>
            ${current.toFixed(0)} / ${limit}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress 
          value={percentage} 
          className="h-2"
          style={{
            backgroundColor: `${categoryColor}20`,
          }}
        />
        {isOverLimit && (
          <p className="text-xs text-expense mt-1">
            ${(current - limit).toFixed(2)} over budget
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryLimitCard;
