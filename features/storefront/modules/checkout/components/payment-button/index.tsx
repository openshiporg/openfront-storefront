"use client"

import { isManual, isStripe, isPaypal } from "@/features/storefront/lib/constants"
import { placeOrder } from "@/features/storefront/lib/data/cart"
import { Button } from "@/components/ui/button" // Shadcn Button
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { RiLoader2Fill } from "@remixicon/react"

type PaymentButtonProps = {
  cart: any
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shippingAddress ||
    !cart.billingAddress ||
    !cart.email ||
    (cart.shippingMethods?.length ?? 0) < 1

  const paymentSession = cart.paymentCollection?.paymentSessions?.find(
    (s: any) => s.isSelected
  )

  switch (true) {
    // Check using paymentProvider.code
    case isStripe(paymentSession?.paymentProvider?.code):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    // Check using paymentProvider.code
    case isPaypal(paymentSession?.paymentProvider?.code):
      return (
        <PayPalPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    // Check using paymentProvider.code
    case isManual(paymentSession?.paymentProvider?.code):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled size="lg">Select a payment method</Button> // Use Shadcn Button, add size
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: any
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.paymentCollection?.paymentSessions?.find(
    (s: any) => s.isSelected && s.paymentProvider?.code === 'pp_stripe_stripe' // Ensure it's the selected Stripe session
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart || !session) { // Added session check
      setSubmitting(false)
      console.log({ stripe, elements, card, cart, session })
      setErrorMessage("Stripe not initialized or card element not found.")
      return
    }

    await stripe
      .confirmCardPayment(session?.data?.clientSecret as string, { // Accessing client_secret from JSON data
        payment_method: {
          card: card,
          billing_details: {
            name:
              `${cart.billingAddress?.firstName || ''} ${cart.billingAddress?.lastName || ''}`.trim(),
            address: {
              city: cart.billingAddress?.city ?? undefined,
              country: cart.billingAddress?.countryCode ?? undefined, // Use countryCode
              line1: cart.billingAddress?.address1 ?? undefined,
              line2: cart.billingAddress?.address2 ?? undefined,
              postal_code: cart.billingAddress?.postalCode ?? undefined,
              state: cart.billingAddress?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billingAddress?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent
          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            return onPaymentCompleted()
          }
          setErrorMessage(error.message || null)
          return
        }

        if (!paymentIntent) {
          setErrorMessage("Payment intent not found.")
          return
        }

        switch (paymentIntent.status) {
          case "succeeded":
          case "requires_capture":
            onPaymentCompleted()
            break
          case "requires_action":
            // Handle actions like 3D Secure
            stripe.handleNextAction({ clientSecret: paymentIntent.client_secret as string })
              .then(result => {
                if (result.error) {
                  setErrorMessage(result.error.message || "An error occurred during payment authentication.")
                } else if (result.paymentIntent?.status === "succeeded") {
                  onPaymentCompleted()
                }
              });
            break
          default:
            setErrorMessage(`Unhandled payment intent status: ${paymentIntent.status}`)
            break
        }
      })
      .catch((error) => {
        setErrorMessage(error.message || "An unknown Stripe error occurred.")
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady || submitting} // Disable if submitting
        onClick={handlePayment}
        size="lg" // Map size
        data-testid={dataTestId}
      >
        {submitting && <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />}
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady, "data-testid": dataTestId }: { notReady: boolean, "data-testid"?: string }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady || submitting} // Disable if submitting
        onClick={handlePayment}
        size="lg" // Map size
        data-testid={dataTestId || "submit-order-button"} // Use passed testid or default
      >
        {submitting && <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />} 
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const PayPalPaymentButton = ({
  notReady,
  cart,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  cart: any
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const session = cart.paymentCollection?.paymentSessions?.find(
    (s: any) => s.isSelected
  )

  const handlePayment = async (
    _data: any,
    actions: any
  ) => {
    actions?.order
      ?.authorize()
      .then((authorization: any) => {
        if (authorization.status !== "COMPLETED") {
          setErrorMessage(`An error occurred, status: ${authorization.status}`)
          return
        }
        onPaymentCompleted()
      })
      .catch(() => {
        setErrorMessage(`An unknown error occurred, please try again.`)
        setSubmitting(false)
      })
  }

  const [{ isPending, isResolved }] = usePayPalScriptReducer()

  if (isPending) {
    return <RiLoader2Fill className="animate-spin"/>
  }

  if (isResolved) {
    return (
      <>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={async () => session.data.orderId}
          onApprove={handlePayment}
          disabled={notReady || submitting || isPending}
          data-testid={dataTestId || "paypal-payment-button"}
        />
        <ErrorMessage error={errorMessage} data-testid="paypal-payment-error-message" />
      </>
    )
  }

  return null
}

export default PaymentButton
