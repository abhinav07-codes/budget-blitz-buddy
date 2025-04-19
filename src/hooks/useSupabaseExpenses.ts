
import { useState, useCallback } from 'react';
import { Expense, ExpenseCategory, CategoryLimit, DailyLimit } from '@/types';
import { mockExpenses, mockCategoryLimits, mockDailyLimit } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

export const useSupabaseExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>(mockCategoryLimits);
  const [dailyLimit, setDailyLimit] = useState<DailyLimit>(mockDailyLimit);
  const [isFetchingPayments, setIsFetchingPayments] = useState(false);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9)
    };
    setExpenses(prev => [...prev, newExpense]);
    toast({
      title: "Expense Added",
      description: `${expense.title} for $${expense.amount.toFixed(2)}`,
    });
  };

  const updateExpense = (expense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
    toast({
      title: "Expense Updated",
      description: `${expense.title} for $${expense.amount.toFixed(2)}`,
    });
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Expense Deleted",
      description: `${expense.title} for $${expense.amount.toFixed(2)}`,
    });
  };

  const updateDailyLimit = (limit: number) => {
    setDailyLimit(prev => ({ ...prev, limit }));
    toast({
      title: "Daily Limit Updated",
      description: `New limit set to $${limit.toFixed(2)}`,
    });
  };

  const updateCategoryLimit = (category: ExpenseCategory, limit: number) => {
    setCategoryLimits(prev => 
      prev.map(cl => cl.category === category ? { ...cl, limit } : cl)
    );
    toast({
      title: "Category Limit Updated",
      description: `${category} limit set to $${limit.toFixed(2)}`,
    });
  };

  const getTodayExpenses = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date).toISOString().split('T')[0];
      return expenseDate === today;
    });
  }, [expenses]);

  const getMonthlyExpenses = useCallback(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth;
    });
  }, [expenses]);

  const fetchAndCategorizePayments = async () => {
    setIsFetchingPayments(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add mock imported transactions
      const mockImportedExpenses: Expense[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          title: "Imported Coffee",
          amount: 4.50,
          category: "food",
          date: new Date().toISOString(),
          source: "imported"
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          title: "Imported Transport",
          amount: 15.00,
          category: "travel",
          date: new Date().toISOString(),
          source: "imported"
        }
      ];
      
      setExpenses(prev => [...prev, ...mockImportedExpenses]);
      
      toast({
        title: "Transactions Imported",
        description: "Your transactions have been successfully imported and categorized.",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to import transactions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingPayments(false);
    }
  };

  return {
    expenses,
    categoryLimits,
    dailyLimit,
    isLoading: false,
    addExpense,
    updateExpense,
    deleteExpense,
    updateDailyLimit,
    updateCategoryLimit,
    getTodayExpenses,
    getMonthlyExpenses,
    fetchAndCategorizePayments,
    isFetchingPayments
  };
};
