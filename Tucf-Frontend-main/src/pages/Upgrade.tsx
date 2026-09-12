import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import { pricingPlans } from "../lib/plans";
import { usePlanState } from "../hooks/usePlanState";
import { type TucfPlan } from "../lib/plan";
import "./Landing.css";
import "./Upgrade.css";

type FeedbackState = { type: "success" | "error"; message: string } | null;

const toSubscriptionRole = (plan: TucfPlan) => {
  if (plan === "starter") {
    return "STARTER" as const;
  }

  if (plan === "complete" || plan === "pro") {
    return "PRO" as const;
  }

  return "FREE" as const;
};

const Upgrade: React.FC = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const plan = usePlanState();
  const role = toSubscriptionRole(plan);
  const isTrial = plan === "trial_active";

  const isStarterDisabled = role === "STARTER" || role === "PRO";
  const isProDisabled = role === "PRO";

  return (
    <div className="landing-page upgrade-page">
      <header className="landing-topbar">
        <Link className="landing-brand" to="/">
          <BrandLogo />
        </Link>

        <div className="landing-actions">
          <ThemeToggle />
          <Link to="/dashboard" className="landing-outline-button">
            <ArrowLeft size={18} />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="landing-pricing upgrade-pricing">
        <div className="landing-section-top landing-pricing-top">
          <div className="landing-section-title">
            <span>Upgrade Your</span>
            <span>Preparation</span>
            <strong>Workspace</strong>
          </div>
          <p className="landing-section-copy">
            Pick a plan, complete checkout, and TUCF will unlock the full
            subscribed dashboard for your current account.
          </p>
          <div className="upgrade-role-wrap">
            <span className="upgrade-role-badge">
              Current plan: {isTrial ? "2-Day Trial Active" : role}
            </span>
          </div>
          {feedback ? (
            <p
              className={`upgrade-feedback ${feedback.type === "error" ? "error" : "success"}`}
            >
              {feedback.message}
            </p>
          ) : null}
        </div>

        <div className="landing-pricing-grid">
          {pricingPlans.map((plan, index) => {
            const isDisabled =
              plan.id === "starter" ? isStarterDisabled : isProDisabled;

            return (
              <motion.article
                key={plan.id}
                className={`landing-pricing-card ${plan.highlighted ? "featured" : ""}`}
                initial={{ opacity: 0, y: 36, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {plan.highlighted ? (
                  <span className="landing-pricing-ribbon">Best Value</span>
                ) : null}

                <div className="landing-pricing-head">
                  <span className="landing-pricing-name">{plan.name}</span>
                  <div className="landing-pricing-price">
                    <sup>Rs</sup>
                    <strong>{plan.price}</strong>
                  </div>
                  <p>{plan.note}</p>
                </div>

                <ul className="landing-pricing-features">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className={!feature.included ? "muted" : ""}
                    >
                      <span className="landing-pricing-icon">
                        {feature.included ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </span>
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => navigate(`/checkout?plan=${plan.id}`)}
                  disabled={isDisabled}
                  className={`landing-pricing-button ${
                    plan.highlighted
                      ? "landing-solid-button"
                      : "landing-outline-button"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.article>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Upgrade;
