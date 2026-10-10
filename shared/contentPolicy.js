// Source metadata must be recorded after a human/content audit of the original document.
export function eligibleForStudy(q) {
 const source = q.provenance;
 return ['history','geography'].includes(q.subject) && Number.isInteger(q.grade) && q.grade >= 4 && q.grade <= 12 &&
  source?.verified === true && ['textbook','official-exam'].includes(source.kind) &&
  source.curriculum === 'pre-2018' && Boolean(source.title && source.issuer && source.documentUrl && source.locator) &&
  (source.kind !== 'textbook' || Boolean(source.edition));
}
export const CONTENT_POLICY = {
 study: { sources:['textbook','official-exam'], curriculum:'pre-2018', verifiedRequired:true },
 explore: { topics:['culture','landscape','history','heritage','resistance','local-specialty'], localOnly:true },
 ranked: { topics:'all', levels:['foundation','intermediate','advanced'], count:30 },
};
