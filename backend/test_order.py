import requests

BASE_URL = "http://127.0.0.1:8000"

def test_place_order():
    # Attempt to place order without login
    payload = {
        "items": [{"product_id": 1, "quantity": 1}],
        "address": "123 Test St",
        "payment_method": "cod",
        "points_to_use": 0
    }
    
    print("Testing order placement...")
    try:
        # We need a token. Let's assume there's a test user.
        # But first let's see why it might fail even for a logged in user.
        # If I can't login, I can at least see the 401.
        response = requests.post(f"{BASE_URL}/orders/place", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_place_order()
