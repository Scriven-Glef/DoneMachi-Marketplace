# DoneMachi 🛠️

DoneMachi is a modern, on-demand, dual-sided marketplace MVP designed to connect customers with trusted local home service professionals (plumbing, AC repair, carpentry, etc.). 

This platform was built to solve the **trust deficit** in the unorganized home services sector by introducing a transparent, "inspection-first" pricing model backed by real-time geolocation dispatch and instant quoting.

## 🚀 The Problem & Solution
* **The Problem:** Customers face opaque pricing and bait-and-switch tactics from local mechanics. Vendors struggle with lead generation, high platform commission structures, and unpredictable daily earnings.
* **The Solution:** A transparent workflow where customers pay a flat ₹150 inspection fee upfront. The vendor arrives, inspects the issue, and provides a final quote via the app. The customer can approve and pay digitally, or decline with no further obligation (losing only the ₹150).

## 🏗️ Platform Architecture
The platform operates on a three-sided architecture sharing a centralized PostgreSQL database:
1. **Customer Portal (`donemachi.com`)**: Allows users to browse services, drop a pin via Google Maps for precise geolocation, and pay the upfront inspection fee.
2. **Vendor Portal (`vendors.donemachi.com`)**: A mobile-first dashboard for verified professionals to receive hyper-local job alerts, navigate to the customer, and submit dynamic final quotes on-site.
3. **Admin Command Center (`admins.donemachi.com`)**: A role-based dashboard for marketplace operators to monitor live bookings, oversee marketplace liquidity (supply/demand matching), verify vendors, and handle overrides.

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
