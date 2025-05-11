/*
  # Update bookings table and policies

  1. Changes
    - Safely create bookings table if it doesn't exist
    - Add RLS policies for anonymous inserts and authenticated reads
  
  2. Security
    - Enable RLS on bookings table
    - Allow anonymous users to insert bookings
    - Allow authenticated users to read all bookings
*/

-- Create table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'bookings') THEN
    CREATE TABLE bookings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      timestamp timestamptz NOT NULL,
      property_size text NOT NULL,
      services text NOT NULL,
      total_amount numeric NOT NULL,
      address text NOT NULL,
      notes text,
      preferred_date date NOT NULL,
      property_status text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE tablename = 'bookings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN 
  DROP POLICY IF EXISTS "Allow anonymous insert" ON bookings;
  DROP POLICY IF EXISTS "Allow authenticated read" ON bookings;
END $$;

-- Create policies
CREATE POLICY "Allow anonymous insert"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);