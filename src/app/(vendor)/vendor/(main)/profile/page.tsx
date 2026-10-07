import { getVendorProfile, updateVendorPassword } from "../../actions"
import { getSessionUserId } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function VendorProfilePage() {
  const userId = await getSessionUserId()
  if (!userId) redirect('/vendor/login')

  const profile = await getVendorProfile(userId)
  if (!profile) redirect('/vendor/onboarding')

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h2>
        <p className="text-slate-500 mt-2">Manage your vendor profile and account security.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your current onboarding information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-slate-500 text-xs uppercase tracking-wider">Business Name</Label>
                <p className="font-semibold text-slate-900">{profile.business_name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-500 text-xs uppercase tracking-wider">Owner Name</Label>
                <p className="font-semibold text-slate-900">{profile.users?.name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-500 text-xs uppercase tracking-wider">Email Address</Label>
                <p className="font-semibold text-slate-900">{profile.users?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-500 text-xs uppercase tracking-wider">Onboarding Status</Label>
                <p className="font-semibold text-slate-900 capitalize">{profile.onboarding_status}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm text-amber-600 font-medium">To update your business details or email, please contact DoneMachi admin support.</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password. You will remain logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
              'use server'
              await updateVendorPassword(formData)
            }} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required minLength={6} placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} placeholder="Confirm new password" />
              </div>
              <Button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
