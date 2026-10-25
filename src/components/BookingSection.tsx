import React, { useMemo, useState } from 'react';
import { Check, Minus, Plus, Calendar, MessageCircle, Copy } from 'lucide-react';
import {
  BridalGown,
  FULL_SIZE_CHART,
  FittingSelectionItem,
  SALON_CONTACTS,
  SizeLabel,
  buildWhatsAppUrl,
  formatSom,
} from '../data/salonData';

interface BookingSectionProps {
  gowns: BridalGown[];
  fittingItems: FittingSelectionItem[];
  onToggleQuickGown: (gown: BridalGown) => void;
}

interface ConfirmedBookingRecord {
  referenceCode: string;
  dateLabel: string;
  timeSlot: string;
  brideSize: SizeLabel;
  guestsCount: number;
  brideName: string;
  phone: string;
  weddingDateNote: string;
  wishes: string;
  selectedGownNames: string[];
}

// Salon working hours: 10:00 to 19:00 daily
const AVAILABLE_DATES = [
  {
    id: '2026-10-26',
    dayShort: 'Пн',
    dateNum: '26 октября',
    slots: ['10:00', '11:30', '13:30', '15:30', '17:30'],
    busySlots: ['13:30'],
  },
  {
    id: '2026-10-27',
    dayShort: 'Вт',
    dateNum: '27 октября',
    slots: ['10:00', '12:00', '14:00', '16:00', '17:30'],
    busySlots: [],
  },
  {
    id: '2026-10-28',
    dayShort: 'Ср',
    dateNum: '28 октября',
    slots: ['10:30', '12:30', '14:30', '16:30', '17:30'],
    busySlots: ['16:30'],
  },
  {
    id: '2026-10-30',
    dayShort: 'Пт',
    dateNum: '30 октября',
    slots: ['10:00', '11:30', '13:30', '15:30', '17:30'],
    busySlots: [],
  },
  {
    id: '2026-10-31',
    dayShort: 'Сб',
    dateNum: '31 октября',
    slots: ['10:00', '12:00', '14:00', '16:00', '17:30'],
    busySlots: ['12:00', '14:00'],
  },
];

export const BookingSection: React.FC<BookingSectionProps> = ({
  gowns,
  fittingItems,
  onToggleQuickGown,
}) => {
  const [selectedDateId, setSelectedDateId] = useState<string>(AVAILABLE_DATES[1].id);
  const [selectedSlot, setSelectedSlot] = useState<string>('12:00');
  const [brideSize, setBrideSize] = useState<SizeLabel>('M');
  const [guestsCount, setGuestsCount] = useState<number>(2);

  const [brideName, setBrideName] = useState('');
  const [phone, setPhone] = useState('+996 ');
  const [weddingDateNote, setWeddingDateNote] = useState('');
  const [wishes, setWishes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [confirmedRecord, setConfirmedRecord] = useState<ConfirmedBookingRecord | null>(() => {
    try {
      const saved = localStorage.getItem('luxe_jalalabad_booking_v2');
      return saved ? (JSON.parse(saved) as ConfirmedBookingRecord) : null;
    } catch {
      return null;
    }
  });

  const activeDateObj = useMemo(
    () => AVAILABLE_DATES.find((d) => d.id === selectedDateId) || AVAILABLE_DATES[0],
    [selectedDateId]
  );

  const handleDateChange = (dateId: string) => {
    setSelectedDateId(dateId);
    const nextDate = AVAILABLE_DATES.find((d) => d.id === dateId);
    if (nextDate) {
      const firstOpenSlot = nextDate.slots.find((s) => !nextDate.busySlots.includes(s));
      if (firstOpenSlot) setSelectedSlot(firstOpenSlot);
    }
  };

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(SALON_CONTACTS.whatsappDisplay);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    } catch {
      setCopiedPhone(false);
    }
  };

  const buildCurrentWhatsAppBookingUrl = (record?: ConfirmedBookingRecord | null) => {
    const r = record;
    const gownListText = r
      ? r.selectedGownNames.join(', ')
      : fittingItems
          .map((item) => {
            const g = gowns.find((x) => x.id === item.gownId);
            return g ? `${g.name} (${item.selectedSize})` : null;
          })
          .filter(Boolean)
          .join(', ');

    const text = [
      `Здравствуйте, Luxe Wedding Salon! Хочу записаться на примерку (${SALON_CONTACTS.mallAndFloor}).`,
      `Имя: ${r ? r.brideName : brideName.trim() || 'Невеста'}`,
      `Дата и время: ${r ? `${r.dateLabel} в ${r.timeSlot}` : `${activeDateObj.dateNum} в ${selectedSlot}`}`,
      `Желаемый размер: ${r ? r.brideSize : brideSize}`,
      gownListText ? `Выбранные платья: ${gownListText}` : 'Подбор из наличия в салоне (1000+ платьев)',
      (r ? r.weddingDateNote : weddingDateNote.trim())
        ? `Дата свадьбы: ${r ? r.weddingDateNote : weddingDateNote.trim()}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    return buildWhatsAppUrl(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = brideName.trim();
    const digitsOnly = phone.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      setFormError('Пожалуйста, укажите ваше имя для бронирования примерочной.');
      return;
    }

    if (digitsOnly.length < 9) {
      setFormError('Пожалуйста, укажите корректный номер телефона или WhatsApp.');
      return;
    }

    const selectedNames = fittingItems
      .map((item) => {
        const found = gowns.find((g) => g.id === item.gownId);
        return found ? `${found.name} (${item.selectedSize}, ${item.selectedShade})` : null;
      })
      .filter((n): n is string => Boolean(n));

    const record: ConfirmedBookingRecord = {
      referenceCode: `LW-${1040 + Number(digitsOnly.slice(-2) || 18)}`,
      dateLabel: `${activeDateObj.dateNum} (${activeDateObj.dayShort})`,
      timeSlot: selectedSlot,
      brideSize,
      guestsCount,
      brideName: trimmedName,
      phone: phone.trim(),
      weddingDateNote: weddingDateNote.trim() || 'Уточняется на примерке',
      wishes: wishes.trim(),
      selectedGownNames: selectedNames,
    };

    setConfirmedRecord(record);
    try {
      localStorage.setItem('luxe_jalalabad_booking_v2', JSON.stringify(record));
    } catch {
      // Ignore storage errors
    }
  };

  const handleEditBooking = () => {
    if (confirmedRecord) {
      setBrideName(confirmedRecord.brideName);
      setPhone(confirmedRecord.phone);
      setBrideSize(confirmedRecord.brideSize);
      setWeddingDateNote(
        confirmedRecord.weddingDateNote === 'Уточняется на примерке'
          ? ''
          : confirmedRecord.weddingDateNote
      );
      setWishes(confirmedRecord.wishes);
    }
    setConfirmedRecord(null);
    try {
      localStorage.removeItem('luxe_jalalabad_booking_v2');
    } catch {
      // Ignore
    }
  };

  return (
    <section
      id="booking"
      className="py-20 sm:py-24 bg-[#F5F2EC] border-t border-b border-[#E3DDD2]"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs text-[#6E675F] mb-2">
              {SALON_CONTACTS.cityRegion} · {SALON_CONTACTS.mallAndFloor} ·{' '}
              {SALON_CONTACTS.workingHoursShort}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#141312]">
              Запись на примерку в салон
            </h2>
            <p className="mt-3 text-base text-[#4F4A44] leading-relaxed">
              Забронируйте удобное время с <span className="tabular-nums">10:00</span> до{' '}
              <span className="tabular-nums">19:00</span> онлайн или напишите нам напрямую в
              WhatsApp — стилист заранее подготовит модели вашего размера (XS–XXXL).
            </p>
          </div>

          {/* Direct WhatsApp Contact Strip */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={buildCurrentWhatsAppBookingUrl(confirmedRecord)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-5 inline-flex items-center gap-2 text-xs font-semibold text-[#FAF8F5] bg-[#141312] hover:bg-[#2A2724] transition-colors duration-150 whitespace-nowrap tabular-nums"
            >
              <MessageCircle className="w-4 h-4 text-[#DFC295]" />
              <span>WhatsApp: {SALON_CONTACTS.whatsappDisplay}</span>
            </a>

            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="h-11 px-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#141312] bg-[#FDFCFB] border border-[#D8D1C5] hover:border-[#141312] transition-colors duration-150 whitespace-nowrap cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedPhone ? 'Номер скопирован' : 'Скопировать номер'}</span>
            </button>
          </div>
        </div>

        {confirmedRecord ? (
          <div className="bg-[#FDFCFB] border border-[#D8D1C5] p-8 sm:p-10 max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E3DDD2]">
              <div>
                <p className="text-xs text-[#6E675F] tabular-nums">
                  Заявка #{confirmedRecord.referenceCode} оформлена
                </p>
                <h3 className="font-display text-3xl font-semibold text-[#141312] mt-1">
                  Ждем вас на примерке, {confirmedRecord.brideName}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141312]">
                <Check className="w-4 h-4 text-[#7A582C]" />
                Время закреплено
              </span>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#E3DDD2] text-sm">
              <div>
                <dt className="text-xs text-[#6E675F]">Дата и время визита</dt>
                <dd className="font-semibold text-[#141312] mt-1 tabular-nums">
                  {confirmedRecord.dateLabel} в {confirmedRecord.timeSlot}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#6E675F]">Адрес салона</dt>
                <dd className="font-semibold text-[#141312] mt-1">
                  {SALON_CONTACTS.cityRegion}, {SALON_CONTACTS.mallAndFloor}
                  <span className="block font-normal text-xs text-[#4F4A44] mt-0.5">
                    {SALON_CONTACTS.streetAddress}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#6E675F]">Желаемый размер невесты</dt>
                <dd className="font-semibold text-[#141312] mt-1">
                  Размер {confirmedRecord.brideSize} (подготовим подборку из наличия)
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#6E675F]">Гости и телефон</dt>
                <dd className="font-semibold text-[#141312] mt-1 tabular-nums">
                  Гостей: {confirmedRecord.guestsCount} · {confirmedRecord.phone}
                </dd>
              </div>
            </dl>

            <div className="py-6 border-b border-[#E3DDD2]">
              <p className="text-xs text-[#6E675F] mb-2">Отложенные модели к вашему приходу</p>
              {confirmedRecord.selectedGownNames.length > 0 ? (
                <ul className="space-y-1.5 text-sm text-[#141312]">
                  {confirmedRecord.selectedGownNames.map((name) => (
                    <li key={name}>— {name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#3F3B36]">
                  Индивидуальный подбор в зале среди более 1 000 платьев в наличии.
                </p>
              )}
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
              <a
                href={buildCurrentWhatsAppBookingUrl(confirmedRecord)}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 inline-flex items-center gap-2 text-xs font-semibold text-[#FAF8F5] bg-[#141312] hover:bg-[#2A2724] transition-colors duration-150 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#DFC295]" />
                <span>Продублировать бронь в WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleEditBooking}
                className="h-11 px-5 text-xs font-semibold text-[#141312] border border-[#141312] hover:bg-[#F5F2EC] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Изменить данные записи
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left 7 Columns: Date, Time (10:00–19:00), Size XS–XXXL, and Gown Selection */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Date & Time within 10:00 - 19:00 */}
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#141312] mb-4">
                  01. Выберите день и время (режим работы 10:00 – 19:00)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
                  {AVAILABLE_DATES.map((d) => {
                    const active = d.id === selectedDateId;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleDateChange(d.id)}
                        className={`p-3 border text-left transition-colors duration-150 tabular-nums cursor-pointer ${
                          active
                            ? 'bg-[#141312] border-[#141312] text-[#FAF8F5]'
                            : 'bg-[#FDFCFB] border-[#D8D1C5] text-[#141312] hover:border-[#141312]'
                        }`}
                      >
                        <span
                          className={`block text-xs ${
                            active ? 'text-[#DFC295]' : 'text-[#6E675F]'
                          }`}
                        >
                          {d.dayShort}
                        </span>
                        <span className="block text-sm font-semibold mt-0.5 whitespace-nowrap">
                          {d.dateNum}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {activeDateObj.slots.map((slot) => {
                    const isBusy = activeDateObj.busySlots.includes(slot);
                    const isSelected = selectedSlot === slot && !isBusy;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBusy}
                        onClick={() => setSelectedSlot(slot)}
                        className={`h-10 px-4 text-xs border transition-colors duration-150 tabular-nums whitespace-nowrap shrink-0 ${
                          isBusy
                            ? 'bg-[#EAE4D9] border-[#D8D1C5] text-[#8A8278] line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#141312] border-[#141312] text-[#FAF8F5] font-semibold cursor-pointer'
                            : 'bg-[#FDFCFB] border-[#D8D1C5] text-[#141312] hover:border-[#141312] cursor-pointer'
                        }`}
                      >
                        {isBusy ? `${slot} · Занято` : slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Bride Size Selection XS - XXXL */}
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#141312] mb-3">
                  02. Укажите ваш ориентировочный размер (XS – XXXL)
                </h3>
                <p className="text-xs text-[#6E675F] mb-3">
                  Консультант заранее подберет лучшие платья вашего размера среди более 1 000 моделей
                  в наличии.
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {FULL_SIZE_CHART.map((spec) => {
                    const active = brideSize === spec.code;
                    return (
                      <button
                        key={spec.code}
                        type="button"
                        onClick={() => setBrideSize(spec.code)}
                        className={`py-2.5 px-2 border text-center transition-colors duration-150 tabular-nums cursor-pointer ${
                          active
                            ? 'bg-[#141312] border-[#141312] text-[#FAF8F5] font-semibold'
                            : 'bg-[#FDFCFB] border-[#D8D1C5] text-[#141312] hover:border-[#141312]'
                        }`}
                      >
                        <span className="block text-xs">{spec.code}</span>
                        <span
                          className={`block text-[10px] ${
                            active ? 'text-[#DFC295]' : 'text-[#6E675F]'
                          }`}
                        >
                          {spec.ruSize} RU
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Optional Gowns from Featured Collection */}
              <div>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3 className="font-display text-2xl font-semibold text-[#141312]">
                    03. Отметить модели с витрины (по желанию)
                  </h3>
                  <span className="text-xs text-[#6E675F] tabular-nums">
                    Выбрано: {fittingItems.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {gowns.map((gown) => {
                    const chosen = fittingItems.find((i) => i.gownId === gown.id);
                    return (
                      <button
                        key={gown.id}
                        type="button"
                        onClick={() => onToggleQuickGown(gown)}
                        className={`p-3.5 border text-left flex items-center justify-between gap-3 transition-colors duration-150 cursor-pointer ${
                          chosen
                            ? 'bg-[#FDFCFB] border-[#141312]'
                            : 'bg-[#FDFCFB]/70 border-[#D8D1C5] hover:border-[#8A8278]'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#141312] truncate">
                            {gown.name}{' '}
                            <span className="font-normal text-xs text-[#6E675F]">
                              · {gown.fabricSummary}
                            </span>
                          </p>
                          <p className="text-xs text-[#6E675F] tabular-nums mt-0.5">
                            {chosen
                              ? `В списке · Размер ${chosen.selectedSize}`
                              : `Прокат ${formatSom(gown.rentalPriceSom)}`}
                          </p>
                        </div>
                        <span
                          className={`w-6 h-6 border inline-flex items-center justify-center shrink-0 ${
                            chosen
                              ? 'bg-[#141312] border-[#141312] text-[#FAF8F5]'
                              : 'border-[#D8D1C5] text-transparent'
                          }`}
                          aria-hidden="true"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Contact Form */}
            <div className="lg:col-span-5 bg-[#FDFCFB] border border-[#D8D1C5] p-6 sm:p-8 space-y-5">
              <div className="pb-4 border-b border-[#E3DDD2]">
                <h3 className="font-display text-2xl font-semibold text-[#141312]">
                  Контакты невесты
                </h3>
                <p className="text-xs text-[#6E675F] mt-1 tabular-nums">
                  {activeDateObj.dateNum} в {selectedSlot} · Размер {brideSize} · ТЦ «Бренд Микс», 3
                  этаж
                </p>
              </div>

              <label className="block">
                <span className="block text-xs font-semibold text-[#141312] mb-1.5">
                  Ваше имя *
                </span>
                <input
                  type="text"
                  required
                  placeholder="Например, Айпери"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm bg-[#FDFCFB] border border-[#D8D1C5] text-[#141312] placeholder:text-[#9C9488] focus:outline-none focus:border-[#141312]"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold text-[#141312] mb-1.5">
                  Номер телефона / WhatsApp *
                </span>
                <input
                  type="tel"
                  required
                  placeholder="+996 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm bg-[#FDFCFB] border border-[#D8D1C5] text-[#141312] tabular-nums placeholder:text-[#9C9488] focus:outline-none focus:border-[#141312]"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-xs font-semibold text-[#141312] mb-1.5">
                    Дата свадьбы / нике
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ноябрь 2026"
                      value={weddingDateNote}
                      onChange={(e) => setWeddingDateNote(e.target.value)}
                      className="w-full h-11 pl-3.5 pr-9 text-sm bg-[#FDFCFB] border border-[#D8D1C5] text-[#141312] placeholder:text-[#9C9488] focus:outline-none focus:border-[#141312]"
                    />
                    <Calendar
                      className="w-4 h-4 text-[#8A8278] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </label>

                <div>
                  <span className="block text-xs font-semibold text-[#141312] mb-1.5">
                    Гости с вами (до 4)
                  </span>
                  <div className="h-11 px-3 border border-[#D8D1C5] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setGuestsCount((c) => Math.max(0, c - 1))}
                      aria-label="Уменьшить число гостей"
                      className="w-8 h-8 inline-flex items-center justify-center text-[#141312] hover:bg-[#F5F2EC] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold text-[#141312] tabular-nums">
                      {guestsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount((c) => Math.min(4, c + 1))}
                      aria-label="Увеличить число гостей"
                      className="w-8 h-8 inline-flex items-center justify-center text-[#141312] hover:bg-[#F5F2EC] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="block text-xs font-semibold text-[#141312] mb-1.5">
                  Пожелания к платью (силуэт, закрытые рукава, прокат/покупка)
                </span>
                <textarea
                  rows={3}
                  placeholder="Например: ищу пышное платье с длинным рукавом или наряд на нике..."
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  className="w-full p-3.5 text-sm bg-[#FDFCFB] border border-[#D8D1C5] text-[#141312] placeholder:text-[#9C9488] focus:outline-none focus:border-[#141312] resize-none"
                />
              </label>

              {formError && (
                <p
                  role="alert"
                  className="text-xs font-semibold text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] p-3"
                >
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 px-6 text-xs font-semibold text-[#FAF8F5] bg-[#141312] hover:bg-[#2A2724] transition-colors duration-150 whitespace-nowrap cursor-pointer"
              >
                Подтвердить запись на примерку
              </button>

              <p className="text-[11px] text-[#6E675F] leading-relaxed">
                Примерка в салоне бесплатная. Адрес: {SALON_CONTACTS.fullAddress}.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
