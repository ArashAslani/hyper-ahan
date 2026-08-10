import { apiFetch } from "@/lib/api-client";
import type { ActivePrice, FinalPrice } from "@/types/catalog";

type FinalPriceDto = {
  isSellable: boolean;
  salesStatus: string | number;
  resolvedBasePrice?: number | null;
  payableQuantity?: number | null;
  subtotal?: number | null;
  vatApplied: boolean;
  vatAmount?: number | null;
  finalPrice?: number | null;
  appliedTierId?: string | null;
  priceId?: string | null;
};

type ActivePriceDto = {
  isSellable: boolean;
  salesStatus: string | number;
  price?: {
    id: string;
    amount?: number;
    basePrice?: number;
    currency?: string;
  } | null;
};

type ValidatePriceDto = {
  isSellable: boolean;
  salesStatus: string | number;
  priceId?: string | null;
};

function toFinalPrice(dto: FinalPriceDto): FinalPrice {
  return {
    isSellable: dto.isSellable,
    salesStatus: dto.salesStatus,
    resolvedBasePrice: dto.resolvedBasePrice ?? null,
    payableQuantity: dto.payableQuantity ?? null,
    subtotal: dto.subtotal ?? null,
    vatApplied: dto.vatApplied,
    vatAmount: dto.vatAmount ?? null,
    finalPrice: dto.finalPrice ?? null,
    appliedTierId: dto.appliedTierId ?? null,
    priceId: dto.priceId ?? null,
  };
}

function toActivePrice(dto: ActivePriceDto): ActivePrice {
  const amount = dto.price?.amount ?? dto.price?.basePrice;
  return {
    isSellable: dto.isSellable,
    salesStatus: dto.salesStatus,
    price: dto.price
      ? {
          id: dto.price.id,
          amount,
          currency: dto.price.currency,
        }
      : null,
  };
}

export type CalculatePriceRequest = {
  productId: string;
  orderUnitId: string;
  quantity: number;
};

export const pricingService = {
  async getActive(productId: string): Promise<ActivePrice> {
    const dto = await apiFetch<ActivePriceDto>(
      `/api/pricing/products/${encodeURIComponent(productId)}/active`,
      { cache: "no-store" },
    );
    return toActivePrice(dto);
  },

  async validate(productId: string): Promise<ValidatePriceDto> {
    return apiFetch<ValidatePriceDto>(
      `/api/pricing/products/${encodeURIComponent(productId)}/validate`,
      { cache: "no-store" },
    );
  },

  async calculate(
    body: CalculatePriceRequest,
    init?: { signal?: AbortSignal },
  ): Promise<FinalPrice> {
    const dto = await apiFetch<FinalPriceDto>("/api/pricing/calculate", {
      method: "POST",
      body: JSON.stringify(body),
      cache: "no-store",
      signal: init?.signal,
    });
    return toFinalPrice(dto);
  },
};
