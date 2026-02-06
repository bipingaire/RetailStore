-- Enable public read access for active marketing campaigns
DROP POLICY IF EXISTS "Public read active campaigns" ON public."marketing-campaign-master";

CREATE POLICY "Public read active campaigns"
ON public."marketing-campaign-master"
FOR SELECT
USING (
  "is-active-flag" = true
);
