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

function buildRedirectUrl(status, message) {
  return `/contact?submission=${status}&message=${encodeURIComponent(message)}`;
}

function extractApiErrorMessage(payload, fallbackMessage) {
  if (Array.isArray(payload?.errors) && payload.errors.length) {
    return payload.errors[0]?.msg || fallbackMessage;
  }

  return payload?.message || fallbackMessage;
}

export async function submitContactAction(formData) {
  const payload = {
    fullName: requiredString(formData, 'fullName'),
    email: requiredString(formData, 'email'),
    phone: optionalString(formData, 'phone'),
    company: optionalString(formData, 'company'),
    subject: requiredString(formData, 'subject'),
    message: requiredString(formData, 'message'),
  };

  let redirectUrl = buildRedirectUrl('success', '');

  try {
    const response = await fetch(`${API_BASE_URL}/contact-messages`, {
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
        'error',
        extractApiErrorMessage(responseBody, 'Impossible d’envoyer votre message pour le moment.')
      );
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    const errorMessage = error.message === 'fetch failed' 
      ? 'Le serveur backend est injoignable. Vérifiez qu’il est bien démarré.' 
      : (error?.message || 'Impossible de joindre le service de contact pour le moment.');
    redirectUrl = buildRedirectUrl('error', errorMessage);
  }

  redirect(redirectUrl);
}
