import React from "react";
import { useAppSelector } from "../../store/hooks";

export const useHasPermission = (allowedRoles: string[]) => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.roles?.some((role) => allowedRoles.includes(role)) ?? false;
};

interface HasPermissionProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const HasPermission = ({
  allowedRoles,
  children,
  fallback = null,
}: HasPermissionProps) => {
  const hasPermission = useHasPermission(allowedRoles);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default HasPermission;
