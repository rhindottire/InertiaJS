import type React from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Button } from "../../elements/button"

interface PageHeaderProps {
  title: string
  subtitle: string
  backHref: string
  categoryName?: string
  totalItems?: number
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, backHref, categoryName, totalItems, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">{subtitle}</p>
          {categoryName && (
            <p className="text-sm text-blue-600 mt-1">
              Category: {categoryName}
              {totalItems !== undefined && ` • ${totalItems} existing items`}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}
