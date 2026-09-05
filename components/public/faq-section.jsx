import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const defaultFaqs = [
  {
    id: 'faq-1',
    question: 'What services does AIOpsMedia offer?',
    answer:
      'We offer AI & automation, custom software development, web and mobile app development, cloud solutions, cybersecurity, and ERP products tailored for specific industries like real estate and education.',
  },
  {
    id: 'faq-2',
    question: 'How long does it take to develop a custom software solution?',
    answer:
      'Timeline varies based on complexity. A typical MVP takes 6-10 weeks, while a full-scale enterprise solution may take 3-6 months. We provide a detailed timeline during the discovery phase.',
  },
  {
    id: 'faq-3',
    question: 'What is the pricing model?',
    answer:
      'We offer flexible pricing: fixed-price for well-defined projects, hourly billing for ongoing work, and subscription models for our ERP products. Contact us for a free consultation and custom quote.',
  },
  {
    id: 'faq-4',
    question: 'Do you provide ongoing support after project delivery?',
    answer:
      'Yes. We offer maintenance and support packages including bug fixes, performance monitoring, security updates, and feature enhancements. We also provide SLA-backed support for enterprise clients.',
  },
  {
    id: 'faq-5',
    question: 'Can you integrate AI into our existing systems?',
    answer:
      'Absolutely. We specialize in augmenting existing systems with AI capabilities — from predictive analytics and NLP to computer vision and intelligent automation — without requiring a full rebuild.',
  },
  {
    id: 'faq-6',
    question: 'What industries do you serve?',
    answer:
      'We serve real estate, education, healthcare, retail, finance, logistics, and manufacturing. Our solutions are adaptable to any industry looking to leverage technology for growth.',
  },
];

function FaqSection({ faqs }) {
  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="bg-[#0B1220] py-20 sm:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="faq-heading" className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="mt-4 text-[#94A3B8]">
            Find answers to common questions about our services and process.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {items.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export { FaqSection };
