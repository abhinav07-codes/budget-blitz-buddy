
import React from 'react';
import { Progress } from './ui/progress';
import { useExpense } from '@/contexts/ExpenseContext';
import { cn } from '@/lib/utils';

const DailyLimitProgress: React.FC = () => {
  const { dailyLimit } = useExpense();
  
  const percentage = Math.min((dailyLimit.current / dailyLimit.limit) * 100, 100);
  const isOverLimit = dailyLimit.current > dailyLimit.limit;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Daily Spending</p>
        <p className="text-sm font-medium">
          ${dailyLimit.current.toFixed(2)} / ${dailyLimit.limit.toFixed(2)}
        </p>
      </div>
      <Progress 
        value={percentage} 
        className={cn('h-2', isOverLimit ? 'bg-red-900/20' : 'bg-blue-900/20')}
      />
      {isOverLimit && (
        <p className="text-xs text-expense animate-fade-in">
          You're ${(dailyLimit.current - dailyLimit.limit).toFixed(2)} over your daily limit
        </p>
      )}
    </div>
  );
};

export default DailyLimitProgress;
