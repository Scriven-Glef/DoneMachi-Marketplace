# DoneMachi 🚀 
**On-Demand Home Services Marketplace (MVP)**

DoneMachi is a dual-sided marketplace designed to bridge the trust deficit in the unorganized home services sector. By introducing a transparent "inspection-first" pricing model and real-time geolocation dispatch, the platform solves core pain points for both consumers and gig-economy professionals.

---

## 📌 Executive Summary
- **The Problem**: Customers face opaque pricing, unpredictable arrivals, and bait-and-switch tactics. Vendors struggle with lead generation, high commission structures, and unpredictable daily earnings.
- **The Solution**: A transparent, three-sided platform where customers pay a flat upfront inspection fee (₹150). Verified vendors arrive, inspect the issue, and provide a dynamic, digitally-binding quote on-site. The customer approves and pays via the app—ensuring price transparency and guaranteed compensation for vendor travel.
- **Value Proposition**: 
  - *For Customers*: Zero surprise fees, verified professionals, and instant matching.
  - *For Vendors*: Guaranteed inspection payout, hyper-local job routing, and digital invoicing.

---

## 👥 Target Personas & Product Architecture
The platform is built on a unified PostgreSQL database serving three distinct user experiences:

### 1. The Customer (`done-machi-marketplace.vercel.app`)
**Goal**: Get a home repair issue diagnosed quickly and transparently.
- **Core Loop**: Browse catalog → Pinpoint location via Google Maps → Pay ₹150 Inspection Fee → Track vendor arrival → Approve/Decline final quote.
- **Friction Solved**: Eliminates the anxiety of negotiating with mechanics by standardizing the initial call-out fee and digitizing the final quote approval.

### 2. The Vendor (`vendors-donemachi.vercel.app`)
**Goal**: Maximize daily earnings with minimal travel downtime.
- **Core Loop**: Complete KYC onboarding → Set availability toggle → Receive hyper-local job alerts → Navigate to customer → Submit final quote on-site.
- **Friction Solved**: Ensures vendors are compensated for their travel time (via the inspection fee) even if the customer declines the final repair quote.

### 3. The Platform Operator/Admin (`admins-donemachi.vercel.app`)
**Goal**: Maintain marketplace liquidity and enforce quality standards.
- **Core Loop**: Verify vendor KYC documents → Monitor live marketplace transactions → Adjust dynamic service catalog pricing → Resolve disputes via quote/status overrides.

---

## 📊 Key Performance Indicators (KPIs) & North Stars
To validate product-market fit and ensure healthy unit economics, the platform architecture captures data to measure:
1. **Quote Acceptance Rate (QAR)**: The percentage of customers who approve the final on-site quote. *Indicates pricing fairness and consumer trust.*
2. **Liquidity Match Rate**: The percentage of customer searches that result in a successfully assigned vendor within a 5km radius in under 10 minutes.
3. **Vendor Utilization**: Ratio of active working hours to idle hours for online vendors.

---

## 🛣️ Product Roadmap & Future Scope
**Phase 1: MVP (Completed)**
- [x] End-to-end booking funnel and geolocation.
- [x] Three-sided portal routing (Customer, Vendor, Admin).
- [x] Dynamic Catalog Management.

**Phase 2: Growth & Retention (Upcoming)**
- **Surge Pricing Algorithm**: Dynamically adjust the inspection fee based on real-time supply/demand metrics in specific pin codes.
- **Vendor Gamification**: Introduce a tier system (Silver, Gold, Platinum) based on customer ratings and completion rates, offering lower commission brackets for top performers.
- **Subscription Model (DoneMachi Plus)**: Annual subscription for customers waiving the ₹150 inspection fee in exchange for recurring revenue.

---

## ⚙️ Tech Stack & Implementation Details
While heavily focused on product flow, the MVP is built with a highly scalable, production-ready stack:
- **Framework**: Next.js 15 (App Router) with advanced Subdomain Routing middleware.
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS) policies.
- **UI/UX**: Tailwind CSS, shadcn/ui, and mobile-first responsive design.
