"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, MessageSquare, CheckCircle, AlertCircle, Phone, MapPin, Globe } from "lucide-react";
import emailjs from "@emailjs/browser";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        "sui-patent", // Service ID
        "template_lbya4d8", // Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "fnbKmn2L89JNbJpTn" // Public Key
      );

      setNotification({ type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to send message. Try again later." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-[#4da2ff]/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4da2ff]/3 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#4da2ff]/10 rounded-full mb-8">
            <div className="w-2 h-2 bg-[#4da2ff] rounded-full mr-3 animate-pulse"></div>
            <span className="text-[#4da2ff] font-clash font-medium text-sm tracking-wide">
              Get in Touch
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-clash font-light text-gray-900 mb-4">
            Contact <span className="text-[#4da2ff] font-medium">Us</span>
          </h1>
          <p className="text-xl text-gray-600 font-clash font-light leading-relaxed max-w-3xl mx-auto">
            Have questions? Reach out and we’ll respond promptly to assist you.
          </p>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-12 rounded-2xl p-6 max-w-3xl mx-auto ${
                notification.type === "success"
                  ? "bg-[#4da2ff]/5 border border-[#4da2ff]/30 text-[#4da2ff]"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                {notification.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-clash font-medium">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Form + Company Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative z-10">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#4da2ff]/10 rounded-2xl flex items-center justify-center z-20">
                <div className="w-8 h-8 bg-[#4da2ff] rounded-lg"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#4da2ff]/20 to-transparent rounded-xl"></div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2 font-clash">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4da2ff] text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 font-clash"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2 font-clash">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4da2ff] text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 font-clash"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2 font-clash">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span>Message</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4da2ff] text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 font-clash"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-2xl text-white font-clash font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#4da2ff] hover:bg-[#3d91ef] shadow-lg hover:shadow-xl hover:shadow-[#4da2ff]/25"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Company Details */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 flex flex-col justify-center space-y-6 relative">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#4da2ff]/10 rounded-2xl flex items-center justify-center z-20">
                <div className="w-8 h-8 bg-[#4da2ff] rounded-lg"></div>
              </div>
              <h2 className="text-2xl font-clash font-semibold text-gray-800 mb-4">Company Details</h2>

              <p className="flex items-center space-x-3 text-gray-700 font-clash font-light">
                <Mail className="w-5 h-5 text-[#4da2ff]" />
                <a href="mailto:fortiv.pvt.ltd@gmail.com" className="hover:underline">
                  fortiv.pvt.ltd@gmail.com
                </a>
              </p>

              <p className="flex items-center space-x-3 text-gray-700 font-clash font-light">
                <Phone className="w-5 h-5 text-[#4da2ff]" />
                <span>+91 9876543210</span>
              </p>

              <p className="flex items-center space-x-3 text-gray-700 font-clash font-light">
                <MapPin className="w-5 h-5 text-[#4da2ff]" />
                <span>Chennai, Tamil Nadu, India</span>
              </p>

              <p className="flex items-center space-x-3 text-gray-700 font-clash font-light">
                <Globe className="w-5 h-5 text-[#4da2ff]" />
                <a href="https://www.fortiv.com" target="_blank" className="hover:underline">
                  www.fortiv.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;