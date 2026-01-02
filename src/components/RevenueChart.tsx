import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sale } from '@/types/sales';
import { Card } from '@/components/ui/card';

interface RevenueChartProps {
  sales: Sale[];
  months: number;
}

export function RevenueChart({ sales, months }: RevenueChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const startDate = subMonths(startOfMonth(now), months - 1);
    const endDate = startOfMonth(now);
    
    const monthsInRange = eachMonthOfInterval({ start: startDate, end: endDate });
    
    return monthsInRange.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const monthTotal = sales
        .filter((sale) => {
          const saleDate = parseISO(sale.date);
          return saleDate >= monthStart && saleDate <= monthEnd;
        })
        .reduce((sum, sale) => sum + sale.value, 0);
      
      return {
        month: format(month, 'MMM', { locale: ptBR }),
        fullMonth: format(month, "MMMM 'de' yyyy", { locale: ptBR }),
        value: monthTotal,
      };
    });
  }, [sales, months]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Faturamento por Mês</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
              width={45}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-popover p-3 shadow-lg">
                      <p className="text-sm text-muted-foreground capitalize">
                        {payload[0].payload.fullMonth}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
