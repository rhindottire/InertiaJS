<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    public function toggle(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'item_id' => 'required|exists:items,id'
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'error' => 'User not authenticated'
                ], 401);
            }

            $itemId = $request->item_id;

            // Cek apakah item sudah di-favorite
            if ($user->hasFavorited($itemId)) {
                // Jika sudah favorite, hapus
                $user->favorites()
                     ->where('item_id', $itemId)
                     ->delete();

                return response()->json([
                    'success' => true,
                    'status' => 'removed',
                    'message' => 'Item removed from favorites'
                ]);
            }

            // Jika belum favorite, tambahkan
            $user->favorites()->create([
                'item_id' => $itemId
            ]);

            return response()->json([
                'success' => true,
                'status' => 'added',
                'message' => 'Item added to favorites'
            ]);

        } catch (\Exception $e) {
            Log::error('Favorite toggle failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to update favorite status',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
