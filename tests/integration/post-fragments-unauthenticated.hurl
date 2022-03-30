# tests/integration/post-fragments-unauthenticated.hurl

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password2
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3J12345
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 401
HTTP/1.1 401
# We have various assertions about the response that we want to check 
[Asserts]

jsonpath "$.message" == "Unauthorized"


