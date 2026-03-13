"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
      alert("Message received. We will be in touch shortly.");
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative w-full py-24 md:py-32 px-4 md:px-12 bg-background z-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Initiate <span className="text-gradient">Protocol</span>
          </h2>
          <p className="opacity-70 text-lg">Secure your digital future. Drop us a line below.</p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="w-full"
        >
          <GlassCard className="p-8 md:p-12 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium opacity-80 uppercase tracking-widest pl-2">Client Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-black/5 dark:bg-white/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all font-mono text-sm placeholder:opacity-40"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium opacity-80 uppercase tracking-widest pl-2">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full bg-black/5 dark:bg-white/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all font-mono text-sm placeholder:opacity-40"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium opacity-80 uppercase tracking-widest pl-2">Secure Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-black/5 dark:bg-white/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all font-mono text-sm placeholder:opacity-40"
                  placeholder="client@domain.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium opacity-80 uppercase tracking-widest pl-2">Project Details</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required
                  rows={4}
                  className="w-full bg-black/5 dark:bg-white/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all font-mono text-sm placeholder:opacity-40 resize-none"
                  placeholder="Outline your vision..."
                />
              </div>

              <div className="pt-4 flex justify-end">
                <ButtonWithIconDemo 
                  type="submit"
                  disabled={isSubmitting}
                  className={isSubmitting ? "opacity-70 pointer-events-none" : ""}
                  text={isSubmitting ? "Transmitting..." : "Send Secure Message"} 
                />
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
