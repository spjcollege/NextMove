import razorpay
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os

router = APIRouter(prefix="/payment", tags=["Payment"])

# Placeholders. Recommend storing inside .env file in production.
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_SVtgVzzzyc8S1v")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "tKU3kQTD6KyWor7h0uePOU1m")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class OrderCreateRequest(BaseModel):
    amount: int  # INR
    currency: str = "INR"

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
def create_order(data: OrderCreateRequest):
    try:
        # Amount in paise (multiply by 100)
        razorpay_order = client.order.create(dict(
            amount=data.amount * 100,
            currency=data.currency,
            payment_capture="1" # 1 captures payment automatically
        ))
        return {"order_id": razorpay_order["id"], "amount": razorpay_order["amount"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify")
def verify_payment(data: PaymentVerifyRequest):
    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': data.razorpay_order_id,
            'razorpay_payment_id': data.razorpay_payment_id,
            'razorpay_signature': data.razorpay_signature
        })
        return {"status": "success", "message": "Payment securely verified and captured"}
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Signature Verification Failed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
