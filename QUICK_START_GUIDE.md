# Quick Start Guide - Finance Backend

## 🚀 Setup & Run

### Prerequisites
- Node.js 16+
- MongoDB (running locally or in cloud)
- Postman or curl (for testing)

### Installation

```bash
cd be
npm install
```

### Configure Environment

Create `.env` file in `be/` directory:

```env
MONGO_URI=mongodb://localhost:27017/finance-db
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRY=15m
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@finance-app.com
```

### Run Development Server

```bash
npm run start:dev
```

Server will start on: `http://localhost:3001`  
GraphQL Playground: `http://localhost:3001/graphql`

---

## 📖 Testing with GraphQL Playground

1. Open `http://localhost:3001/graphql` in browser
2. Copy-paste the mutations/queries below
3. Click the Play button to execute

### Important: Using Bearer Token

After signup/login, you'll get a token. In GraphQL Playground:
- Click the "HTTP HEADERS" tab at bottom
- Add header:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

---

## 🔑 Authentication Workflow

### Step 1: Signup
```graphql
mutation {
  signup(signupInput: {
    email: "testuser@example.com"
    password: "SecurePass123!"
  }) {
    token
    user {
      id
      email
      role
      isVerified
    }
  }
}
```

✅ Returns: Token for authentication

### Step 2: Check Email for OTP
Look for OTP in your email inbox (or SMTP logs in development)

### Step 3: Verify OTP
```graphql
mutation {
  verifyOtp(verifyOtpInput: {
    email: "testuser@example.com"
    otp: "123456"  # Use the OTP from email
  }) {
    success
    message
  }
}
```

✅ Response: `success: true` if OTP is correct

### Step 4: Login
```graphql
mutation {
  login(loginInput: {
    email: "testuser@example.com"
    password: "SecurePass123!"
  }) {
    token
    user {
      id
      email
      role
      isVerified
    }
  }
}
```

✅ Copy the token for next requests

**Add to Headers:**
```json
{
  "Authorization": "Bearer TOKEN_FROM_LOGIN"
}
```

---

## 💰 Finance Operations (All Need Authentication!)

### Create Income Record
```graphql
mutation {
  createFinance(input: {
    amount: 50000
    type: INCOME
    category: SALARY
    date: "2026-03-15"
    description: "Monthly salary payment"
  }) {
    _id
    amount
    type
    category
    date
    description
    createdAt
  }
}
```

✅ Must have ANALYST or ADMIN role

### Create Expense Record
```graphql
mutation {
  createFinance(input: {
    amount: 1500
    type: EXPENSE
    category: FOOD
    date: "2026-03-18"
    description: "Grocery shopping"
  }) {
    _id
    amount
    type
    category
    date
    description
  }
}
```

### List Records with Pagination
```graphql
query {
  listFinances(
    pagination: { skip: 0, take: 10 }
  ) {
    items {
      _id
      amount
      type
      category
      date
      description
    }
    total
  }
}
```

✅ Returns: Array of your records + total count

### List with Filters
```graphql
query {
  listFinances(
    filter: {
      type: EXPENSE
      category: FOOD
      dateFrom: "2026-03-01"
      dateTo: "2026-03-31"
    }
    pagination: { skip: 0, take: 10 }
  ) {
    items {
      _id
      amount
      type
      category
      date
    }
    total
  }
}
```

✅ Filters by type, category, and date range

### Get Single Record
```graphql
query {
  getFinance(id: "RECORD_ID") {
    _id
    amount
    type
    category
    date
    description
    createdAt
  }
}
```

Replace `RECORD_ID` with actual ID from list query

### Update Record
```graphql
mutation {
  updateFinance(
    id: "RECORD_ID"
    input: {
      amount: 1800
      description: "Updated grocery expense"
    }
  ) {
    _id
    amount
    description
    updatedAt
  }
}
```

### Delete Record
```graphql
mutation {
  deleteFinance(id: "RECORD_ID")
}
```

✅ Returns: `true` if deleted successfully

---

## 📊 Dashboard Analytics (View-Only)

### Get Complete Dashboard Summary
```graphql
query {
  getDashboardSummary(
    startDate: "2026-03-01"
    endDate: "2026-03-31"
  ) {
    totalIncome
    totalExpense
    netBalance
    categoryWiseTotals {
      category
      total
      count
    }
    recentActivity {
      _id
      amount
      type
      category
      date
      description
    }
    periodStart
    periodEnd
  }
}
```

✅ Returns: All financial metrics for the period

### Get Total Income
```graphql
query {
  getTotalIncome(
    startDate: "2026-03-01"
    endDate: "2026-03-31"
  )
}
```

### Get Total Expense
```graphql
query {
  getTotalExpense(
    startDate: "2026-03-01"
    endDate: "2026-03-31"
  )
}
```

### Get Net Balance
```graphql
query {
  getNetBalance(
    startDate: "2026-03-01"
    endDate: "2026-03-31"
  )
}
```

### Get Category Breakdown
```graphql
query {
  getCategoryWiseTotals(
    startDate: "2026-03-01"
    endDate: "2026-03-31"
  ) {
    category
    total
    count
  }
}
```

### Get Recent Activity
```graphql
query {
  getRecentActivity(limit: 10) {
    _id
    amount
    type
    category
    date
    description
    createdAt
  }
}
```

---

## 🧪 Testing Permissions

### Test 1: VIEWER Access (Read-Only)
1. Create user as ADMIN (manually set role in MongoDB)
2. Login as VIEWER user
3. Try to create record:
   ```graphql
   mutation {
     createFinance(input: {
       amount: 1000
       type: EXPENSE
       category: FOOD
       date: "2026-03-20"
     }) {
       _id
     }
   }
   ```
   ❌ Should fail with: "Forbidden resource"

4. Try to view dashboard:
   ```graphql
   query {
     getDashboardSummary {
       totalIncome
       totalExpense
     }
   }
   ```
   ✅ Should succeed (VIEWER can view)

### Test 2: ANALYST Access (Create Own)
1. Login as ANALYST user
2. Create record (should succeed)
3. Try admin-only features (should fail)

### Test 3: ADMIN Access (Full)
1. Login as ADMIN user
2. All operations should succeed

---

## 🐛 Common Issues & Solutions

### Issue: "User not found or unauthorized"
**Solution:** 
- Ensure OTP is verified before login
- Check that Bearer token is in headers
- Token may have expired (15 min), login again

### Issue: "Cannot determine a GraphQL output type"
**Solution:** 
- Schema generation failed, run: `npm run build`
- Restart server: `npm run start:dev`

### Issue: "MongooseServerSelectionError"
**Solution:**
- Verify MongoDB is running
- Check MONGO_URI in .env is correct
- For MongoDB Atlas: whitelist your IP

### Issue: "Invalid OTP"
**Solution:**
- Check timestamp - OTP expires after 10 minutes
- Look for OTP in email or console logs
- Resend OTP and use the new one:
  ```graphql
  mutation {
    resendOtp(resendOtpInput: {
      email: "your-email@example.com"
    })
  }
  ```

---

## 📱 API Testing with curl (Alternative)

### Login & Get Token
```bash
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(loginInput: { email: \"test@example.com\", password: \"SecurePass123!\" }) { token } }"
  }' | jq '.data.login.token'
```

### Create Finance Record
```bash
TOKEN="your-token-here"
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation { createFinance(input: { amount: 5000, type: INCOME, category: SALARY, date: \"2026-03-15\", description: \"Salary\" }) { _id amount type } }"
  }'
```

### List Records
```bash
TOKEN="your-token-here"
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "{ listFinances(pagination: { skip: 0, take: 10 }) { items { _id amount type category date } total } }"
  }' | jq
```

---

## 📚 Available Categories

When creating records, use these categories:

- **SALARY** - Salary/wages
- **FOOD** - Food and groceries
- **UTILITIES** - Electric, water, gas bills
- **TRANSPORTATION** - Fuel, public transport, car maintenance
- **ENTERTAINMENT** - Movies, games, hobbies
- **HEALTHCARE** - Medical expenses
- **OTHER** - Any other category

---

## 🎯 Sample Complete Workflow

1. **Signup:** Create new account with email
2. **Verify:** Check email for OTP, verify it
3. **Login:** Get authentication token
4. **Create Records:** Add 5-10 income/expense records
5. **List Records:** Retrieve all records with filters
6. **Update:** Modify an existing record
7. **Dashboard:** View summary analytics
8. **Dashboard Filtered:** Get analytics for specific date range
9. **Delete:** Remove a record

All these operations with example data are provided above!

---

## 💡 Tips

- **Default Date Range:** Dashboard queries default to current calendar month
- **No Role Change:** Role can only be changed via MongoDB (not exposed in API)
- **Admin Only:** Set role to ADMIN in MongoDB to access all user records
- **Soft Delete:** Not implemented yet (deletion is permanent)
- **Bulk Operations:** Use multiple mutations in sequence

---

## 📞 Support

For issues or questions, refer to:
- `FINANCE_API_DOCUMENTATION.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `be/src/schema.gql` - Generated GraphQL schema

---

**Happy Testing! 🚀**

*Generated: April 1, 2026*
