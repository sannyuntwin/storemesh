type Role = "BUYER" | "SELLER" | "ADMIN";

interface AuthzUserShape {
  role?: string | null;
  provider?: string | null;
}

const isSellerRole = (role: string | null | undefined): boolean => {
  return role === "SELLER" || role === "ADMIN";
};

export const canAccessSellerPortal = (user: AuthzUserShape | null | undefined): boolean => {
  if (!user) {
    return false;
  }

  if (isSellerRole(user.role)) {
    return true;
  }

  // Backward compatibility for existing demo-credentials sessions created before role propagation.
  return user.provider === "credentials";
};

export type { Role };
