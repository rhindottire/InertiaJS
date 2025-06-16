"use client"

import type React from "react"
import { Upload } from "lucide-react"
import Card from "../card/card"
import CardContent from "../card/card-content"
import CardHeader from "../card/card-header"
import CardTitle from "../card/card-title"

interface FormFieldImageProps {
  imagePreview: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormFieldImage({ imagePreview, onChange }: FormFieldImageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Upload Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="mb-4">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              ) : (
                <Upload className="mx-auto h-12 w-12" />
              )}
              <div className="flex text-sm">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer rounded-md font-medium"
                >
                  <span>{imagePreview ? "Change image" : "Upload a file"}</span>
                  <input id="image" name="image" type="file" className="sr-only" accept="image/*" onChange={onChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
