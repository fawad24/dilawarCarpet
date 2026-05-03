import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";


export default function Bilgilerim() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) return <div className="p-4">{t(UI_TEXT.loading)}</div>;
  if (!user) return <div className="p-4">{t(UI_TEXT.mustLogin)}</div>;

  return (
    <div className="mt-36 sm:mt-32 max-w-3xl mx-auto px-3 sm:px-6">
      
      <div className="bg-slate-200 shadow rounded-2xl sm:rounded-3xl p-4 sm:p-10">
        
        <h1 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          👤 {t(UI_TEXT.myInfo)}
        </h1>

        <div className="space-y-2 sm:space-y-3">
          
          <p className="bg-slate-50 rounded-xl shadow px-3 py-2 text-sm sm:text-base">
            <b>{t(UI_TEXT.firstName)}:</b> {user.firstName}
          </p>

          <p className="bg-slate-50 rounded-xl shadow px-3 py-2 text-sm sm:text-base">
            <b>{t(UI_TEXT.lastName)}:</b> {user.lastName}
          </p>

          <p className="bg-slate-50 rounded-xl shadow px-3 py-2 text-sm sm:text-base break-all">
            <b>{t(UI_TEXT.email)}:</b> {user.email}
          </p>

          <p className="bg-slate-50 rounded-xl shadow px-3 py-2 text-sm sm:text-base">
            <b>{t(UI_TEXT.phone)}:</b> {user.phone || "-"}
          </p>

          <p className="bg-slate-50 rounded-xl shadow px-3 py-2 text-sm sm:text-base">
            <b>{t(UI_TEXT.address)}:</b> {user.address || "-"}
          </p>

        </div>
      </div>
    </div>
  );
}