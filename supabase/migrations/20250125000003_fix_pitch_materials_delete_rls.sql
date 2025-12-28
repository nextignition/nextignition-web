-- Fix RLS policy for pitch_materials to ensure DELETE operations work correctly
-- The existing policy should work, but we'll ensure it explicitly allows DELETE

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "PitchMaterials: owner access" ON public.pitch_materials;

-- Recreate policy with explicit DELETE permission
CREATE POLICY "PitchMaterials: owner access"
  ON public.pitch_materials
  FOR ALL
  USING (owner_profile_id = auth.uid())
  WITH CHECK (owner_profile_id = auth.uid());

-- Also ensure there's a specific DELETE policy (though FOR ALL should cover it)
-- This is redundant but ensures DELETE works
CREATE POLICY "PitchMaterials: owner can delete"
  ON public.pitch_materials
  FOR DELETE
  USING (owner_profile_id = auth.uid());

-- Grant necessary permissions
GRANT DELETE ON public.pitch_materials TO authenticated;

