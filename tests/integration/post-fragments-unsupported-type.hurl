# tests/integration/post-fragments-unsupported-type.hurl

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending an image fragment
Content-Type: image/png
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# 1. We expect to get back an HTTP 201
HTTP/1.1 415
# We have various assertions about the response that we want to check 
[Asserts]
jsonpath "$.status" == "error"

# Ensure message returned is correct
jsonpath "$.error.message" isString
jsonpath "$.error.message" == "Body requires correct data that is supported."

# Ensure the code is correct in error
jsonpath "$.error.code" == 415

