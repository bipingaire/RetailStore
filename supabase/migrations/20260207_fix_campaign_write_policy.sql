-- Enable Write Access for Marketing Campaigns

-- INSERT Policy
CREATE POLICY "Enable insert access for marketing" 
ON public."marketing-campaign-master"
FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "marketing-campaign-master"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);

-- UPDATE Policy
CREATE POLICY "Enable update access for marketing" 
ON public."marketing-campaign-master"
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "marketing-campaign-master"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "marketing-campaign-master"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);

-- DELETE Policy
CREATE POLICY "Enable delete access for marketing" 
ON public."marketing-campaign-master"
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "marketing-campaign-master"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);
