import React, { useEffect } from 'react';
import { X, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import {
  BridalGown,
  FittingSelectionItem,
  SALON_CONTACTS,
  buildWhatsAppUrl,
  formatSom,
} from '../data/salonData';
import { ResilientImage } from './ResilientImage';

interface FittingDrawerProps {
  isOpen: boolean;
  fittingItems: FittingSelectionItem[];
  gowns: BridalGown[];
  onClose: () => void;
  onRemoveItem: (gownId: string) => void;
  onProceedToBooking: () => void;
}

export const FittingDrawer: React.FC<FittingDrawerProps> = ({
  isOpen,
  fittingItems,
  gowns,
  onClose,
  onRemoveItem,
  onProceedToBooking,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const enrichedItems = fittingItems
    .map((item) => {
      const gown = gowns.find((g) => g.id === item.gownId);
      return gown ? { ...item, gown } : null;
    })
    .filter((x): x is FittingSelectionItem & { gown: BridalGown } => x !== null);

  const totalEstimate = enrichedItems.reduce(
    (sum, entry) =>
      sum + (entry.mode === 'rental' ? entry.gown.rentalPriceSom : entry.gown.purchasePriceSom),
    0
  );

  const whatsappListMessage =
    enrichedItems.length > 0
      ? `Здравствуйте, Luxe Wedding Salon! Хочу записаться на примерку (${SALON_CONTACTS.mallAndFloor}). Мои выбранные модели:\n` +
        enrichedItems
          .map(
            (e, i) =>
              `${i + 1}. ${e.gown.name} — размер ${e.selectedSize}, ${e.selectedShade} (${e.mode === 'rental' ? 'прокат' : 'покупка'})`
          )
          .join('\n')
      : `Здравствуйте, Luxe Wedding Salon! Хочу записаться на примерку свадебного платья в ТЦ «Бренд Микс» (3-й этаж).`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#121110]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fitting-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FDFCFB] h-full border-l border-[#E3DDD2] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#121110] text-[#FAF8F5] flex items-center justify-between gap-4">
          <div>
            <h2 id="fitting-drawer-title" className="font-display text-2xl font-semibold">
              Список примерки
            </h2>
            <p className="text-xs text-[#CFC9C0] mt-0.5 tabular-nums">
              Отложено моделей: {enrichedItems.length} · В зале еще более 1 000 платьев
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть список примерки"
            className="w-10 h-10 inline-flex items-center justify-center border border-[#38332E] text-[#FAF8F5] hover:bg-[#1E1C1A] transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {enrichedItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-display text-2xl text-[#141312]">
                Список примерки пока пуст
              </p>
              <p className="text-sm text-[#6E675F] max-w-xs mx-auto leading-relaxed">
                Добавьте понравившиеся модели из каталога, чтобы консультант подготовил их в вашем
                размере (XS–XXXL) к вашему приходу.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#E3DDD2]">
              {enrichedItems.map(({ gown, selectedSize, selectedShade, mode }) => {
                const price = mode === 'rental' ? gown.rentalPriceSom : gown.purchasePriceSom;
                return (
                  <li key={gown.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="w-20 h-26 shrink-0 bg-[#F5F2EC] overflow-hidden border border-[#E3DDD2]">
                      <ResilientImage
                        src={gown.image}
                        alt={gown.name}
                        fallbackTitle={gown.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-xl font-semibold text-[#141312] truncate">
                            {gown.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(gown.id)}
                            aria-label={`Удалить ${gown.name} из списка примерки`}
                            className="p-1.5 text-[#6E675F] hover:text-[#141312] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#6E675F] truncate">
                          {mode === 'rental' ? 'Прокат' : 'Покупка'} · Размер {selectedSize}
                        </p>
                        <p className="text-xs text-[#4F4A44] mt-0.5 truncate">{selectedShade}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#141312] tabular-nums mt-2">
                        {formatSom(price)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E3DDD2] bg-[#F5F2EC] space-y-3">
          {enrichedItems.length > 0 && (
            <div className="flex items-baseline justify-between text-xs text-[#4F4A44]">
              <span>Ориентировочная сумма выбранных моделей</span>
              <span className="text-sm font-semibold text-[#141312] tabular-nums">
                {formatSom(totalEstimate)}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onProceedToBooking}
            className="w-full h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#FAF8F5] bg-[#141312] hover:bg-[#2A2724] transition-colors duration-150 whitespace-nowrap cursor-pointer"
          >
            <span>Оформить запись на сайте</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={buildWhatsAppUrl(whatsappListMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 px-4 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#141312] bg-[#FDFCFB] border border-[#141312] hover:bg-[#EAE4D9] transition-colors duration-150 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-[#7A582C]" />
            <span>Отправить список в WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
