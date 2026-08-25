import { Navigate } from "react-router-dom";
import { useLanguage } from "../../lib/i18n/LanguageContext";

/**
 * Legacy ContributorDashboardPage component.
 * Redirects automatically to the official /write submission portal.
 */
export default function ContributorDashboardPage() {
  const { getLocalizedPath } = useLanguage();
  return <Navigate to={getLocalizedPath("/write")} replace />;
}
