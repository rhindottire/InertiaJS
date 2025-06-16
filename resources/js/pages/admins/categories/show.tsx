import { Button } from "@/components/elements/button"
import AppLayout from "@/components/layouts/app-layout"
import { ItemCard } from "@/components/templates/items-card"
import type { BreadcrumbItem, Category, SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { ArrowLeft, Plus, Package, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Input from "@/components/elements/input"

export default function CategoryShow() {
  const { category, success, error } = usePage<SharedData & { category: { data: Category } }>().props

  console.log("Category data:", category)
  console.log("Items in category:", category.data.items)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Categories",
      href: "/admin/categories",
    },
    {
      title: category.data.name,
      href: `/admin/categories/${category.data.id}`,
    },
  ]

  useEffect(() => {
    if (success) toast.success(success as string)
    if (error) toast.error(error as string)
  }, [success, error])

  // Filter and sort items
  const filteredAndSortedItems = () => {
    if (!category.data.items) return []

    let items = [...category.data.items]

    // Filter by search term
    if (searchTerm) {
      items = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Sort items
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "stock":
          return b.stock - a.stock
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return items
  }

  const filteredItems = filteredAndSortedItems()

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredItems.slice(startIndex, endIndex)

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${category.data.name} - Items`} />

      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{category.data.name}</h1>
            <p className="text-gray-500">{category.data.description}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {category.data.items?.length || 0} items in this category
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/items">View All Items</Link>
          </Button>
          <Button asChild>
            <Link href={route('items.create', {
              category: category.data.id
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-5 mb-5">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <img
              src={category.data.image_url || "/placeholder.svg"}
              alt={category.data.name}
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=96&width=96"
              }}
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{category.data.name}</h2>
              <p className="text-gray-600 mb-3">{category.data.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Slug: {category.data.slug}</span>
                <span>Created: {new Date(category.data.created_at).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {category.data.items && category.data.items.length > 0 && (
        <div className="flex items-center gap-4 px-5 mb-5">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="stock">Stock (High to Low)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results Info */}
      {category.data.items && category.data.items.length > 0 && (
        <div className="px-5 mb-5">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
            {searchTerm && ` (filtered from ${category.data.items.length} total)`}
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="px-5">
        {currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {currentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : category.data.items && category.data.items.length > 0 ? (
          // No results from search/filter
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCurrentPage(1)
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">This category doesn't have any items yet.</p>
            <Button asChild>
              <Link href={`/admin/items/create?category_id=${category.data.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
