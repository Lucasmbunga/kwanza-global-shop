import { Star, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ReviewDisplayProps {
  rating: number;
  comment: string | null;
  createdAt: string;
}

export function ReviewDisplay({ rating, comment, createdAt }: ReviewDisplayProps) {
  return (
    <Card className="border-green-500/20 bg-green-50 dark:bg-green-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          Sua Avaliação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-5 w-5',
                  rating >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium">
            {rating === 1 && 'Muito ruim'}
            {rating === 2 && 'Ruim'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Bom'}
            {rating === 5 && 'Excelente'}
          </span>
        </div>

        {comment && (
          <p className="text-sm text-muted-foreground italic">"{comment}"</p>
        )}

        <p className="text-xs text-muted-foreground">
          Avaliado em {format(new Date(createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </CardContent>
    </Card>
  );
}
