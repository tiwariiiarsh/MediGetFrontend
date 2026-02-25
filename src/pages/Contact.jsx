import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#04111d] flex items-center justify-center px-6 py-20 text-white">

      <div className="w-full max-w-6xl bg-[#0f172a]/70 backdrop-blur-xl 
                      border border-white/10 rounded-3xl shadow-2xl p-12">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-14">
          Get in Touch with{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            MediCare
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT SIDE INFO */}
          <div className="space-y-8">

            <div>
              <h3 className="text-2xl font-semibold text-emerald-400 mb-3">
                Contact Information
              </h3>
              <p className="text-gray-400">
                Need help with medicines, orders, or pharmacy partnerships?
                Our team is available 24/7 to support your healthcare needs.
              </p>
            </div>

            <div className="space-y-4 text-gray-300">
              <p><strong>📍 Address:</strong> 221 Healthcare Street, Mumbai, India</p>
              <p><strong>📧 Email:</strong> support@medicare.com</p>
              <p><strong>📞 Phone:</strong> +91 98765 43210</p>
              <p><strong>⏰ Working Hours:</strong> 24/7 Support Available</p>
            </div>

            {/* Glow Box */}
            <div className="bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 
                            border border-emerald-400/20 
                            rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                Emergency Support
              </h4>
              <p className="text-gray-400 text-sm">
                For urgent medical queries, contact our priority support line.
                We ensure fast response for emergency medicine requests.
              </p>
            </div>

          </div>

          {/* RIGHT SIDE FORM */}
          <form className="space-y-6">

            <div>
              <label className="block mb-2 text-gray-300">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-[#04111d] border border-white/10 
                           rounded-xl text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[#04111d] border border-white/10 
                           rounded-xl text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Your Message</label>
              <textarea
                rows="5"
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-[#04111d] border border-white/10 
                           rounded-xl text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-emerald-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-black
                         bg-gradient-to-r from-emerald-400 to-cyan-400
                         hover:scale-105 transition duration-300
                         shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              Send Message
            </button>

          </form>

        </div>
      </div>

    </div>
  );
};

export default Contact;