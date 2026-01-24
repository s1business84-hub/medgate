/**
 * MedGate RBAC Middleware
 * 
 * Role-based access control for API routes.
 * Implements:
 * - JWT authentication
 * - Permission checking
 * - Tenant isolation
 * - Audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  Role,
  Permission,
  AuthenticatedUser,
  AuthContext,
  JwtPayload,
  AuthenticationError,
  AuthorizationError,
} from './types';
import { hasPermission, getPermissions, securityConfig } from './config';
import { auditAuth, auditAccessControl } from './audit';
import { generateSecureId } from './crypto';

// ============================================================================
// JWT UTILITIES
// ============================================================================

/**
 * Verify and decode a JWT token
 * 
 * In production, this would use jose or jsonwebtoken library
 * with proper RS256 signature verification.
 */
async function verifyJwt(token: string): Promise<JwtPayload> {
  try {
    // In production, verify signature with public key
    // For development, do basic decode and validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new AuthenticationError('Invalid token format');
    }

    const payloadBase64 = parts[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson) as JwtPayload;

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new AuthenticationError('Token expired');
    }

    // Check issuer
    if (payload.iss !== securityConfig.jwt.issuer) {
      throw new AuthenticationError('Invalid token issuer');
    }

    return payload;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Invalid token');
  }
}

/**
 * Create a JWT token (for authentication service)
 */
export async function createJwt(
  userId: string,
  role: Role,
  tenantId?: string,
  type: 'access' | 'refresh' = 'access'
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiry = type === 'access'
    ? securityConfig.jwt.accessTokenExpirySec
    : securityConfig.jwt.refreshTokenExpirySec;

  const payload: JwtPayload = {
    sub: userId,
    role,
    tenantId,
    sessionId: generateSecureId('sess'),
    type,
    iat: now,
    exp: now + expiry,
    iss: securityConfig.jwt.issuer,
    aud: securityConfig.jwt.audience,
  };

  // In production, sign with RS256 private key
  // For development, create unsigned token
  const header = { alg: 'RS256', typ: 'JWT' };
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = 'dev-signature'; // In production: sign with private key

  return `${headerBase64}.${payloadBase64}.${signature}`;
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Extract and verify the authentication token from request
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<AuthContext> {
  const requestId = generateSecureId('req');

  // Extract token from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7);
  const payload = await verifyJwt(token);

  // Ensure it's an access token
  if (payload.type !== 'access') {
    throw new AuthenticationError('Invalid token type');
  }

  // Build authenticated user
  const user: AuthenticatedUser = {
    id: payload.sub,
    email: '', // Would be in the token in production
    role: payload.role,
    tenantId: payload.tenantId,
    sessionId: payload.sessionId,
    permissions: getPermissions(payload.role),
  };

  // Build auth context
  const context: AuthContext = {
    user,
    requestId,
    ipAddress: request.headers.get('x-forwarded-for') 
      || request.headers.get('x-real-ip') 
      || undefined,
    userAgent: request.headers.get('user-agent') || undefined,
  };

  return context;
}

/**
 * Check if user has required permission
 */
export function checkPermission(
  user: AuthenticatedUser,
  permission: Permission
): boolean {
  return user.permissions.includes(permission);
}

/**
 * Check tenant isolation - user can only access their tenant's data
 */
export function checkTenantAccess(
  user: AuthenticatedUser,
  resourceTenantId: string
): boolean {
  // MedGate admins can access any tenant
  if (user.role === Role.MEDGATE_ADMIN || user.role === Role.MEDGATE_VERIFIER) {
    return true;
  }

  // System can access any tenant
  if (user.role === Role.SYSTEM) {
    return true;
  }

  // Others can only access their own tenant
  return user.tenantId === resourceTenantId;
}

// ============================================================================
// MIDDLEWARE WRAPPERS
// ============================================================================

/**
 * Type for protected API route handler
 */
type ProtectedRouteHandler = (
  request: NextRequest,
  context: AuthContext
) => Promise<NextResponse>;

/**
 * Create a protected API route that requires authentication
 */
export function withAuth(handler: ProtectedRouteHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const context = await authenticateRequest(request);
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        );
      }
      throw error;
    }
  };
}

/**
 * Create a protected API route that requires specific permission
 */
export function withPermission(permission: Permission, handler: ProtectedRouteHandler) {
  return withAuth(async (request: NextRequest, context: AuthContext) => {
    if (!checkPermission(context.user, permission)) {
      await auditAccessControl('denied', 'system', undefined, context, permission);
      return NextResponse.json(
        { error: 'Access denied', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    await auditAccessControl('granted', 'system', undefined, context, permission);
    return handler(request, context);
  });
}

/**
 * Create a protected API route that requires role
 */
export function withRole(roles: Role[], handler: ProtectedRouteHandler) {
  return withAuth(async (request: NextRequest, context: AuthContext) => {
    if (!roles.includes(context.user.role)) {
      await auditAccessControl('denied', 'system', undefined, context);
      return NextResponse.json(
        { error: 'Access denied', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    return handler(request, context);
  });
}

/**
 * Create a protected API route with tenant isolation
 */
export function withTenantAccess(
  getTenantId: (request: NextRequest) => string | undefined,
  handler: ProtectedRouteHandler
) {
  return withAuth(async (request: NextRequest, context: AuthContext) => {
    const resourceTenantId = getTenantId(request);
    
    if (resourceTenantId && !checkTenantAccess(context.user, resourceTenantId)) {
      await auditAccessControl('denied', 'system', resourceTenantId, context);
      return NextResponse.json(
        { error: 'Access denied to tenant', code: 'TENANT_ACCESS_DENIED' },
        { status: 403 }
      );
    }

    return handler(request, context);
  });
}

// ============================================================================
// NEXT.JS MIDDLEWARE
// ============================================================================

/**
 * Security headers to add to all responses
 */
export function securityHeaders(): HeadersInit {
  return {
    'Strict-Transport-Security': securityConfig.headers.hsts,
    'Content-Security-Policy': securityConfig.headers.contentSecurityPolicy,
    'X-Content-Type-Options': securityConfig.headers.xContentTypeOptions,
    'X-Frame-Options': securityConfig.headers.xFrameOptions,
    'X-XSS-Protection': securityConfig.headers.xXssProtection,
    'Referrer-Policy': securityConfig.headers.referrerPolicy,
  };
}

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const headers = securityHeaders();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

// ============================================================================
// RATE LIMITING (Simple implementation)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = 
    securityConfig.rateLimit.endpoints[endpoint as keyof typeof securityConfig.rateLimit.endpoints]
    || securityConfig.rateLimit;

  const now = Date.now();
  const key = `${identifier}:${endpoint}`;
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    // Start new window
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  const allowed = entry.count <= config.maxRequests;
  
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(handler: ProtectedRouteHandler) {
  return async (request: NextRequest, context: AuthContext): Promise<NextResponse> => {
    const identifier = context.user.id;
    const endpoint = new URL(request.url).pathname;
    
    const { allowed, remaining, resetTime } = checkRateLimit(identifier, endpoint);
    
    if (!allowed) {
      const response = NextResponse.json(
        { error: 'Rate limit exceeded', code: 'RATE_LIMITED' },
        { status: 429 }
      );
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
      response.headers.set('Retry-After', String(Math.ceil((resetTime - Date.now()) / 1000)));
      return response;
    }

    const response = await handler(request, context);
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
    
    return response;
  };
}

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

/**
 * Create a mock auth context for development/testing
 */
export function createMockAuthContext(
  role: Role = Role.STUDENT,
  tenantId = 'test-tenant'
): AuthContext {
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      role,
      tenantId,
      sessionId: generateSecureId('sess'),
      permissions: getPermissions(role),
    },
    requestId: generateSecureId('req'),
    ipAddress: '127.0.0.1',
    userAgent: 'Test Client',
  };
}
