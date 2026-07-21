"use client";

import { motion } from "framer-motion";

interface PricingBenefitItem {
  id: string;
  sort: number | null;
  title: string | null;
  plans?: Array<{
    pricing_cards_id?: {
      id: string;
      title?: string | null;
    };
  }>;
}

export default function PricingBenefits({
  benefits,
  pricingCards,
}: {
  benefits: PricingBenefitItem[];
  pricingCards?: any[];
}) {
  if (!benefits || benefits.length === 0) return null;

  // Sort benefits by `sort` field
  const sortedBenefits = [...benefits].sort((a, b) => {
    const aSort = a.sort ?? 999;
    const bSort = b.sort ?? 999;
    return aSort - bSort;
  });

  // Resolve junction objects and use as column headers
  const columns = (pricingCards || [])
    .map((item: any) => item.pricing_cards_id || item)
    .filter(Boolean);

  // Helper: check if a benefit is included in a specific pricing card
  const isIncluded = (benefit: PricingBenefitItem, cardId: string): boolean => {
    if (!benefit.plans || benefit.plans.length === 0) return false;
    return benefit.plans.some((plan: any) => {
      const card = plan.pricing_cards_id;
      if (!card) return false;
      const id = typeof card === "string" ? card : card.id;
      return id === cardId;
    });
  };

  // Checkmark SVG — 24x24px matching the Figma material-symbols:check style
  const CheckIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block mx-auto"
    >
      <polyline
        points="4 12 9 17 20 6"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const CrossIcon = () => (
    <span className="text-[#5E5E5E] font-sans text-[18px] leading-none">
      &mdash;
    </span>
  );

  return (
    <section className="include-section relative w-full bg-[#1a1a1a]">
      <div className="w-full flex flex-col items-center px-4 sm:px-8 lg:px-13.75 py-16 md:py-20 lg:py-20-8 md:gap-12 lg:gap-13.75">
        {/* ── Title: "What's Included" ── */}
        <div className="title title-white inline-title text-center w-full max-w-250">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-title font-normal uppercase tracking-normal text-white text-[36px] leading-11 sm:text-[42px] sm:leading-12.5 lg:text-[48px] lg:leading-14.5"
          >
            What&apos;s <span className="font-black text-white">Included</span>
          </motion.h2>
        </div>

        {/* ── Benefit Table ── */}
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {/*
             * DESKTOP (md+): Standard table with 4px gaps showing dark bg.
             * Header: #5E5E5E. Body rows: alternating #FFFFFF / #E3E3E3.
             *
             * MOBILE (<md): Stacked card layout.
             * Each <tr> becomes a card, each <td> shows its data-label.
             * Thead is visually hidden.
             */}

            {/* ── DESKTOP TABLE ── */}
            <table
              className="benefit-table w-full hidden md:table border-separate border-spacing-1"
              role="table"
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="bg-[#5E5E5E] text-white font-title font-bold text-center uppercase w-[48%]
                               px-5 pt-5 pb-3.5
                               text-[20px] leading-6 lg:text-[24px] lg:leading-7.25"
                  >
                    Benefits &amp; Advantages
                  </th>
                  {columns.map((card: any) => (
                    <th
                      key={card.id}
                      scope="col"
                      className="bg-[#5E5E5E] text-white font-sans font-extrabold text-center uppercase
                                 px-4 lg:px-5 pt-5 pb-3.5
                                 text-[14px] leading-4.5 lg:text-[16px] lg:leading-5"
                    >
                      {card.title || ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedBenefits.map((benefit, index) => (
                  <tr key={benefit.id} className="group">
                    <td
                      data-label="Benefits &amp; Advantages"
                      className={`font-sans font-extrabold text-[#5E5E5E] w-[48%]
                                  text-[15px] leading-4.75 lg:text-[16px] lg:leading-5
                                  px-5 pt-3.75b-3
                                  transition-colors duration-200
                                  ${
                                    index % 2 === 0
                                      ? "bg-white group-hover:bg-[#ececec]"
                                      : "bg-[#E3E3E3] group-hover:bg-[#d5d5d5]"
                                  }`}
                    >
                      {benefit.title || ""}
                    </td>
                    {columns.map((card: any) => (
                      <td
                        key={card.id}
                        data-label={card.title || ""}
                        className={`text-center
                                    px-4 lg:px-5 pt-3.75 pb-3
                                    transition-colors duration-200
                                    ${
                                      index % 2 === 0
                                        ? "bg-white group-hover:bg-[#ececec]"
                                        : "bg-[#E3E3E3] group-hover:bg-[#d5d5d5]"
                                    }`}
                      >
                        {isIncluded(benefit, card.id) ? (
                          <div className="flex items-center justify-center">
                            <CheckIcon />
                          </div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ── MOBILE STACKED CARDS ── */}
            <div className="md:hidden flex flex-col gap-3">
              {sortedBenefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className={`rounded-lg overflow-hidden border border-[#5E5E5E]/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#E3E3E3]"
                  }`}
                >
                  {/* Benefit Title */}
                  <div className="px-4 pt-3.5 pb-2 font-sans font-extrabold text-[#5E5E5E] text-[15px] leading-4.75">
                    {benefit.title || ""}
                  </div>

                  {/* Plan availability rows */}
                  <div className="border-t border-[#5E5E5E]/10">
                    {columns.map((card: any) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between px-4 py-2.5 border-b border-[#5E5E5E]/10 last:border-b-0"
                      >
                        <span className="font-sans font-bold text-[#5E5E5E] text-[13px] uppercase tracking-wide">
                          {card.title || ""}
                        </span>
                        <span className="shrink-0">
                          {isIncluded(benefit, card.id) ? (
                            <CheckIcon />
                          ) : (
                            <CrossIcon />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
