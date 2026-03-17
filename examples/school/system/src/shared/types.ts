// =============================================================================
// DERA Shared Types
// Base types used across all entities in the system.
// Derived from: paper/dera_data_model.md
// =============================================================================

// -----------------------------------------------------------------------------
// EventRequest — Part 1 of the DERA data model
// -----------------------------------------------------------------------------

export type EventRequestStatus = 'Received' | 'Processing' | 'Completed' | 'Failed';

export interface IncomingEvent<TInput = unknown> {
  eventId: string;
  traceId: string;
  correlationId: string;
  actorId: string;
  eventType: string;
  entityId?: string;       // undefined for NewEntry events
  eventInput: TInput;      // full payload stored for bug reproduction
}

// -----------------------------------------------------------------------------
// EventResult — Part 4 of the DERA data model
// Returned to the actor as the HTTP response body.
// -----------------------------------------------------------------------------

export type EventOutcome = 'Success' | 'ValidationFailure' | 'NoAction' | 'SystemError';

export interface ValidationError {
  field: string;
  code: string;
  message: string;
}

export interface EventResult<TData = unknown> {
  eventId: string;
  outcome: EventOutcome;
  code: string;
  message: string;
  data?: TData;
  failedValidations?: ValidationError[];
  warnings?: Array<{ code: string; message: string }>;
  traceId: string;
  executedAt: string;      // ISO 8601
  durationMs: number;
}

// -----------------------------------------------------------------------------
// ChangeLog — Part 3 of the DERA data model
// One record per field changed per event. Written by actions on success.
// -----------------------------------------------------------------------------

export interface ChangeLogEntry {
  entityType: string;
  entityId: string;
  field: string;
  oldValue: string | null;
  newValue: string;
  actorId: string;
}

// -----------------------------------------------------------------------------
// ActionContext
// Passed to every action. Contains the full event plus derived context.
// -----------------------------------------------------------------------------

export interface ActionContext<TInput = unknown> {
  event: IncomingEvent<TInput>;
  startedAt: Date;
}

// -----------------------------------------------------------------------------
// Action result types
// Actions return these internally before being mapped to EventResult.
// -----------------------------------------------------------------------------

export type ActionSuccess<TData = unknown> = {
  outcome: 'Success';
  code: string;
  message: string;
  data: TData;
  changeLogs: ChangeLogEntry[];
  warnings?: Array<{ code: string; message: string }>;
};

export type ActionValidationFailure = {
  outcome: 'ValidationFailure';
  code: string;
  message: string;
  failedValidations: ValidationError[];
};

export type ActionNoAction = {
  outcome: 'NoAction';
  code: string;
  message: string;
};

export type ActionResult<TData = unknown> =
  | ActionSuccess<TData>
  | ActionValidationFailure
  | ActionNoAction;

// -----------------------------------------------------------------------------
// ErrorLog helpers — Part 5 of the DERA data model
// -----------------------------------------------------------------------------

export interface ErrorLogEntry {
  eventId?: string;
  errorType: string;
  errorMessage: string;
  stackTrace: string;
  serviceName: string;
  entityType?: string;
  entityId?: string;
  environment: string;
}
