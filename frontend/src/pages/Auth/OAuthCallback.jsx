import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../app/providers/AppProvider";
import { handleOAuthCallback } from "../../services/auth.service";
import Loader from "../../components/ui/Loader";

/**
 * /auth/callback
 * Google redirects here after OAuth with ?token=...&user=...
 * We parse, save, update context, redirect.
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userRaw = params.get("user");

    if (!token || !userRaw) {
      navigate("/login?error=oauth_failed");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      const authData = handleOAuthCallback({ token, user });
      login(authData);
      navigate("/patterns");
    } catch {
      navigate("/login?error=oauth_failed");
    }
  }, []);

  return (
    <section className="flex min-h-[80vh] items-center justify-center">
      <Loader label="Signing you in with Google…" />
    </section>
  );
};

export default OAuthCallback;
