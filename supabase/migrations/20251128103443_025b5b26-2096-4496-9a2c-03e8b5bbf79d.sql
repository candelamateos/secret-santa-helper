-- Fix security warning: Set search_path for functions
CREATE OR REPLACE FUNCTION generate_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 6));
END;
$$;

-- Fix draw_names function search_path
CREATE OR REPLACE FUNCTION draw_names(group_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;