-- Add quoting columns to bookings table
ALTER TABLE bookings 
ADD COLUMN final_quoted_price DECIMAL(10, 2),
ADD COLUMN quote_status VARCHAR(20) DEFAULT 'pending';
