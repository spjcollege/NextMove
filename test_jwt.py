import urllib.request, json
from jose import jwt
SECRET_KEY = 'nextmove-secret-key-change-in-production-2026'
ALGORITHM = 'HS256'

req = urllib.request.Request('http://127.0.0.1:8000/auth/login', method='POST', headers={'Content-Type': 'application/json'}, data=b'{"username":"admin","password":"admin123"}')
res = json.loads(urllib.request.urlopen(req).read())
token = res['token']
print("TOKEN:", token)

try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    print("PAYLOAD:", payload)
except Exception as e:
    print("DECODE ERROR:", type(e), e)
