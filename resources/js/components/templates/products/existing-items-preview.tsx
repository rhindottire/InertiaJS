import type { Item } from "@/types"
import { Package } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Button } from "../../elements/button"
import { ItemCard } from "../items-card"
import Card from "../../fragments/card/card"
import CardContent from "../../fragments/card/card-content"
import CardHeader from "../../fragments/card/card-header"
import CardTitle from "../../fragments/card/card-title"

interface ExistingItemsPreviewProps {
  items: Item[]
  categoryName: string
  categoryId: number
}

export function ExistingItemsPreview({ items, categoryName, categoryId }: ExistingItemsPreviewProps) {
  if (!items || items.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-green-500" />
          Existing Items in {categoryName} ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Here are the current items in this category for reference when creating your new item.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.slice(0, 8).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        {items.length > 8 && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href={`/admin/categories/${categoryId}`}>View All {items.length} Items</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
  