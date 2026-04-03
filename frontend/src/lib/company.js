import 'server-only';
import { getCompanyProfile } from '@/lib/api';
import { getSiteCopy } from '@/lib/site-copy';
import { company as defaultCompany } from '@/lib/site-data';

async function getCompanyContent(locale) {
  const copy = await getSiteCopy(locale);
  const companyProfile = await getCompanyProfile();

  return {
    ...defaultCompany,
    ...(companyProfile || {}),
    description: copy.companyDescription,
  };
}

export { getCompanyContent };