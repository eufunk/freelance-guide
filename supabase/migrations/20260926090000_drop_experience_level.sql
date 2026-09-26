-- Onboarding asks for years of experience only (decision in Phase 5), so the
-- separate experience level is not stored.
alter table public.profiles drop column experience_level;
