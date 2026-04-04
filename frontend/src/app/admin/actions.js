'use server';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ADMIN_ROLES, clearAdminSession, setAdminSession } from '@/lib/admin-auth';
import { adminRequest, loginAdmin } from '@/lib/admin-api';
import { getSiteCopy } from '@/lib/site-copy';

const ARTICLE_UPLOAD_DIRECTORY = path.join(process.cwd(), 'public', 'uploads', 'articles');
const ARTICLE_UPLOAD_PUBLIC_PATH = '/uploads/articles';
const TEAM_UPLOAD_DIRECTORY = path.join(process.cwd(), 'public', 'uploads', 'team');
const TEAM_UPLOAD_PUBLIC_PATH = '/uploads/team';
const IMAGE_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function requiredString(formData, key) {
  return String(formData.get(key) || '').trim();
}


function optionalString(formData, key) {
  const value = requiredString(formData, key);
  return value || undefined;
}

function nullableString(formData, key) {
  const value = requiredString(formData, key);
  return value || null;
}

function rawStringValue(formData, key) {
  const value = formData.get(key);
  return value == null ? '' : String(value);
}

function jsonValue(formData, key, label) {
  const value = rawStringValue(formData, key).trim();

  if (!value) {
    throw new Error(`${label} ne peut pas être vide.`);
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${label} doit être un JSON valide.`);
  }
}

function jsonObjectValue(formData, key, label) {
  const value = requiredString(formData, key);

  if (!value) {
    return {};
  }

  let parsedValue;

  try {
    parsedValue = JSON.parse(value);
  } catch {
    throw new Error(`${label} doit être un JSON valide.`);
  }

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    throw new Error(`${label} doit être un objet JSON.`);
  }

  return parsedValue;
}

function booleanValue(formData, key) {
  return formData.get(key) === 'on';
}

function numberValue(formData, key) {
  const value = requiredString(formData, key);
  return value ? Number(value) : undefined;
}

function isoDateValue(formData, key) {
  const value = requiredString(formData, key);
  return value ? new Date(value).toISOString() : undefined;
}

function numberArray(formData, key) {
  return formData
    .getAll(key)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);
}

function refreshAdmin(...paths) {
  paths.forEach((path) => revalidatePath(path));
}

function normalizeNextPath(value) {
  const candidate = typeof value === 'string' ? value : '/admin';
  return candidate.startsWith('/admin') ? candidate : '/admin';
}

function isRedirectError(error) {
  return typeof error?.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT');
}

function buildActionErrorMessage(error, fallbackMessage) {
  if (Array.isArray(error?.errors) && error.errors.length) {
    return error.errors
      .map((item) => item?.msg)
      .filter(Boolean)
      .join(' ');
  }

  return error?.message || fallbackMessage;
}

export async function loginAction(formData) {
  const email = requiredString(formData, 'email');
  const password = requiredString(formData, 'password');
  const nextPath = normalizeNextPath(formData.get('next'));

  try {
    const payload = await loginAdmin({ email, password });
    if (!ADMIN_ROLES.includes(payload?.user?.role)) {
      throw new Error('Ce compte n’est pas autorisé à accéder au tableau de bord administrateur.');
    }

    await setAdminSession(payload.token);
  } catch (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message || 'Échec de la connexion.')}&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}

export async function createArticleAction(formData) {
  await adminRequest('/articles', { method: 'POST', body: await buildArticlePayload(formData) });
  refreshAdmin('/admin', '/admin/articles');
}

export async function updateArticleAction(formData) {
  await adminRequest(`/articles/${requiredString(formData, 'id')}`, { method: 'PUT', body: await buildArticlePayload(formData) });
  refreshAdmin('/admin', '/admin/articles');
}

export async function deleteArticleAction(formData) {
  await adminRequest(`/articles/${requiredString(formData, 'id')}`, { method: 'DELETE' });
  refreshAdmin('/admin', '/admin/articles');
}

export async function createCategoryAction(formData) {
  await adminRequest('/categories', { method: 'POST', body: buildCategoryPayload(formData) });
  refreshAdmin('/admin', '/admin/articles', '/admin/categories');
}

export async function updateCategoryAction(formData) {
  await adminRequest(`/categories/${requiredString(formData, 'id')}`, { method: 'PUT', body: buildCategoryPayload(formData) });
  refreshAdmin('/admin', '/admin/articles', '/admin/categories');
}

export async function deleteCategoryAction(formData) {
  await adminRequest(`/categories/${requiredString(formData, 'id')}`, { method: 'DELETE' });
  refreshAdmin('/admin', '/admin/articles', '/admin/categories');
}

export async function createTrainingAction(formData) {
  await adminRequest('/trainings', { method: 'POST', body: buildTrainingPayload(formData) });
  refreshAdmin('/admin', '/admin/trainings', '/admin/sessions');
}

export async function updateTrainingAction(formData) {
  await adminRequest(`/trainings/${requiredString(formData, 'id')}`, { method: 'PUT', body: buildTrainingPayload(formData) });
  refreshAdmin('/admin', '/admin/trainings', '/admin/sessions');
}

export async function deleteTrainingAction(formData) {
  await adminRequest(`/trainings/${requiredString(formData, 'id')}`, { method: 'DELETE' });
  refreshAdmin('/admin', '/admin/trainings', '/admin/sessions');
}

export async function createSessionAction(formData) {
  await adminRequest(`/trainings/${requiredString(formData, 'programId')}/sessions`, { method: 'POST', body: buildSessionPayload(formData) });
  refreshAdmin('/admin', '/admin/trainings', '/admin/sessions', '/admin/registrations');
}

export async function updateSessionAction(formData) {
  await adminRequest(`/training-sessions/${requiredString(formData, 'id')}`, { method: 'PUT', body: buildSessionPayload(formData) });
  refreshAdmin('/admin', '/admin/trainings', '/admin/sessions', '/admin/registrations');
}

export async function deleteSessionAction(formData) {
  await adminRequest(`/training-sessions/${requiredString(formData, 'id')}`, { method: 'DELETE' });
  refreshAdmin('/admin', '/admin/trainings', '/admin/sessions', '/admin/registrations');
}

export async function updateRegistrationStatusAction(formData) {
  await adminRequest(`/registrations/${requiredString(formData, 'id')}/status`, {
    method: 'PATCH',
    body: { status: requiredString(formData, 'status') },
  });
  refreshAdmin('/admin', '/admin/registrations');
}

export async function updateContactMessageAction(formData) {
  await adminRequest(`/contact-messages/${requiredString(formData, 'id')}`, {
    method: 'PATCH',
    body: { status: requiredString(formData, 'status') },
  });
  refreshAdmin('/admin', '/admin/contact-messages');
}

export async function deleteContactMessageAction(formData) {
  await adminRequest(`/contact-messages/${requiredString(formData, 'id')}`, { method: 'DELETE' });
  refreshAdmin('/admin', '/admin/contact-messages');
}

export async function createTeamMemberAction(formData) {
  await adminRequest('/team-members', { method: 'POST', body: await buildTeamMemberPayload(formData, { photoRequired: true }) });
  refreshAdmin('/admin', '/admin/team');
  revalidatePath('/');
  revalidatePath('/about');
}

export async function updateTeamMemberAction(formData) {
  await adminRequest(`/team-members/${requiredString(formData, 'id')}`, {
    method: 'PUT',
    body: await buildTeamMemberPayload(formData),
  });
  refreshAdmin('/admin', '/admin/team');
  revalidatePath('/');
  revalidatePath('/about');
}

export async function deleteTeamMemberAction(formData) {
  await adminRequest(`/team-members/${requiredString(formData, 'id')}`, { method: 'DELETE' });
  refreshAdmin('/admin', '/admin/team');
  revalidatePath('/');
  revalidatePath('/about');
}

export async function updateCompanySettingsAction(formData) {
  try {
    await adminRequest('/company-profile', {
      method: 'PUT',
      body: buildCompanySettingsPayload(formData),
    });

    refreshAdmin('/admin');
    revalidatePath('/', 'layout');
    revalidatePath('/contact');
    revalidatePath('/news');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirect(
      `/admin?companySettings=error&message=${encodeURIComponent(
        buildActionErrorMessage(error, 'Impossible de mettre à jour les coordonnées société.')
      )}`
    );
  }

  redirect('/admin?companySettings=success&message=Les%20coordonn%C3%A9es%20ont%20%C3%A9t%C3%A9%20mises%20%C3%A0%20jour%20avec%20succ%C3%A8s.');
}

export async function updateSiteContentAction(formData) {
  try {
    await adminRequest('/site-content', {
      method: 'PUT',
      body: await buildSiteContentPayload(formData),
    });

    refreshAdmin('/admin');
    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/services');
    revalidatePath('/news');
    revalidatePath('/trainings');
    revalidatePath('/contact');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirect(
      `/admin?siteContent=error&siteContentMessage=${encodeURIComponent(
        buildActionErrorMessage(error, 'Impossible de mettre à jour le contenu éditorial du site.')
      )}`
    );
  }

  redirect('/admin?siteContent=success&siteContentMessage=Le%20contenu%20%C3%A9ditorial%20a%20%C3%A9t%C3%A9%20mis%20%C3%A0%20jour%20avec%20succ%C3%A8s.');
}

async function buildArticlePayload(formData) {
  return {
    title: requiredString(formData, 'title'),
    slug: optionalString(formData, 'slug'),
    excerpt: optionalString(formData, 'excerpt'),
    content: requiredString(formData, 'content'),
    featuredImageUrl: await resolveArticleFeaturedImageUrl(formData),
    status: requiredString(formData, 'status') || 'draft',
    seoTitle: optionalString(formData, 'seoTitle'),
    seoDescription: optionalString(formData, 'seoDescription'),
    publishedAt: isoDateValue(formData, 'publishedAt'),
    categoryIds: numberArray(formData, 'categoryIds'),
  };
}

async function resolveArticleFeaturedImageUrl(formData) {
  const uploadedImageUrl = await uploadArticleImage(formData.get('featuredImageFile'));
  if (uploadedImageUrl) {
    return uploadedImageUrl;
  }

  return optionalString(formData, 'featuredImageUrl');
}

async function uploadArticleImage(file) {
  return uploadImageFile(file, {
    uploadDirectory: ARTICLE_UPLOAD_DIRECTORY,
    publicPath: ARTICLE_UPLOAD_PUBLIC_PATH,
  });
}

async function buildTeamMemberPayload(formData, { photoRequired = false } = {}) {
  return {
    firstName: requiredString(formData, 'firstName'),
    lastName: requiredString(formData, 'lastName'),
    photoUrl: await resolveTeamMemberPhotoUrl(formData, { photoRequired }),
    jobTitle: requiredString(formData, 'jobTitle'),
    shortDescription: requiredString(formData, 'shortDescription'),
    sortOrder: numberValue(formData, 'sortOrder') ?? 0,
    isActive: booleanValue(formData, 'isActive'),
  };
}

async function resolveTeamMemberPhotoUrl(formData, { photoRequired = false } = {}) {
  const uploadedImageUrl = await uploadTeamMemberPhoto(formData.get('photoFile'));
  if (uploadedImageUrl) {
    return uploadedImageUrl;
  }

  const existingPhotoUrl = optionalString(formData, 'existingPhotoUrl');
  if (existingPhotoUrl) {
    return existingPhotoUrl;
  }

  if (photoRequired) {
    throw new Error('Veuillez uploader une photo pour le membre de l’équipe.');
  }

  return undefined;
}

async function uploadTeamMemberPhoto(file) {
  return uploadImageFile(file, {
    uploadDirectory: TEAM_UPLOAD_DIRECTORY,
    publicPath: TEAM_UPLOAD_PUBLIC_PATH,
  });
}

async function uploadImageFile(file, { uploadDirectory, publicPath }) {
  if (!file || typeof file !== 'object' || typeof file.arrayBuffer !== 'function') {
    return undefined;
  }

  if (!file.size) {
    return undefined;
  }

  const extension = IMAGE_MIME_TYPES[file.type];
  if (!extension) {
    throw new Error('Le fichier image doit être au format JPG, PNG, WEBP, GIF ou AVIF.');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('L’image ne doit pas dépasser 5 MB.');
  }

  await mkdir(uploadDirectory, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, fileBuffer);

  return `${publicPath}/${fileName}`;
}

function buildCategoryPayload(formData) {
  return {
    name: requiredString(formData, 'name'),
    slug: optionalString(formData, 'slug'),
    description: optionalString(formData, 'description'),
    sortOrder: numberValue(formData, 'sortOrder') ?? 0,
    isActive: booleanValue(formData, 'isActive'),
  };
}

function buildTrainingPayload(formData) {
  return {
    title: requiredString(formData, 'title'),
    slug: optionalString(formData, 'slug'),
    summary: optionalString(formData, 'summary'),
    description: requiredString(formData, 'description'),
    audience: optionalString(formData, 'audience'),
    deliveryMode: requiredString(formData, 'deliveryMode') || 'onsite',
    durationText: optionalString(formData, 'durationText'),
    price: numberValue(formData, 'price'),
    currency: requiredString(formData, 'currency') || 'USD',
    status: requiredString(formData, 'status') || 'draft',
  };
}

function buildSessionPayload(formData) {
  return {
    sessionTitle: requiredString(formData, 'sessionTitle'),
    sessionCode: optionalString(formData, 'sessionCode'),
    startDate: isoDateValue(formData, 'startDate'),
    endDate: isoDateValue(formData, 'endDate'),
    location: optionalString(formData, 'location'),
    capacity: numberValue(formData, 'capacity') ?? 1,
    registrationDeadline: isoDateValue(formData, 'registrationDeadline'),
    status: requiredString(formData, 'status') || 'open',
  };
}

function buildCompanySettingsPayload(formData) {
  return {
    address: nullableString(formData, 'address'),
    email: nullableString(formData, 'email'),
    phone: nullableString(formData, 'phone'),
    websiteUrl: nullableString(formData, 'websiteUrl'),
    facebookUrl: nullableString(formData, 'facebookUrl'),
    linkedinUrl: nullableString(formData, 'linkedinUrl'),
    instagramUrl: nullableString(formData, 'instagramUrl'),
  };
}

async function buildSiteContentPayload(formData) {
  if (hasStructuredSiteContentFields(formData)) {
    return buildStructuredSiteContentPayload(formData);
  }

  const sectionKeys = formData
    .getAll('siteContentSectionKey')
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  if (sectionKeys.length) {
    return {
      fr: buildLocalizedSiteContentPayload(formData, 'fr', sectionKeys),
      en: buildLocalizedSiteContentPayload(formData, 'en', sectionKeys),
    };
  }

  return {
    fr: jsonObjectValue(formData, 'siteContentFr', 'Le contenu FR'),
    en: jsonObjectValue(formData, 'siteContentEn', 'Le contenu EN'),
  };
}

async function buildStructuredSiteContentPayload(formData) {
  const [siteCopyFr, siteCopyEn] = await Promise.all([getSiteCopy('fr'), getSiteCopy('en')]);

  return {
    fr: applyStructuredSiteContentEntries(siteCopyFr, formData, 'fr'),
    en: applyStructuredSiteContentEntries(siteCopyEn, formData, 'en'),
  };
}

function hasStructuredSiteContentFields(formData) {
  for (const key of formData.keys()) {
    if (String(key).startsWith('siteContentField__')) {
      return true;
    }
  }

  return false;
}

function applyStructuredSiteContentEntries(baseContent, formData, locale) {
  const nextContent = JSON.parse(JSON.stringify(baseContent || {}));
  const prefix = `siteContentField__${locale}__`;

  for (const [key, value] of formData.entries()) {
    const normalizedKey = String(key);

    if (!normalizedKey.startsWith(prefix)) {
      continue;
    }

    setPathValue(nextContent, normalizedKey.slice(prefix.length), String(value ?? ''));
  }

  return nextContent;
}

function setPathValue(target, path, value) {
  const segments = String(path).split('.').filter(Boolean);
  let current = target;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const isLast = index === segments.length - 1;
    const nextSegment = segments[index + 1];
    const segmentIsIndex = isNumericSegment(segment);
    const nextContainer = isNumericSegment(nextSegment) ? [] : {};

    if (isLast) {
      if (Array.isArray(current) && segmentIsIndex) {
        current[Number(segment)] = value;
      } else {
        current[segment] = value;
      }

      return;
    }

    if (Array.isArray(current) && segmentIsIndex) {
      const arrayIndex = Number(segment);

      if (current[arrayIndex] == null || typeof current[arrayIndex] !== 'object') {
        current[arrayIndex] = nextContainer;
      }

      current = current[arrayIndex];
      continue;
    }

    if (current[segment] == null || typeof current[segment] !== 'object') {
      current[segment] = nextContainer;
    }

    current = current[segment];
  }
}

function isNumericSegment(value) {
  return /^[0-9]+$/.test(String(value));
}

function buildLocalizedSiteContentPayload(formData, locale, sectionKeys) {
  return sectionKeys.reduce((payload, key) => {
    const fieldType = requiredString(formData, `siteContentSectionType__${key}`) || 'json';
    const sectionLabel = requiredString(formData, `siteContentSectionLabel__${key}`) || key;
    const fieldName = `siteContentSection__${locale}__${key}`;

    payload[key] =
      fieldType === 'string'
        ? rawStringValue(formData, fieldName)
        : jsonValue(formData, fieldName, `${sectionLabel} (${locale.toUpperCase()})`);

    return payload;
  }, {});
}