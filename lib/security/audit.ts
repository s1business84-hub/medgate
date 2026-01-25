/**
 * MedGate Audit Logging Service
 * 
 * Comprehensive audit logging for security and compliance.
 * Logs all security-relevant events with actor, action, resource, and outcome.
 * 
 * Features:
 * - Structured logging for easy querying
 * - Batched writes for performance
 * - Alert rule evaluation
 * - Privacy-preserving IP hashing
 */

import {
  AuditLogEntry,
  AuditAction,
  AuditOutcome,
  AuditSeverity,
  AuditAlertRule,
  Role,
  AuthContext,
} from './types';
import { securityConfig, defaultAuditAlertRules } from './config';
import { generateSecureId, hashIpAddress } from './crypto';

// ============================================================================
// AUDIT LOGGER
// ============================================================================

export class AuditLogger {
  private buffer: AuditLogEntry[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private alertRules: AuditAlertRule[];
  private recentEvents: Map<string, { count: number; firstSeen: number }> = new Map();

  constructor(alertRules: AuditAlertRule[] = defaultAuditAlertRules) {
    this.alertRules = alertRules;
    
    // Start periodic flush
    this.scheduleFlush();
  }

  /**
   * Log a security event
   */
  async log(params: {
    action: AuditAction;
    outcome: AuditOutcome;
    resourceType: AuditLogEntry['resourceType'];
    resourceId?: string;
    context?: AuthContext;
    tenantId?: string;
    subjectId?: string;
    reasonCode?: string;
    metadata?: Record<string, string | number | boolean>;
    errorCode?: string;
    errorMessage?: string;
    severity?: AuditSeverity;
  }): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: generateSecureId('aud'),
      timestamp: new Date().toISOString(),
      
      // Actor
      actorId: params.context?.user.id ?? 'system',
      actorRole: params.context?.user.role ?? Role.SYSTEM,
      actorIpHash: params.context?.ipAddress 
        ? await hashIpAddress(params.context.ipAddress)
        : undefined,
      actorUserAgent: params.context?.userAgent,
      
      // Action
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      
      // Context
      tenantId: params.tenantId ?? params.context?.user.tenantId,
      subjectId: params.subjectId,
      reasonCode: params.reasonCode,
      metadata: params.metadata,
      
      // Outcome
      outcome: params.outcome,
      errorCode: params.errorCode,
      errorMessage: params.errorMessage,
      
      // Tracing
      sessionId: params.context?.user.sessionId,
      requestId: params.context?.requestId,
      
      // Classification
      severity: params.severity ?? this.calculateSeverity(params.action, params.outcome),
    };

    // Add to buffer
    this.buffer.push(entry);

    // Check alert rules
    await this.checkAlertRules(entry);

    // Flush if buffer is full
    if (this.buffer.length >= securityConfig.audit.batchSize) {
      await this.flush();
    }

    return entry;
  }

  /**
   * Log authentication events
   */
  async logAuth(
    action: 'auth:login' | 'auth:logout' | 'auth:token_refresh' | 'auth:login_failed' | 'auth:mfa_challenged' | 'auth:mfa_verified',
    outcome: AuditOutcome,
    context?: AuthContext,
    metadata?: Record<string, string | number | boolean>
  ): Promise<AuditLogEntry> {
    return this.log({
      action,
      outcome,
      resourceType: 'session',
      context,
      metadata,
      severity: action === 'auth:login_failed' ? 'warning' : 'info',
    });
  }

  /**
   * Log document access events
   */
  async logDocumentAccess(
    action: 'document:upload_initiated' | 'document:viewed' | 'document:decrypted' | 'document:downloaded' | 'document:verified' | 'document:rejected' | 'document:deleted',
    documentId: string,
    outcome: AuditOutcome,
    context: AuthContext,
    metadata?: Record<string, string | number | boolean>
  ): Promise<AuditLogEntry> {
    return this.log({
      action,
      outcome,
      resourceType: 'document',
      resourceId: documentId,
      context,
      metadata,
      severity: action === 'document:deleted' ? 'warning' : 'info',
    });
  }

  /**
   * Log encryption/decryption events
   */
  async logEncryption(
    action: 'encryption:data_encrypted' | 'encryption:data_decrypted' | 'encryption:key_generated' | 'encryption:key_wrapped' | 'encryption:key_unwrapped',
    resourceType: AuditLogEntry['resourceType'],
    resourceId: string | undefined,
    outcome: AuditOutcome,
    context?: AuthContext,
    metadata?: Record<string, string | number | boolean>
  ): Promise<AuditLogEntry> {
    return this.log({
      action,
      outcome,
      resourceType,
      resourceId,
      context,
      metadata,
    });
  }

  /**
   * Log access control events
   */
  async logAccessControl(
    outcome: 'granted' | 'denied',
    resourceType: AuditLogEntry['resourceType'],
    resourceId: string | undefined,
    context: AuthContext,
    permission?: string
  ): Promise<AuditLogEntry> {
    return this.log({
      action: outcome === 'granted' ? 'access:granted' : 'access:denied',
      outcome: outcome === 'granted' ? 'success' : 'denied',
      resourceType,
      resourceId,
      context,
      metadata: permission ? { permission } : undefined,
      severity: outcome === 'denied' ? 'warning' : 'info',
    });
  }

  /**
   * Log admin actions
   */
  async logAdminAction(
    action: 'admin:user_created' | 'admin:user_updated' | 'admin:role_changed' | 'admin:export_initiated' | 'admin:export_completed' | 'admin:key_rotated',
    resourceId: string | undefined,
    context: AuthContext,
    metadata?: Record<string, string | number | boolean>
  ): Promise<AuditLogEntry> {
    return this.log({
      action,
      outcome: 'success',
      resourceType: action.includes('export') ? 'system' : action.includes('key') ? 'key' : 'user',
      resourceId,
      context,
      metadata,
      severity: 'info',
    });
  }

  /**
   * Flush buffered logs to storage
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const entries = [...this.buffer];
    this.buffer = [];

    try {
      // In production, write to CloudWatch Logs, database, or log aggregation service
      // await this.writeToCloudWatch(entries);
      // await this.writeToDatabase(entries);
      
      // For now, write to console in structured format
      for (const entry of entries) {
        console.log(JSON.stringify({
          level: entry.severity,
          type: 'audit',
          ...entry,
        }));
      }
    } catch (error) {
      // On error, put entries back in buffer
      this.buffer.unshift(...entries);
      console.error('Failed to flush audit logs:', error);
    }
  }

  /**
   * Query audit logs (for admin interface)
   */
  async query(params: {
    tenantId?: string;
    actorId?: string;
    action?: AuditAction;
    resourceType?: AuditLogEntry['resourceType'];
    resourceId?: string;
    startTime?: string;
    endTime?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLogEntry[]> {
    // In production, this would query the database or log aggregation service
    // For now, return empty array
    return [];
  }

  /**
   * Get audit summary for a resource
   */
  async getResourceAuditSummary(
    resourceType: AuditLogEntry['resourceType'],
    resourceId: string
  ): Promise<{
    totalEvents: number;
    lastAccess?: string;
    accessCount: number;
    uniqueActors: number;
  }> {
    // In production, aggregate from database
    return {
      totalEvents: 0,
      accessCount: 0,
      uniqueActors: 0,
    };
  }

  // ============================================================================
  // ALERT HANDLING
  // ============================================================================

  /**
   * Check if any alert rules are triggered
   */
  private async checkAlertRules(entry: AuditLogEntry): Promise<void> {
    for (const rule of this.alertRules) {
      if (this.ruleMatches(rule, entry)) {
        await this.evaluateAlertThreshold(rule, entry);
      }
    }
  }

  /**
   * Check if an entry matches a rule's criteria
   */
  private ruleMatches(rule: AuditAlertRule, entry: AuditLogEntry): boolean {
    // Check action
    if (!rule.actions.includes(entry.action)) {
      return false;
    }

    // Check conditions
    if (rule.conditions) {
      if (rule.conditions.outcome && entry.outcome !== rule.conditions.outcome) {
        return false;
      }
      if (rule.conditions.actorRole && entry.actorRole !== rule.conditions.actorRole) {
        return false;
      }
      if (rule.conditions.tenantId && entry.tenantId !== rule.conditions.tenantId) {
        return false;
      }
    }

    return true;
  }

  /**
   * Evaluate if alert threshold is reached
   */
  private async evaluateAlertThreshold(
    rule: AuditAlertRule,
    entry: AuditLogEntry
  ): Promise<void> {
    const key = `${rule.id}:${entry.actorId}`;
    const now = Date.now();
    const windowStart = now - rule.windowSeconds * 1000;

    // Get or create tracking entry
    let tracking = this.recentEvents.get(key);
    
    if (!tracking || tracking.firstSeen < windowStart) {
      // Start new window
      tracking = { count: 1, firstSeen: now };
    } else {
      // Increment within window
      tracking.count++;
    }

    this.recentEvents.set(key, tracking);

    // Check threshold
    if (tracking.count >= rule.threshold) {
      await this.triggerAlert(rule, entry, tracking.count);
      // Reset tracking after alert
      this.recentEvents.delete(key);
    }

    // Cleanup old tracking entries periodically
    if (Math.random() < 0.01) {
      this.cleanupTracking(windowStart);
    }
  }

  /**
   * Trigger an alert
   */
  private async triggerAlert(
    rule: AuditAlertRule,
    entry: AuditLogEntry,
    count: number
  ): Promise<void> {
    const alert = {
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      triggeredBy: entry.id,
      actorId: entry.actorId,
      tenantId: entry.tenantId,
      count,
      threshold: rule.threshold,
      windowSeconds: rule.windowSeconds,
      timestamp: new Date().toISOString(),
    };

    console.warn(`🚨 SECURITY ALERT: ${rule.name}`, JSON.stringify(alert));

    // In production, send to notification channels
    // for (const channel of rule.notifyChannels) {
    //   await this.notify(channel, alert);
    // }
  }

  /**
   * Cleanup old tracking entries
   */
  private cleanupTracking(cutoff: number): void {
    const keysToDelete: string[] = [];
    this.recentEvents.forEach((tracking, key) => {
      if (tracking.firstSeen < cutoff) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.recentEvents.delete(key));
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Calculate severity based on action and outcome
   */
  private calculateSeverity(action: AuditAction, outcome: AuditOutcome): AuditSeverity {
    if (outcome === 'failure') {
      return 'error';
    }
    if (outcome === 'denied') {
      return 'warning';
    }
    if (action.startsWith('admin:')) {
      return 'info';
    }
    if (action.includes('delete') || action.includes('decrypt')) {
      return 'info';
    }
    return 'info';
  }

  /**
   * Schedule periodic flush
   */
  private scheduleFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    this.flushTimer = setTimeout(async () => {
      await this.flush();
      this.scheduleFlush();
    }, securityConfig.audit.flushIntervalMs);
  }

  /**
   * Shutdown the logger (flush remaining logs)
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let auditLoggerInstance: AuditLogger | null = null;

export function getAuditLogger(): AuditLogger {
  if (!auditLoggerInstance) {
    auditLoggerInstance = new AuditLogger();
  }
  return auditLoggerInstance;
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Log an audit event
 */
export async function audit(
  params: Parameters<AuditLogger['log']>[0]
): Promise<AuditLogEntry> {
  return getAuditLogger().log(params);
}

/**
 * Log authentication event
 */
export async function auditAuth(
  ...args: Parameters<AuditLogger['logAuth']>
): Promise<AuditLogEntry> {
  return getAuditLogger().logAuth(...args);
}

/**
 * Log document access event
 */
export async function auditDocumentAccess(
  ...args: Parameters<AuditLogger['logDocumentAccess']>
): Promise<AuditLogEntry> {
  return getAuditLogger().logDocumentAccess(...args);
}

/**
 * Log encryption event
 */
export async function auditEncryption(
  ...args: Parameters<AuditLogger['logEncryption']>
): Promise<AuditLogEntry> {
  return getAuditLogger().logEncryption(...args);
}

/**
 * Log access control event
 */
export async function auditAccessControl(
  ...args: Parameters<AuditLogger['logAccessControl']>
): Promise<AuditLogEntry> {
  return getAuditLogger().logAccessControl(...args);
}

/**
 * Log admin action
 */
export async function auditAdminAction(
  ...args: Parameters<AuditLogger['logAdminAction']>
): Promise<AuditLogEntry> {
  return getAuditLogger().logAdminAction(...args);
}
