import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { prisma } from '$lib/server/db';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = await prisma.sessions.create({
		data: {
			id: sessionId,
			user_id: userId,
			expires_at: new Date(Date.now() + DAY_IN_MS * 30),
		},
	});
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = await prisma.sessions.findUnique({
		where: { id: sessionId },
		include: { users: true }, // Include user data
	});

	if (!session) {
		return { session: null, user: null };
	}

	const sessionExpired = Date.now() >= session.expires_at.getTime();
	if (sessionExpired) {
		await prisma.sessions.delete({ where: { id: session.id } });
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expires_at.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expires_at = new Date(Date.now() + DAY_IN_MS * 30);
		await prisma.sessions.update({
			where: { id: session.id },
			data: { expires_at: session.expires_at },
		});
	}

	const user = await prisma.users.findUnique({
		where: { id: session.user_id },
		include: {
			images: true,
			user_permissions: true,
		},
	});

	return { session, user: user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await prisma.sessions.delete({ where: { id: sessionId } });
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/',
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/',
	});
}