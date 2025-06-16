"use client"

import type React from "react"
import Input from "../../elements/input"
import { Textarea } from "../../ui/textarea"
import Card from "../../fragments/card/card"
import CardContent from "../../fragments/card/card-content"
import CardHeader from "../../fragments/card/card-header"
import CardTitle from "../../fragments/card/card-title"

interface ItemFormBasicProps {
  formData: {
    name: string
    description: string
    category_id: string
  }
  categoryName: string
  categoryId: number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ItemFormBasic({ formData, categoryName, categoryId, onChange }: ItemFormBasicProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Item Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={onChange}
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium mb-1">
              Category *
            </label>
            <Input
              id="category_id"
              name="category_id"
              type="text"
              value={`${categoryName} (ID: ${categoryId})`}
              disabled
            />
            <p className="text-xs mt-1">Category is pre-selected and cannot be changed</p>
          </div>
          <p>
            
          </p>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={onChange}
              placeholder="Enter item description"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
