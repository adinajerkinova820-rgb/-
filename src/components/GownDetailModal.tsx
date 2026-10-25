import React, { useEffect, useState } from 'react';
import { X, Check, Ruler, ArrowRight, MessageCircle } from 'lucide-react';
import {
  BridalGown,
  FULL_SIZE_CHART,
  FittingSelectionItem,
  SALON_CONTACTS,
  SizeLabel,
  buildWhatsAppUrl,
  formatSom,
} from '../data/salonData';
import { ResilientImage } from './ResilientImage';

interface GownDetailModalProps {
  gown: BridalGown | null;
  defaultMode: 'rental' | 'purchase';
  fittingItems: FittingSelectionItem[];
  onClose: () => void;
  onToggleFittingItem: (item: FittingSelectionItem) => void;
  onBookGownDirectly: (item: FittingSelectionItem) => void;
}

export const GownDetailModal: React.FC<GownDetailModalProps> = ({
  gown,
  defaultMode,
  fittingItems,
  onClose,
  onToggleFittingItem,
  onBookGownDirectly,
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeLabel>('S');
  const [selectedShade, setSelectedShade] = useState<string>('');
  const [mode, setMode] = useState<'rental' | 'purchase'>(defaultMode);
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);

  const [bustInput, setBustInput] = useState<number>(88);
  const [waistInput, setWaistInput] = useState<number>(68);
  const [hipsInput, setHipsInput] = useState<number>(94);

  useEffect(() => {
    if (gown) {
      const existing = fittingItems.find((item) => item.gownId === gown.id);
      if (existing) {
        setSelectedSize(existing.selectedSize);
        setSelectedShade(existing.selectedShade);
        setMode(existing.mode);
      } else {
        setSelectedSize(gown.availableSizes.includes('S') ? 'S' : gown.availableSizes[0]);
        setSelectedShade(gown.shades[0]);
        setMode(defaultMode);
      }
      setShowSizeCalculator(false);
    }
  }, [gown, fittingItems, defaultMode]);

  useEffect(() => {
    if (!gown) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gown, onClose]);

  if (!gown) return null;

  const isSelectedInList = fittingItems.some((item) => item.gownId === gown.id);
  const displayedPrice = mode === 'rental' ? gown.rentalPriceSom : gown.purchasePriceSom;
  const activeSizeSpec =
    FULL_SIZE_CHART.find((s) => s.code === selectedSize) || FULL_SIZE_CHART[1];

  const calculateRecommendedSize = () => {
    for (const s of FULL_SIZE_CHART) {
      if (bustInput <= s.bustCm[1] && waistInput <= s.waistCm[1] && hipsInput <= s.hipsCm[1]) {
        return s;
      }
    }
    return FULL_SIZE_CHART[FULL_SIZE_CHART.length - 1];
  };

  const recommendedSpec = calculateRecommendedSize();
  const isRecommendedInGown = gown.availableSizes.includes(recommendedSpec.code);

  const whatsappDirectLink = buildWhatsAppUrl(
    `Здравствуйте, Luxe Wedding Salon! Хочу узнать подробнее и записаться на примерку платья «${gown.name}» (размер ${selectedSize}, оттенок: ${selectedShade || gown.shades[0]}, формат: ${mode === 'rental' ? 'прокат' : 'покупка'}).`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#121110]/70 backdrop-blur-[2px] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gown-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1060px] max-h-[90vh] overflow-y-auto bg-[#FDFCFB] border border-[#E3DDD2] grid grid-cols-1 lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть карточку платья"
          className="absolute top-4 right-4 z-10 w-10 h-10 inline-flex items-center justify-center bg-[#FDFCFB]/95 border border-[#E3DDD2] text-[#141312] hover:bg-[#F5F2EC] transition-colors duration-150 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Gown Portrait */}
        <div className="lg:col-span-6 bg-[#F5F2EC] flex flex-col">
          <div className="aspect-[3/4] w-full h-full">
            <ResilientImage
              src={gown.image}
              alt={`${gown.name} — ${gown.collectionLine}`}
              fallbackTitle={gown.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & Fitting Module */}
        <div className="lg:col-span-6 p-6 sm:p-9 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E675F]">
              <span>{gown.collectionLine}</span>
              <span aria-hidden="true">·</span>
              <span>{gown.silhouetteLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{SALON_CONTACTS.mallAndFloor}</span>
            </div>

            <h2
              id="gown-modal-title"
              className="font-display text-3xl sm:text-4xl font-semibold text-[#141312] mt-2"
            >
              {gown.name}
            </h2>

            <div className="mt-3 flex items-baseline justify-between gap-4 pb-5 border-b border-[#E3DDD2]">
              <div>
                <p className="text-2xl font-semibold text-[#141312] tabular-nums">
                  {formatSom(displayedPrice)}
                </p>
                <p className="text-xs text-[#6E675F] mt-0.5">
                  {mode === 'rental'
                    ? 'Прокат на торжество · включает фату, кринолин, отпаривание и химчистку'
                    : 'Покупка нового платья · включает подгонку по росту и фирменный чехол'}
                </p>
              </div>
              <span className="text-xs text-[#4F4A44] tabular-nums shrink-0">
                Шлейф {gown.trainLengthCm} см
              </span>
            </div>

            {/* Rental vs Purchase Toggle */}
            <div className="mt-5">
              <span className="block text-xs font-semibold text-[#141312] mb-2">
                Формат (прокат или покупка)
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#F5F2EC]">
                <button
                  type="button"
                  onClick={() => setMode('rental')}
                  className={`py-2 px-3 text-xs font-semibold transition-colors duration-150 whitespace-nowrap truncate cursor-pointer ${
                    mode === 'rental'
                      ? 'bg-[#141312] text-[#FAF8F5]'
                      : 'text-[#4F4A44] hover:text-[#141312]'
                  }`}
                >
                  Прокат на свадьбу
                </button>
                <button
                  type="button"
                  onClick={() => setMode('purchase')}
                  className={`py-2 px-3 text-xs font-semibold transition-colors duration-150 whitespace-nowrap truncate cursor-pointer ${
                    mode === 'purchase'
                      ? 'bg-[#141312] text-[#FAF8F5]'
                      : 'text-[#4F4A44] hover:text-[#141312]'
                  }`}
                >
                  Покупка платья
                </button>
              </div>
            </div>

            {/* Shade Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#141312]">Оттенок</span>
                <span className="text-[#6E675F]">{selectedShade}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gown.shades.map((shade) => (
                  <button
                    key={shade}
                    type="button"
                    onClick={() => setSelectedShade(shade)}
                    className={`py-2 px-3.5 text-xs border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedShade === shade
                        ? 'border-[#141312] bg-[#141312] text-[#FAF8F5] font-semibold'
                        : 'border-[#D8D1C5] bg-[#FDFCFB] text-[#3F3B36] hover:border-[#141312]'
                    }`}
                  >
                    {shade}
                  </button>
                ))}
              </div>
            </div>

            {/* Full XS - XXXL Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#141312]">
                  Размер (в салоне линейка XS – XXXL)
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeCalculator((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A582C] hover:text-[#141312] underline underline-offset-4 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  {showSizeCalculator ? 'Скрыть калькулятор' : 'Подобрать размер'}
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {FULL_SIZE_CHART.map((spec) => {
                  const inThisModel = gown.availableSizes.includes(spec.code);
                  const isActive = selectedSize === spec.code;
                  return (
                    <button
                      key={spec.code}
                      type="button"
                      onClick={() => setSelectedSize(spec.code)}
                      className={`py-2 px-1.5 text-center border transition-colors duration-150 tabular-nums cursor-pointer ${
                        isActive
                          ? 'border-[#141312] bg-[#141312] text-[#FAF8F5] font-semibold'
                          : inThisModel
                          ? 'border-[#D8D1C5] bg-[#FDFCFB] text-[#141312] hover:border-[#141312]'
                          : 'border-[#E8E2D8] bg-[#F7F5F0] text-[#78716A] hover:border-[#9E9589]'
                      }`}
                    >
                      <span className="block text-xs">{spec.code}</span>
                      <span
                        className={`block text-[10px] ${
                          isActive ? 'text-[#DFC295]' : 'text-[#6E675F]'
                        }`}
                      >
                        {spec.ruSize}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-[#4F4A44] tabular-nums">
                Размер {activeSizeSpec.code} ({activeSizeSpec.ruSize} RU):{' '}
                <strong className="font-semibold text-[#141312]">
                  {gown.availableSizes.includes(activeSizeSpec.code)
                    ? 'В наличии в зале ТЦ «Бренд Микс»'
                    : 'Подберем аналогичный силуэт в зале (1 000+ моделей)'}
                </strong>{' '}
                · Грудь {activeSizeSpec.bustCm[0]}–{activeSizeSpec.bustCm[1]} см, Талия{' '}
                {activeSizeSpec.waistCm[0]}–{activeSizeSpec.waistCm[1]} см
              </p>

              {showSizeCalculator && (
                <div className="mt-3 p-4 bg-[#F5F2EC] border border-[#E3DDD2] space-y-3">
                  <p className="text-xs font-semibold text-[#141312]">
                    Калькулятор размера от XS до XXXL
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="block">
                      <span className="block text-[11px] text-[#4F4A44] mb-1">Грудь (см)</span>
                      <input
                        type="number"
                        min={74}
                        max={130}
                        value={bustInput}
                        onChange={(e) => setBustInput(Number(e.target.value) || 84)}
                        className="w-full h-9 px-2.5 text-xs bg-[#FDFCFB] border border-[#D8D1C5] tabular-nums text-[#141312]"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] text-[#4F4A44] mb-1">Талия (см)</span>
                      <input
                        type="number"
                        min={55}
                        max={115}
                        value={waistInput}
                        onChange={(e) => setWaistInput(Number(e.target.value) || 68)}
                        className="w-full h-9 px-2.5 text-xs bg-[#FDFCFB] border border-[#D8D1C5] tabular-nums text-[#141312]"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] text-[#4F4A44] mb-1">Бедра (см)</span>
                      <input
                        type="number"
                        min={82}
                        max={136}
                        value={hipsInput}
                        onChange={(e) => setHipsInput(Number(e.target.value) || 94)}
                        className="w-full h-9 px-2.5 text-xs bg-[#FDFCFB] border border-[#D8D1C5] tabular-nums text-[#141312]"
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-[#141312] tabular-nums">
                      Ваш размер:{' '}
                      <span className="font-semibold">
                        {recommendedSpec.code} ({recommendedSpec.ruSize} RU)
                      </span>{' '}
                      · {isRecommendedInGown ? 'В наличии' : 'Доступны похожие в зале'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSize(recommendedSpec.code);
                        setShowSizeCalculator(false);
                      }}
                      className="py-1.5 px-3 text-xs font-semibold bg-[#141312] text-[#FAF8F5] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Выбрать {recommendedSpec.code}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Details */}
            <div className="mt-5 pt-5 border-t border-[#E3DDD2] space-y-3">
              <p className="text-sm text-[#3F3B36] leading-relaxed">{gown.description}</p>
              <p className="text-xs text-[#6E675F]">
                <span className="font-semibold text-[#141312]">Ткани и отделка:</span>{' '}
                {gown.fabricComposition}
              </p>
              <ul className="space-y-1.5 pt-1">
                {gown.craftsmanshipDetails.map((detail) => (
                  <li key={detail} className="text-xs text-[#4F4A44] leading-relaxed">
                    — {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contiguous Action Bar */}
          <div className="pt-4 border-t border-[#E3DDD2] space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onBookGownDirectly({
                    gownId: gown.id,
                    selectedSize,
                    selectedShade: selectedShade || gown.shades[0],
                    mode,
                  })
                }
                className="flex-1 h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#FAF8F5] bg-[#141312] hover:bg-[#2A2724] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Записаться на примерку</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  onToggleFittingItem({
                    gownId: gown.id,
                    selectedSize,
                    selectedShade: selectedShade || gown.shades[0],
                    mode,
                  })
                }
                className={`h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-semibold border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelectedInList
                    ? 'border-[#141312] bg-[#F5F2EC] text-[#141312]'
                    : 'border-[#D8D1C5] bg-[#FDFCFB] text-[#141312] hover:border-[#141312]'
                }`}
              >
                {isSelectedInList ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>В списке примерки</span>
                  </>
                ) : (
                  <span>+ В список примерки</span>
                )}
              </button>
            </div>

            <a
              href={whatsappDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 px-4 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#141312] bg-[#F5F2EC] border border-[#E3DDD2] hover:border-[#141312] transition-colors duration-150 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#7A582C]" />
              <span>Уточнить наличие в WhatsApp ({SALON_CONTACTS.whatsappDisplay})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
