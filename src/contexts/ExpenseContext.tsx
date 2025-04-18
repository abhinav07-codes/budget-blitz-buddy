
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Expense, ExpenseCategory, CategoryLimit, DailyLimit } from '../types';
import { mockExpenses, mockCategoryLimits, mockDailyLimit } from '../data/mockData';
import { toast } from '@/hooks/use-toast';

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
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>(mockCategoryLimits);
  const [dailyLimit, setDailyLimit] = useState<DailyLimit>(mockDailyLimit);

  // Add an expense and update related limits
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(), // simple ID generation
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    
    // Update category limit
    setCategoryLimits(prevLimits => 
      prevLimits.map(limit => 
        limit.category === expense.category 
          ? { ...limit, current: limit.current + expense.amount } 
          : limit
      )
    );
    
    // Update daily limit if expense is from today
    const today = new Date().toISOString().split('T')[0];
    const expenseDate = new Date(expense.date).toISOString().split('T')[0];
    
    if (today === expenseDate) {
      setDailyLimit(prev => ({
        ...prev,
        current: prev.current + expense.amount
      }));
    }
    
    toast({
      title: "Expense Added",
      description: `${expense.title} for $${expense.amount.toFixed(2)}`,
    });
  };
  
  // Delete an expense and update related limits
  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(e => e.id === id);
    if (!expenseToDelete) return;
    
    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== id));
    
    // Update category limit
    setCategoryLimits(prevLimits => 
      prevLimits.map(limit => 
        limit.category === expenseToDelete.category 
          ? { ...limit, current: limit.current - expenseToDelete.amount } 
          : limit
      )
    );
    
    // Update daily limit if expense is from today
    const today = new Date().toISOString().split('T')[0];
    const expenseDate = new Date(expenseToDelete.date).toISOString().split('T')[0];
    
    if (today === expenseDate) {
      setDailyLimit(prev => ({
        ...prev,
        current: prev.current - expenseToDelete.amount
      }));
    }
    
    toast({
      title: "Expense Deleted",
      description: `${expenseToDelete.title} for $${expenseToDelete.amount.toFixed(2)}`,
    });
  };
  
  // Update an expense
  const updateExpense = (updatedExpense: Expense) => {
    const oldExpense = expenses.find(e => e.id === updatedExpense.id);
    if (!oldExpense) return;
    
    setExpenses(prevExpenses => 
      prevExpenses.map(e => e.id === updatedExpense.id ? updatedExpense : e)
    );
    
    // If category changed
    if (oldExpense.category !== updatedExpense.category) {
      setCategoryLimits(prevLimits => 
        prevLimits.map(limit => {
          if (limit.category === oldExpense.category) {
            return { ...limit, current: limit.current - oldExpense.amount };
          }
          if (limit.category === updatedExpense.category) {
            return { ...limit, current: limit.current + updatedExpense.amount };
          }
          return limit;
        })
      );
    } else {
      // If only amount changed
      const amountDiff = updatedExpense.amount - oldExpense.amount;
      setCategoryLimits(prevLimits => 
        prevLimits.map(limit => 
          limit.category === updatedExpense.category 
            ? { ...limit, current: limit.current + amountDiff } 
            : limit
        )
      );
    }
    
    // Update daily limit if necessary
    const today = new Date().toISOString().split('T')[0];
    const oldExpenseDate = new Date(oldExpense.date).toISOString().split('T')[0];
    const newExpenseDate = new Date(updatedExpense.date).toISOString().split('T')[0];
    
    if (oldExpenseDate === today && newExpenseDate === today) {
      // Both dates are today, just update amount
      const amountDiff = updatedExpense.amount - oldExpense.amount;
      setDailyLimit(prev => ({
        ...prev,
        current: prev.current + amountDiff
      }));
    } else if (oldExpenseDate === today && newExpenseDate !== today) {
      // Moved from today to another day
      setDailyLimit(prev => ({
        ...prev,
        current: prev.current - oldExpense.amount
      }));
    } else if (oldExpenseDate !== today && newExpenseDate === today) {
      // Moved from another day to today
      setDailyLimit(prev => ({
        ...prev,
        current: prev.current + updatedExpense.amount
      }));
    }
    
    toast({
      title: "Expense Updated",
      description: `${updatedExpense.title} for $${updatedExpense.amount.toFixed(2)}`,
    });
  };
  
  // Update daily spending limit
  const updateDailyLimit = (limit: number) => {
    setDailyLimit(prev => ({
      ...prev,
      limit
    }));
    
    toast({
      title: "Daily Limit Updated",
      description: `New limit set to $${limit.toFixed(2)}`,
    });
  };
  
  // Update category spending limit
  const updateCategoryLimit = (category: ExpenseCategory, limit: number) => {
    setCategoryLimits(prevLimits => 
      prevLimits.map(cl => 
        cl.category === category ? { ...cl, limit } : cl
      )
    );
    
    toast({
      title: "Category Limit Updated",
      description: `${category} limit set to $${limit.toFixed(2)}`,
    });
  };
  
  // Get expenses for today
  const getTodayExpenses = (): Expense[] => {
    const today = new Date().toISOString().split('T')[0];
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date).toISOString().split('T')[0];
      return expenseDate === today;
    });
  };
  
  // Get expenses for current month
  const getMonthlyExpenses = (): Expense[] => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth;
    });
  };
  
  const value = {
    expenses,
    categoryLimits,
    dailyLimit,
    addExpense,
    deleteExpense,
    updateExpense,
    updateDailyLimit,
    updateCategoryLimit,
    getTodayExpenses,
    getMonthlyExpenses,
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
