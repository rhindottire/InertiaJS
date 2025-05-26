<?php

namespace App\Http\Controllers\Admin;

use App\Models\Address;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminAddressController extends Controller {
    public function index(Request $request) {
        $query = Address::with(['contact.user:id,username,email']);
        
        // Multi-field search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('post_code', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('province', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('street', 'like', "%{$search}%")
                  ->orWhereHas('contact', function($contactQuery) use ($search) {
                      $contactQuery->where('name', 'like', "%{$search}%")
                                  ->orWhereHas('user', function($userQuery) use ($search) {
                                      $userQuery->where('username', 'like', "%{$search}%")
                                               ->orWhere('email', 'like', "%{$search}%");
                                  });
                  });
            });
        }
        
        // Sorting
        if ($request->filled('sort_by') && $request->filled('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        } else {
            $query->latest();
        }
        
        $address = $query->get();

        return Inertia::render('admins/address/index', [
            'address' => AddressResource::collection($address),
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create() {
        //
    }

    public function store(StoreAddressRequest $request) {
        //
    }

    public function show(Address $address) {
        //
    }

    public function edit(Address $address) {
        //
    }

    public function update(UpdateAddressRequest $request, Address $address) {
        //
    }

    public function destroy(Address $address) {
        //
    }
}