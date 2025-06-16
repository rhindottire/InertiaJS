<?php

namespace App\Http\Controllers\Admin;

use App\Models\Item;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ItemResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class AdminItemController extends Controller {
    public function index() {
        // $items = Item::with('category')->get();

        // return Inertia::render('admins/products/index', [
        //     'items' => ItemResource::collection($items),
        //     'success' => session('success'),
        //     'error' => session('error'),
        // ]);
    }

    public function create(Request $request) {
        $query = $request->query('category');

        $category = Category::find($query)->load(['items']);
        return Inertia::render('admins/products/create', [
            'category' =>  new CategoryResource($category),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(StoreItemRequest $request) {
        try {
            $validated = $request->validated();

            if ($request->hasFile('image_url')) {
                $imageUrl = $request->file('image_url')->store('img/items', 'public');
                $validated['image_url'] = $imageUrl;
            }

            Item::create($validated);
            return redirect()->route('items.index')->with('success', 'Item created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create item.');
        }
    }

    public function show(Item $item) {
        $item = Item::with('items')->get();

        return Inertia::render('admins/products/show', [
            'item' => new ItemResource($item),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function edit(Item $item) {
        $item->load('category');

        return Inertia::render('admins/products/edit', [
            'item' => new ItemResource($item),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(UpdateItemRequest $request, Item $item) {
        try {
            $validated = $request->validated();


            if ($request->hasFile('image_url')) {
                $path = $request->file('image_url')->store('img/items', 'public');
                $validated['image_url'] = $path;
            }
            $item->update($validated);

            return redirect()->route('items.index')->with('success', 'Item updated successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to update item.');
        }
    }

    public function destroy(Item $item) {
        try {
            $item->delete();

            return redirect()->back()->with('success', 'Item deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete item.');
        }
    }
}
