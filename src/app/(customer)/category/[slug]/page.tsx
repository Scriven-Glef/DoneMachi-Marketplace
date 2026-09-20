import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CategoryClient } from './CategoryClient'

const categoryMap: Record<string, string> = {
  'plumbing': 'Plumbing',
  'ac-repair': 'AC',
  'electrical': 'Electrical'
}

const copyMap: Record<string, { title: string, intro: string }> = {
  'plumbing': {
    title: 'Plumbing Services',
    intro: "From a dripping tap to a fully blocked drain, our verified plumbers handle every plumbing issue in your home. Every visit starts with a quick inspection so you know exactly what's wrong and what it'll cost before any work begins."
  },
  'ac-repair': {
    title: 'AC Repair & Service',
    intro: "Whether your AC has stopped cooling, is leaking, or just needs its annual service, our certified technicians get it running efficiently again. We service split and window ACs of all major brands."
  },
  'electrical': {
    title: 'Electrical Services',
    intro: "Safe, code-compliant electrical work for your home — from a single faulty switch to complete new wiring. Our electricians are trained to handle everything with safety as the first priority on every job."
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const dbCategory = categoryMap[resolvedParams.slug]
  if (!dbCategory) {
    notFound()
  }

  const supabase = await createClient()
  const { data: catalog, error } = await supabase
    .from('service_catalog')
    .select('*')
    .eq('category', dbCategory)
    .eq('is_active', true)
    .order('problem_group')
    .order('service_name')

  if (error || !catalog) {
    console.error('Error fetching catalog:', error)
    return <div className="p-8 text-center text-rose-500">Failed to load services. Please try again.</div>
  }

  // Group by problem_group, ignoring Uncategorized or empty groups
  const groupedCatalog = catalog.reduce((acc: any, service: any) => {
    if (!service.problem_group || service.problem_group === 'Uncategorized') return acc;
    if (!acc[service.problem_group]) acc[service.problem_group] = [];
    acc[service.problem_group].push(service);
    return acc;
  }, {});

  const copy = copyMap[resolvedParams.slug]

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="bg-indigo-900 text-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{copy.title}</h1>
          <p className="text-indigo-100 text-lg md:text-xl leading-relaxed">{copy.intro}</p>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-amber-900 text-sm shadow-sm flex items-start gap-3">
          <div className="mt-0.5">ℹ️</div>
          <div>
            <strong>Important Pricing Note:</strong> Prices shown below are starting estimates. Final cost will be confirmed by your technician after inspection. The inspection fee (₹149) is adjusted against your final bill if you proceed with the repair.
          </div>
        </div>

        <CategoryClient groupedCatalog={groupedCatalog} categorySlug={resolvedParams.slug} />
      </div>
    </div>
  )
}
