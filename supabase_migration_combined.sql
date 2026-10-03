-- 1. Create the customer_addresses table
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add phone and name to bookings to ensure persistence if an address is deleted
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

-- 3. Add quoting columns to bookings table (Inspection-First Model)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS final_quoted_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS quote_status VARCHAR(20) DEFAULT 'pending';
