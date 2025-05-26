<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withTrashed();

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by deleted status
        if ($request->filled('deleted_status')) {
            if ($request->deleted_status === 'deleted') {
                $query->onlyTrashed();
            } elseif ($request->deleted_status === 'active') {
                $query->whereNull('deleted_at');
            }
        }

        // Multi-field search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        // Sorting
        if ($request->filled('sort_by') && $request->filled('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        } else {
            $query->latest()->orderBy('id', 'asc');;
        }
        // Pagination
        $perPage = $request->get('per_page', 10);
        $users = $query->paginate($perPage);

        return Inertia::render('admins/users/index', [

            'users' => UserResource::collection($users),
            'filters' => $request->only(['role', 'status', 'deleted_status', 'search', 'sort_by', 'sort_order']),
            'highlight' => $request->query('highlight'),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create()
    {
        return Inertia::render('admins/users/create', [
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $validated = $request->validated();

            if ($validated['password'] != $request['password_confirmation']) {
                return redirect()->back()->with('error', 'Passwords do not match.');
            }

            $validated['password'] = bcrypt($validated['password']);

            User::create($validated);

            return redirect()->route('users.index')->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create user.');
        }
    }

    public function show(User $user)
    {
        //
    }

    public function edit(User $user)
    {
        return Inertia::render('admins/users/edit', [
            'user' => new UserResource($user),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $validated = $request->validated();

            $user->update($validated);

            return redirect()->route('users.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to update user.');
        }
    }

    public function destroy(User $user)
    {
        try {
            $user->delete();

            return redirect()->back()->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete user.');
        }
    }

    // New methods for restore and bulk operations
    public function restore($id)
    {
        try {
            $user = User::withTrashed()->findOrFail($id);
            $user->restore();

            return redirect()->back()->with('success', 'User restored successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore user.');
        }
    }

    public function bulkDelete(Request $request)
    {
        try {
            $ids = $request->input('ids', []);
            User::whereIn('id', $ids)->delete();

            return redirect()->back()->with('success', count($ids) . ' users deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete users.');
        }
    }

    public function bulkRestore(Request $request)
    {
        try {
            $ids = $request->input('ids', []);
            User::withTrashed()->whereIn('id', $ids)->restore();

            return redirect()->back()->with('success', count($ids) . ' users restored successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore users.');
        }
    }
}
