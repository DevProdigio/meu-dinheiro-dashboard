import { Trash2, BookOpen, GraduationCap, Users, FileText, Briefcase, Package } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sale, SaleSource, sourceLabels, sourceColors } from '@/types/sales';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const sourceIcons: Record<SaleSource, React.ComponentType<{ className?: string }>> = {
  'info-produto': BookOpen,
  'curso': GraduationCap,
  'mentoria': Users,
  'ebook': FileText,
  'consultoria': Briefcase,
  'outro': Package,
};

interface SalesHistoryProps {
  sales: Sale[];
  onDelete: (id: string) => void;
}

export function SalesHistory({ sales, onDelete }: SalesHistoryProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  if (sales.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">Nenhuma venda registrada</p>
        <p className="text-sm text-muted-foreground/70">Adicione sua primeira venda clicando no botão acima</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="h-[400px]">
        <div className="divide-y divide-border">
          {sales.map((sale) => {
            const Icon = sourceIcons[sale.source];
            return (
              <div
                key={sale.id}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/30"
              >
                <div className={`rounded-lg p-2.5 ${sourceColors[sale.source]}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {sourceLabels[sale.source]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(sale.date), "dd 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>
                  {sale.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {sale.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatCurrency(sale.value)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(sale.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
