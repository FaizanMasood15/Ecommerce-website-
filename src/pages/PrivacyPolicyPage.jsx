import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <>
      <div className="py-24 text-center bg-background-light border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.12em] uppercase font-medium text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-900 text-xs tracking-[0.1em] uppercase">
            Home <span className="font-semibold text-primary"> &gt; Privacy Policy</span>
          </p>
        </div>
      </div>

      <section className="py-16 bg-[#efefef]">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <div className="bg-white border border-stone-200 p-8 space-y-6 text-sm text-gray-700">
            <p>
              We value your privacy and only collect information necessary to process orders,
              provide customer support, and improve your shopping experience.
            </p>
            <p>
              Information we may collect includes your name, email, phone number, shipping address,
              and payment details. Payment data is handled securely by our payment providers.
            </p>
            <p>
              We do not sell or share your personal information with third parties for marketing.
              We only share data with trusted partners required to fulfill your order.
            </p>
            <p>
              If you have questions about your data or wish to request changes, please contact us
              through the Contact page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
