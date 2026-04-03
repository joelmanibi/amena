import Link from 'next/link';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';

async function NotFoundPage() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);

  return (
    <div className="page-shell bg-white">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top,rgba(241,106,111,0.14),transparent_35%),#ffffff] px-8 py-14 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-black">{copy.notFound.title}</h1>
          <p className="mt-4 text-base leading-7 text-brand-gray-dark">{copy.notFound.description}</p>
          <Link href="/" className="btn-brand-primary mt-8">
            {copy.notFound.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
