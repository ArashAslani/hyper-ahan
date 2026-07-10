"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/features/layout/TopBar";
import { NavMenu } from "@/features/layout/NavMenu";
import { ConsultationModal } from "@/features/layout/ConsultationModal";
import { MobileHeader } from "@/features/layout/MobileHeader";
import { MobileMenu } from "@/features/layout/MobileMenu";
import { catalogNavService } from "@/services/catalogNavService";
import type { CategoryNode, WeightCalcItem } from "@/types";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [weightCalcItems, setWeightCalcItems] = useState<WeightCalcItem[]>([]);

  useEffect(() => {
    void Promise.all([
      catalogNavService.getCategories(),
      catalogNavService.getWeightCalcItems(),
    ]).then(([cats, weights]) => {
      setCategories(cats);
      setWeightCalcItems(weights);
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          <TopBar onConsultationClick={() => setIsModalOpen(true)} />
          <NavMenu categories={categories} weightCalcItems={weightCalcItems} />
        </div>
      </div>

      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        weightCalcItems={weightCalcItems}
      />

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}
