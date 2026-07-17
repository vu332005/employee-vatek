import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { App } from "antd";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { t } = useTranslation();

  const hasRole = user?.roles?.some((role) => allowedRoles.includes(role));

  useEffect(() => {
    if (isAuthenticated && !hasRole) {
      message.error(t("common.unauthorized"));

      // check if there is history to go back to.
      // if user directly typed the URL on a new tab, history index will be 0.
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate("/employees", { replace: true });
      }
    }
  }, [isAuthenticated, hasRole, navigate, message, t]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole) {
    return null;
  }

  return <>{children}</>;
};

export default RoleRoute;
