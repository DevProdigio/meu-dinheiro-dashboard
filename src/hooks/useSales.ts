import { useState, useEffect } from 'react';
import { Sale, SaleSource } from '@/types/sales';
import { startOfDay, startOfMonth, subMonths, isAfter, parseISO } from 'date-fns';

const STORAGE_KEY = 'dashboard-sales';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSales(JSON.parse(stored));
    }
  }, []);

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSales));
  };

  const addSale = (value: number, source: SaleSource, description?: string, date?: string) => {
    const newSale: Sale = {
      id: crypto.randomUUID(),
      value,
      source,
      description,
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    saveSales([newSale, ...sales]);
  };

  const deleteSale = (id: string) => {
    saveSales(sales.filter(sale => sale.id !== id));
  };

  const getDailyTotal = () => {
    const today = startOfDay(new Date());
    return sales
      .filter(sale => {
        const saleDate = startOfDay(parseISO(sale.date));
        return saleDate.getTime() === today.getTime();
      })
      .reduce((sum, sale) => sum + sale.value, 0);
  };

  const getMonthlyTotal = () => {
    const monthStart = startOfMonth(new Date());
    return sales
      .filter(sale => isAfter(parseISO(sale.date), monthStart) || parseISO(sale.date).getTime() === monthStart.getTime())
      .reduce((sum, sale) => sum + sale.value, 0);
  };

  const getPeriodTotal = (months: number) => {
    const periodStart = subMonths(startOfMonth(new Date()), months - 1);
    return sales
      .filter(sale => isAfter(parseISO(sale.date), periodStart) || parseISO(sale.date).getTime() === periodStart.getTime())
      .reduce((sum, sale) => sum + sale.value, 0);
  };

  const getSalesByPeriod = (months: number) => {
    const periodStart = subMonths(startOfMonth(new Date()), months - 1);
    return sales.filter(sale => 
      isAfter(parseISO(sale.date), periodStart) || parseISO(sale.date).getTime() === periodStart.getTime()
    );
  };

  return {
    sales,
    addSale,
    deleteSale,
    getDailyTotal,
    getMonthlyTotal,
    getPeriodTotal,
    getSalesByPeriod,
  };
}
