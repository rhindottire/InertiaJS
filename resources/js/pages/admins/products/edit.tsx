import { Item, SharedData } from "@/types"
import { usePage } from "@inertiajs/react"

export default function EditItem() {
  const { item, success, error } = usePage<SharedData & { item: { data: Item[] } }>().props
  console.log(item.data);
  
}