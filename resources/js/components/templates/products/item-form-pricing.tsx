"use client"

import type React from "react"
import Input from "../../elements/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import Card from "../../fragments/card/card"
import CardContent from "../../fragments/card/card-content"
import CardHeader from "../../fragments/card/card-header"
import CardTitle from "../../fragments/card/card-title"

interface ItemFormPricingProps {
  formData: {
    price: string
    stock: string
    unit: string
    discount: string
    expired_at: string
    is_available: string
  }
  averagePrice?: number
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectChange: (name: string, value: string) => void
}

export function ItemFormPricing({ formData, averagePrice, onInputChange, onSelectChange }: ItemFormPricingProps) {
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
        <CardTitle>Pricing & Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (IDR) *
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={onInputChange}
              placeholder="0"
            />
            {averagePrice && averagePrice > 0 && (
              <p className="text-xs mt-1">Suggested: {formatPrice(averagePrice)} (category average)</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-1">
              Stock Quantity *
            </label>
            <Input
              id="stock"
              name="stock"
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium mb-1">
              Unit *
            </label>
            <Select value={formData.unit} onValueChange={(value) => onSelectChange("unit", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                <SelectItem value="gram">Gram (g)</SelectItem>
                <SelectItem value="liter">Liter (L)</SelectItem>
                <SelectItem value="ml">Milliliter (ml)</SelectItem>
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium mb-1">
              Discount (%)
            </label>
            <Input
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="expired_at" className="block text-sm font-medium mb-1">
              Expiry Date
            </label>
            <Input id="expired_at" name="expired_at" type="date" value={formData.expired_at} onChange={onInputChange} />
          </div>

          <div>
            <label htmlFor="is_available" className="block text-sm font-medium mb-1">
              Availability *
            </label>
            <Select value={formData.is_available} onValueChange={(value) => onSelectChange("is_available", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Available</SelectItem>
                <SelectItem value="0">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
