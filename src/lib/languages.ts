export interface Language {
  code: string;
  label: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}", nativeName: "English" },
  { code: "es", label: "Spanish", flag: "\u{1F1EA}\u{1F1F8}", nativeName: "Espa\u00f1ol" },
  { code: "fr", label: "French", flag: "\u{1F1EB}\u{1F1F7}", nativeName: "Fran\u00e7ais" },
  { code: "de", label: "German", flag: "\u{1F1E9}\u{1F1EA}", nativeName: "Deutsch" },
  { code: "pt", label: "Portuguese", flag: "\u{1F1E7}\u{1F1F7}", nativeName: "Portugu\u00eas" },
  { code: "hi", label: "Hindi", flag: "\u{1F1EE}\u{1F1F3}", nativeName: "\u0939\u093f\u0928\u094d\u0926\u0940" },
  { code: "ja", label: "Japanese", flag: "\u{1F1EF}\u{1F1F5}", nativeName: "\u65e5\u672c\u8a9e" },
  { code: "zh", label: "Chinese", flag: "\u{1F1E8}\u{1F1F3}", nativeName: "\u4e2d\u6587" },
  { code: "ar", label: "Arabic", flag: "\u{1F1F8}\u{1F1E6}", nativeName: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" },
  { code: "ko", label: "Korean", flag: "\u{1F1F0}\u{1F1F7}", nativeName: "\ud55c\uad6d\uc5b4" },
] as const;

const LANGUAGE_STORAGE_KEY = "postcraft_language";

export function getStoredLanguage(): string {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
}

export function setStoredLanguage(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
}

export function getLanguageByCode(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}
