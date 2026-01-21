#!/bin/bash

# EduTap Backend API Quick Test Script
# Make sure server is running: npm run dev

BASE_URL="http://localhost:5001/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧪 Testing EduTap Backend API${NC}"
echo "================================"

# Check if jq is installed
HAS_JQ=false
if command -v jq &> /dev/null; then
    HAS_JQ=true
else
    echo -e "${YELLOW}⚠️  jq not found. Install it for better output: brew install jq${NC}"
fi

# 1. Health Check
echo -e "\n${GREEN}1. Health Check:${NC}"
HEALTH=$(curl -s http://localhost:5001/health)
if [ $? -eq 0 ]; then
    if [ "$HAS_JQ" = true ]; then
        echo "$HEALTH" | jq '.'
    else
        echo "$HEALTH"
    fi
else
    echo -e "${RED}❌ Server not running! Start with: npm run dev${NC}"
    exit 1
fi

# 2. Login (using seeded admin)
echo -e "\n${GREEN}2. Login (Admin):${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.edu",
    "password": "admin123"
  }')

if command -v jq &> /dev/null; then
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token // empty')
    SUCCESS=$(echo $LOGIN_RESPONSE | jq -r '.success // false')
else
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    SUCCESS=$(echo $LOGIN_RESPONSE | grep -o '"success":true' | wc -l)
fi

if [ -z "$TOKEN" ] || [ "$SUCCESS" != "true" ]; then
    echo -e "${RED}❌ Login failed${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"
echo "Token: ${TOKEN:0:50}..."

# 3. Get Schools
echo -e "\n${GREEN}3. Get Schools:${NC}"
SCHOOLS=$(curl -s -X GET $BASE_URL/schools \
  -H "Authorization: Bearer $TOKEN")
if [ "$HAS_JQ" = true ]; then
    COUNT=$(echo "$SCHOOLS" | jq -r '.count // (.data | length) // 0')
    echo "Found $COUNT schools"
else
    COUNT=$(echo "$SCHOOLS" | grep -o '"count":[0-9]*' | cut -d':' -f2 || echo "0")
    echo "Found $COUNT schools"
fi

# 4. Get Students
echo -e "\n${GREEN}4. Get Students:${NC}"
STUDENTS=$(curl -s -X GET $BASE_URL/students \
  -H "Authorization: Bearer $TOKEN")
if command -v jq &> /dev/null; then
    COUNT=$(echo "$STUDENTS" | jq -r '.count // .data | length')
else
    COUNT=$(echo "$STUDENTS" | grep -o '"count":[0-9]*' | cut -d':' -f2)
fi
echo "Found $COUNT students"

# 5. Get Admin Transactions
echo -e "\n${GREEN}5. Get Admin Transactions:${NC}"
TRANSACTIONS=$(curl -s -X GET "$BASE_URL/admin/transactions?limit=5" \
  -H "Authorization: Bearer $TOKEN")
if command -v jq &> /dev/null; then
    COUNT=$(echo "$TRANSACTIONS" | jq -r '.data.pagination.total // .data.transactions | length // 0')
else
    COUNT=0
fi
echo "Found $COUNT transactions"

echo -e "\n${GREEN}✅ Basic API tests completed!${NC}"
echo -e "\n${YELLOW}💡 Next steps:${NC}"
echo "  - Test student registration: POST $BASE_URL/students/register"
echo "  - Test card tap: POST $BASE_URL/card/tap"
echo "  - Test manual top-up: POST $BASE_URL/topup/manual"
echo "  - See TESTING_GUIDE.md for detailed examples"




