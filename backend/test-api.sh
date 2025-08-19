#!/bin/bash

# Test the authentication endpoints

echo "🧪 Testing Campus Resale API with PostgreSQL"
echo "============================================"

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:3001/api/health | jq '.'
echo ""

# Test login with existing user
echo "2. Testing login with test user..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.edu",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
echo ""

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "3. Testing protected route with token..."
  curl -s -X GET http://localhost:3001/api/users/profile \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""
else
  echo "❌ Login failed - no token received"
fi

# Test registration
echo "4. Testing user registration..."
curl -s -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@university.edu",
    "password": "newpassword123",
    "name": "New Student"
  }' | jq '.'

echo ""
echo "✅ API testing complete!"
