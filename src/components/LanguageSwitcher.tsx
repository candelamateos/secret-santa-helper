import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full"
      aria-label="Change language"
    >
      {i18n.language === 'en' ? (
        <span className="text-2xl">🇪🇸</span>
      ) : (
        <span className="text-2xl">🇬🇧</span>
      )}
    </Button>
  );
};

export default LanguageSwitcher;
