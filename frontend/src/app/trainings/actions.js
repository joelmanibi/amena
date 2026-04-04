'use server';

import { redirect } from 'next/navigation';

const API_BASE_URL = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

function requiredString(formData, key) {
  const value = formData.get(key);
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Le champ ${key} est requis.`);
  }

  return value.trim();
}

function optionalString(formData, key) {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function buildRedirectUrl(trainingSlug, status, message) {
  return `/trainings/${encodeURIComponent(trainingSlug)}?registration=${status}&message=${encodeURIComponent(message)}`;
}

function extractApiErrorMessage(payload, fallbackMessage) {
  if (Array.isArray(payload?.errors) && payload.errors.length) {
    return payload.errors[0]?.msg || fallbackMessage;
  }

  return payload?.message || fallbackMessage;
}

export async function submitTrainingRegistrationAction(formData) {
  const trainingSlug = requiredString(formData, 'trainingSlug');
  const payload = {
    sessionId: Number(requiredString(formData, 'sessionId')),
    fullName: requiredString(formData, 'fullName'),
    email: requiredString(formData, 'email'),
    phone: optionalString(formData, 'phone'),
    company: optionalString(formData, 'company'),
    jobTitle: optionalString(formData, 'jobTitle'),
    message: optionalString(formData, 'message'),
  };

  let redirectUrl = buildRedirectUrl(trainingSlug, 'success', 'Votre demande d’inscription a été envoyée avec succès.');

  try {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      redirectUrl = buildRedirectUrl(
        trainingSlug,
        'error',
        extractApiErrorMessage(responseBody, 'Impossible d’envoyer votre inscription pour le moment.')
      );
    }
  } catch (error) {
    redirectUrl = buildRedirectUrl(trainingSlug, 'error', error?.message || 'Impossible de joindre le service d’inscription pour le moment.');
  }

  redirect(redirectUrl);
}