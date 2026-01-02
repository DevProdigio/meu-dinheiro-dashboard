export type SaleSource = 'info-produto' | 'curso' | 'mentoria' | 'ebook' | 'consultoria' | 'outro';

export interface Sale {
  id: string;
  value: number;
  source: SaleSource;
  description?: string;
  date: string;
  createdAt: string;
}

export const sourceLabels: Record<SaleSource, string> = {
  'info-produto': 'Info-Produto',
  'curso': 'Curso',
  'mentoria': 'Mentoria',
  'ebook': 'E-book',
  'consultoria': 'Consultoria',
  'outro': 'Outro',
};

export const sourceColors: Record<SaleSource, string> = {
  'info-produto': 'bg-emerald-500',
  'curso': 'bg-blue-500',
  'mentoria': 'bg-purple-500',
  'ebook': 'bg-amber-500',
  'consultoria': 'bg-rose-500',
  'outro': 'bg-slate-500',
};
