-- VERIFY LOCKDOWN STATUS
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN (
    'retail-store-inventory-item', 
    'inventory-batch-tracking-record', 
    'marketing-campaign-master',
    'campaign-product-segment-group'
)
ORDER BY tablename, policyname;
