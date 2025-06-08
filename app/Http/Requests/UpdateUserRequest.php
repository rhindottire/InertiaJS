<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        $userId = $this->route('user');
        return [
            'google_id' => [
                'nullable',
                'string',
                Rule::unique('users', 'google_id')->ignore($userId),
            ],
            'username' => [
                'nullable',
                'string',
                // 'min:10',
                'max:25',
                // 'regex:/^[a-zA-Z0-9_]+$/',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'email' => [
                'nullable',
                'email',
                // 'min:16',
                'max:40',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => [
                'nullable',
                'string',
                // 'min:8',
                'max:64',
                // 'confirmed',
                // 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/' . $this->user->id,
                'confirmed',
            ],
            'role'   => ['nullable', 'in:ADMIN,CLIENT,COURIER'],
            'status' => ['nullable', 'in:active,inactive'],
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048',
            ],
        ];
    }

    public function messages(): array {
        return [
            'google_id.string' => 'The Google ID must be a valid string.',
            'google_id.unique' => 'This Google ID is already associated with another user.',

            'username.string' => 'The username must be a valid string.',
            'username.min' => 'The username must be at least 10 characters long.',
            'username.max' => 'The username may not be greater than 25 characters.',
            // 'username.regex' => 'The username may only contain letters, numbers, and underscores.',
            'username.unique' => 'This username is already taken.',

            'email.email' => 'Please provide a valid email address.',
            // 'email.min' => 'The email must be at least 16 characters long.',
            // 'email.max' => 'The email may not exceed 40 characters.',
            'email.unique' => 'This email address is already in use.',

            'password.string' => 'The password must be a valid string.',
            'password.min' => 'The password must be at least 8 characters long.',
            'password.max' => 'The password may not exceed 64 characters.',
            // 'password.confirmed' => 'The password confirmation does not match.',
            // 'password.regex' => 'The password must include at least one uppercase letter, one lowercase letter, and one number.',

            'role.in' => 'The selected role is invalid. Valid options are ADMIN, CLIENT, COURIER.',

            'status.in' => 'The selected status is invalid. Valid options are active or inactive.',

            'avatar.image' => 'The avatar must be an image.',
            'avatar.mimes' => 'The avatar must be a file of type: jpg, jpeg, png.',
            'avatar.max' => 'The avatar must not be larger than 2MB.',

        ];
    }
}