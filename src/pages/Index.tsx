import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, CalendarDays } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { StatsCard } from '@/components/StatsCard';
import { AddSaleDialog } from '@/components/AddSaleDialog';
import { SalesHistory } from '@/components/SalesHistory';
import { RevenueChart } from '@/components/RevenueChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const [filterMonths, setFilterMonths] = useState(3);
  const { sales, addSale, deleteSale, getDailyTotal, getMonthlyTotal, getPeriodTotal, getSalesByPeriod } = useSales();

  const filteredSales = getSalesByPeriod(filterMonths);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Controle de vendas do mercado digital</p>
          </div>
          <AddSaleDialog onAddSale={addSale} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Faturamento Hoje"
            value={getDailyTotal()}
            icon={DollarSign}
            subtitle="Vendas do dia"
          />
          <StatsCard
            title="Faturamento Mensal"
            value={getMonthlyTotal()}
            icon={Calendar}
            subtitle="Mês atual"
          />
          <StatsCard
            title="Últimos 3 Meses"
            value={getPeriodTotal(3)}
            icon={CalendarDays}
            subtitle="Acumulado trimestral"
          />
          <StatsCard
            title="Total do Período"
            value={getPeriodTotal(filterMonths)}
            icon={TrendingUp}
            subtitle={`Últimos ${filterMonths} meses`}
          />
        </section>

        {/* Chart Section */}
        <RevenueChart sales={sales} months={filterMonths} />

        {/* Sales History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Histórico de Vendas</h2>
            <Select
              value={filterMonths.toString()}
              onValueChange={(v) => setFilterMonths(parseInt(v))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Último mês</SelectItem>
                <SelectItem value="3">Últimos 3 meses</SelectItem>
                <SelectItem value="6">Últimos 6 meses</SelectItem>
                <SelectItem value="12">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SalesHistory sales={filteredSales} onDelete={deleteSale} />
        </section>
      </main>
    </div>
  );
};

export default Index;
