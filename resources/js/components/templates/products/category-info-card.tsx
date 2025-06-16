import type { Category } from "@/types"
import { Info } from "lucide-react"
import Card from "../../fragments/card/card"
import CardContent from "../../fragments/card/card-content"
import CardHeader from "../../fragments/card/card-header"
import CardTitle from "../../fragments/card/card-title"

interface CategoryInfoCardProps {
  category: Category
  stats: {
    totalItems: number
    averagePrice: number
    priceRange: { min: number; max: number }
  }
}

export function CategoryInfoCard({ category, stats }: CategoryInfoCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Category Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <img
            src={category.image_url || "/placeholder.svg"}
            alt={category.name}
            className="w-20 h-20 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=80&width=80"
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-3">{category.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Total Items:</span>
                <p className="text-blue-600 font-semibold">{stats.totalItems}</p>
              </div>
              {stats.totalItems > 0 && (
                <>
                  <div>
                    <span className="font-medium text-gray-700">Average Price:</span>
                    <p className="text-green-600 font-semibold">{formatPrice(stats.averagePrice)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Price Range:</span>
                    <p className="text-gray-600">
                      {formatPrice(stats.priceRange.min)} - {formatPrice(stats.priceRange.max)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
