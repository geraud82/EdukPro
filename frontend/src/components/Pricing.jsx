import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Rocket, 
  Building2, 
  Check, 
  Sparkles 
} from 'lucide-react';
import './Pricing.css';

function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      icon: <Sprout size={32} />,
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for small schools getting started',
      features: [
        'Up to 50 students',
        'Up to 5 teachers',
        '3 classes maximum',
        'Basic fee management',
        'Email support',
        'Student enrollment',
        'Parent portal access'
      ],
      highlighted: false,
      buttonText: 'Get Started',
      buttonStyle: 'btn-secondary'
    },
    {
      name: 'Professional',
      icon: <Rocket size={32} />,
      price: '$49',
      period: 'per month',
      description: 'Ideal for growing educational institutions',
      features: [
        'Up to 500 students',
        'Unlimited teachers',
        'Unlimited classes',
        'Advanced fee management',
        'Invoice generation & PDF export',
        'Email notifications',
        'Priority email support',
        'Real-time messaging',
        'Analytics dashboard',
        'Multi-school support'
      ],
      highlighted: true,
      buttonText: 'Start Free Trial',
      buttonStyle: 'btn-primary',
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      icon: <Building2 size={32} />,
      price: 'Custom',
      period: 'Contact us',
      description: 'For large institutions with special needs',
      features: [
        'Unlimited students',
        'Unlimited teachers',
        'Unlimited classes',
        'Custom features',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone & email support',
        'On-premise deployment option',
        'Custom branding',
        'Advanced security features',
        'Training & onboarding'
      ],
      highlighted: false,
      buttonText: 'Contact Sales',
      buttonStyle: 'btn-enterprise'
    }
  ];

  const faqs = [
    {
      question: 'Can I try before I buy?',
      answer: 'Yes! We offer a 14-day free trial on our Professional plan with no credit card required. You can explore all features and decide if it\'s right for you.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we\'ll prorate any differences.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also use purchase orders.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard encryption, secure data centers, and regular backups. Your data is protected with bank-level security and we\'re fully GDPR compliant.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Save 20% when you choose annual billing instead of monthly. Contact our sales team for custom pricing on multi-year contracts.'
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer: 'We\'ll notify you when you\'re approaching your limits. You can upgrade to a higher plan at any time, or contact us to discuss custom solutions.'
    }
  ];

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <div className="pricing-hero">
        <div className="container">
          <h1 className="pricing-title">
            Simple, Transparent Pricing
          </h1>
          <p className="pricing-subtitle">
            Choose the perfect plan for your educational institution
          </p>
          <div className="pricing-badge">
            <Sparkles size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
            No hidden fees · Cancel anytime · 14-day money-back guarantee
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container">
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card ${plan.highlighted ? 'pricing-card-highlighted' : ''}`}
            >
              {plan.badge && (
                <div className="pricing-badge-popular">{plan.badge}</div>
              )}
              
              <div className="pricing-card-header">
                <div className="pricing-icon">{plan.icon}</div>
                <h3 className="pricing-plan-name">{plan.name}</h3>
                <p className="pricing-description">{plan.description}</p>
              </div>

              <div className="pricing-card-price">
                <div className="price-amount">{plan.price}</div>
                <div className="price-period">{plan.period}</div>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="pricing-feature">
                    <span className="feature-check"><Check size={18} /></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn ${plan.buttonStyle} pricing-button`}
                onClick={() => {
                  if (plan.name === 'Enterprise') {
                    window.location.href = 'mailto:sales@educkpro.com';
                  } else {
                    navigate('/signup');
                  }
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="trust-section">
          <h3 className="trust-title">Trusted by Educational Institutions Worldwide</h3>
          <div className="trust-stats">
            <div className="trust-stat">
              <div className="trust-stat-number">10,000+</div>
              <div className="trust-stat-label">Active Users</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">500+</div>
              <div className="trust-stat-label">Schools</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">50+</div>
              <div className="trust-stat-label">Countries</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">99.9%</div>
              <div className="trust-stat-label">Uptime</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="pricing-cta">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-subtitle">
            Join thousands of schools already using EduckPro to streamline their operations
          </p>
          <div className="cta-buttons">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/signup')}
            >
              Start Free Trial
            </button>
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
