import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Expense, ExpenseCategory, CategoryLimit, DailyLimit } from '../types';
import { mockExpenses, mockCategoryLimits, mockDailyLimit } from '../data/mockData';
import { toast } from '@/hooks/use-toast';
import { fetchPaymentData } from '@/services/paymentService';
import { categorizeExpense } from '@/utils/aiCategorizer';

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
  fetchAndCategorizePayments: () => Promise<void>;
  isFetchingPayments: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>(mockCategoryLimits);
  const [dailyLimit, setDailyLimit] = useState<DailyLimit>(mockDailyLimit);
  const [isFetchingPayments, setIsFetchingPayments] = useState(false);

  const fetchAndCategorizePayments = async () => {
    try {
      setIsFetchingPayments(true);
      const payments = await fetchPaymentData();
      
      let newExpenses: Expense[] = [];
      
      payments.forEach((payment) => {
        if (!payment.title || !payment.amount || !payment.date) return;
        
        const category = categorizeExpense(payment.title, payment.amount);
        
        const newExpense: Expense = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          title: payment.title,
          amount: payment.amount,
          category,
          date: payment.date,
          notes: payment.notes || `Auto-categorized as ${category}`
        };
        
        newExpenses.push(newExpense);
      });
      
      if (newExpenses.length > 0) {
        setExpenses(prev => [...prev, ...newExpenses]);
        
        setCategoryLimits(prevLimits => {
          const updatedLimits = [...prevLimits];
          
          const categoryTotals: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;
          
          newExpenses.forEach(expense => {
            if (!categoryTotals[expense.category]) {
              categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;
          });
          
          return updatedLimits.map(limit => {
            if (categoryTotals[limit.category]) {
              return {
                ...limit,
                current: limit.current + categoryTotals[limit.category]
              };
            }
            return limit;
          });
        });
        
        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = newExpenses.filter(expense => {
          const expenseDate = new Date(expense.date).toISOString().split('T')[0];
          return expenseDate === today;
        });
        
        if (todayExpenses.length > 0) {
          const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          
          setDailyLimit(prev => ({
            ...prev,
            current: prev.current + todayTotal
          }));
        }
        
        toast({
          title: "Transactions Imported",
          description: `${newExpenses.length} transactions were imported and categorized.`,
        });
      } else {
        toast({
          title: "No New Transactions",
          description: "No new transactions were found to import.",
        });
      }
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
      toast({
        title: "Import Failed",
        description: "Unable to import transactions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingPayments(false);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    
    setCategoryLimits(prevLimits => 
      prevLimits.map(limit => 
        limit.category === expense.category 
          ? { ...limit, current: limit.current + expense.amount } 
          : limit
      )
    );
    
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
  
  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(e => e.id === id);
    if (!expenseToDelete) return;
    
    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== id));
    
    setCategoryLimits(prevLimits => 
      prevLimits.map(limit => 
        limit.category === expenseToDelete.category 
          ? { ...limit, current: limit.current - expenseToDelete.amount } 
          : limit
      )
    );
    
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
  
  const updateExpense = (updatedExpense: Expense) => {
    const oldExpense = expenses.find(e => e.id === updatedExpense.id);
    if (!oldExpense) return;
    
    setExpenses(prevExpenses => 
      prevExpenses.map(e => e.id === updatedExpense.id ? updatedExpense : e)
    );
    
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
      const amountDiff = updatedExpense.amount - oldExpense.amount;
      setCategoryLimits(prevLimits => 
        prevLimits.map(limit => 
          limit.category === updatedExpense.category 
            ? { ...limit, current: limit.current + amountDiff } 
            : limit
        )
      );
    }
    
    const today = new Date().toISOString().split('T')[0];
    const oldExpenseDate = new Date(oldExpense.date).toISOString().split('T')[0];
    const newExpenseDate = new Date(updatedExpense.date).toISOString().split('T')[0];
    
    if (oldExpenseDate === today && newExpenseDate === today) {
      const amountDiff = updatedExpense.amount - oldExpense.amount;
      setDailyLimit(prev => ({
        ...prev,
        current: prev.current + amountDiff
      }));
    } else if (oldExpenseDate === today && newExpenseDate !== today) {
      setDailyLimit(prev => ({
        ...prev,
        current: prev.current - oldExpense.amount
      }));
    } else if (oldExpenseDate !== today && newExpenseDate === today) {
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
  
  const getTodayExpenses = (): Expense[] => {
    const today = new Date().toISOString().split('T')[0];
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date).toISOString().split('T')[0];
      return expenseDate === today;
    });
  };
  
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
