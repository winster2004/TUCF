import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { loginUser, registerUser } from "../api/api";
import { setStoredUserPlan } from "../lib/plan";
import { getSubscriptionStatus } from "../api/subscription";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const buildUserData = (
    nameValue: string,
    emailValue: string,
    roleValue?: string,
  ) => {
    const normalizedEmail = emailValue.trim().toLowerCase();
    return {
      id:
        normalizedEmail.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
        "user",
      name: nameValue.trim() || "User",
      email: normalizedEmail,
      role: roleValue,
    };
  };

  const completeAuthSession = (
    accessToken: string,
    authUser: { name?: string; email?: string; role?: string } | undefined,
  ) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem(
      "userData",
      JSON.stringify(
        buildUserData(
          authUser?.name || name,
          authUser?.email || email,
          authUser?.role,
        ),
      ),
    );

    setStoredUserPlan("FREE");
    window.dispatchEvent(new Event("auth-changed"));
    setError("");
    navigate("/dashboard");
  };

  const syncPlanFromSubscription = async () => {
    try {
      const status = await getSubscriptionStatus();
      if (status.role === "PRO") {
        setStoredUserPlan("PRO_499");
        return;
      }

      if (status.role === "STARTER") {
        setStoredUserPlan("PRO_99");
        return;
      }

      setStoredUserPlan("FREE");
    } catch {
      setStoredUserPlan("FREE");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const registerResponse = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      let accessToken = registerResponse.access_token;
      let authUser = registerResponse.user;

      if (!accessToken) {
        const loginResponse = await loginUser({
          email: email.trim(),
          password,
        });
        accessToken = loginResponse.access_token;
        authUser = loginResponse.user ?? authUser;
      }

      if (!accessToken) {
        throw new Error(
          "Registration succeeded but login token was not received.",
        );
      }

      completeAuthSession(accessToken, authUser);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      const isUserExistsConflict = /already exists/i.test(errorMessage);

      if (isUserExistsConflict) {
        try {
          const loginResponse = await loginUser({
            email: email.trim(),
            password,
          });
          if (!loginResponse.access_token) {
            throw new Error("Login failed. Token not received.");
          }

          completeAuthSession(loginResponse.access_token, loginResponse.user);
          return;
        } catch {
          setError(
            "User already exists. Please sign in with your existing password.",
          );
          return;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <span className="text-white font-bold text-lg">CP</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: "#2f2c2a" }}>
            Create your account
          </h2>
          <p className="mt-2" style={{ color: "#5a6673" }}>
            Join CareerPro and accelerate your career
          </p>
        </div>

        <form className="mt-8 space-y-6 tucf-card" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
                style={{ color: "#5a6673" }}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5" style={{ color: "#8a7562" }} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: "#5a6673" }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: "#8a7562" }} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: "#5a6673" }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: "#8a7562" }} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: "#8a7562" }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: "#8a7562" }} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
                style={{ color: "#5a6673" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: "#8a7562" }} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: "#8a7562" }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: "#8a7562" }} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div
              className="text-sm text-center"
              style={{ color: "var(--accent)" }}
            >
              {error}
            </div>
          )}

          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded mt-1"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm"
              style={{ color: "#2f2c2a" }}
            >
              I agree to the{" "}
              <button type="button" style={{ color: "var(--accent)" }}>
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" style={{ color: "var(--accent)" }}>
                Privacy Policy
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all tucf-btn-primary"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm" style={{ color: "#5a6673" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium"
                style={{ color: "var(--accent)" }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
