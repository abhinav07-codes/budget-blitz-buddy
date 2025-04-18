
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, getUser } from '@/lib/supabase';
import { Expense, ExpenseCategory, CategoryLimit, DailyLimit } from '@/types';
import { toast } from '@/hooks/use-toast';

// Type transformations between Supabase and App types
const transformExpenseFromDB = (dbExpense: any): Expense => ({
  id: dbExpense.id,
  title: dbExpense.title,
  amount: dbExpense.amount,
  category: dbExpense.category as ExpenseCategory,
  date: dbExpense.date,
  notes: dbExpense.notes || undefined
});

const transformCategoryLimitFromDB = (dbLimit: any): CategoryLimit => ({
  category: dbLimit.category as ExpenseCategory,
  limit: dbLimit.limit_amount,
  current: dbLimit.current_amount
});

const transformDailyLimitFromDB = (dbLimit: any): DailyLimit => ({
  limit: dbLimit.limit_amount,
  current: dbLimit.current_amount,
  date: dbLimit.date
});

// Fetch expenses
const fetchExpenses = async () => {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data.map(transformExpenseFromDB);
};

// Fetch category limits
const fetchCategoryLimits = async () => {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('category_limits')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data.map(transformCategoryLimitFromDB);
};

// Fetch daily limit
const fetchDailyLimit = async () => {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_limits')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle();

  if (error) throw error;
  
  if (!data) {
    // Create a default daily limit if none exists
    const { data: newLimit, error: createError } = await supabase
      .from('daily_limits')
      .insert({
        user_id: user.id,
        limit_amount: 100, // Default amount
        current_amount: 0,
        date: today
      })
      .select('*')
      .single();
      
    if (createError) throw createError;
    return transformDailyLimitFromDB(newLimit);
  }
  
  return transformDailyLimitFromDB(data);
};

// Create or update expense
const upsertExpense = async (expense: Omit<Expense, 'id'> | Expense) => {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  const supabaseExpense = {
    user_id: user.id,
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    notes: expense.notes || null,
    imported: false
  };

  if ('id' in expense) {
    // Update existing expense
    const { data, error } = await supabase
      .from('expenses')
      .update(supabaseExpense)
      .eq('id', expense.id)
      .select('*')
      .single();
      
    if (error) throw error;
    return transformExpenseFromDB(data);
  } else {
    // Create new expense
    const { data, error } = await supabase
      .from('expenses')
      .insert(supabaseExpense)
      .select('*')
      .single();
      
    if (error) throw error;
    return transformExpenseFromDB(data);
  }
};

// Delete expense
const deleteExpenseById = async (id: string) => {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return id;
};

// Update daily limit
const updateDailyLimitAmount = async (amount: number) => {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_limits')
    .update({ limit_amount: amount })
    .eq('user_id', user.id)
    .eq('date', today)
    .select('*')
    .single();
    
  if (error) throw error;
  return transformDailyLimitFromDB(data);
};

// Update category limit
const updateCategoryLimitAmount = async ({ category, amount }: { category: ExpenseCategory; amount: number }) => {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if the category limit exists
  const { data: existingLimit, error: fetchError } = await supabase
    .from('category_limits')
    .select('*')
    .eq('user_id', user.id)
    .eq('category', category)
    .maybeSingle();
    
  if (fetchError) throw fetchError;

  if (existingLimit) {
    // Update existing limit
    const { data, error } = await supabase
      .from('category_limits')
      .update({ limit_amount: amount })
      .eq('id', existingLimit.id)
      .select('*')
      .single();
      
    if (error) throw error;
    return transformCategoryLimitFromDB(data);
  } else {
    // Create new limit
    const { data, error } = await supabase
      .from('category_limits')
      .insert({
        user_id: user.id,
        category,
        limit_amount: amount,
        current_amount: 0
      })
      .select('*')
      .single();
      
    if (error) throw error;
    return transformCategoryLimitFromDB(data);
  }
};

// Process imported payments
const processImportedPayments = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('process-payments');
    
    if (error) throw error;
    return data.data;
  } catch (error) {
    console.error('Error processing payments:', error);
    throw error;
  }
};

export const useSupabaseExpenses = () => {
  const queryClient = useQueryClient();

  // Query hooks
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses
  });

  const { data: categoryLimits = [], isLoading: limitsLoading } = useQuery({
    queryKey: ['categoryLimits'],
    queryFn: fetchCategoryLimits
  });

  const { data: dailyLimit, isLoading: dailyLimitLoading } = useQuery({
    queryKey: ['dailyLimit'],
    queryFn: fetchDailyLimit
  });

  // Mutation hooks
  const addOrUpdateExpense = useMutation({
    mutationFn: upsertExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['categoryLimits'] });
      queryClient.invalidateQueries({ queryKey: ['dailyLimit'] });
    }
  });

  const removeExpense = useMutation({
    mutationFn: deleteExpenseById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['categoryLimits'] });
      queryClient.invalidateQueries({ queryKey: ['dailyLimit'] });
    }
  });

  const updateDailyLimit = useMutation({
    mutationFn: updateDailyLimitAmount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLimit'] });
    }
  });

  const updateCategoryLimit = useMutation({
    mutationFn: updateCategoryLimitAmount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryLimits'] });
    }
  });

  const importTransactions = useMutation({
    mutationFn: processImportedPayments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['categoryLimits'] });
      queryClient.invalidateQueries({ queryKey: ['dailyLimit'] });
      
      toast({
        title: "Transactions Imported",
        description: "Your transactions have been successfully imported and categorized.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Unable to import transactions. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Helper functions
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

  return {
    expenses,
    categoryLimits,
    dailyLimit: dailyLimit || { limit: 100, current: 0, date: new Date().toISOString().split('T')[0] },
    isLoading: expensesLoading || limitsLoading || dailyLimitLoading,
    addExpense: (expense: Omit<Expense, 'id'>) => {
      addOrUpdateExpense.mutate(expense);
      toast({
        title: "Expense Added",
        description: `${expense.title} for $${expense.amount.toFixed(2)}`,
      });
    },
    updateExpense: (expense: Expense) => {
      addOrUpdateExpense.mutate(expense);
      toast({
        title: "Expense Updated",
        description: `${expense.title} for $${expense.amount.toFixed(2)}`,
      });
    },
    deleteExpense: (id: string) => {
      const expense = expenses.find(e => e.id === id);
      if (!expense) return;
      
      removeExpense.mutate(id);
      toast({
        title: "Expense Deleted",
        description: `${expense.title} for $${expense.amount.toFixed(2)}`,
      });
    },
    updateDailyLimit: (limit: number) => {
      updateDailyLimit.mutate(limit);
      toast({
        title: "Daily Limit Updated",
        description: `New limit set to $${limit.toFixed(2)}`,
      });
    },
    updateCategoryLimit: (category: ExpenseCategory, limit: number) => {
      updateCategoryLimit.mutate({ category, amount: limit });
      toast({
        title: "Category Limit Updated",
        description: `${category} limit set to $${limit.toFixed(2)}`,
      });
    },
    getTodayExpenses,
    getMonthlyExpenses,
    fetchAndCategorizePayments: () => {
      importTransactions.mutate();
    },
    isFetchingPayments: importTransactions.isPending
  };
};
