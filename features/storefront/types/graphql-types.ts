/**
 * Custom types generated based on the GraphQL API schema.
 * These replace the MedusaJS types from '@medusajs/types'.
 */

export interface StorePrice {
  amount: number
  currency_code: string
  calculated_amount?: number
  original_amount?: number
}

export interface StoreProductVariant {
  id: string
  title: string
  sku?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  prices: StorePrice[]
  product?: StoreProduct
}

export interface StoreProduct {
  id: string
  title: string
  handle: string
  thumbnail?: string
  description?: string
  product_variants: StoreProductVariant[]
  status?: string
  metadata?: Record<string, any>
}

export interface StoreCollection {
  id: string
  title: string
  handle: string
  products?: StoreProduct[]
}

export interface StoreRegion {
  id: string
  name: string
  currency_code: string
  countries: {
    id: string
    name: string
    iso2: string
  }[]
}

export interface Address {
  id: string
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  addresses?: Address[]
  billing_address?: Address
}

export interface CartLineItem {
  id: string
  quantity: number
  product_title?: string
  product_handle?: string
  thumbnail?: string
  variant?: StoreProductVariant & {
    manage_inventory?: boolean
    product?: StoreProduct & {
      images?: { url: string }[]
    }
  }
}

export interface StoreCart {
  id: string
  email?: string
  region: StoreRegion
  line_items: CartLineItem[]
  shipping_address?: Address
  billing_address?: Address
  discounts?: any[]
  gift_cards?: any[]
  payment_sessions?: any[]
  completed_at?: string
  created_at?: string
  updated_at?: string
  status?: string
}

export interface Order {
  id: string
  status: string
  email: string
  region: StoreRegion
  shipping_address: Address
  billing_address: Address
  line_items: CartLineItem[]
  total: number
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface StoreOrder {
  id: string
  display_id?: number
  status: string
  email: string
  region: StoreRegion
  shipping_address: Address
  billing_address: Address
  line_items: CartLineItem[]
  total: number
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  fulfillment_status?: string
  payment_status?: string
}