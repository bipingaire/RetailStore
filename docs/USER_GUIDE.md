# 📚 RetailStore - User Guide

## Welcome to RetailStore!

Your complete retail management platform for digitizing mom-and-pop stores.

---

## 🚀 Quick Start

### For Store Owners

**Step 1: Setup Your Store**
1. Sign up at `/login`
2. Enter store details (name, address, contact)
3. Your dashboard will be ready at `/admin`

**Step 2: Add Inventory**
1. Upload vendor invoices → System extracts products automatically
2. Or manually add products via Inventory page
3. Set pricing and reorder points

**Step 3: Track Sales**
1. Upload daily Z-reports from your POS
2. System updates inventory automatically
3. View profit dashboard in real-time

---

## 📦 Major Features

### 1. Inventory In (Invoice Processing)
**Path:** `/admin/invoices`

**How to use:**
1. Click "Upload Invoice"
2. Take photo or select PDF of vendor invoice
3. AI extracts all products automatically
4. Review and approve
5. Products added to inventory with batch tracking

**Tips:**
- Clear photos work best
- System remembers vendors for faster matching
- Check expiry dates before approving

---

### 2. Inventory Out (Sales Tracking)
**Path:** `/admin/sales/upload-z-report`

**How to use:**
1. Get daily Z-report from POS system
2. Upload report (PDF/image)
3. AI extracts sales data
4. Inventory automatically deducted

**What you get:**
- Daily sales totals
- Top selling products
- Sales trends

---

### 3. Inventory Reconciliation
**Path:** `/admin/reconciliation`

**Physical Count Process:**
1. Click "Start New Count"
2. Staff walks store counting products
3. Enter actual quantities in mobile-friendly interface
4. System calculates variance
5. Manager reviews and approves
6. Inventory adjusted automatically

**Use for:**
- Detecting theft/loss
- Finding damaged goods
- Monthly audits

---

### 4. Inventory Health
**Path:** `/admin/reports/inventory-health`

**Features:**
- Health score (0-100%)
- Slow-moving products alert
- Expiring products warning
- Reorder recommendations

**Actions:**
- Create campaigns for slow items
- Generate purchase orders
- Plan promotions

---

### 5. Profit Dashboard
**Path:** `/admin/reports/profit-loss`

**What you see:**
- Total Revenue
- Cost of Goods Sold (COGS)
- Gross Profit & Margin
- Net Profit (after expenses)

**Track expenses:**
- Go to `/admin/reports/expenses/add`
- Add rent, utilities, labor, etc.
- See true profitability

---

### 6. Marketing Campaigns
**Path:** `/admin/campaigns/create`

**Create promotions in 3 steps:**
1. Select slow-moving products
2. AI generates social media post
3. Post to Facebook/Instagram

**Requirements:**
- Facebook Page access token
- Instagram Business account

---

### 7. Vendor Restock
**Path:** `/admin/restock`

**Auto-generate purchase orders:**
1. System detects low stock items
2. Suggests reorder quantities
3. Generate PO with one click
4. Email directly to vendor

---

## 🛒 E-Commerce Shop

**Customer-facing storefront:** `/shop`

**Features:**
- Browse products by category
- Add to cart
- Checkout with Stripe
- Order tracking

**Setup:**
1. Products auto-publish from inventory
2. Create campaigns for featured items
3. Share shop link with customers

---

## ⚙️ Settings

### Store Configuration
- Update store info, hours, contact
- Manage user access (staff/managers)
- Set reorder points

### Integrations
- Connect POS system
- Link social media accounts
- Setup payment gateway

---

## 📊 Reports

### Available Reports:
1. **Profit & Loss** - Financial overview
2. **Inventory Health** - Stock analysis
3. **Sales Performance** - Top products, trends
4. **Reconciliation History** - Theft/loss tracking

---

## 🆘 Troubleshooting

**Invoice not scanning?**
- Ensure good lighting
- Flatten the invoice
- Try PDF format

**Z-report parsing issues?**
- Check file format (PDF preferred)
- Ensure report includes SKU codes
- Verify date format

**Products not matching?**
- Use POS Mapping page
- Manually link SKU to inventory
- System learns over time

---

## 📞 Support

**Need help?**
- Email: support@retailstore.app
- Knowledge Base: docs.retailstore.app
- Video Tutorials: Available in app

---

## 🎯 Best Practices

1. **Upload invoices daily** - Keep inventory accurate
2. **Review Z-reports** - Catch discrepancies early
3. **Monthly reconciliation** - Physical counts prevent loss
4. **Track expenses weekly** - Understand true profitability
5. **Create campaigns monthly** - Move slow inventory

---

*Last updated: January 6, 2026*
