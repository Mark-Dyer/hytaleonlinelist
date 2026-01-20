'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQAccordionProps {
  questions: {
    question: string;
    answer: string;
  }[];
}

export function FAQAccordion({ questions }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {questions.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
