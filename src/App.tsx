/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, MessageCircle, Search } from 'lucide-react';
import {
  BRIDE_TESTIMONIALS,
  BridalGown,
  COUTURE_GOWNS,
  FULL_SIZE_CHART,
  FittingSelectionItem,
  SALON_ADVANTAGES,
  SALON_CONTACTS,
  SALON_IMAGES,
  SILHOUETTE_FILTERS,
  SilhouetteCategory,
  SizeLabel,
  buildWhatsAppUrl,
  formatSom,
} from './data/salonData';
import { Header } from './components/Header';
import { ResilientImage } from './components/ResilientImage';
import { GownDetailModal } from './components/GownDetailModal';
import { FittingDrawer } from './components/FittingDrawer';
import { BrideAdviceSection } from './components/BrideAdviceSection';
import { BookingSection } from './components/BookingSection';

type PriceMode = 'rental' | 'purchase';

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteCategory>(
    SilhouetteCategory.ALL
  );
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<SizeLabel | 'ALL'>('ALL');
  const [priceMode, setPriceMode] = useState<PriceMode>('rental');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeModalGown, setActiveModalGown] = useState<BridalGown | null>(null);
  const [isFittingDrawerOpen, setIsFittingDrawerOpen] = useState(false);

  const [fittingItems, setFittingItems] = useState<FittingSelectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('luxe_jalalabad_fitting_v2');
      return saved ? (JSON.parse(saved) as FittingSelectionItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('luxe_jalalabad_fitting_v2', JSON.stringify(fittingItems));
    } catch {
      // Ignore storage errors
    }
  }, [fittingItems]);

  const navigateToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleFittingItem = (item: FittingSelectionItem) => {
    setFittingItems((prev) => {
      const exists = prev.some((x) => x.gownId === item.gownId);
      if (exists) {
        return prev.filter((x) => x.gownId !== item.gownId);
      }
      return [...prev, item];
    });
  };

  const handleToggleQuickGown = (gown: BridalGown) => {
    const chosenSize: SizeLabel =
      selectedSizeFilter !== 'ALL' && gown.availableSizes.includes(selectedSizeFilter)
        ? selectedSizeFilter
        : gown.availableSizes.includes('M')
        ? 'M'
        : gown.availableSizes[0];

    handleToggleFittingItem({
      gownId: gown.id,
      selectedSize: chosenSize,
      selectedShade: gown.shades[0],
      mode: priceMode,
    });
  };

  const handleRemoveFittingItem = (gownId: string) => {
    setFittingItems((prev) => prev.filter((x) => x.gownId !== gownId));
  };

  const handleBookGownDirectly = (item: FittingSelectionItem) => {
    setFittingItems((prev) => {
      const filtered = prev.filter((x) => x.gownId !== item.gownId);
      return [...filtered, item];
    });
    setActiveModalGown(null);
    setTimeout(() => navigateToSection('booking'), 80);
  };

  const filteredGowns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COUTURE_GOWNS.filter((gown) => {
      const matchesSilhouette =
        selectedSilhouette === SilhouetteCategory.ALL || gown.silhouette === selectedSilhouette;
      const matchesSize =
        selectedSizeFilter === 'ALL' || gown.availableSizes.includes(selectedSizeFilter);
      const matchesSearch =
        !q ||
        gown.name.toLowerCase().includes(q) ||
        gown.collectionLine.toLowerCase().includes(q) ||
        gown.fabricSummary.toLowerCase().includes(q) ||
        gown.silhouetteLabel.toLowerCase().includes(q);
      return matchesSilhouette && matchesSize && matchesSearch;
    });
  }, [selectedSilhouette, selectedSizeFilter, searchQuery]);

  const heroWhatsAppUrl = buildWhatsAppUrl(
    `Здравствуйте, Luxe Wedding Salon! Пишу с сайта, хочу записаться на примерку в ТЦ «Бренд Микс» (3-й этаж).`
  );

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#141312]">
      {/* Strict 3-Zone Top Bar */}
      <Header
        fittingCount={fittingItems.length}
        onOpenFittingDrawer={() => setIsFittingDrawerOpen(true)}
        onNavigateSection={navigateToSection}
      />

      <main className="flex-1">
        {/* SECTION 1: Redesigned Velvet Noir Editorial Hero + Full-Width Salon Facts Bar */}
        <section className="bg-[#121110] text-[#FAF8F5] border-b border-[#292623]">
          <div className="max-w-[1280px] mx-auto px-6 py-12 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left 7 Columns: Editorial Typography & Proposition */}
              <div className="lg:col-span-7 flex flex-col justify-between py-2">
                <div>
                  <p className="text-xs text-[#DFC295] tracking-[0.02em] mb-4">
                    {SALON_CONTACTS.cityRegion} · {SALON_CONTACTS.mallAndFloor} ·{' '}
                    {SALON_CONTACTS.streetAddress}
                  </p>
                  <h1 className="font-display text-[clamp(2.35rem,4.4vw,3.9rem)] leading-[1.08] font-semibold text-[#FAF8F5]">
                    Более 1 000 роскошных свадебных платьев в размерах от XS до XXXL
                  </h1>
                  <p className="mt-6 text-base text-[#CFC9C0] leading-[1.68] max-w-[58ch] tracking-[0.01em]">
                    Дом свадебной моды <strong className="font-semibold text-[#FAF8F5]">Luxe Wedding Salon</strong>{' '}
                    приглашает невест на примерку в просторный зал в центре Жалал-Абада. Королевские
                    пышные шлейфы, нежное кружево, благородный шелк микадо и изысканные закрытые
                    наряды для нике — готовые к вашему торжеству без ожидания доставки.
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-[#292623] flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigateToSection('booking')}
                    className="h-12 px-7 inline-flex items-center justify-center gap-2.5 text-xs font-semibold text-[#121110] bg-[#DFC295] hover:bg-[#EAD3AE] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Записаться на примерку</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={heroWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 px-6 inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#FAF8F5] border border-[#3E3933] hover:border-[#DFC295] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums"
                  >
                    <MessageCircle className="w-4 h-4 text-[#DFC295]" />
                    <span>WhatsApp {SALON_CONTACTS.whatsappDisplay}</span>
                  </a>

                  <a
                    href="#advice"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection('advice');
                    }}
                    className="py-2 px-2 text-xs font-semibold text-[#DFC295] hover:text-[#FAF8F5] underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    Читать советы невестам
                  </a>
                </div>
              </div>

              {/* Right 5 Columns: Framed Couture Bride Portrait */}
              <div className="lg:col-span-5">
                <div className="h-full min-h-[380px] p-2.5 bg-[#1B1917] border border-[#2F2B26]">
                  <ResilientImage
                    src={SALON_IMAGES.heroBride}
                    alt="Невеста в свадебном платье Luxe Wedding Salon"
                    fallbackTitle="Luxe Wedding Salon · Жалал-Абад"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Salon Scale Strip Below Split Hero */}
            <div className="mt-12 pt-9 border-t border-[#292623] grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <p className="font-display text-3xl sm:text-4xl font-semibold text-[#DFC295] tabular-nums">
                  1 000+ платьев
                </p>
                <p className="text-xs text-[#CFC9C0] mt-1.5 tracking-[0.01em]">
                  Готовых свадебных и нике-образов прямо сейчас в наличии в зале
                </p>
              </div>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-semibold text-[#FAF8F5]">
                  XS – XXXL
                </p>
                <p className="text-xs text-[#CFC9C0] mt-1.5 tracking-[0.01em] tabular-nums">
                  Полная размерная сетка от 40 до 58 размера без компромиссов в красоте
                </p>
              </div>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-semibold text-[#FAF8F5] tabular-nums">
                  10:00 – 19:00
                </p>
                <p className="text-xs text-[#CFC9C0] mt-1.5 tracking-[0.01em]">
                  Работаем ежедневно без выходных · бесплатная примерка со стилистом
                </p>
              </div>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-semibold text-[#FAF8F5] tabular-nums">
                  3-й этаж
                </p>
                <p className="text-xs text-[#CFC9C0] mt-1.5 tracking-[0.01em]">
                  г. Жалал-Абад, Манас, ТЦ «Бренд Микс» · пр. им. Т. Байзакова, 10/55А
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 3-Column Featured Couture Catalog */}
        <section id="collection" className="py-20 sm:py-24 bg-[#FDFCFB]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs text-[#6E675F] mb-2">
                  Витрина бестселлеров сезона · В салоне представлено более 1 000 моделей
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#141312]">
                  Избранная коллекция салона
                </h2>
              </div>

              {/* Rental / Purchase Mode + Search + Size Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex p-1 bg-[#F5F2EC] border border-[#E3DDD2]">
                  <button
                    type="button"
                    onClick={() => setPriceMode('rental')}
                    className={`px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      priceMode === 'rental'
                        ? 'bg-[#141312] text-[#FAF8F5]'
                        : 'text-[#4F4A44] hover:text-[#141312]'
                    }`}
                  >
                    Прокат
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceMode('purchase')}
                    className={`px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      priceMode === 'purchase'
                        ? 'bg-[#141312] text-[#FAF8F5]'
                        : 'text-[#4F4A44] hover:text-[#141312]'
                    }`}
                  >
                    Покупка
                  </button>
                </div>

                <select
                  value={selectedSizeFilter}
                  onChange={(e) => setSelectedSizeFilter(e.target.value as SizeLabel | 'ALL')}
                  aria-label="Фильтр по размеру XS–XXXL"
                  className="h-10 px-3 text-xs bg-[#FDFCFB] border border-[#D8D1C5] text-[#141312] focus:outline-none focus:border-[#141312] cursor-pointer"
                >
                  <option value="ALL">Все размеры (XS–XXXL)</option>
                  {FULL_SIZE_CHART.map((s) => (
                    <option key={s.code} value={s.code}>
                      Размер {s.code} ({s.ruSize} RU)
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Search
                    className="w-4 h-4 text-[#8A8278] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по ткани или крою..."
                    aria-label="Поиск платьев по ткани или силуэту"
                    className="h-10 w-52 sm:w-60 pl-9 pr-3 text-xs bg-[#FDFCFB] border border-[#D8D1C5] text-[#141312] placeholder:text-[#8A8278] focus:outline-none focus:border-[#141312]"
                  />
                </div>
              </div>
            </div>

            {/* Silhouette Segmented Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-8 mb-10 border-b border-[#E3DDD2]">
              <div
                role="tablist"
                aria-label="Фильтр по силуэту платья"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F5F2EC]"
              >
                {SILHOUETTE_FILTERS.map((filter) => {
                  const active = selectedSilhouette === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedSilhouette(filter.id)}
                      className={`px-4 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#141312] text-[#FAF8F5]'
                          : 'text-[#4F4A44] hover:text-[#141312]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {fittingItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsFittingDrawerOpen(true)}
                  className="text-xs font-semibold text-[#141312] underline underline-offset-4 hover:text-[#7A582C] tabular-nums whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Открыть список примерки ({fittingItems.length})
                </button>
              )}
            </div>

            {/* 3-Column Couture Product Grid */}
            {filteredGowns.length === 0 ? (
              <div className="py-16 text-center border border-[#E3DDD2] bg-[#F5F2EC] px-6">
                <p className="font-display text-2xl text-[#141312]">
                  По выбранным параметрам на онлайн-витрине моделей не найдено
                </p>
                <p className="text-sm text-[#6E675F] mt-2 max-w-lg mx-auto">
                  В самом салоне в ТЦ «Бренд Микс» (3-й этаж) в наличии более 1 000 платьев во всех
                  размерах XS–XXXL. Сбросьте фильтры или напишите нам в WhatsApp — мы пришлем фото
                  под ваш запрос!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSilhouette(SilhouetteCategory.ALL);
                    setSelectedSizeFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-5 h-10 px-5 text-xs font-semibold bg-[#141312] text-[#FAF8F5] cursor-pointer"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGowns.map((gown, index) => {
                  const inList = fittingItems.some((item) => item.gownId === gown.id);
                  const shownPrice =
                    priceMode === 'rental' ? gown.rentalPriceSom : gown.purchasePriceSom;

                  return (
                    <motion.article
                      key={gown.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : { y: -3, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } }
                      }
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.55,
                        delay: shouldReduceMotion ? 0 : (index % 3) * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="group flex flex-col justify-between"
                    >
                      <div>
                        {/* 3:4 Portrait Card Image */}
                        <div
                          onClick={() => setActiveModalGown(gown)}
                          className="aspect-[3/4] w-full bg-[#F5F2EC] overflow-hidden border border-[#E3DDD2] cursor-pointer"
                        >
                          <ResilientImage
                            src={gown.image}
                            alt={`${gown.name} — ${gown.silhouetteLabel}`}
                            fallbackTitle={gown.name}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        </div>

                        {/* Unboxed Metadata */}
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#6E675F] truncate">
                          <span className="truncate">{gown.collectionLine}</span>
                          <span aria-hidden="true">·</span>
                          <span className="shrink-0">{gown.fabricSummary}</span>
                        </div>

                        <div className="mt-1.5 flex items-baseline justify-between gap-3">
                          <h3 className="text-base font-semibold text-[#141312] font-sans">
                            <button
                              type="button"
                              onClick={() => setActiveModalGown(gown)}
                              className="text-left hover:underline underline-offset-4 cursor-pointer"
                            >
                              {gown.name}
                            </button>
                          </h3>
                          <span className="text-[15px] font-semibold text-[#141312] tabular-nums shrink-0">
                            {formatSom(shownPrice)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-[#6E675F]">
                          {gown.silhouetteLabel} · {gown.availabilityNote}
                        </p>
                      </div>

                      {/* Card Footer Controls */}
                      <div className="mt-4 pt-3.5 border-t border-[#ECE7DF] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveModalGown(gown)}
                          className="py-1.5 text-xs font-semibold text-[#141312] hover:text-[#7A582C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Размеры и детали
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleQuickGown(gown)}
                          className={`h-8 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                            inList
                              ? 'bg-[#141312] border-[#141312] text-[#FAF8F5]'
                              : 'bg-[#FDFCFB] border-[#D8D1C5] text-[#141312] hover:border-[#141312]'
                          }`}
                        >
                          {inList ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>В примерке</span>
                            </>
                          ) : (
                            <span>+ В примерку</span>
                          )}
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: Dedicated Bridal Advice Guide & Interactive Checklist */}
        <BrideAdviceSection onNavigateBooking={() => navigateToSection('booking')} />

        {/* SECTION 4: Salon Space in Jalal-Abad + Adjacent Real Bride Reviews */}
        <section id="atelier" className="py-20 sm:py-24 bg-[#FDFCFB]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs text-[#6E675F] mb-2">
                  О свадебном доме · {SALON_CONTACTS.cityRegion}
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#141312]">
                  Пространство красоты в ТЦ «Бренд Микс»
                </h2>
                <p className="mt-4 text-base text-[#4F4A44] leading-relaxed">
                  Мы создали салон на 3-м этаже ТЦ «Бренд Микс» (проспект им. Тумонбая Байзакова,
                  10/55А), где каждая невеста окружена заботой. Свыше 1 000 платьев в наличии,
                  полный размерный ряд от XS до XXXL и внимательные стилисты помогут найти именно
                  ваш образ с первой встречи.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateToSection('booking')}
                    className="h-11 px-6 text-xs font-semibold text-[#FAF8F5] bg-[#141312] hover:bg-[#2A2724] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Записаться в салон
                  </button>
                  <a
                    href={heroWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-5 inline-flex items-center gap-2 text-xs font-semibold text-[#141312] border border-[#141312] hover:bg-[#F5F2EC] transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 text-[#7A582C]" />
                    <span>Написать в WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="aspect-[16/9] w-full bg-[#F5F2EC] overflow-hidden border border-[#E3DDD2]">
                  <ResilientImage
                    src={SALON_IMAGES.atelierLounge}
                    alt="Зал примерки свадебного салона Luxe Wedding Salon в ТЦ Бренд Микс"
                    fallbackTitle="Luxe Wedding Salon · ТЦ «Бренд Микс», 3-й этаж"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 4 Numbered Salon Advantages */}
            <div className="mt-14 pt-12 border-t border-[#E3DDD2] grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {SALON_ADVANTAGES.map((adv) => (
                <div
                  key={adv.index}
                  className="pb-8 border-b border-[#ECE7DF] flex flex-col justify-between gap-3"
                >
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#141312]">
                      {adv.index}. {adv.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#4F4A44] leading-relaxed">{adv.summary}</p>
                  </div>
                  <p className="text-xs font-semibold text-[#7A582C] tabular-nums">
                    {adv.metricNote}
                  </p>
                </div>
              ))}
            </div>

            {/* Adjacent Bride Testimonials */}
            <div className="mt-20 pt-12 border-t border-[#E3DDD2]">
              <div className="max-w-xl mb-10">
                <p className="text-xs text-[#6E675F] mb-2">Отзывы наших невест</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141312]">
                  Счастливые истории выбора
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                {BRIDE_TESTIMONIALS.map((story) => (
                  <blockquote
                    key={story.id}
                    className="p-7 bg-[#F5F2EC] border border-[#E3DDD2] flex flex-col justify-between gap-6"
                  >
                    <p className="text-sm text-[#2A2724] leading-relaxed">«{story.quote}»</p>
                    <footer className="pt-4 border-t border-[#E3DDD2]">
                      <p className="text-sm font-semibold text-[#141312]">{story.brideName}</p>
                      <p className="text-xs text-[#6E675F] mt-0.5">
                        {story.venueAndCity} · {story.weddingDate}
                      </p>
                      <p className="text-xs text-[#7A582C] mt-1">{story.gownAndSize}</p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Interactive Booking & WhatsApp Studio */}
        <BookingSection
          gowns={COUTURE_GOWNS}
          fittingItems={fittingItems}
          onToggleQuickGown={handleToggleQuickGown}
        />
      </main>

      {/* SECTION 6: Velvet Noir Footer with Exact Jalal-Abad Coordinates */}
      <footer id="contacts" className="bg-[#121110] text-[#E5E0D8] py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#292623]">
            <div className="md:col-span-5 space-y-3">
              <p className="font-display text-2xl font-semibold text-[#FAF8F5] tracking-wide">
                Luxe Wedding Salon
              </p>
              <p className="text-sm text-[#B8B1A6] max-w-sm leading-relaxed tracking-[0.01em]">
                Свадебный салон класса люкс. Более 1 000 свадебных и вечерних платьев в наличии в
                размерах от XS до XXXL.
              </p>
            </div>

            <div className="md:col-span-4 space-y-2 text-sm tracking-[0.01em]">
              <p className="font-semibold text-[#FAF8F5]">Адрес и режим работы</p>
              <p className="text-[#CFC9C0]">
                {SALON_CONTACTS.cityRegion}, {SALON_CONTACTS.mallAndFloor}
              </p>
              <p className="text-[#B8B1A6]">{SALON_CONTACTS.streetAddress}</p>
              <p className="text-[#DFC295] tabular-nums pt-1">{SALON_CONTACTS.workingHours}</p>
              <div className="pt-2 flex flex-col gap-1 tabular-nums">
                <a
                  href={`tel:+${SALON_CONTACTS.whatsappRaw}`}
                  className="text-[#FAF8F5] font-semibold hover:underline underline-offset-4"
                >
                  Тел. / WhatsApp: {SALON_CONTACTS.whatsappDisplay}
                </a>
                <a
                  href={heroWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#DFC295] hover:underline underline-offset-4"
                >
                  Открыть чат в WhatsApp →
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-sm tracking-[0.01em]">
              <p className="font-semibold text-[#FAF8F5]">Разделы сайта</p>
              <ul className="space-y-2 text-[#B8B1A6]">
                <li>
                  <a
                    href="#collection"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection('collection');
                    }}
                    className="hover:text-[#FAF8F5] transition-colors"
                  >
                    Коллекция платьев (XS–XXXL)
                  </a>
                </li>
                <li>
                  <a
                    href="#advice"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection('advice');
                    }}
                    className="hover:text-[#FAF8F5] transition-colors"
                  >
                    Советы для невест
                  </a>
                </li>
                <li>
                  <a
                    href="#atelier"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection('atelier');
                    }}
                    className="hover:text-[#FAF8F5] transition-colors"
                  >
                    О салоне в ТЦ «Бренд Микс»
                  </a>
                </li>
                <li>
                  <a
                    href="#booking"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection('booking');
                    }}
                    className="hover:text-[#FAF8F5] transition-colors"
                  >
                    Запись на примерку
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8E877D] tracking-[0.01em]">
            <p>© 2026 Luxe Wedding Salon · г. Жалал-Абад, Манас.</p>
            <p className="tabular-nums">
              ТЦ «Бренд Микс», 3-й этаж · пр. им. Тумонбая Байзакова, 10/55А · 10:00–19:00
            </p>
          </div>
        </div>
      </footer>

      {/* Contiguous Product Detail Modal */}
      <GownDetailModal
        gown={activeModalGown}
        defaultMode={priceMode}
        fittingItems={fittingItems}
        onClose={() => setActiveModalGown(null)}
        onToggleFittingItem={handleToggleFittingItem}
        onBookGownDirectly={handleBookGownDirectly}
      />

      {/* Slide-over Fitting Lookbook Drawer */}
      <FittingDrawer
        isOpen={isFittingDrawerOpen}
        fittingItems={fittingItems}
        gowns={COUTURE_GOWNS}
        onClose={() => setIsFittingDrawerOpen(false)}
        onRemoveItem={handleRemoveFittingItem}
        onProceedToBooking={() => {
          setIsFittingDrawerOpen(false);
          setTimeout(() => navigateToSection('booking'), 80);
        }}
      />
    </div>
  );
}
