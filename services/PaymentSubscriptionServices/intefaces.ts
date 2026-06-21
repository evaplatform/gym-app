export interface ISetupIntentRequest {
  email: string;
}

export interface ISetupIntentResponse {
  clientSecret: string;
  customerId: string;
  message: string;
}

export interface ICreateSubscriptionRequest {
  customerId: string;
  paymentMethodId: string;
  priceId: string;
}

export interface ICreateSubscriptionResponse {
  subscriptionId: string;
  status: string;
  message: string;
}

export interface ISubscriptionByUserResponse {
  subscriptions: ISubscriptionByUserData[];
}

export interface ISubscriptionByUserData {
  id: string;
  object: string;
  application: null;
  application_fee_percent: null;

  automatic_tax: {
    disabled_reason: string | null;
    enabled: boolean;
    liability: string | null;
  };

  billing_cycle_anchor: number;
  billing_cycle_anchor_config: null;

  billing_mode: {
    flexible: {
      proration_discounts: string;
    };
    type: string;
    updated_at: number;
  };

  billing_schedules: unknown[];
  billing_thresholds: null;

  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;

  cancellation_details: {
    comment: string | null;
    feedback: string | null;
    reason: string | null;
  };

  collection_method: string;
  created: number;
  currency: string;
  customer: string;
  customer_account: null;
  days_until_due: number | null;

  default_payment_method: {
    id: string;
    object: string;
    allow_redisplay: string;

    billing_details: {
      address: {
        city: string | null;
        country: string | null;
        line1: string | null;
        line2: string | null;
        postal_code: string | null;
        state: string | null;
      };
      email: string | null;
      name: string | null;
      phone: string | null;
      tax_id: string | null;
    };

    card: {
      brand: string;

      checks: {
        address_line1_check: string | null;
        address_postal_code_check: string | null;
        cvc_check: string | null;
      };

      country: string;
      display_brand: string;
      exp_month: number;
      exp_year: number;
      fingerprint: string;
      funding: string;
      generated_from: null;
      last4: string;

      networks: {
        available: string[];
        preferred: string | null;
      };

      regulated_status: string;

      three_d_secure_usage: {
        supported: boolean;
      };

      wallet: null;
    };

    created: number;
    customer: string;
    customer_account: null;
    livemode: boolean;
    metadata: Record<string, unknown>;
    shared_payment_granted_token: null;
    type: string;
  };

  default_source: null;
  default_tax_rates: unknown[];
  description: string | null;
  discounts: unknown[];
  ended_at: number | null;

  invoice_settings: {
    account_tax_ids: null;
    issuer: {
      type: string;
    };
  };

  items: {
    object: string;

    data: Array<{
      id: string;
      object: string;
      billing_thresholds: null;
      created: number;
      current_period_end: number;
      current_period_start: number;
      discounts: unknown[];
      metadata: Record<string, unknown>;

      plan: {
        id: string;
        object: string;
        active: boolean;
        amount: number;
        amount_decimal: string;
        billing_scheme: string;
        created: number;
        currency: string;
        interval: string;
        interval_count: number;
        livemode: boolean;
        metadata: Record<string, unknown>;
        meter: null;
        nickname: string | null;
        product: string;
        tiers_mode: string | null;
        transform_usage: null;
        trial_period_days: number | null;
        usage_type: string;
      };

      price: {
        id: string;
        object: string;
        active: boolean;
        billing_scheme: string;
        created: number;
        currency: string;
        custom_unit_amount: null;
        livemode: boolean;
        lookup_key: string | null;
        metadata: Record<string, unknown>;
        nickname: string | null;
        product: string;

        recurring: {
          interval: string;
          interval_count: number;
          meter: null;
          trial_period_days: number | null;
          usage_type: string;
        };

        tax_behavior: string;
        tiers_mode: string | null;
        transform_quantity: null;
        type: string;
        unit_amount: number;
        unit_amount_decimal: string;
      };

      quantity: number;
      subscription: string;
      tax_rates: unknown[];
    }>;

    has_more: boolean;
    total_count: number;
    url: string;
  };

  latest_invoice: string;
  livemode: boolean;

  managed_payments: {
    enabled: boolean;
  };

  metadata: Record<string, unknown>;

  next_pending_invoice_item_invoice: null;
  on_behalf_of: null;
  pause_collection: null;

  payment_settings: {
    payment_method_options: null;
    payment_method_types: string[] | null;
    save_default_payment_method: string;
  };

  pending_invoice_item_interval: null;
  pending_setup_intent: null;
  pending_update: null;

  plan: {
    id: string;
    object: string;
    active: boolean;
    amount: number;
    amount_decimal: string;
    billing_scheme: string;
    created: number;
    currency: string;
    interval: string;
    interval_count: number;
    livemode: boolean;
    metadata: Record<string, unknown>;
    meter: null;
    nickname: string | null;
    product: string;
    tiers_mode: string | null;
    transform_usage: null;
    trial_period_days: number | null;
    usage_type: string;
  };

  quantity: number;
  schedule: null;
  start_date: number;
  status: string;
  test_clock: null;
  transfer_data: null;

  trial_end: number | null;

  trial_settings: {
    end_behavior: {
      missing_payment_method: string;
    };
  };

  trial_start: number | null;
}

export interface IUpdatePaymentMethodRequest {
  subscriptionId: string;
  paymentMethodId: string;
}

export interface IRetryPaymentRequest {
  subscriptionId: string;
}

export interface IReactivateSubscriptionRequest {
  customerId: string;
  priceId: string;
  paymentMethodId?: string;
}
