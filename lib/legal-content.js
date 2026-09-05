import { siteConfig } from '@/config';

const lastUpdated = '1 September 2026';

const company = siteConfig.name;
const email = siteConfig.email;
const address = siteConfig.address;

const legalContent = {
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: `At ${company}, accessible from ${siteConfig.url}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${company} and how we use it.`,
    updated: `Last updated: ${lastUpdated}`,
    sections: [
      { heading: '1. Information We Collect', body: `We collect information you provide directly to us, including your name, email address, phone number, company name, and any other details you submit through our contact forms, lead forms, or when requesting a quote. We may also collect information automatically, such as your IP address, browser type, pages visited, and device information through cookies and analytics tools.` },
      { heading: '2. How We Use Your Information', body: `We use the information we collect to respond to your inquiries, provide and improve our services, send you relevant updates and marketing communications you have opted into, process transactions, and personalize your experience. We do not sell your personal information to third parties.` },
      { heading: '3. Cookies and Tracking', body: `We use cookies and similar tracking technologies to understand how visitors engage with our website, improve user experience, and measure the effectiveness of our content. You can control cookies through your browser settings. See our Cookies Policy for more details.` },
      { heading: '4. How We Protect Your Data', body: `We implement reasonable technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is 100% secure.` },
      { heading: '5. Third-Party Services', body: `We may use trusted third-party services (such as analytics providers, hosting providers, and payment processors) that may collect and process data on our behalf. These providers are contractually obligated to protect your data and may be located in India or other countries.` },
      { heading: '6. Your Data Rights', body: `Depending on your jurisdiction, you may have the right to access, correct, update, or delete the personal information we hold about you. You may also have the right to object to certain processing and to data portability. To exercise any of these rights, please contact us at ${email}.` },
      { heading: "7. Children's Privacy", body: `Our website is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If you believe a child has provided us personal information, please contact us immediately so we can remove it.` },
      { heading: '8. Changes to This Policy', body: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically for any changes.` },
      { heading: '9. Contact Us', body: `If you have any questions about this Privacy Policy, please contact us at ${email} or write to us at ${address}.` },
    ],
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    intro: `Welcome to ${company}. These Terms & Conditions govern your use of ${siteConfig.url} and the services we provide. By accessing or using our website and services, you agree to be bound by these terms.`,
    updated: `Last updated: ${lastUpdated}`,
    sections: [
      { heading: '1. Acceptance of Terms', body: `By accessing or using our website and services, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website or services.` },
      { heading: '2. Services', body: `We provide software development, AI and automation, web development, mobile app development, cloud solutions, cybersecurity, and ERP products and services. The scope, deliverables, timelines, and pricing for any engagement will be defined in a separate agreement, quotation, or proposal.` },
      { heading: '3. Use of Website', body: `You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of, or restrict the use of, this website by any third party. You must not misuse the website, attempt to gain unauthorized access, or transmit harmful code.` },
      { heading: '4. Intellectual Property', body: `All content on this website, including text, graphics, logos, images, and software, is the property of ${company} or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without prior written consent.` },
      { heading: '5. Client Responsibilities', body: `Clients are responsible for providing accurate and timely information, feedback, and approvals required to complete projects. Delays in providing materials may impact project timelines and deliverables.` },
      { heading: '6. Payment Terms', body: `Payment terms, including deposits, milestones, and final payments, are defined in the respective quotation, invoice, or agreement. Unless otherwise agreed, payments are due as specified on the invoice. Late payments may incur additional charges or suspension of services.` },
      { heading: '7. Limitation of Liability', body: `To the maximum extent permitted by law, ${company} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, data, or goodwill arising out of or related to your use of our website or services.` },
      { heading: '8. Indemnification', body: `You agree to indemnify and hold harmless ${company}, its employees, and agents from any claims, damages, liabilities, and expenses arising out of your use of the website or services or your violation of these terms.` },
      { heading: '9. Termination', body: `We reserve the right to terminate or suspend access to our website and services at our discretion, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.` },
      { heading: '10. Governing Law', body: `These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bihar, India.` },
      { heading: '11. Contact Us', body: `For any questions about these Terms & Conditions, please contact us at ${email}.` },
    ],
  },
  'refund-policy': {
    title: 'Refund & Cancellation Policy',
    intro: `At ${company}, we are committed to ensuring your satisfaction with our products and services. This Refund & Cancellation Policy outlines the terms under which refunds and cancellations are handled.`,
    updated: `Last updated: ${lastUpdated}`,
    sections: [
      { heading: '1. Overview', body: `Our services are delivered in phases, as defined in the respective quotation or agreement. Because each engagement is customized, refund eligibility depends on the stage of the project at the time of cancellation.` },
      { heading: '2. Project Cancellations', body: `If you decide to cancel a project, please notify us in writing. Refunds, where applicable, will be calculated based on the work completed up to the cancellation date, excluding non-refundable deposits or costs already incurred (such as licensing, subscriptions, or third-party fees).` },
      { heading: '3. Deposits', body: `Initial deposits or advance payments may be non-refundable, as they secure project scheduling and resource allocation. Please review the specific deposit terms in your agreement or quotation before making a payment.` },
      { heading: '4. Digital Products', body: `For digital products and software licenses delivered electronically, refunds may be available within a specified period if the product is found to be defective, subject to the terms of the applicable license agreement.` },
      { heading: '5. Subscription Services', body: `For subscription-based services (such as ongoing maintenance or support), you may cancel your subscription with notice as specified in your agreement. Fees already charged for the current billing period may not be refundable.` },
      { heading: '6. How to Request a Refund', body: `To request a refund, please contact us at ${email} with your name, project or invoice details, and the reason for the request. We will review your request and respond within a reasonable timeframe.` },
      { heading: '7. Contact Us', body: `If you have any questions about this policy, please reach out to us at ${email}.` },
    ],
  },
  'cookies-policy': {
    title: 'Cookies Policy',
    intro: `This Cookies Policy explains how ${company} uses cookies and similar technologies to recognize you when you visit our website.`,
    updated: `Last updated: ${lastUpdated}`,
    sections: [
      { heading: '1. What Are Cookies?', body: `Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide reporting information and support website functionality.` },
      { heading: '2. How We Use Cookies', body: `We use cookies to understand how visitors use our website, remember your preferences, improve performance, and measure the effectiveness of our marketing. Cookies help us deliver a better, more personalized experience.` },
      { heading: '3. Types of Cookies We Use', body: `We use session cookies (which expire when you close your browser), persistent cookies (which remain until they expire or are deleted), and analytics cookies (which help us understand usage patterns). We may also use functional cookies to remember your preferences.` },
      { heading: '4. Managing Cookies', body: `You can control and manage cookies through your browser settings. You can delete existing cookies, block new ones, or set your browser to notify you when a cookie is set. Please note that blocking cookies may affect how our website functions.` },
      { heading: '5. Third-Party Cookies', body: `Some cookies are set by third-party services we use, such as analytics and advertising providers. These third parties may use cookies to gather information about your visits to our site and other websites.` },
      { heading: '6. Changes to This Policy', body: `We may update this Cookies Policy from time to time to reflect changes to technology, legislation, or our business practices. Please review it periodically.` },
      { heading: '7. Contact Us', body: `If you have questions about our use of cookies, please contact us at ${email}.` },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    intro: `The information provided by ${company} on ${siteConfig.url} is for general informational purposes only.`,
    updated: `Last updated: ${lastUpdated}`,
    sections: [
      { heading: '1. General Information', body: `All information on our website is provided in good faith. However, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.` },
      { heading: '2. No Professional Advice', body: `The content on this website does not constitute professional, legal, financial, or technical advice. You should not act or refrain from acting based on any information found on our website without consulting appropriate professionals.` },
      { heading: '3. External Links', body: `Our website may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, or completeness of any information on these external sites and are not responsible for their content.` },
      { heading: '4. Products and Services', body: `While we strive to keep product and service information current and accurate, specifications, features, pricing, and availability may change without notice. Please confirm details with our team before making decisions.` },
      { heading: '5. Limitation of Liability', body: `In no event shall ${company}, its directors, employees, or agents be liable for any loss or damage, including without limitation indirect or consequential loss or damage, arising from or in connection with the use of our website.` },
      { heading: '6. Contact Us', body: `If you require any more information or have any questions about our website's disclaimer, please feel free to contact us by email at ${email}.` },
    ],
  },
  'data-protection': {
    title: 'Data Protection Policy',
    intro: `This Data Protection Policy outlines how ${company} collects, processes, stores, and protects personal data in compliance with applicable data protection laws and regulations, including the Digital Personal Data Protection Act of India.`,
    updated: `Last updated: ${lastUpdated}`,
    sections: [
      { heading: '1. Our Commitment', body: `We are committed to protecting the privacy and security of personal data we handle. We process personal data fairly, lawfully, and transparently, and only for legitimate and specified purposes.` },
      { heading: '2. Principles of Data Processing', body: `We process personal data in accordance with the principles of lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity, and confidentiality.` },
      { heading: '3. What Data We Process', body: `We may process personal data such as names, contact details, employment details (for HR purposes), and transactional data (for billing and finance), depending on the nature of our relationship with you.` },
      { heading: '4. Lawful Basis for Processing', body: `We process personal data based on your consent, the performance of a contract, our legitimate business interests, or legal obligations, as applicable to each processing activity.` },
      { heading: '5. Data Subject Rights', body: `You have the right to access, rectify, erase, restrict, or object to the processing of your personal data, as well as the right to data portability where applicable. You can exercise these rights by contacting us.` },
      { heading: '6. Data Retention', body: `We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including for legal, accounting, or reporting requirements.` },
      { heading: '7. Data Security', body: `We implement appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction, including access controls and secure infrastructure.` },
      { heading: '8. Data Breach Response', body: `In the event of a personal data breach, we will assess the risk and, where required, notify affected individuals and relevant authorities in accordance with applicable laws.` },
      { heading: '9. Contact Us', body: `If you have questions or concerns about this Data Protection Policy or wish to exercise your data rights, please contact us at ${email}.` },
    ],
  },
  accessibility: {
    title: 'Accessibility Statement',
    intro: `${company} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.`,
    updated: `Last updated: ${lastUpdated}`,
    sections: [
      { heading: '1. Our Commitment', body: `We aim to make our website accessible to as many people as possible, including those with visual, motor, cognitive, and hearing impairments. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.` },
      { heading: '2. Accessibility Features', body: `Our website is designed to support keyboard navigation, screen readers, and sufficient color contrast. We use semantic HTML, clear headings, descriptive link text, and alt text for meaningful images to enhance accessibility.` },
      { heading: '3. Ongoing Efforts', body: `Accessibility is an ongoing effort. We regularly review our website and development practices to identify and address accessibility barriers and ensure our content remains accessible as technology and standards evolve.` },
      { heading: '4. Third-Party Content', body: `Our website may link to or embed content from third-party providers that we do not control. While we aim to choose accessible partners, we cannot guarantee the accessibility of third-party content.` },
      { heading: '5. Feedback', body: `We welcome your feedback on the accessibility of our website. If you encounter an accessibility barrier or have suggestions for improvement, please let us know.` },
      { heading: '6. Contact Us', body: `To report an accessibility issue, request assistance, or provide feedback, please contact us at ${email} or reach out to ${address}. We will endeavor to respond and address your concern promptly.` },
    ],
  },
};

export function getLegalContent(slug) {
  return legalContent[slug] || null;
}
