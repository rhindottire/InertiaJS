"use client"

import { Button } from "@/components/elements/button"
import Input from "@/components/elements/input"
import AppLayout from "@/components/layouts/app-layout"
import { ItemCard } from "@/components/templates/items-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BreadcrumbItem, Item, SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { Filter, Package, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Items",
    href: "/admin/items",
  },
]

export default function ItemsIndex() {
  const { items, success, error } = usePage<SharedData & { items: { data: Item[] } }>().props
  const item = items.data

  console.log("All items data:", items)

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16

  // Get unique categories for filter
  const categories = Array.from(new Set(item.map((i) => i.category?.name).filter(Boolean)))

  useEffect(() => {
    if (success) toast.success(success as string)
    if (error) toast.error(error as string)
  }, [success, error])

  // Calculate statistics
  const getItemStats = () => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return item.reduce(
      (stats, i) => {
        stats.total++
        if (i.is_available) stats.available++
        if (i.stock === 0) stats.outOfStock++

        if (i.expired_at) {
          const expiredDate = new Date(i.expired_at)
          if (expiredDate < now) {
            stats.expired++
          } else if (expiredDate < sevenDaysFromNow) {
            stats.nearExpiry++
          }
        }

        return stats
      },
      { total: 0, available: 0, expired: 0, nearExpiry: 0, outOfStock: 0 },
    )
  }

  const stats = getItemStats()

  // Filter and sort items
  const filteredAndSortedItems = () => {
    let filtered = [...item]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category?.name === categoryFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      const now = new Date()
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      filtered = filtered.filter((item) => {
        switch (statusFilter) {
          case "available":
            return item.is_available === true
          case "out-of-stock":
            return item.stock === 0
          case "expired":
            return item.expired_at && new Date(item.expired_at) < now
          case "near-expiry":
            return item.expired_at && new Date(item.expired_at) > now && new Date(item.expired_at) < sevenDaysFromNow
          default:
            return true
        }
      })
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "category":
          return (a.category?.name || "").localeCompare(b.category?.name || "")
        case "stock":
          return b.stock - a.stock
        case "expiry":
          if (!a.expired_at && !b.expired_at) return 0
          if (!a.expired_at) return 1
          if (!b.expired_at) return -1
          return new Date(a.expired_at).getTime() - new Date(b.expired_at).getTime()
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredItems = filteredAndSortedItems()

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredItems.slice(startIndex, endIndex)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, statusFilter, sortBy])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Items" />

      {/* Header Section */}
      <div className="flex items-center justify-between p-5">
        <div>
          <h1 className="text-2xl font-bold">All Items</h1>
          <p className="text-gray-500">Manage all items across categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/categories">View Categories</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/items/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mx-5 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.nearExpiry}</div>
            <div className="text-sm text-muted-foreground">Near Expiry</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.outOfStock}</div>
            <div className="text-sm text-muted-foreground">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-4 px-5 mb-5 flex-wrap">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available Only</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="near-expiry">Near Expiry</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price-low">Price (Low to High)</SelectItem>
            <SelectItem value="price-high">Price (High to Low)</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="stock">Stock (High to Low)</SelectItem>
            <SelectItem value="expiry">Expiry Date</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {categoryFilter}
                <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setStatusFilter("all")
              }}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="px-5 mb-5">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
          {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") &&
            ` (filtered from ${item.length} total)`}
        </div>
      </div>

      {/* Items Grid */}
      <div className="px-5">
        {currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {currentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 m-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page
                    if (totalPages <= 7) {
                      page = i + 1
                    } else if (currentPage <= 4) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 3) {
                      page = totalPages - 6 + i
                    } else {
                      page = currentPage - 3 + i
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    )
                  })}
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No items have been created yet."}
            </p>
            <div className="flex gap-2 justify-center">
              {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                    setStatusFilter("all")
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button asChild>
                <Link href="/admin/items/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
