import type { Category } from "@/types"
import { Package, DollarSign, Tag } from "lucide-react"
import { useCallback } from "react"
import { DeleteModal } from "./delete-modal"
import { EditButton } from "./edit-button"
import { ShowButton } from "./show-button"
import Card from "../fragments/card/card"
import CardHeader from "../fragments/card/card-header"
import { Badge } from "../ui/badge"
import CardTitle from "../fragments/card/card-title"
import CardDescription from "../fragments/card/card-description"
import CardFooter from "../fragments/card/card-footer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export function CategoriesCard({ category }: { category: Category }) {
  const itemsCount = category.items?.length || 0

  const averagePrice = useCallback(() => {
    if (!category.items || category.items.length === 0) return 0
    const totalPrice = category.items.reduce((acc, item) => acc + (item.price || 0), 0)
    return Math.round(totalPrice / category.items.length)
  }, [category.items])

  const priceRange = useCallback(() => {
    if (!category.items || category.items.length === 0) return { min: 0, max: 0 }
    const prices = category.items.map((item) => item.price || 0)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [category.items])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const { min, max } = priceRange()

  return (
    <Card key={category.id} className="relative overflow-hidden pt-0">
      <CardHeader className="px-0">
        <div className="relative h-52 w-full">
          <img
            className="h-full w-full object-cover"
            src={category.image_url || "/placeholder.svg"}
            alt={category.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=208&width=300"
            }}
          />
          <Badge className="absolute top-2 right-2" variant="secondary">
            {category.slug}
          </Badge>
        </div>
        <CardTitle className="mt-2 px-6 text-xl">{category.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3 px-6">{category.description}</CardDescription>
        <div className="text-muted-foreground flex items-center gap-2 px-6 flex-wrap">
          <span className="flex items-center gap-2 py-2 text-sm">
            <Badge variant="secondary" className="rounded-full py-2">
              <Package className="h-4 w-4 text-blue-500" />
            </Badge>
            {itemsCount} Items
          </span>
          {itemsCount > 0 && (
            <span className="flex items-center gap-2 py-2 text-sm">
              <Badge variant="secondary" className="rounded-full py-2">
                <DollarSign className="h-4 w-4 text-green-500" />
              </Badge>
              Avg: {formatPrice(averagePrice())}
            </span>
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <div className="text-muted-foreground flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {itemsCount > 0 && (
              <span className="flex items-center gap-2 py-2 text-sm">
                <Badge variant="secondary" className="rounded-full py-2">
                  <Tag className="h-4 w-4 text-purple-500" />
                </Badge>
                {min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ShowButton endpoint="categorie" id={String(category.id)} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Items</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <EditButton endpoint="categorie" id={String(category.id)} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DeleteModal resourceName="category" id={category.id} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
