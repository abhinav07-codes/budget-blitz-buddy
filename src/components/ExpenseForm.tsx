
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Expense, ExpenseCategory } from '@/types';
import { useExpense } from '@/contexts/ExpenseContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';

const ExpenseForm: React.FC = () => {
  const { addExpense } = useExpense();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };
  
  const handleCategoryChange = (value: ExpenseCategory) => {
    setFormData({ ...formData, category: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    addExpense({
      title: formData.title,
      amount,
      category: formData.category,
      date: new Date(formData.date).toISOString(),
      notes: formData.notes || undefined
    });
    
    setFormData({
      title: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="Coffee, Groceries, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange('amount')}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="bills">Bills</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Add any additional details"
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" className="w-full">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
