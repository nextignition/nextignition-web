-- Add investor-specific fields to profiles table
alter table public.profiles
  add column if not exists investment_firm text,
  add column if not exists investor_type text;

-- Add comment for documentation
comment on column public.profiles.investment_firm is 'Company or firm name for investors';
comment on column public.profiles.investor_type is 'Type of investor (angel, vc, corporate_vc, family_office, private_equity, accelerator)';
