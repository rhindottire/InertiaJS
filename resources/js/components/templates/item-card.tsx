import type { Item } from "@/types"
import { Package, DollarSign } from "lucide-react"
import { DeleteModal } from "./delete-modal"
import { EditButton } from "./edit-button"
import Card from "../fragments/card/card"
import CardHeader from "../fragments/card/card-header"
import { Badge } from "../ui/badge"
import CardTitle from "../fragments/card/card-title"
import CardDescription from "../fragments/card/card-description"
import CardFooter from "../fragments/card/card-footer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export function ItemCard({ item }: { item: Item }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {item.category?.name || "No Category"}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            per {item.unit}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{item.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-lg font-semibold text-green-600">
          <DollarSign className="h-4 w-4" />
          {formatPrice(item.price)}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>Unit: {item.unit}</span>
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
  )
}
