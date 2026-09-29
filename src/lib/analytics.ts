/** Honours Global Privacy Control: nothing is sent when the browser signals it. */
export const privacySignal = () =>
  typeof navigator !== "undefined" &&
  (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
