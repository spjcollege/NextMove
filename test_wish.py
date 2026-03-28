
import urllib.request, json
req = urllib.request.Request('http://127.0.0.1:8000/auth/login', method='POST', headers={'Content-Type': 'application/json'}, data=b'{"username":"admin","password":"admin123"}')
try:
    res = json.loads(urllib.request.urlopen(req).read())
    token = res['token']
    req2 = urllib.request.Request('http://127.0.0.1:8000/wishlist/1', method='POST', headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token})
    print(urllib.request.urlopen(req2).read().decode())
except Exception as e:
    print('ERROR:', e)
    if hasattr(e, 'read'): print(e.read().decode())

