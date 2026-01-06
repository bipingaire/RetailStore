# Email OTP Verification Setup

## ✅ Already Implemented:

Your registration now sends a **confirmation email** after signup!

## 📝 Configuration Required in Supabase:

To enable email verification, follow these steps:

### 1. **Enable Email Confirmations** (in Supabase Dashboard)

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, enable:
   - ✅ **Enable email confirmations**
   - This requires users to verify their email before logging in

### 2. **Configure Email Templates** (Optional - Customize the OTP email)

1. Go to **Authentication** → **Email Templates**
2. Click on **Confirm signup** template
3. Customize the email template:

```html
<h2>Confirm your signup</h2>
<p>Hi {{ .Data.full_name }},</p>
<p>Please click the link below to verify your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>Or enter this code: <strong>{{ .Token }}</strong></p>
```

### 3. **SMTP Settings** (For production)

For production, configure your own SMTP:
1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Add your email service credentials (Gmail, SendGrid, etc.)

**For Development:**
- Supabase provides a built-in email service
- Limited to 3 emails per hour in free tier

## 🔄 User Flow After Implementation:

### **Registration Process:**

1. **User fills form** → Enters name, email, phone, password
2. **Clicks "Create Account"** → Form submitted
3. **Email sent** → Confirmation email goes to user's inbox
4. **Success screen shown:**
   ```
   ✅ Check Your Email!
   We've sent a confirmation link to: user@example.com
   
   📧 Next Steps:
   1. Open your email inbox
   2. Click the confirmation link
   3. You'll be automatically logged in
   4. Start shopping!
   ```

5. **User clicks email link** → Verified and logged in
6. **Redirected to shop/cart** → Ready to shop!

## 🎯 Alternative: Magic Link (OTP-Free)

If you want a simpler "magic link" approach (no password):

```tsx
const { error } = await supabase.auth.signInWithOtp({
  email: formData.email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});
```

This sends a one-time login link instead of requiring password + confirmation.

## 🔐 Security Features:

- ✅ Email verification prevents fake signups
- ✅ Confirmation tokens expire after 24 hours
- ✅ Rate limiting on email sends
- ✅ Secure token generation
- ✅ Passwords remain hashed

## ✨ Already Working:

Your code now:
- ✅ Sends confirmation email
- ✅ Shows success screen
- ✅ Handles email verification
- ✅ Auto-logs in after confirmation
- ✅ Preserves cart items

Just enable it in Supabase Dashboard! 🚀
