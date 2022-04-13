# POST a new text fragment to http://localhost:8080 as an authorized user. The fragment's body should be the string, Hello S3!.
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
{ "service": "DynamoDB" }


# Confirm that the server returns a 201, and capture the Location header value to a variable named url
HTTP/1.1 201
[Captures]
fragment1_url: header "Location"
fragment1_id: header "Location" regex "([A-Za-z0-9_-]{21})"

# GET the fragment you just created using the url as an authorized user.
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Confirm that the server returns a 200, that the type of the fragment is text/plain
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" isString
jsonpath "$.status" == "ok"
jsonpath "$.status" isString
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 25


# POST a new text fragment to http://localhost:8080 as an authorized user. The fragment's body should be the string, Hello S3!.
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown
"DynamoDB is **great**."

# Confirm that the server returns a 201, and capture the Location header value to a variable named url
HTTP/1.1 201
[Captures]
fragment2_url: header "Location"
fragment2_id: header "Location" regex "([A-Za-z0-9_-]{21})"


# GET the fragment you just created using the url as an authorized user.
GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Confirm that the server returns a 200, that the type of the fragment is text/markdown,
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" isString
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 24

# GET the fragments created using the url as an authorized user.
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Confirm that the server returns a 200, that the type of the fragment is text/plain, and that the body is equal to Hello S3!
HTTP/1.1 200
[Asserts]
jsonpath "$.status" isString
jsonpath "$.status" == "ok"
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# DELETE the fragment using the url as an authorized user.
DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Confirm that the server returns a 200.
HTTP/1.1 200

# GET the fragments created using the url as an authorized user.
GET {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404

# GET the fragments created using the url as an authorized user.
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Confirm that the server returns a 200, that the type of the fragment is text/plain, and that the body is equal to Hello S3!
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" isString
jsonpath "$.status" == "ok"
jsonpath "$.fragments" includes {{fragment2_id}}
jsonpath "$.fragments" not includes {{fragment1_id}}
