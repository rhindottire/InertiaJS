import type { Item } from '@/types';
import { Calendar, CheckCircle, DollarSign, XCircle } from 'lucide-react';
import Card from '../fragments/card/card';
import CardContent from '../fragments/card/card-content';
import CardFooter from '../fragments/card/card-footer';
import CardHeader from '../fragments/card/card-header';
import CardTitle from '../fragments/card/card-title';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DeleteModal } from './delete-modal';
import { EditButton } from './edit-button';

export function ItemCard({ item }: { item: Item }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpired = item.expired_at && new Date(item.expired_at) < new Date();

  return (
    <Card className="relative overflow-hidden pt-0">
      <CardHeader className="px-0">
        <div className="relative h-52 w-full">
          <img
            className="h-full w-full object-cover"
            src={item.image_url || '/placeholder.svg'}
            alt={item.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg?height=208&width=300';
            }}
          />
          {item.discount > 0 && <Badge className="absolute top-2 right-2 bg-red-500 text-white">{item.discount}% OFF</Badge>}
          {isExpired && (
            <div className="bg-opacity-60 absolute inset-0 flex items-center justify-center bg-black">
              <Badge variant="destructive" className="px-3 py-1 text-lg">
                Expired
              </Badge>
            </div>
          )}
        </div>
        <div className="mt-2 px-6 text-xl flex items-center justify-between">
          <Badge variant={item.is_available ? 'success' : 'outline'} className="text-xs">
            {item.is_available ? 'Available' : 'Out of Stock'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {item.unit}
          </Badge>
        </div>
        <CardTitle className="mt-2 px-6 line-clamp-1 text-lg">{item.name}</CardTitle>
        <div className="flex items-center justify-between">
          <span className="mt-2 px-6 flex items-center gap-1 text-lg font-semibold text-green-600">
            <DollarSign className="h-4 w-4" />
            {formatPrice(item.price)}
          </span>
          {item.stock !== null && <span className="mt-2 px-6 text-muted-foreground text-sm">Stock: {item.stock}</span>}
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        <p className="text-muted-foreground line-clamp-2 text-sm">{item.description}</p>

        {item.expired_at && (
          <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span>Exp: {formatDate(item.expired_at)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {item.is_available ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <EditButton endpoint="item" id={String(item.id)} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DeleteModal resourceName="item" id={item.id} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
