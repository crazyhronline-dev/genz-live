'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import StaticPage from '@/components/layout/StaticPage';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <StaticPage title="Contact Us" subtitle="We read every message. Reach out for news tips, press inquiries, or feedback.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <Mail className="w-5 h-5 text-brand-blue" />, label: 'General Enquiries', value: 'hello@genz-live.com' },
          { icon: <MessageSquare className="w-5 h-5 text-brand-purple" />, label: 'News Tips', value: 'tips@genz-live.com' },
          { icon: <MapPin className="w-5 h-5 text-brand-cyan" />, label: 'Press & Media', value: 'press@genz-live.com' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="section-card text-center">
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-white mt-1">{value}</p>
          </div>
        ))}
      </div>

      {sent ? (
        <div className="section-card text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-white font-bold text-lg">Message sent!</h3>
          <p className="text-slate-400 text-sm">Our team will get back to you within 24–48 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="section-card space-y-4">
          <h2 style={{ marginTop: 0 }}>Send a Message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'contact-name', label: 'Your Name', type: 'text', key: 'name' as const },
              { id: 'contact-email', label: 'Email Address', type: 'email', key: 'email' as const },
            ].map(({ id, label, type, key }) => (
              <div key={key} className="space-y-1">
                <label htmlFor={id} className="text-xs font-semibold text-slate-400">{label}</label>
                <input
                  id={id}
                  type={type}
                  required
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full bg-navy-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-400">Subject</label>
            <input
              id="contact-subject"
              type="text"
              required
              value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              className="w-full bg-navy-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="contact-message" className="text-xs font-semibold text-slate-400">Message</label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full bg-navy-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple transition-colors resize-none"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Sending…' : <><Send className="w-4 h-4" /> Send Message</>}
          </button>
        </form>
      )}
    </StaticPage>
  );
}
