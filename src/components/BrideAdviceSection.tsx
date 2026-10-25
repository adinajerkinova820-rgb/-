import React, { useEffect, useState } from 'react';
import { Check, RotateCcw, ArrowRight } from 'lucide-react';
import {
  BRIDE_ADVICE_CHAPTERS,
  BRIDE_VISIT_CHECKLIST,
  SALON_CONTACTS,
} from '../data/salonData';

interface BrideAdviceSectionProps {
  onNavigateBooking: () => void;
}

export const BrideAdviceSection: React.FC<BrideAdviceSectionProps> = ({
  onNavigateBooking,
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>(
    BRIDE_ADVICE_CHAPTERS[0].id
  );

  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('luxe_bride_checklist_v2');
      return saved ? (JSON.parse(saved) as string[]) : ['save-date'];
    } catch {
      return ['save-date'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxe_bride_checklist_v2', JSON.stringify(checkedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [checkedIds]);

  const activeChapter =
    BRIDE_ADVICE_CHAPTERS.find((c) => c.id === activeChapterId) ||
    BRIDE_ADVICE_CHAPTERS[0];

  const toggleChecklistItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="advice"
      className="py-20 sm:py-24 bg-[#F5F2EC] border-t border-b border-[#E3DDD2]"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Heading */}
        <div className="max-w-2xl mb-10">
          <p className="text-xs text-[#6E675F] mb-2">
            Гид невесты · Рекомендации стилистов {SALON_CONTACTS.brandName}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#141312]">
            Советы для невест перед выбором платья
          </h2>
          <p className="mt-3 text-base text-[#4F4A44] leading-relaxed">
            Мы собрали практические рекомендации наших консультантов, чтобы поиск платья вашей
            мечты прошел спокойно, вдохновляюще и без лишних хлопот.
          </p>
        </div>

        {/* Interactive Chapter Tabs */}
        <div
          role="tablist"
          aria-label="Разделы советов для невест"
          className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EAE4D9] mb-10 w-fit"
        >
          {BRIDE_ADVICE_CHAPTERS.map((chapter) => {
            const isSelected = chapter.id === activeChapterId;
            return (
              <button
                key={chapter.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveChapterId(chapter.id)}
                className={`px-4 py-2.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#141312] text-[#FAF8F5]'
                    : 'text-[#4F4A44] hover:text-[#141312]'
                }`}
              >
                {chapter.number}. {chapter.tabLabel}
              </button>
            );
          })}
        </div>

        {/* 12-Column Editorial Guide + Interactive Bride Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: Selected Advice Chapter */}
          <div className="lg:col-span-7 bg-[#FDFCFB] border border-[#E3DDD2] p-7 sm:p-10">
            <div className="pb-6 border-b border-[#E8E2D8]">
              <p className="text-xs font-semibold text-[#7A582C] tabular-nums">
                Глава {activeChapter.number} из 0{BRIDE_ADVICE_CHAPTERS.length}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#141312] mt-2">
                {activeChapter.headline}
              </h3>
              <p className="mt-3 text-sm text-[#4F4A44] leading-relaxed">
                {activeChapter.intro}
              </p>
            </div>

            <div className="divide-y divide-[#ECE7DF] mt-2">
              {activeChapter.tips.map((tip, idx) => (
                <div key={tip.title} className="py-5 first:pt-6 last:pb-0">
                  <h4 className="text-base font-semibold text-[#141312] font-sans">
                    <span className="text-[#7A582C] tabular-nums mr-2">0{idx + 1}.</span>
                    {tip.title}
                  </h4>
                  <p className="mt-2 text-sm text-[#4F4A44] leading-relaxed">{tip.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Interactive Bride Fitting Checklist */}
          <div className="lg:col-span-5 bg-[#141312] text-[#FAF8F5] p-7 sm:p-9 border border-[#292623]">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#2B2723]">
              <div>
                <p className="text-xs text-[#DFC295] tracking-[0.01em]">
                  Памятка перед визитом
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#FAF8F5] mt-1">
                  Чек-лист невесты
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckedIds([])}
                aria-label="Сбросить отметки чек-листа"
                className="inline-flex items-center gap-1.5 py-1.5 px-2.5 text-xs text-[#CFC9C0] hover:text-[#FAF8F5] border border-[#332E29] cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сбросить</span>
              </button>
            </div>

            <p className="mt-4 text-xs text-[#CFC9C0] tabular-nums tracking-[0.01em]">
              Готовность к примерке: отмечено {checkedIds.length} из{' '}
              {BRIDE_VISIT_CHECKLIST.length} пунктов
            </p>

            <ul className="mt-5 space-y-3">
              {BRIDE_VISIT_CHECKLIST.map((item) => {
                const checked = checkedIds.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-full text-left p-3.5 border transition-colors duration-150 flex items-start gap-3.5 cursor-pointer ${
                        checked
                          ? 'bg-[#1F1D1A] border-[#DFC295]/60'
                          : 'bg-[#181614] border-[#2B2723] hover:border-[#4A433C]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 border inline-flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-[#DFC295] border-[#DFC295] text-[#141312]'
                            : 'border-[#575049] text-transparent'
                        }`}
                        aria-hidden="true"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span className="block">
                        <span
                          className={`block text-sm font-semibold tracking-[0.01em] ${
                            checked ? 'text-[#FAF8F5]' : 'text-[#EAE5DC]'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="block text-xs text-[#A9A298] mt-0.5 leading-relaxed">
                          {item.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 pt-5 border-t border-[#2B2723] space-y-3">
              <p className="text-xs text-[#CFC9C0] leading-relaxed tracking-[0.01em]">
                Ждем вас ежедневно с <span className="tabular-nums">10:00</span> до{' '}
                <span className="tabular-nums">19:00</span> по адресу:{' '}
                {SALON_CONTACTS.cityRegion}, {SALON_CONTACTS.mallAndFloor}.
              </p>
              <button
                type="button"
                onClick={onNavigateBooking}
                className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#141312] bg-[#DFC295] hover:bg-[#EAD3AE] transition-colors duration-150 whitespace-nowrap cursor-pointer"
              >
                <span>Записаться на примерку к стилисту</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
