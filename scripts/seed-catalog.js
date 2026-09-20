require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');

// Initialize Supabase Client (Using Anon Key since it's local seeding, 
// if RLS is enabled, you might need the Service Role Key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Map of problem groups based on the markdown copy
const MAPPINGS = {
  'Plumbing': {
    'Inspection & Diagnosis': ['Inspection / diagnosis', 'General inspection', 'Low water pressure check', 'Bathroom plumbing check', 'Kitchen plumbing check'],
    'Taps & Mixers': ['Tap leaking', 'Tap replacement', 'Mixer tap repair', 'Mixer tap replacement'],
    'Pipes & Leakage': ['Minor pipe leakage', 'Major pipe leakage', 'Water pipe repair', 'Water pipe replacement'],
    'Drains & Blockages': ['Drain blockage', 'Kitchen sink blockage', 'Bathroom drain blockage', 'Wash basin blockage', 'Sink pipe replacement', 'Wash basin pipe replacement'],
    'Toilet Services': ['Toilet flush repair', 'Toilet flush replacement', 'Toilet blockage', 'Toilet seat replacement'],
    'Bathroom Fixtures': ['Health faucet repair', 'Health faucet replacement', 'Shower repair', 'Shower replacement'],
    'Water Tank': ['Water tank pipe repair', 'Water tank overflow issue']
  },
  'AC Repair & Service': {
    'General Diagnosis': ['Inspection/diagnosis', 'AC not turning on', 'AC power issue'],
    'Cooling & Performance Issues': ['AC not cooling', 'AC cooling less', 'AC airflow issue', 'AC ice formation'],
    'Noise, Smell & Leaks': ['AC making noise', 'AC unusual sound', 'AC bad smell', 'AC water leaking'],
    'Electronics & Components': ['AC remote not working', 'AC PCB inspection', 'AC capacitor replacement', 'AC fan issue'],
    'Gas & Refrigerant': ['Gas leakage inspection', 'Gas charging (split AC)', 'Gas charging (window AC)', 'Gas top-up'],
    'Cleaning & Maintenance': ['Indoor unit cleaning', 'Outdoor unit cleaning', 'Basic cleaning', 'Deep cleaning', 'Filter cleaning', 'Drain pipe cleaning'],
    'AC Service Packages': ['AC service (split)', 'AC service (window)'],
    'Installation & Removal': ['AC installation', 'AC uninstallation', 'AC reinstallation']
  },
  'Electrical': {
    'Inspection & Safety Checks': ['General inspection', 'Short circuit inspection', 'Power failure inspection', 'Wiring inspection'],
    'Switches & Sockets': ['Switch not working', 'Socket not working', 'Switch replacement', 'Socket replacement'],
    'Fans': ['Fan not working', 'Fan installation', 'Fan removal', 'Ceiling fan repair'],
    'Lighting': ['Light not working', 'Light installation', 'LED light replacement', 'Tube light installation', 'Tube light repair'],
    'Power & Wiring': ['MCB tripping', 'MCB replacement', 'Fuse issue', 'Minor wiring repair', 'New wiring', 'Loose connection repair'],
    'Doorbell': ['Doorbell installation', 'Doorbell repair'],
    'Exhaust Fan': ['Exhaust fan installation', 'Exhaust fan repair'],
    'Geyser': ['Geyser inspection', 'Geyser installation', 'Geyser electrical repair'],
    'Inverter': ['Inverter inspection', 'Inverter installation', 'Inverter wiring']
  }
};

function getProblemGroup(category, serviceName) {
  // Normalize strings for comparison
  const normalizedCategory = category.trim().toLowerCase();
  
  let mappedCategory = '';
  if (normalizedCategory.includes('plumb')) mappedCategory = 'Plumbing';
  else if (normalizedCategory.includes('ac')) mappedCategory = 'AC Repair & Service';
  else if (normalizedCategory.includes('electric')) mappedCategory = 'Electrical';
  else return 'Other';

  const groups = MAPPINGS[mappedCategory];
  if (!groups) return 'Other';

  for (const [groupName, items] of Object.entries(groups)) {
    const isMatch = items.some(item => item.toLowerCase() === serviceName.trim().toLowerCase() || item.toLowerCase().includes(serviceName.trim().toLowerCase()));
    if (isMatch) return groupName;
  }

  return 'Uncategorized';
}

async function seed() {
  console.log('Reading Excel file...');
  const wb = xlsx.readFile('C:/Users/scriv/Desktop/Tri 4/SPM/Antigravity/Catalog/Catalog.xlsx');
  const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  
  const formattedData = data.map(row => {
    const category = row['Service'] || '';
    const serviceName = row['Sub-service / Problem'] || '';
    const basePrice = row['Suggested Base Price'] || 0;
    
    // Auto-map to problem group
    const problemGroup = getProblemGroup(category, serviceName);

    return {
      category: category,
      problem_group: problemGroup,
      service_name: serviceName,
      base_price: parseFloat(basePrice),
      is_active: true
    };
  }).filter(item => item.service_name);

  console.log(`Parsed ${formattedData.length} valid services from Excel.`);
  console.log('Inserting into Supabase service_catalog table...');

  // Bulk insert
  const { data: inserted, error } = await supabase
    .from('service_catalog')
    .insert(formattedData)
    .select();

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log(`Successfully seeded ${inserted.length} services!`);
  }
}

seed();
