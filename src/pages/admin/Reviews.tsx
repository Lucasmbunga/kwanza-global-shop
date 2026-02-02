import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminReviews } from '@/hooks/useAdminReviews';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Star, MessageSquare, TrendingUp, Users, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          )}
        />
      ))}
    </div>
  );
}

function getRatingLabel(rating: number) {
  const labels: Record<number, string> = {
    1: 'Muito ruim',
    2: 'Ruim',
    3: 'Regular',
    4: 'Bom',
    5: 'Excelente',
  };
  return labels[rating] || '';
}

function getRatingBadgeVariant(rating: number) {
  if (rating >= 4) return 'default';
  if (rating === 3) return 'secondary';
  return 'destructive';
}

export default function Reviews() {
  const { reviews, stats, isLoading } = useAdminReviews();
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
      const matchesSearch =
        searchQuery === '' ||
        review.order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.order.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.comment && review.comment.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRating && matchesSearch;
    });
  }, [reviews, ratingFilter, searchQuery]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Avaliações</h1>
          <p className="text-muted-foreground">
            Acompanhe o feedback dos clientes sobre seus pedidos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Total de Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalReviews}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Média Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
                <StarRating rating={Math.round(stats.averageRating)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4" />
                Avaliações 5 Estrelas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.distribution[5]}</p>
              <p className="text-sm text-muted-foreground">
                {stats.totalReviews > 0
                  ? `${((stats.distribution[5] / stats.totalReviews) * 100).toFixed(0)}% do total`
                  : '0% do total'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Satisfação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {stats.totalReviews > 0
                  ? `${(((stats.distribution[4] + stats.distribution[5]) / stats.totalReviews) * 100).toFixed(0)}%`
                  : '0%'}
              </p>
              <p className="text-sm text-muted-foreground">4+ estrelas</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Avaliações</CardTitle>
            <CardDescription>Quantidade de avaliações por estrela</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1 h-3" />
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, pedido, produto ou comentário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por estrelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as avaliações</SelectItem>
              <SelectItem value="5">5 estrelas</SelectItem>
              <SelectItem value="4">4 estrelas</SelectItem>
              <SelectItem value="3">3 estrelas</SelectItem>
              <SelectItem value="2">2 estrelas</SelectItem>
              <SelectItem value="1">1 estrela</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Nenhuma avaliação encontrada</h3>
                <p className="text-muted-foreground">
                  {searchQuery || ratingFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'As avaliações dos clientes aparecerão aqui'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} />
                        <Badge variant={getRatingBadgeVariant(review.rating)}>
                          {getRatingLabel(review.rating)}
                        </Badge>
                      </div>
                      
                      {review.comment && (
                        <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                      )}

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span>
                          <strong>Cliente:</strong> {review.order.customer_name}
                        </span>
                        <span>
                          <strong>Pedido:</strong> {review.order.order_number}
                        </span>
                        <span>
                          <strong>Produto:</strong> {review.order.product_name}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground md:text-right">
                      {format(new Date(review.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
