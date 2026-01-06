## 🔐 Protected Cart Flow - User Guide

### How It Works:

**Scenario 1: User Not Logged In**
1. User browses products on `/shop`
2. User clicks "Add to Cart" on any product
3. System detects user is not authenticated
4. Product ID is stored temporarily
5. User is redirected to `/shop/login`
6. After successful login → User is taken to cart with product added
7. Cart page displays the selected product

**Scenario 2: User Needs to Register**
1. From login page, user clicks "Sign up"
2. User fills registration form (name, email, phone, password)
3. After successful registration:
   - User is automatically logged in
   - If there was a pending cart item → Redirected to cart
   - Otherwise → Redirected to shop

**Scenario 3: Google OAuth**
1. User clicks "Continue with Google" from login/register
2. Authenticates via Google
3. Returns to shop with pending item added (if any)
4. Automatically redirected to cart

**Scenario 4: Already Logged In**
1. User clicks "Add to Cart"
2. Product immediately added to cart
3. User can continue shopping or go to cart

### Technical Implementation:

**Storage Used:**
- `sessionStorage.pending_cart_item` - Stores product ID temporarily
- `localStorage.retail_cart` - Persistent cart storage
- Supabase JWT - Authentication token

**Flow:**
```
Product Page
    ↓
  [Add to Cart clicked]
    ↓
  Check: Is user authenticated?
    ↓
  NO → Store product ID → Redirect to /login
    ↓
  Login/Register successful
    ↓
  Return to /shop → Detect pending item
    ↓
  Add to cart → Redirect to /cart
    ↓
  ✅ Product in cart
```

### Benefits:
- ✅ Seamless user experience
- ✅ No lost cart items
- ✅ Secure (requires authentication)
- ✅ Works with Google OAuth
- ✅ Auto-login after registration
