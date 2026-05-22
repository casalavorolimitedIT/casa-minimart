"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { MessageCircle, Shield01FreeIcons, Zap } from "@hugeicons/core-free-icons";

const footerLinks = {
  "Store Info": ["About", "Delivery Info", "Terms"],
  Support: ["WhatsApp", "Contact", "FAQ"],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer
      className="rounded-t-2xl mt-12"
      style={{ backgroundColor: "rgba(255, 253, 247, 0.8)" }}
    >
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C8720A] flex items-center justify-center">
              <span
                className="text-white text-sm font-bold"
                style={{ fontFamily: "Georgia, serif" }}
              >
                C
              </span>
            </div>
            <span
              className="text-white font-bold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Casalavoro Minimart
            </span>
          </div>
          <p className="text-[#A89070] text-xs leading-relaxed">
            Your premium neighborhood store at Casalavoro Residence. Serving
            Abuja with quality everyday essentials.
          </p>
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-[#A89070] text-xs">
              <HugeiconsIcon icon={Shield01FreeIcons} className="w-3.5 h-3.5 text-[#C8A87A]" />
              Secure Payment
            </div>
            <div className="flex items-center gap-1.5 text-[#A89070] text-xs">
              <HugeiconsIcon icon={Zap} className="w-3.5 h-3.5 text-[#C8A87A]" />
              Abuja Express
            </div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading} className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A87A]">
              {heading}
            </p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#A89070] text-sm hover:text-black transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A87A]">
            Newsletter
          </p>
          <p className="text-[#A89070] text-xs">Weekly deals to your inbox.</p>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-8 text-xs bg-[#3A2010] border-[#4A2E1A] text-white placeholder:text-[#7A5C3E] focus-visible:ring-[#C8720A]"
            />
            <Button
              size="sm"
              className="h-8 px-3 text-xs shrink-0"
              style={{ backgroundColor: "var(--amber-brand)" }}
              onClick={() => {
                if (email) setJoined(true);
              }}
            >
              {joined ? "✓" : "Join"}
            </Button>
          </div>
          {joined && (
            <p className="text-[#4A7C59] text-xs">Thanks for subscribing!</p>
          )}
        </div>
      </div>

      <Separator className="bg-[#4A2E1A]" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-[#7A5C3E] text-xs">
          © 2026 Casalavoro Residence Minimart. All rights reserved.
        </p>
        <a
          href="#"
          className="flex items-center gap-1.5 text-xs text-[#A89070] hover:text-white transition-colors"
        >
          <HugeiconsIcon icon={MessageCircle} className="w-3.5 h-3.5 text-[#25D366]" />
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
