
import React, { createContext, useContext, ReactNode } from 'react';
import { Expense, ExpenseCategory, CategoryLimit, DailyLimit } from '../types';
import { useSupabaseExpenses } from '@/hooks/useSupabaseExpenses';

interface ExpenseContextType {
  expenses: Expense[];
  categoryLimits: CategoryLimit[];
  dailyLimit: DailyLimit;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: Expense) => void;
  updateDailyLimit: (limit: number) => void;
  updateCategoryLimit: (category: ExpenseCategory, limit: number) => void;
  getTodayExpenses: () => Expense[];
  getMonthlyExpenses: () => Expense[];
  fetchAndCategorizePayments: () => void;
  isFetchingPayments: boolean;
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const { 
    expenses,
    categoryLimits,
    dailyLimit,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    updateDailyLimit,
    updateCategoryLimit,
    getTodayExpenses,
    getMonthlyExpenses,
    fetchAndCategorizePayments,
    isFetchingPayments
  } = useSupabaseExpenses();
  
  const value = {
    expenses,
    categoryLimits,
    dailyLimit,
    isLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    updateDailyLimit,
    updateCategoryLimit,
    getTodayExpenses,
    getMonthlyExpenses,
    fetchAndCategorizePayments,
    isFetchingPayments
  };
  
  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
