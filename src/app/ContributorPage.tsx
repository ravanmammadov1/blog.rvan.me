import { Navigate } from "react-router-dom";
import { useLanguage } from "../lib/i18n/LanguageContext";

/**
 * Legacy ContributorPage component.
 * Redirects automatically to the official /write submission portal.
 */
export default function ContributorPage() {
  const { getLocalizedPath } = useLanguage();
  return <Navigate to={getLocalizedPath("/write")} replace />;
}
