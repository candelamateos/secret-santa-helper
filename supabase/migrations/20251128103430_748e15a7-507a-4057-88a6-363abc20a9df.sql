-- Create groups table for Secret Santa groups
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  is_drawn BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create participants table
CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  wishlist TEXT,
  assigned_to_id UUID REFERENCES public.participants(id),
  participant_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups - anyone can view and create
CREATE POLICY "Anyone can view groups"
  ON public.groups FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update groups"
  ON public.groups FOR UPDATE
  USING (true);

-- RLS Policies for participants - anyone can view and create
CREATE POLICY "Anyone can view participants"
  ON public.participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create participants"
  ON public.participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update participants"
  ON public.participants FOR UPDATE
  USING (true);

-- Function to generate random 6-character codes
CREATE OR REPLACE FUNCTION generate_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 6));
END;
$$ LANGUAGE plpgsql;

-- Function to draw names for Secret Santa
CREATE OR REPLACE FUNCTION draw_names(group_id_param UUID)
RETURNS void AS $$
DECLARE
  participant_ids UUID[];
  shuffled_ids UUID[];
  i INTEGER;
BEGIN
  -- Get all participant IDs for the group
  SELECT array_agg(id ORDER BY random())
  INTO participant_ids
  FROM participants
  WHERE group_id = group_id_param;

  -- Create shuffled version (shift by 1 to ensure no one gets themselves)
  shuffled_ids := participant_ids[2:array_length(participant_ids, 1)] || participant_ids[1:1];

  -- Assign each participant to the next person
  FOR i IN 1..array_length(participant_ids, 1) LOOP
    UPDATE participants
    SET assigned_to_id = shuffled_ids[i]
    WHERE id = participant_ids[i];
  END LOOP;

  -- Mark group as drawn
  UPDATE groups
  SET is_drawn = true
  WHERE id = group_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;