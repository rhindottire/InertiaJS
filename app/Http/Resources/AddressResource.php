<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'contact_id' => $this->contact_id,
            'post_code' => $this->post_code,
            'country' => $this->country,
            'province' => $this->province,
            'city' => $this->city,
            'street' => $this->street,
            'more' => $this->more,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Include contact and user information for cross-reference
            'contact' => $this->whenLoaded('contact', function() {
                return [
                    'id' => $this->contact->id,
                    'name' => $this->contact->name,
                    'user_id' => $this->contact->user_id,
                    'user' => $this->contact->user ? [
                        'id' => $this->contact->user->id,
                        'username' => $this->contact->user->username,
                        'email' => $this->contact->user->email,
                    ] : null,
                ];
            }),
        ];
    }
}