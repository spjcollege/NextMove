import React from "react";

function PrivacyPolicy() {
  return (
    <div className="page animate-fade-in" style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 24 }}>Privacy Policy</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "0.9rem" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>1. Introduction</h2>
        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
          Welcome to NextMove. This Privacy Policy outlines how we collect, use, process, and protect your personal data in accordance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP) of India.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>2. Information We Collect</h2>
        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
          We collect the following types of information when you use our platform:
        </p>
        <ul style={{ paddingLeft: 24, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          <li><strong>Personal Data:</strong> Name, email address, phone number, and physical address for order fulfillment.</li>
          <li><strong>Financial Data:</strong> We do not store your payment card details. All transactions are securely processed through Razorpay.</li>
          <li><strong>Usage Data:</strong> Information about your interactions with our site, such as course progress, forum posts, and chess ratings.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>3. Purpose and Use of Information</h2>
        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
          Under the DPDP Act guidelines, we process your personal data for the following legitimate purposes based on your explicit consent:
        </p>
        <ul style={{ paddingLeft: 24, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          <li>Providing, operating, and maintaining our e-commerce and learning platforms.</li>
          <li>Processing and fulfilling your orders.</li>
          <li>Enabling communication regarding account updates, course enrollment, and support.</li>
          <li>Managing loyalty points and reward programs.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>4. Data Protection & Security</h2>
        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
          NextMove implements reasonable security practices and procedures to protect your sensitive personal data from unauthorized access, modification, or disclosure, as mandated by Indian data protection laws. We use industry-standard encryption for data transmission and storage.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>5. Your Rights as a Data Principal</h2>
        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
          In accordance with the Digital Personal Data Protection Act, you possess the following rights:
        </p>
        <ul style={{ paddingLeft: 24, lineHeight: 1.6, color: "var(--text-secondary)" }}>
          <li>The right to access and obtain a copy of your data.</li>
          <li>The right to correction and erasure of your personal data.</li>
          <li>The right to withdraw your consent at any time.</li>
          <li>The right to nominate an individual in the event of death or incapacity.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>6. Grievance Redressal</h2>
        <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16 }}>
          If you have any grievances or discrepancies regarding the processing of your data, you may contact our Grievance Officer in accordance with the IT Rules, 2011 and DPDP Act:
        </p>
        <div className="card" style={{ padding: 16, background: "var(--bg-tertiary)" }}>
          <p><strong>Name:</strong> NextMove Grievance Officer</p>
          <p><strong>Email:</strong> grievances@nextmove.example.in</p>
          <p><strong>Physical Address:</strong> NextMove HQ, Mumbai, Maharashtra, India</p>
          <p>We will acknowledge your grievance within 24 hours and aim to resolve it within 15 days.</p>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
