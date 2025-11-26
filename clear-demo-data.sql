-- Clear all demo data but keep Super Admin
DELETE FROM "Activity" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Task" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Deal" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Call" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Contact" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "PipelineStage" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "User" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Tenant" WHERE slug != 'crm-platform';

-- Recreate pipeline stages for your tenant
INSERT INTO "PipelineStage" ("id", "name", "order", "probability", "color", "tenantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  stage_data.name,
  stage_data.order,
  stage_data.probability,
  stage_data.color,
  (SELECT id FROM "Tenant" WHERE slug = 'crm-platform'),
  NOW(),
  NOW()
FROM (VALUES
  ('New Lead', 1, 10, '#gray'),
  ('Qualified', 2, 30, '#blue'),
  ('Demo Scheduled', 3, 50, '#yellow'),
  ('Proposal Sent', 4, 70, '#orange'),
  ('Negotiation', 5, 85, '#purple'),
  ('Closed Won', 6, 100, '#green')
) AS stage_data(name, order, probability, color);
