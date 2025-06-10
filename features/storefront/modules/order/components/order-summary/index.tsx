import { formatAmount } from "@/features/storefront/lib/util/prices" 
import { StoreOrder } from "@/features/storefront/types/graphql-types"

type OrderSummaryProps = {
  order: StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (amount === undefined || amount === null) { // Check for undefined or null
      return null // Return null or a placeholder like "-"
    }

    // Use formatAmount with updated currency code access
    return formatAmount({
      amount,
      region: order.region, // Add region
      currencyCode: order.currency_code, // Use correct property name
    });
  }

  return (
    <div>
      <h2 className="text-sm leading-6 font-semibold">Order Summary</h2>
      <div className="text-xs leading-5 font-normal text-foreground my-2">
        <div className="flex items-center justify-between text-sm leading-6 font-normal text-foreground mb-2">
          <span>Subtotal</span>
          {/* Assuming subtotal is still direct */}
          <span>{order.subtotal}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {/* Assuming discount is still direct */}
          {order.discount > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {order.discount}</span>
            </div>
          )}
          {/* Assuming giftCard is still direct */}
          {order.giftCard && (
            <div className="flex items-center justify-between">
              {/* Label might need adjustment depending on how gift cards are handled */}
              <span>Gift Card</span>
              <span>- {order.giftCard}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            {/* Assuming shipping is still direct */}
              <span>{order.shipping}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Taxes</span>
            {/* Assuming tax is still direct */}
              <span>{order.tax}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-dashed my-4" />
        <div className="flex items-center justify-between text-sm leading-6 font-normal text-foreground mb-2">
          <span>Total</span>
          {/* Assuming total is still direct */}
          <span>{order.total}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
