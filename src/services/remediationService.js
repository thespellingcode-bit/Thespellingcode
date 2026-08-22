// src/services/remediationService.js
import { getRemediationByErrorTag } from "./contentService";
import { primaryErrorTag } from "./assessmentService";

// Given the error tags collected from a failed assessment attempt, return
// the remediation content record to show the child/parent. Falls back to
// null (caller should handle "no remediation content found" — an
// EDUCATIONAL REVIEW REQUIRED case, not something to paper over silently).
export function pickRemediation(errorTags) {
  const tag = primaryErrorTag(errorTags);
  if (!tag) return null;
  return getRemediationByErrorTag(tag);
}
