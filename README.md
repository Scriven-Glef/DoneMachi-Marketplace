# DoneMachi 🛠️

<<<<<<< HEAD
DoneMachi is a modern, on-demand, dual-sided marketplace MVP designed to connect customers with trusted local home service professionals (plumbing, AC repair, carpentry, etc.). 
=======
## Summary
DoneMachi is an on-demand, dual-sided marketplace MVP designed to connect customers with trusted local home service professionals (plumbing, AC repair, carpentry, etc.). 
>>>>>>> 28eb192ceef8bd1cc15f8e559de2f5267f39cc11

This platform was built to solve the **trust deficit** in the unorganized home services sector by introducing a transparent, "inspection-first" pricing model backed by real-time geolocation dispatch and instant quoting.

<<<<<<< HEAD
## 🚀 The Problem & Solution
=======
## The Problem & Solution
>>>>>>> 28eb192ceef8bd1cc15f8e559de2f5267f39cc11
* **The Problem:** Customers face opaque pricing and bait-and-switch tactics from local mechanics. Vendors struggle with lead generation, high platform commission structures, and unpredictable daily earnings.
* **The Solution:** A transparent workflow where customers pay a flat ₹150 inspection fee upfront. The vendor arrives, inspects the issue, and provides a final quote via the app. The customer can approve and pay digitally, or decline with no further obligation (losing only the ₹150).

## Platform Architecture
The platform operates on a three-sided architecture sharing a centralized PostgreSQL database:
1. **Customer Portal (`donemachi.com`)**: Allows users to browse services, drop a pin via Google Maps for precise geolocation, and pay the upfront inspection fee.
2. **Vendor Portal (`vendors.donemachi.com`)**: A mobile-first dashboard for verified professionals to receive hyper-local job alerts, navigate to the customer, and submit dynamic final quotes on-site.
3. **Admin Command Center (`admins.donemachi.com`)**: A role-based dashboard for marketplace operators to monitor live bookings, oversee marketplace liquidity (supply/demand matching), verify vendors, and handle overrides.

<<<<<<< HEAD
## 🛠️ Tech Stack
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + RLS Policies + SSR Cookies)
- **Deployment:** [Vercel](https://vercel.com/) with automated Subdomain Routing via Middleware

## ✨ Core Features
- **Role-Based Access Control (RBAC)**: Secure, distinct auth flows for Customers, Vendors, and Admins via Supabase Middleware.
- **Dynamic Catalog Pricing**: Admins can adjust the master service catalog (Category > Problem Group > Service) in real-time, instantly reflecting on the customer storefront.
- **Subdomain Routing**: Seamless Next.js middleware routing mapping `vendors.*` and `admins.*` to internal application modules.
- **Cart & Session Preservation**: Checkout parameters are intelligently preserved in the URL across the authentication funnel, preventing cart drop-off.
- **Quote Overrides**: Admins have root authority to intervene in ongoing jobs and override final quotes or booking statuses directly from the Command Center.

## 📈 North Star Metrics
To ensure marketplace health and unit economics, the platform architecture tracks:
1. **Quote Acceptance Rate:** The percentage of customers who approve the final on-site quote (validates pricing fairness and trust).
2. **Vendor Utilization:** Ratio of available hours to booked hours.
3. **Liquidity Match Rate:** The percentage of searches that result in a successfully assigned vendor within a 5km radius.
=======
## Core Business Metrics (North Stars)
To ensure marketplace health and unit economics, the platform is structured to track:
* **Quote Acceptance Rate:** The percentage of customers who approve the final on-site quote (Validates pricing fairness and trust).
* **Job Fulfillment Rate:** The percentage of paid ₹150 inspections matched successfully to a vendor (Validates supply-side marketplace liquidity).
* **Repeat Customer Rate:** The percentage of users booking a second service (Validates overall Product-Market Fit).

## Go-To-Market (GTM) Strategy
* **Initial Wedge:** Launching with high-urgency, weather-dependent services (e.g., AC Repair, RO Servicing).
* **Hyperlocal Focus:** Targeting specific high-density tech corridors and apartment complexes before expanding city-wide.
* **Supply-First Acquisition:** Onboarding verified local vendors with a "zero fixed fee, free leads" promise to guarantee liquidity before driving customer demand via local RWA partnerships and geo-targeted digital ads.

## Technical Execution
This MVP was rapidly prototyped and executed utilizing AI-agentic models to accelerate development. 
* **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI
* **Backend & Database:** Supabase (Relational PostgreSQL), Next.js Server Actions
* **APIs:** Google Maps API (Real-time Geolocation & Dispatching)
* **Authentication:** Supabase Auth (Strict Role-Based Access Control)
>>>>>>> 28eb192ceef8bd1cc15f8e559de2f5267f39cc11
