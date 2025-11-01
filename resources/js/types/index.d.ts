export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface PaymentAccount {
    id: number;
    owner_id: number;
    handle: string;
    type: 'venmo' | 'zelle' | 'paypal' | 'cash_app';
    name?: string;
    description?: string;
    status: 'active' | 'inactive' | 'suspended';
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    owner?: User;
}

export interface PaymentRequest {
    id: number;
    uuid: string;
    owner_id: number;
    title?: string;
    description?: string;
    currency: string;
    amount: number;
    token: string;
    status: 'pending' | 'paid' | 'cancelled';
    expires_at?: string;
    paid_at?: string;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    owner?: User;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
