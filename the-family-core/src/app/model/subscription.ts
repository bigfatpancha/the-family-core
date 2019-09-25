export class Subscription {
    id: number;
    created: Date;
    modified: Date;
    plan: string;
    quantity: number;
    start: Date;
    status: string;
    cancel_at_period_end: boolean;
    canceled_at: Date;
    current_period_end: Date;
    current_period_start: Date;
    ended_at: Date;
    trial_end: Date;
    trial_start: Date;
    amount: number;
    customer: number;
}

export class SubscriptionRequest {
    stripe_token: string;
    plan: string;
    charge_immediately?: boolean;
    constructor(
        stripe_token: string,
        plan: string
    ) {
        this.stripe_token = stripe_token;
        this.plan = plan;
    }
}