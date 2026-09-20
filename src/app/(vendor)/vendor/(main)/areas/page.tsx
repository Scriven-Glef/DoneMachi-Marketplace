import { getVendorProfile, getVendorServiceAreas } from "../../actions"
import { redirect } from "next/navigation"
import { AreaManager } from "./AreaManager"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function AreasPage() {
  const profile = await getVendorProfile()

  if (!profile) {
    redirect('/vendor/onboarding')
  }

  const areas = await getVendorServiceAreas(profile.id)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Service Areas</h2>
        <p className="text-slate-500 mt-2">
          Manage the locations where you are available to provide services.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pincode Manager</CardTitle>
          <CardDescription>Add the 6-digit pincodes for the areas you cover.</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaManager vendorId={profile.id} initialAreas={areas} />
        </CardContent>
      </Card>
    </div>
  )
}
