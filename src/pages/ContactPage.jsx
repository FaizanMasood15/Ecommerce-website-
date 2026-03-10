import React from 'react';

const ContactPage = () => {
  return (
    <>
      <div className="py-24 text-center bg-background-light border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.12em] uppercase font-medium text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-gray-900 text-xs tracking-[0.1em] uppercase">
            Home <span className="font-semibold text-primary"> &gt; Contact</span>
          </p>
        </div>
      </div>

      <section className="py-16 bg-[#efefef]">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 p-8">
            <h2 className="font-display text-2xl md:text-3xl tracking-[0.08em] uppercase text-[#0b1f47] mb-6">
              Get In Touch
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Address:</span> Sialkot, Punjab, Pakistan
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{' '}
                <a href="mailto:faizanbutt15@yahoo.com" className="underline underline-offset-2">
                  faizanbutt15@yahoo.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900">Phone:</span> 03027959570
              </p>
              <p>
                <span className="font-semibold text-gray-900">Working Hours:</span> Mon - Sat, 10:00 AM - 7:00 PM
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-8">
            <h3 className="text-sm tracking-[0.12em] uppercase font-semibold text-gray-900 mb-6">Send Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs tracking-[0.08em] uppercase text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full h-12 border border-stone-300 px-4 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.08em] uppercase text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 border border-stone-300 px-4 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.08em] uppercase text-gray-500 mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message"
                  className="w-full border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
              <button
                type="button"
                className="border border-black text-black hover:bg-black hover:text-white text-xs tracking-[0.14em] uppercase font-semibold py-3 px-6 transition duration-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
