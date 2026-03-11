import React from 'react';

const ReturnsPage = () => {
  return (
    <>
      <div className="py-24 text-center bg-background-light border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.12em] uppercase font-medium text-gray-900 mb-2">
            Returns
          </h1>
          <p className="text-gray-900 text-xs tracking-[0.1em] uppercase">
            Home <span className="font-semibold text-primary"> &gt; Returns</span>
          </p>
        </div>
      </div>

      <section className="py-16 bg-[#efefef]">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <div className="bg-white border border-stone-200 p-8 space-y-6 text-sm text-gray-700">
            <p>
              If you need to return an item, please contact us within 7 days of delivery.
              Items must be unused and in their original packaging.
            </p>
            <p>
              Return shipping costs are the responsibility of the customer unless the item is
              defective or incorrect. Once we receive and inspect the return, we will process
              your refund or exchange.
            </p>
            <p>
              For return requests, please provide your order number and the reason for return
              via the Contact page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReturnsPage;
