export const calculateProfileCompletation = (
  profile: any,
  contacts: any[] = [],
) => {
  const fields = [
    profile?.full_name,
    profile?.phone,
    profile?.photo_url,
    profile?.address,
  ];

  const fieldCount = fields.filter(Boolean).length;
  // Max 2 contacts contribute to the percentage
  const contactCount = Math.min(contacts?.length || 0, 2);

  const totalCompleted = fieldCount + contactCount;
  const totalRequirement = fields.length + 2; // 4 fields + 2 contacts

  return Math.round((totalCompleted / totalRequirement) * 100);
};
