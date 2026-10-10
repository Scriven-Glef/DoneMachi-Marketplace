# DoneMachi: Full-Stack Home Services Marketplace

## 📖 Executive Summary
DoneMachi is an on-demand, dual-sided marketplace MVP designed to connect customers with trusted local home service professionals (plumbing, AC repair, carpentry, etc.). 

This platform was built to solve the **trust deficit** in the unorganized home services sector by introducing a transparent, "inspection-first" pricing model backed by real-time geolocation dispatch.

## 🎯 The Problem & Solution
* **The Problem:** Customers face opaque pricing and bait-and-switch tactics from local mechanics. Vendors struggle with lead generation, high platform commission structures, and unpredictable daily earnings.
* **The Solution:** A transparent workflow where customers pay a flat ₹150 inspection fee upfront. The vendor arrives, inspects the issue, and provides a final quote via the app. The customer can approve and pay digitally, or decline with no further obligation (losing only the ₹150).

## 🏗️ Platform Architecture
The platform operates on a three-sided architecture sharing a centralized PostgreSQL database:
1. **Customer Portal:** Allows users to browse services, drop a pin via Google Maps for precise geolocation, and pay the upfront inspection fee.
2. **Vendor Portal:** A mobile-first dashboard for verified professionals to receive hyper-local job alerts, navigate to the customer, and submit dynamic final quotes on-site.
3. **Admin Command Center:** A role-based dashboard for marketplace operators to monitor live bookings, oversee marketplace liquidity (supply/demand matching), verify vendors, and handle disputes.

## 📊 Core Business Metrics (North Stars)
To ensure marketplace health and unit economics, the platform is structured to track:
* **Quote Acceptance Rate:** The percentage of customers who approve the final on-site quote (Validates pricing fairness and trust).
* **Job Fulfillment Rate:** The percentage of paid ₹150 inspections matched successfully to a vendor (Validates supply-side marketplace liquidity).
* **Repeat Customer Rate:** The percentage of users booking a second service (Validates overall Product-Market Fit).

## 🚀 Go-To-Market (GTM) Strategy
* **Initial Wedge:** Launching with high-urgency, weather-dependent services (e.g., AC Repair, RO Servicing).
* **Hyperlocal Focus:** Targeting specific high-density tech corridors and apartment complexes before expanding city-wide.
* **Supply-First Acquisition:** Onboarding verified local vendors with a "zero fixed fee, free leads" promise to guarantee liquidity before driving customer demand via local RWA partnerships and geo-targeted digital ads.

## 💻 Technical Execution
This MVP was rapidly prototyped and executed utilizing AI-agentic models to accelerate development. 
* **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI
* **Backend & Database:** Supabase (Relational PostgreSQL), Next.js Server Actions
* **APIs:** Google Maps API (Real-time Geolocation & Dispatching)
* **Authentication:** Supabase Auth (Strict Role-Based Access Control)
