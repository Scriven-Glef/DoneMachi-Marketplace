-- 1. Create the customer_addresses table
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the update trigger for customer_addresses
CREATE TRIGGER update_customer_addresses_modtime BEFORE UPDATE ON customer_addresses FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 3. Alter bookings table to include customer contact details directly on the booking
ALTER TABLE bookings 
ADD COLUMN customer_phone VARCHAR(20),
ADD COLUMN customer_name VARCHAR(255);
