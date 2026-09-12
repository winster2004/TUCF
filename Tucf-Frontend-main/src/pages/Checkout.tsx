import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, CreditCard, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { getPricingPlan } from "../lib/plans";
import { setStoredUserPlan } from "../lib/plan";
import {
  getSubscriptionStatus,
  SubscriptionApiError,
  upgradeToPro,
  upgradeToStarter,
} from "../api/subscription";
import "./Landing.css";
import "./Upgrade.css";

const TEST_CARD = "4242424242424242";

type CheckoutState = "idle" | "processing" | "success";

const isFutureExpiry = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const rawYear = Number(match[2]);
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const expiryEnd = new Date(year, month, 0, 23, 59, 59, 999);
  return expiryEnd > now;
};

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = useMemo(
    () => getPricingPlan(searchParams.get("plan")),
    [searchParams],
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [error, setError] = useState("");
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [processingStep, setProcessingStep] = useState("Securing checkout");

  const handlePayment = async (event: FormEvent) => {
    event.preventDefault();

    const cleanCard = cardNumber.replace(/\D/g, "");
    if (cleanCard !== TEST_CARD) {
      setError("Enter the approved 16-digit test card number.");
      return;
    }

    if (!isFutureExpiry(expiry)) {
      setError("Enter an expiry date later than the current month.");
      return;
    }

    if (cvc.trim() !== "666") {
      setError("Enter the approved CVC.");
      return;
    }

    setError("");
    setCheckoutState("processing");
    setProcessingStep("Securing checkout");

    try {
      setProcessingStep("Verifying payment");
      console.log("[PAYMENT SUCCESS]", {
        step: "payment-verified",
        planId: plan.id,
        userEmail: user?.email ?? null,
      });

      const response =
        plan.id === "starter" ? await upgradeToStarter() : await upgradeToPro();
      console.log("[UPGRADE API RESPONSE]", {
        endpoint:
          plan.id === "starter"
            ? "/subscription/upgrade/starter"
            : "/subscription/upgrade/pro",
        role: response.role,
        message: response.message ?? null,
      });

      setProcessingStep("Upgrading account");

      if (response.role === "STARTER") {
        setStoredUserPlan("PRO_99");
      } else if (response.role === "PRO") {
        setStoredUserPlan("PRO_499");
      } else {
        setStoredUserPlan("FREE");
      }

      if (user?.email) {
        localStorage.setItem(
          "tucf-subscription",
          JSON.stringify({
            plan: plan.id,
            amount: plan.price,
            paidAt: new Date().toISOString(),
          }),
        );
      }

      window.dispatchEvent(new Event("auth-changed"));
      window.dispatchEvent(new Event("trial-state-changed"));

      const statusAfterUpgrade = await getSubscriptionStatus();
      console.log("[PAYMENT SUCCESS]", {
        step: "status-verified-after-upgrade",
        role: statusAfterUpgrade.role,
        message: statusAfterUpgrade.message ?? null,
      });

      setCheckoutState("success");
    } catch (error) {
      if (error instanceof SubscriptionApiError && error.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      if (error instanceof SubscriptionApiError && error.status === 403) {
        setError(error.message);
      } else if (error instanceof SubscriptionApiError) {
        setError(error.message);
      } else {
        setError("Payment failed. Please try again.");
      }

      setCheckoutState("idle");
      setProcessingStep("Securing checkout");
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    if (checkoutState !== "success") {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1200);

    return () => window.clearTimeout(redirectTimer);
  }, [checkoutState, navigate]);

  return (
    <div className="landing-page checkout-page">
      <header className="landing-topbar">
        <Link className="landing-brand" to="/">
          <BrandLogo />
        </Link>

        <div className="landing-actions">
          <ThemeToggle />
          <Link to="/upgrade" className="landing-outline-button">
            <ArrowLeft size={18} />
            Plans
          </Link>
        </div>
      </header>

      <main className="checkout-shell">
        <section className="checkout-copy">
          <span className="landing-pricing-name">Secure Checkout</span>
          <h1>Complete your {plan.name} upgrade.</h1>
          <p>
            Finish your payment to unlock the full TUCF dashboard for this
            account.
          </p>

          <div className="checkout-plan-summary">
            <span>{plan.name}</span>
            <strong>Rs {plan.price}</strong>
            <small>Paid dashboard access</small>
          </div>
        </section>

        <form className="checkout-card" onSubmit={handlePayment}>
          <AnimatePresence mode="wait">
            {checkoutState === "success" ? (
              <motion.div
                key="success"
                className="checkout-success"
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.98 }}
                transition={{ duration: 0.42 }}
              >
                <div className="checkout-confetti" aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, index) => (
                    <span key={index}></span>
                  ))}
                </div>
                <motion.div
                  className="checkout-success-check"
                  initial={{ scale: 0.4, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 360, damping: 18 }}
                >
                  <Check size={46} />
                </motion.div>
                <h2>Payment succeeded</h2>
                <p>
                  You have paid Rs {plan.price}. Your account is now upgraded.
                </p>
                <button
                  type="button"
                  className="landing-solid-button checkout-dashboard-button"
                  onClick={goToDashboard}
                >
                  Go to Dashboard
                </button>
              </motion.div>
            ) : checkoutState === "processing" ? (
              <motion.div
                key="processing"
                className="checkout-processing"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.3 }}
              >
                <div className="checkout-loader-ring">
                  <span></span>
                </div>
                <h2>{processingStep}</h2>
                <p>
                  Please keep this page open while we complete your upgrade.
                </p>
                <div className="checkout-dots" aria-label="Processing payment">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28 }}
              >
                <div className="checkout-card-head">
                  <CreditCard size={22} />
                  <div>
                    <h2>Payment Details</h2>
                    <p>Enter your card details to continue.</p>
                  </div>
                </div>

                <label>
                  <span>Name on card</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                  />
                </label>

                <label>
                  <span>Card number</span>
                  <input
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    inputMode="numeric"
                    placeholder="Card number"
                    maxLength={19}
                  />
                </label>

                <div className="checkout-row">
                  <label>
                    <span>Expiry</span>
                    <input
                      value={expiry}
                      onChange={(event) => setExpiry(event.target.value)}
                      placeholder="MM/YY"
                    />
                  </label>
                  <label>
                    <span>CVC</span>
                    <input
                      value={cvc}
                      onChange={(event) => setCvc(event.target.value)}
                      placeholder="CVC"
                      maxLength={4}
                    />
                  </label>
                </div>

                {error ? <p className="checkout-error">{error}</p> : null}

                <button
                  type="submit"
                  className="landing-solid-button checkout-pay-button"
                  disabled={checkoutState === "processing"}
                >
                  Pay Rs {plan.price}
                </button>

                <div className="checkout-secure-note">
                  <ShieldCheck size={16} />
                  Payment completion unlocks your subscribed dashboard.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
