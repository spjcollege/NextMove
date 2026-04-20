import { useState } from "react";
import "../index.css";

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="page animate-fade-in">
      <header className="section-header">
        <div>
          <h2>🎧 Customer Support</h2>
          <p style={{ color: "var(--text-secondary)" }}>We're here to help you with your moves.</p>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Support Options */}
        <div>
          <h3 style={{ marginBottom: "24px" }}>Frequently Asked Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { q: "How do I track my order?", a: "You can track your order in your profile under the 'Orders' tab." },
              { q: "What is the return policy?", a: "We offer a 7-day return policy for unused products in original packaging." },
              { q: "How are loyalty points calculated?", a: "You earn 1 point for every ₹100 spent. 1 point = ₹1 discount." },
              { q: "Can I participate in tournaments for free?", a: "Basic tournaments are free, while 'Grandmaster' tier events may require a fee." }
            ].map((faq, i) => (
              <div key={i} className="card-glass" style={{ padding: "16px" }}>
                <p style={{ fontWeight: "700", marginBottom: "8px" }}>{faq.q}</p>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: "32px" }}>
          <h3>Contact Us</h3>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontSize: "3rem" }}>✅</p>
              <h4 style={{ marginTop: "16px" }}>Message Sent!</h4>
              <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>Our support team will get back to you within 24 hours.</p>
              <button className="btn btn-outline" style={{ marginTop: "24px" }} onClick={() => setSubmitted(false)}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ marginTop: "24px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Subject</label>
                <select className="form-control" style={{ width: "100%", padding: "12px", background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", borderRadius: "8px", color: "var(--text-primary)" }}>
                  <option>Order Issue</option>
                  <option>Tournament Inquiry</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Message</label>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  placeholder="How can we help?"
                  style={{ width: "100%", padding: "12px", background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", borderRadius: "8px", color: "var(--text-primary)" }}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>Send Message</button>
            </form>
          )}

          <div style={{ marginTop: "32px", paddingTop: "32px", borderTop: "1px solid var(--border-subtle)" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)" }}>Email: support@nextmove.com</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)" }}>Phone: +91 98765 43210</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)" }}>Hours: Mon-Sat, 9 AM - 6 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
