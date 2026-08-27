import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Star } from 'lucide-react';
import { Supplier } from '@/lib/types/supplier';

export function SupplierCard({ supplier, onClick }: { supplier: Supplier; onClick?: () => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{supplier.name}</h3>
            <p className="text-sm text-neutral-500">{supplier.type}</p>
          </div>
          {supplier.rating?.overall ? (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">{supplier.rating.overall.toFixed(1)}</span>
            </div>
          ) : null}
        </div>
        <div className="mt-3 space-y-1 text-sm">
          {supplier.email && <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {supplier.email}</p>}
          {supplier.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {supplier.phone}</p>}
        </div>
        {supplier.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {supplier.tags.slice(0, 4).map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}