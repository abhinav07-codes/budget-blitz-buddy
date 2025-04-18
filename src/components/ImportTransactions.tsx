
import React from 'react';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/contexts/ExpenseContext';
import { ArrowDownCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ImportTransactions: React.FC = () => {
  const { fetchAndCategorizePayments, isFetchingPayments } = useExpense();
  const [lastImport, setLastImport] = useState<string | null>(null);

  useEffect(() => {
    // Load last import time from local storage
    const saved = localStorage.getItem('lastImportTime');
    if (saved) setLastImport(saved);
  }, []);

  const handleImport = async () => {
    try {
      await fetchAndCategorizePayments();
      const now = new Date().toISOString();
      setLastImport(now);
      localStorage.setItem('lastImportTime', now);
    } catch (error) {
      console.error('Error importing transactions:', error);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button 
        onClick={handleImport} 
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
      {lastImport && !isFetchingPayments && (
        <span className="text-xs text-muted-foreground">
          Last import: {new Date(lastImport).toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default ImportTransactions;
