export const UI_COPY = {
  student: {
    exposureTitle: 'Exposure Acknowledgement',
    exposureDescription: 'I confirm I have read and understand the exposure guidance and accept responsibility for completing required precautions.',
    exposureCheckbox: 'I confirm this exposure and accept responsibility',
    acknowledgeButton: 'Acknowledge & Sign',
    acknowledgedMessage: 'Acknowledgement recorded. Thank you.',
    startTrainingBlockedSupervisor: 'Action blocked: please obtain supervisor confirmation for this student or program.',
    startTrainingBlockedExposure: 'Action blocked: exposure acknowledgement required before starting training.',
    startTrainingSuccess: 'Training started — your status is now In Training.',
    startTrainingButtonTooltip: 'Start Training — requires supervisor confirmation and regulatory verification',
    applyButton: 'Apply for this Program →',
    acknowledgeToApply: 'Acknowledge Exposure to Apply',
    applicationSubmittedTitle: 'Application Submitted!',
    submitApplicationButton: 'Submit Application',
  },
  supervisor: {
    confirmationTitle: 'Supervisor Confirmation',
    confirmationDescription: 'Please confirm you will supervise this student for the listed exposures and scope.',
    confirmationSuccessToast: 'Supervisor confirmation recorded.',
    attestSuccessToast: 'Completion attestation recorded.',
    selectSupervisorBeforeConfirm: 'Select a supervisor before confirming',
    selectSupervisorBeforeAttest: 'Select a supervisor before attesting',
  },
  admin: {
    acceptLabel: 'Accept Application',
    deferLabel: 'Defer Application',
    declineLabel: 'Decline Application',
    assignSupervisorLabel: 'Assign Supervisor',
    assignDepartmentLabel: 'Assign Department',
    ehsAllocationButton: 'Create EHS Allocation',
    ehsAllocationSuccessToast: 'EHS allocation created and student notified.',
    assignmentSaved: 'Assignment saved',
    programConfirmed: 'Program-level supervisor confirmation recorded',
  },
  generic: {
    saved: 'Saved successfully.',
    error: 'An error occurred — try again or contact support.',
  }
} as const;

export default UI_COPY;
