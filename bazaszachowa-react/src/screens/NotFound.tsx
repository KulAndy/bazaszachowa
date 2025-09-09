import Content from "../components/Content";
import { useI18n } from "../i18n/I18nContext";
const NotFound = () => {
  const { t } = useI18n();
  return (
    <Content>
      <h1 className="error">{t("not_found")}</h1>
    </Content>
  );
};

export default NotFound;
