import { CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { TeamMembersSection } from '@/components/team/team-members-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamMembers } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);

  return {
    title: copy.about.metadataTitle,
    description: copy.about.metadataDescription,
  };
}

async function AboutPage() {
  const locale = await getLocale();
  const [copy, teamMembers] = await Promise.all([getSiteCopy(locale), getTeamMembers()]);

  return (
    <div className="page-shell bg-white">
      <div className="container-shell page-stack">
        <section className="rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-8 shadow-sm lg:p-10">
          <SectionHeader eyebrow={copy.about.eyebrow} title={copy.about.title} description={copy.about.description} />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {copy.about.cards.map(([title, text]) => (
            <Card key={title} className="card-corporate">
              <CardHeader><CardTitle className="text-brand-black">{title}</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-7 text-brand-gray-dark">{text}</p></CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-corporate">
          <CardHeader><CardTitle className="text-brand-black">{copy.about.reasonsTitle}</CardTitle></CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {copy.about.reasons.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-brand-gray-modern/20 bg-brand-gray-modern/10 p-5 text-sm leading-7 text-brand-gray-dark">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <TeamMembersSection members={teamMembers} copy={copy.about.teamSection} />
    </div>
  );
}

export default AboutPage;
