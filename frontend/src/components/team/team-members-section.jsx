'use client';

import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Quote, Users2 } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { Badge } from '@/components/ui/badge';

function getFullName(member) {
  return [member?.firstName, member?.lastName].filter(Boolean).join(' ');
}

function TeamMembersSection({ members = [], copy }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!members.length) {
      return;
    }

    setActiveIndex((currentIndex) => currentIndex % members.length);
  }, [members.length]);

  useEffect(() => {
    if (members.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % members.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [members.length]);

  if (!members.length) {
    return null;
  }

  const activeMember = members[activeIndex] || members[0];

  return (
    <section className="border-t border-brand-gray-modern/15 bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] py-20">
      <div className="container-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
          <div className="rounded-[1.25rem] border border-brand-gray-modern/15 bg-white px-5 py-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">{copy.membersLabel}</p>
            <div className="mt-3 flex items-center gap-3 text-brand-black">
              <Users2 className="h-5 w-5 text-brand-red" />
              <span className="text-2xl font-semibold">{members.length}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="overflow-hidden rounded-[2rem] border border-brand-gray-modern/15 bg-white shadow-sm">
            <div className="grid h-full gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[24rem] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.18),transparent_35%),linear-gradient(135deg,#7f1017_0%,#c4161c_48%,#1f1f23_100%)]">
                {activeMember.photoUrl ? <img src={activeMember.photoUrl} alt={getFullName(activeMember)} className="absolute inset-0 h-full w-full object-cover" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/75 via-brand-black/20 to-transparent" />
                <div className="absolute left-5 top-5">
                  <Badge className="border-0 bg-white/90 text-brand-black hover:bg-white">{copy.spotlightLabel}</Badge>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{activeMember.jobTitle}</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">{getFullName(activeMember)}</h3>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 lg:p-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-red/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {activeMember.jobTitle}
                  </div>
                  <div className="mt-6 rounded-[1.5rem] bg-brand-gray-modern/10 p-5">
                    <Quote className="h-6 w-6 text-brand-red" />
                    <p className="mt-4 text-base leading-8 text-brand-gray-dark">{activeMember.shortDescription}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-2">
                  {members.map((member, index) => (
                    <button
                      key={member.id || `${member.firstName}-${member.lastName}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={[
                        'h-2.5 rounded-full transition-all duration-300',
                        index === activeIndex ? 'w-10 bg-brand-red' : 'w-2.5 bg-brand-gray-modern/50 hover:bg-brand-red/60',
                      ].join(' ')}
                      aria-label={getFullName(member)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>

          <div className="space-y-3">
            {members.map((member, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={member.id || `${member.firstName}-${member.lastName}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    'flex w-full items-center gap-4 rounded-[1.4rem] border p-3 text-left transition-all duration-200',
                    isActive
                      ? 'border-brand-red/20 bg-brand-red/5 shadow-sm'
                      : 'border-brand-gray-modern/15 bg-white hover:border-brand-red/20 hover:bg-brand-red/5',
                  ].join(' ')}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] bg-brand-gray-modern/15">
                    {member.photoUrl ? <img src={member.photoUrl} alt={getFullName(member)} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-brand-black">{getFullName(member)}</p>
                    <p className="mt-1 text-sm text-brand-red">{member.jobTitle}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-gray-dark">{member.shortDescription}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export { TeamMembersSection };