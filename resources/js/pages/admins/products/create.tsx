"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Head, Link, router, usePage } from "@inertiajs/react"
import { toast } from "sonner"
import { Save } from "lucide-react"

import AppLayout from "@/components/layouts/app-layout"
import { Button } from "@/components/elements/button"
import { CategoryInfoCard } from "@/components/templates/products/category-info-card"
import { ItemFormBasic } from "@/components/templates/products/item-form-basic"
import { ItemFormPricing } from "@/components/templates/products/item-form-pricing"
import { FormFieldImage } from "@/components/fragments/form/form-field-image"
import { ExistingItemsPreview } from "@/components/templates/products/existing-items-preview"
import { PageHeader } from "@/components/templates/products/page-header"

import type { BreadcrumbItem, Category, SharedData } from "@/types"

export default function ItemCreate() {
  const { category, success, error } = usePage<SharedData & { category: { data: Category } }>().props

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    unit: "pcs",
    category_id: category.data?.id?.toString() || "",
    discount: "0",
    expired_at: "",
    is_available: "1",
    image: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Categories",
      href: "/admin/categories",
    },
    {
      title: category.data?.name || "Category",
      href: `/admin/categories/${category.data?.id}`,
    },
    {
      title: "Add Item",
      href: `/admin/items/create?category=${category.data?.id}`,
    },
  ]

  useEffect(() => {
    if (success) toast.success(success as string)
    if (error) toast.error(error as string)
  }, [success, error])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submitData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        submitData.append(key, value as string | Blob)
      }
    })

    router.post("/admin/items", submitData, {
      onFinish: () => setIsSubmitting(false),
      forceFormData: true,
    })
  }

  // Calculate category statistics
  const categoryStats = {
    totalItems: category.data?.items?.length || 0,
    averagePrice:
      category.data?.items?.length > 0
        ? Math.round(category.data.items.reduce((sum, item) => sum + item.price, 0) / category.data.items.length)
        : 0,
    priceRange:
      category.data?.items?.length > 0
        ? {
            min: Math.min(...category.data.items.map((item) => item.price)),
            max: Math.max(...category.data.items.map((item) => item.price)),
          }
        : { min: 0, max: 0 },
  }

  const headerActions = (
    <Button variant="outline" asChild>
      <Link href="/admin/items">View All Items</Link>
    </Button>
  )

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Add Item to ${category.data?.name}`} />

      <PageHeader
        title="Add New Item"
        subtitle="Create a new item for this category"
        backHref={`/admin/categories/${category.data?.id}`}
        categoryName={category.data?.name}
        totalItems={categoryStats.totalItems}
        actions={headerActions}
      />

      <div className="mx-5 mb-5">
        <CategoryInfoCard category={category.data} stats={categoryStats} />
      </div>

      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ItemFormBasic
            formData={{
              name: formData.name,
              description: formData.description,
              category_id: formData.category_id,
            }}
            categoryName={category.data?.name || ""}
            categoryId={category.data?.id || 0}
            onChange={handleInputChange}
          />

          <ItemFormPricing
            formData={{
              price: formData.price,
              stock: formData.stock,
              unit: formData.unit,
              discount: formData.discount,
              expired_at: formData.expired_at,
              is_available: formData.is_available,
            }}
            averagePrice={categoryStats.averagePrice}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />

          <FormFieldImage imagePreview={imagePreview} onChange={handleImageChange} />

          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/admin/categories/${category.data?.id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Item
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {category.data?.items && category.data.items.length > 0 && (
        <div className="mx-5 mt-8 mb-5">
          <ExistingItemsPreview
            items={category.data.items}
            categoryName={category.data.name}
            categoryId={category.data.id}
          />
        </div>
      )}
    </AppLayout>
  )
}
