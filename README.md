# Scaler IC Incentive Calculator

**For Individual Contributors Only**

A dedicated calculator for BD Individual Contributors (BDA, S.BDA, AM, BDS) to calculate their incentives based on the February 2026 Cohort policy.

## 🎯 Purpose

This is the **IC-only version** of the incentive calculator. It contains **only** the IC calculator and does not include manager calculations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## ✨ Features

- Calculate your individual incentives
- Probation and Non-Probation modes
- Real-time validation
- Detailed breakdown of calculations
- Policy-compliant

## 📊 How to Use

1. Select your employment status (Probation or Non-Probation)
2. Enter your sales data:
   - Net Sales
   - Non-Discounted Net Sales
   - Referral Sales Count
   - Manager Coupon Sales Count
3. See your incentive calculation instantly!

## 💰 Incentive Slabs (Non-Probation)

| Net Sales (4-week) | Per Non-Discounted Sale |
|-------------------|------------------------|
| 4-5 | ₹12,500 |
| 6-7 | ₹15,000 |
| 8-9 | ₹17,500 |
| 10-11 | ₹20,000 |
| 12-13 | ₹22,500 |
| 14-15 | ₹25,000 |
| 16-17 | ₹27,500 |
| 18+ | ₹30,000 |

**Additional:**
- Referral Sale: ₹5,000 per sale
- Manager Coupon Sale: ₹10,000 per sale

**Probation:**
- ₹5,000 per non-discounted sale only
- Referral and manager coupon not paid

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

This version should be deployed separately for IC access only.

**Recommended deployment URL:**
- `https://ic-incentives.scaler.com`
- Or any subdomain dedicated to ICs

## 🔒 Security Note

This version does NOT include manager calculations. ICs cannot see team-based incentive structures.

## 📝 Policy Date

February 2026 Cohort

---

For questions about the policy, contact your manager or BD leadership.
