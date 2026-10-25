import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  fittingCount: number;
  onOpenFittingDrawer: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  fittingCount,
  onOpenFittingDrawer,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'collection', label: 'Коллекция' },
    { id: 'advice', label: 'Советы невестам' },
    { id: 'atelier', label: 'О салоне' },
    { id: 'booking', label: 'Примерка' },
    { id: 'contacts', label: 'Контакты' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-sm border-b border-[#292623]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, 'top')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-wide text-[#FAF8F5] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DFC295]"
        >
          Luxe Wedding Salon
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Основная навигация"
          className="hidden lg:flex items-center gap-7 text-sm text-[#CFC9C0] tracking-[0.01em]"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className="py-1 hover:text-[#FAF8F5] border-b border-transparent hover:border-[#DFC295] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DFC295]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={fittingCount > 0 ? onOpenFittingDrawer : () => onNavigateSection('booking')}
            className="h-10 px-5 text-xs font-semibold text-[#121110] bg-[#DFC295] hover:bg-[#EAD3AE] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DFC295]"
          >
            {fittingCount > 0
              ? `Список примерки · ${fittingCount}`
              : 'Записаться на примерку'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center text-[#FAF8F5] border border-[#38332E] hover:bg-[#1E1C1A] transition-colors duration-150 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#292623] bg-[#121110] px-6 py-4">
          <nav aria-label="Мобильная навигация" className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="py-2 text-sm font-semibold text-[#FAF8F5] border-b border-[#221F1C] last:border-b-0 tracking-[0.01em]"
              >
                {item.label}
              </a>
            ))}
            {fittingCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFittingDrawer();
                }}
                className="mt-1 py-2.5 px-4 text-xs font-semibold text-[#FAF8F5] border border-[#DFC295] text-center tabular-nums cursor-pointer"
              >
                Открыть список примерки ({fittingCount})
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
