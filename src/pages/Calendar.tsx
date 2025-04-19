
import React from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpense } from '@/contexts/ExpenseContext';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const Calendar = () => {
  const { expenses } = useExpense();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Create a map of dates to expenses for efficient lookup
  const expensesByDate = React.useMemo(() => {
    const map = new Map();
    expenses.forEach(expense => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date).push(expense);
    });
    return map;
  }, [expenses]);

  // Get expenses for selected date
  const selectedDateExpenses = React.useMemo(() => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return expensesByDate.get(dateStr) || [];
  }, [date, expensesByDate]);

  const totalForSelectedDate = selectedDateExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateExpenses.length > 0 ? (
              <div className="space-y-4">
                <p className="text-lg font-semibold">
                  Total: ${totalForSelectedDate.toFixed(2)}
                </p>
                <div className="space-y-2">
                  {selectedDateExpenses.map(expense => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-start p-3 rounded-lg bg-secondary/20"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{expense.description || expense.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{expense.category}</Badge>
                          {expense.source && (
                            <Badge variant="secondary">{expense.source}</Badge>
                          )}
                        </div>
                      </div>
                      <span className="font-medium">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No expenses for this date</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
