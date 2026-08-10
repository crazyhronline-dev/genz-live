import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-12 bg-slate-950/80 border-t border-white/5 relative overflow-hidden">
      <div className="container">
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 shadow-2xl">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Stay Ahead of the Curve
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold text-white">
              Join <span className="gradient-text">100,000+ GenZ Readers</span> Worldwide
            </h2>

            <p className="text-sm text-slate-300">
              Get raw, unfiltered daily briefings on Tech, AI, World Events, Business, and Culture directly delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl flex items-center justify-center gap-3 text-emerald-300 font-bold text-sm animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>You're subscribed! Welcome to the GenZ Live community.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/90 border border-white/15 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-full shadow-lg shadow-purple-900/40 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>Subscribe Now</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <p className="text-[11px] text-slate-500">
              No spam. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
