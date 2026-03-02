import { useAppStore } from "../store";
import { translations, Language } from "../translations";

export function useTranslation() {
  const { language, setLanguage } = useAppStore();

  const t = translations[language];

  return { t, language, setLanguage };
}
