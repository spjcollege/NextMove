import urllib.request, json
try:
    req = urllib.request.Request('http://127.0.0.1:8000/auth/login', method='POST', headers={'Content-Type': 'application/json'}, data=b'{"username":"admin","password":"admin123"}')
    res = json.loads(urllib.request.urlopen(req).read())
    token = res['token']
    
    req2 = urllib.request.Request('http://127.0.0.1:8000/wishlist/', method='GET', headers={'Authorization': 'Bearer ' + token})
    print("GET /wishlist/:", urllib.request.urlopen(req2).read().decode())
    
    req3 = urllib.request.Request('http://127.0.0.1:8000/wishlist/1', method='POST', headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
    print("POST /wishlist/1:", urllib.request.urlopen(req3).read().decode())
except Exception as e:
    print('ERROR:', e)
    if hasattr(e, 'read'): print(e.read().decode())
