import { getVendorProfile, getServiceCatalog, getVendorServices } from "../../actions"
import { redirect } from "next/navigation"
import { ServiceTabsClient } from "./ServiceTabsClient"

export default async function VendorServicesPage() {
  const profile = await getVendorProfile()

  if (!profile) {
    redirect('/vendor/onboarding')
  }

  // 1. Fetch the master catalog
  const catalog = await getServiceCatalog()
  
  // 2. Fetch the vendor's currently opted-in services
  const vendorServices = await getVendorServices(profile.id)
  
  // 3. Group the catalog by category -> problem_group
  const groupedCatalog = catalog.reduce((acc: any, service: any) => {
    if (!acc[service.category]) acc[service.category] = {};
    if (!acc[service.category][service.problem_group]) acc[service.category][service.problem_group] = [];
    acc[service.category][service.problem_group].push(service);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Services</h2>
        <p className="text-slate-500 mt-2">
          Select the jobs you are qualified to fulfill. You will only receive booking requests for the services you opt-in to below.
        </p>
      </div>

      <ServiceTabsClient 
        vendorId={profile.id} 
        groupedCatalog={groupedCatalog} 
        vendorServices={vendorServices} 
      />
    </div>
  )
}
