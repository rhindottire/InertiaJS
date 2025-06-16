import axios from 'axios';
import { router } from "@inertiajs/react";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  itemId: number;
  initialState?: boolean;
  className?: string;
}

export default function FavoriteButton({ 
  itemId, 
  initialState = false,
  className = ""
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(route('client.favorites.toggle'), {
        item_id: itemId
      });
      
      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit');
    } catch (error) {
      toast.error('Gagal mengubah status favorit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 
                 ${className}
                 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
    >
      <Heart 
        className={`h-5 w-5 transition-colors duration-200
                   ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                   ${isLoading ? 'animate-pulse' : ''}`}
      />
    </button>
  );
}