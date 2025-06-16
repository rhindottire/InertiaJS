<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get items that have been favorited
        $popularItems = Item::select('items.*')
            ->join('favorites', 'items.id', '=', 'favorites.item_id')
            ->distinct()
            ->get()
            ->map(function ($item) use ($user) {
                $item->is_favorite = $user ? 
                    $user->favorites()->where('item_id', $item->id)->exists() : 
                    false;
                return $item;
            });

        // Get regular items (for search)
        $items = Item::query()
            ->when(request('search'), function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->get()
            ->map(function ($item) use ($user) {
                $item->is_favorite = $user ? 
                    $user->favorites()->where('item_id', $item->id)->exists() : 
                    false;
                return $item;
            });
        // dd($popularItems);

        return Inertia::render('Homepage', [
            'items' => $items,
            'popularItems' => $popularItems -> toArray(),
            'search' => request('search'),
            'total' => $items->count()
        ]);
    }
}
