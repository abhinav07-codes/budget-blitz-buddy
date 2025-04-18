
import React from 'react';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/contexts/ExpenseContext';
import { ArrowDownCircle, Loader2 } from 'lucide-react';

const ImportTransactions: React.FC = () => {
  const { fetchAndCategorizePayments, isFetchingPayments } = useExpense();

  return (
    <Button 
      onClick={() => fetchAndCategorizePayments()} 
      disabled={isFetchingPayments}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isFetchingPayments ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <ArrowDownCircle className="h-4 w-4" />
          Import Transactions
        </>
      )}
    </Button>
  );
};

export default ImportTransactions;
