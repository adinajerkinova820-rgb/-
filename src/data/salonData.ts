import heroCoutureBrideImg from '../assets/images/hero_couture_bride_1792903957524.jpg';
import gownSilkMikadoImg from '../assets/images/gown_silk_mikado_1792903957868.jpg';
import gownChantillyLaceImg from '../assets/images/gown_chantilly_lace_1792903958973.jpg';
import gownDrapedSatinImg from '../assets/images/gown_draped_satin_1792903960810.jpg';
import gownTulleBallgownImg from '../assets/images/gown_tulle_ballgown_1792903962330.jpg';
import gownRoyalBallgownImg from '../assets/images/gown_royal_ballgown_1792905660168.jpg';
import gownModestCoutureImg from '../assets/images/gown_modest_couture_1792905662092.jpg';
import atelierPrivateFittingImg from '../assets/images/atelier_private_fitting_1792903962385.jpg';

export const SALON_CONTACTS = {
  brandName: 'Luxe Wedding Salon',
  cityRegion: 'г. Жалал-Абад, Манас',
  mallAndFloor: 'ТЦ «Бренд Микс», 3-й этаж',
  streetAddress: 'проспект им. Тумонбая Байзакова, 10/55А',
  fullAddress:
    'г. Жалал-Абад, Манас, ТЦ «Бренд Микс», 3-й этаж · пр. им. Тумонбая Байзакова, 10/55А',
  workingHours: 'Ежедневно с 10:00 до 19:00',
  workingHoursShort: '10:00 – 19:00',
  whatsappRaw: '996709742488',
  whatsappDisplay: '+996 709 742 488',
  sizeRange: 'XS – XXXL',
  stockCountLabel: 'Более 1 000 платьев в наличии',
};

export enum SilhouetteCategory {
  ALL = 'all',
  ROYAL_BALLGOWN = 'royal_ballgown',
  A_LINE = 'a_line',
  MODEST_NIKE = 'modest_nike',
  MERMAID = 'mermaid',
  COLUMN = 'column',
}

export type SizeLabel = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface SizeSpec {
  code: SizeLabel;
  ruSize: string;
  bustCm: [number, number];
  waistCm: [number, number];
  hipsCm: [number, number];
}

export const FULL_SIZE_CHART: SizeSpec[] = [
  { code: 'XS', ruSize: '40', bustCm: [78, 83], waistCm: [58, 63], hipsCm: [84, 89] },
  { code: 'S', ruSize: '42', bustCm: [84, 88], waistCm: [64, 68], hipsCm: [90, 94] },
  { code: 'M', ruSize: '44–46', bustCm: [89, 94], waistCm: [69, 75], hipsCm: [95, 100] },
  { code: 'L', ruSize: '48', bustCm: [95, 100], waistCm: [76, 82], hipsCm: [101, 106] },
  { code: 'XL', ruSize: '50–52', bustCm: [101, 107], waistCm: [83, 90], hipsCm: [107, 113] },
  { code: 'XXL', ruSize: '54', bustCm: [108, 114], waistCm: [91, 98], hipsCm: [114, 120] },
  { code: 'XXXL', ruSize: '56–58', bustCm: [115, 124], waistCm: [99, 108], hipsCm: [121, 130] },
];

export interface BridalGown {
  id: string;
  name: string;
  collectionLine: string;
  silhouette: SilhouetteCategory;
  silhouetteLabel: string;
  rentalPriceSom: number;
  purchasePriceSom: number;
  fabricSummary: string;
  fabricComposition: string;
  trainLengthCm: number;
  availableSizes: SizeLabel[];
  availabilityNote: string;
  image: string;
  shades: string[];
  description: string;
  craftsmanshipDetails: string[];
}

export interface FittingSelectionItem {
  gownId: string;
  selectedSize: SizeLabel;
  selectedShade: string;
  mode: 'rental' | 'purchase';
}

export interface BrideAdviceChapter {
  id: string;
  number: string;
  tabLabel: string;
  headline: string;
  intro: string;
  tips: {
    title: string;
    detail: string;
  }[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  hint: string;
}

export interface AtelierFeature {
  index: string;
  title: string;
  summary: string;
  metricNote: string;
}

export interface BrideTestimonial {
  id: string;
  brideName: string;
  venueAndCity: string;
  weddingDate: string;
  gownAndSize: string;
  quote: string;
}

export const SALON_IMAGES = {
  heroBride: heroCoutureBrideImg,
  atelierLounge: atelierPrivateFittingImg,
};

export const SILHOUETTE_FILTERS: { id: SilhouetteCategory; label: string }[] = [
  { id: SilhouetteCategory.ALL, label: 'Все силуэты' },
  { id: SilhouetteCategory.ROYAL_BALLGOWN, label: 'Пышные королевские' },
  { id: SilhouetteCategory.A_LINE, label: 'А-силуэт' },
  { id: SilhouetteCategory.MODEST_NIKE, label: 'Закрытые и нике' },
  { id: SilhouetteCategory.MERMAID, label: 'Рыбка и годе' },
  { id: SilhouetteCategory.COLUMN, label: 'Атлас и минимализм' },
];

export const COUTURE_GOWNS: BridalGown[] = [
  {
    id: 'amelie-royal',
    name: 'Amélie Royal',
    collectionLine: 'Grand Couture 2026',
    silhouette: SilhouetteCategory.ROYAL_BALLGOWN,
    silhouetteLabel: 'Королевский пышный силуэт',
    rentalPriceSom: 48000,
    purchasePriceSom: 96000,
    fabricSummary: 'Шелковая органза и жемчуг',
    fabricComposition: 'Натуральная шелковая органза, корсетная сетка, ручная расшивка речным жемчугом',
    trainLengthCm: 165,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    availabilityNote: 'В наличии · XS–XXXL',
    image: gownRoyalBallgownImg,
    shades: ['Королевский айвори', 'Молочный жемчуг'],
    description:
      'Торжественное бальное платье со скульптурным корсетом и невесомыми рукавами, вручную расшитыми жемчужными бусинами. Воздушная юбка держит благородный объем в просторном банкетном зале и остается легкой в танце.',
    craftsmanshipDetails: [
      'Анатомический корсет с мягкой шнуровкой, моделирующий линию талии в размерах от XS до XXXL',
      'Жемчужная расшивка рукавов закреплена узелковым методом без риска зацепок',
      'В комплекте подбирается многослойный подъюбник нужной пышности и фата в тон',
    ],
  },
  {
    id: 'yasmin-modest',
    name: 'Yasmin Noble',
    collectionLine: 'Aristocrat & Nike Line',
    silhouette: SilhouetteCategory.MODEST_NIKE,
    silhouetteLabel: 'Закрытый А-силуэт с фатой',
    rentalPriceSom: 42000,
    purchasePriceSom: 85000,
    fabricSummary: 'Шелковый креп и кружево',
    fabricComposition: 'Плотный матовый шелковый креп, французское кружево на манжетах и шлейфе фаты',
    trainLengthCm: 140,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    availabilityNote: 'В наличии · XS–XXXL',
    image: gownModestCoutureImg,
    shades: ['Чистый молочный', 'Теплый фарфор'],
    description:
      'Благородный закрытый образ с высокой линией горловины, длинными рукавами с кружевными манжетами и плавно струящейся юбкой. Безупречный выбор как для основного торжества, так и для обряда нике или кыз узатуу.',
    craftsmanshipDetails: [
      'Непрозрачный дышащий шелковый креп, не образующий заломов во время поездок',
      'Изящный V-образный крой линии талии визуально вытягивает силуэт невесты',
      'Длинная кружевная фата-испанка гармонично завершает величественный образ',
    ],
  },
  {
    id: 'celeste-mikado',
    name: 'Céleste',
    collectionLine: 'Parisian Minimal 2026',
    silhouette: SilhouetteCategory.A_LINE,
    silhouetteLabel: 'Архитектурный А-силуэт',
    rentalPriceSom: 39000,
    purchasePriceSom: 79000,
    fabricSummary: 'Японский шелк микадо',
    fabricComposition: 'Плотный шелк микадо с благородным жемчужным отливом, хлопково-шелковая подкладка',
    trainLengthCm: 145,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availabilityNote: 'В наличии · XS–XXL',
    image: gownSilkMikadoImg,
    shades: ['Молочный алебастр', 'Теплый айвори'],
    description:
      'Лаконичное платье А-силуэта с изящным отворотом по линии плеч и глубокими бантовыми складками. Четкая геометрия кроя создает точеную талию и скрывает любые нюансы бедер.',
    craftsmanshipDetails: [
      'Скрытые карманы в боковых складках юбки и удобная петля для фиксации шлейфа',
      'Плотная фактура микадо идеально смотрится на студийной и уличной фотосессии',
      'Быстрая подгонка длины подола точно под ваш каблук мастером нашего салона',
    ],
  },
  {
    id: 'seraphine-chantilly',
    name: 'Séraphine',
    collectionLine: 'French Lace Couture',
    silhouette: SilhouetteCategory.MERMAID,
    silhouetteLabel: 'Силуэт годе (рыбка)',
    rentalPriceSom: 46000,
    purchasePriceSom: 92000,
    fabricSummary: 'Кружево Шантильи',
    fabricComposition: 'Тонкое французское кружево Шантильи, воздушные рукава из натуральной органзы',
    trainLengthCm: 160,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availabilityNote: 'В наличии · XS–XL',
    image: gownChantillyLaceImg,
    shades: ['Теплый айвори', 'Шампань крем'],
    description:
      'Женственный силуэт годе из ажурного кружева с воздушными рукавами-фонариками и фигурным вырезом сердечком. Мягкое клешение от середины бедра сохраняет легкость шага.',
    craftsmanshipDetails: [
      'Съемные рукава из шелковой органзы позволяют сменить образ ко второй части банкета',
      'Внутренняя утягивающая корсетная основа обеспечивает уверенную поддержку груди',
      'Ряд жемчужных пуговиц вдоль спинки и манжет ручной работы',
    ],
  },
  {
    id: 'aurelie-botanical',
    name: 'Aurélie',
    collectionLine: 'Romantic Couture 2026',
    silhouette: SilhouetteCategory.ROYAL_BALLGOWN,
    silhouetteLabel: 'Воздушный корсетный кутюр',
    rentalPriceSom: 52000,
    purchasePriceSom: 105000,
    fabricSummary: 'Фатин и 3D-лепестки',
    fabricComposition: 'Многослойный еврофатин премиум-класса, объемная ручная аппликация цветами органзы',
    trainLengthCm: 155,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    availabilityNote: 'В наличии · XS–XXXL',
    image: gownTulleBallgownImg,
    shades: ['Нежный молочный', 'Пудровый айвори'],
    description:
      'Невесомое романтичное платье с полупрозрачным корсетом на косточках, усыпанным объемными лепестками ручной работы, и летящей многослойной юбкой. Вес платья составляет менее 2,2 кг.',
    craftsmanshipDetails: [
      'Усиленная спинка корсета комфортно садится на размеры от хрупкого XS до статного XXXL',
      'По желанию невесты корсет дополняется непрозрачной шелковой подкладкой в тон',
      'Юбка не мнется в автомобиле и мгновенно расправляется перед выходом в зал',
    ],
  },
  {
    id: 'vivienne-satin',
    name: 'Vivienne',
    collectionLine: 'Milano Silk Edition',
    silhouette: SilhouetteCategory.COLUMN,
    silhouetteLabel: 'Струящийся прямой крой',
    rentalPriceSom: 34000,
    purchasePriceSom: 68000,
    fabricSummary: 'Итальянский дюшес-сатин',
    fabricComposition: 'Шелковистый дюшес-сатин косого кроя, съемный летящий шлейф с плеч из шифона',
    trainLengthCm: 180,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availabilityNote: 'В наличии · XS–XXL',
    image: gownDrapedSatinImg,
    shades: ['Жемчужный шелк', 'Сливочный айвори'],
    description:
      'Изысканная колонна с мягкой драпировкой «качели» у ключиц и длинным шифоновым шлейфом, ниспадающим с плеч вместо традиционной фаты. Прекрасный выбор для регистрации или второго платья вечера.',
    craftsmanshipDetails: [
      'Крой по косой нити мягко обтекает силуэт, не сковывая движений',
      'Двойной плотный подклад гарантирует идеальную гладкость посадки',
      'Шлейф на плечах отстегивается за 10 секунд перед первым танцем',
    ],
  },
];

export const BRIDE_ADVICE_CHAPTERS: BrideAdviceChapter[] = [
  {
    id: 'prep',
    number: '01',
    tabLabel: 'Подготовка к примерке',
    headline: 'Как подготовиться к визиту в салон, чтобы примерка прошла легко',
    intro:
      'В нашем зале в ТЦ «Бренд Микс» представлено более 1 000 платьев, поэтому правильная подготовка сэкономит ваши силы и поможет сразу увидеть образ целиком.',
    tips: [
      {
        title: 'Свежий дневной образ без плотного макияжа',
        detail:
          'Пожалуйста, откажитесь от яркой помады, тонального крема на шее и автозагара в день визита — так белоснежный шелк и кружево останутся безупречными, а вам будет комфортно переодеваться.',
      },
      {
        title: 'Гладкое бесшовное белье телесного цвета',
        detail:
          'Белье под тон кожи не заметно даже под тонкими струящимися тканями и позволяет оценить реальную посадку корсета. Большинство наших платьев уже оснащены встроенными чашками.',
      },
      {
        title: 'Группа поддержки из 1–2 близких человек',
        detail:
          'Возьмите с собой маму, сестру или лучшую подругу. Слишком большой совет гостей часто утомляет невесту противоположными мнениями, тогда как рядом с самыми родными выбор дается спокойно.',
      },
      {
        title: 'Соберите волосы или возьмите заколку-краб',
        detail:
          'Чтобы сразу увидеть, как смотрятся вырез декольте, линия плеч, серьги и высокая или низкая посадка фаты, удобно приподнять волосы за пару секунд прямо перед зеркалом.',
      },
    ],
  },
  {
    id: 'silhouette',
    number: '02',
    tabLabel: 'Силуэт и размеры XS–XXXL',
    headline: 'Секреты идеального кроя для любой фигуры от XS до XXXL',
    intro:
      'Главное правило стилистов Luxe Wedding Salon: не ограничивайтесь только фото из соцсетей. Вживую на вашей фигуре лучше всего может раскрыться силуэт, который вы раньше не рассматривали.',
    tips: [
      {
        title: 'А-силуэт и корсетная классика для гармонии пропорций',
        detail:
          'Платья А-силуэта с плотным корсетом на шнуровке мягко формируют выраженную талию, визуально вытягивают рост и одинаково роскошно смотрятся как в размере XS, так и в королевских размерах XL–XXXL.',
      },
      {
        title: 'Пышные платья для больших банкетных залов',
        detail:
          'Если торжество проходит в просторном ресторане с высоким потолком и большой сценой, выбирайте королевский силуэт со шлейфом — на масштабной площадке он сохранит торжественность образа.',
      },
      {
        title: 'Закрытые модели с рукавами для нике и классики',
        detail:
          'Обращайте внимание на эластичность проймы рукава и мягкость кружева на манжетах: в качественном лекале вы сможете свободно поднять руки во время танца и объятий с гостями.',
      },
      {
        title: 'Правильный оттенок белого под ваш цветотип',
        detail:
          'Холодный белоснежный цвет подчеркивает контрастную внешность, а теплые оттенки молока, айвори и жемчуга мягко освежают кожу и выглядят благородно при вечернем освещении.',
      },
    ],
  },
  {
    id: 'timing',
    number: '03',
    tabLabel: 'Сроки и посадка платья',
    headline: 'Когда выбирать платье и как проверить комфорт на примерке',
    intro:
      'В свадебном дне вы проведете в платье от 8 до 12 часов. Мы проверяем каждую деталь посадки заранее, чтобы в день свадьбы вы думали только о празднике.',
    tips: [
      {
        title: 'Оптимальный срок — за 1–3 месяца, но мы готовы и к срочным свадьбам',
        detail:
          'Ранний визит дает самый широкий выбор новинок сезона. Однако благодаря наличию более 1 000 готовых платьев в зале мы подберем и подгоним идеальный наряд даже за 2–3 дня до торжества.',
      },
      {
        title: 'Правило «трех движений» в примерочной',
        detail:
          'Обязательно пройдитесь по подиуму, присядьте на кресло и сделайте глубокий вдох. Корсет должен плотно фиксироваться именно на талии (чтобы платье не сползало под собственным весом), но не мешать дышать.',
      },
      {
        title: 'Точная высота свадебных туфель к финальной примерке',
        detail:
          'Длина переднего края юбки выверяется с зазором 1,5–2 см от пола именно под ваши свадебные туфли. На финальную примерку перед выдачей платья обязательно принесите выбранную пару обуви.',
      },
      {
        title: 'Запасной комфортный вариант обуви на вечер',
        detail:
          'Если для фотосессии и выхода в зал вы выбрали шпильку 10 см, подберите вторую устойчивую пару близкой высоты (например, аккуратную танкетку или блочный каблук), чтобы подол не касался пола.',
      },
    ],
  },
  {
    id: 'wedding-day',
    number: '04',
    tabLabel: 'Утро невесты и торжество',
    headline: 'Советы на утро сборов, чтобы образ остался безупречным до финала',
    intro:
      'Несколько профессиональных приемов помогут быстро надеть платье, правильно зашнуровать корсет и сохранить свежесть тканей на фотосессии и банкете.',
    tips: [
      {
        title: 'Сначала макияж и прическа, затем — свадебное платье',
        detail:
          'Надевайте платье за 30–40 минут до выхода к жениху или фотографу, когда стайлинг волос и макияж полностью зафиксированы. Пышные и корсетные модели удобнее вдевать через ноги, стоя на чистой белой ткани.',
      },
      {
        title: 'Доверьте шнуровку корсета одному помощнику',
        detail:
          'Шнуровать корсет следует сверху вниз или к линии талии плавными равномерными стежками, закладывая на подготовку 15 минут. При выдаче платья наш консультант покажет вашей маме или подруге правильную технику.',
      },
      {
        title: 'Мини-косметичка невесты у свидетельницы',
        detail:
          'Положите в сумочку подруги влажные матирующие салфетки, белые нитки с иголкой, пару невидимок для фаты, пластырь для стоп и помаду для быстрого обновления образа перед банкетом.',
      },
      {
        title: 'Фиксация шлейфа для первого танца',
        detail:
          'На прогулке и во время выхода к гостям расправьте шлейф во всю длину для эффектных кадров, а перед танцевальной программой пристегните его на специальную потайную петельку или пуговку.',
      },
    ],
  },
];

export const BRIDE_VISIT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'save-date',
    title: 'Определена примерная дата свадьбы и формат зала',
    hint: 'Ресторан, уличная регистрация, нике или кыз узатуу',
  },
  {
    id: 'select-models',
    title: 'Отмечены 2–4 понравившихся силуэта в каталоге',
    hint: 'Добавьте их в список примерки на сайте перед записью',
  },
  {
    id: 'seamless-lingerie',
    title: 'Подготовлено гладкое белье светлого или телесного тона',
    hint: 'Для точной оценки посадки лифа и спинки',
  },
  {
    id: 'shoe-height',
    title: 'Продумана желаемая высота каблука свадебных туфель',
    hint: 'В салоне также есть примерочные туфли разной высоты',
  },
  {
    id: 'trusted-guest',
    title: 'Приглашены 1–2 близких человека для теплой поддержки',
    hint: 'В просторных примерочных уютно разместятся ваши родные',
  },
  {
    id: 'book-whatsapp',
    title: 'Забронировано время визита с 10:00 до 19:00',
    hint: 'Через форму на сайте или в WhatsApp +996 709 742 488',
  },
];

export const SALON_ADVANTAGES: AtelierFeature[] = [
  {
    index: '01',
    title: 'Более 1 000 свадебных платьев в наличии',
    summary:
      'Огромный выбор в одном месте в центре Жалал-Абада: от королевских пышных шлейфов и нежного кружева до лаконичного атласа и закрытых нарядов для нике. Вам не придется ждать доставки месяцами.',
    metricNote: '1 000+ готовых образов в зале',
  },
  {
    index: '02',
    title: 'Полная размерная линейка от XS до XXXL',
    summary:
      'Мы бережно формируем коллекцию так, чтобы каждая невеста — от миниатюрного 40-го (XS) до статного 56–58 размера (XXXL) — примерила десятки роскошных моделей именно в своем размере.',
    metricNote: 'Размеры XS, S, M, L, XL, XXL, XXXL',
  },
  {
    index: '03',
    title: 'Бережная подгонка по фигуре и отпаривание',
    summary:
      'Наши мастера корректируют длину юбки под ваш рост и туфли, выверяют посадку корсета и рукавов, а перед выдачей профессионально отпаривают каждый слой ткани и фаты в фирменном чехле.',
    metricNote: 'Идеальная посадка к дате торжества',
  },
  {
    index: '04',
    title: 'Удобное расположение в ТЦ «Бренд Микс»',
    summary:
      'Просторный светлый салон на 3-м этаже с панорамными зеркалами, подиумом и внимательными стилистами. Мы открыты ежедневно с 10:00 до 19:00 без выходных.',
    metricNote: 'пр. им. Тумонбая Байзакова, 10/55А · 3 этаж',
  },
];

export const BRIDE_TESTIMONIALS: BrideTestimonial[] = [
  {
    id: 'aiperi-j',
    brideName: 'Айпери Токтосунова',
    venueAndCity: 'Жалал-Абад',
    weddingDate: 'Сентябрь 2026',
    gownAndSize: 'Amélie Royal · Размер S',
    quote:
      'Искала королевское платье с жемчужными рукавами и длинным шлейфом. В Luxe Wedding Salon в «Бренд Миксе» глаза разбежались от выбора — консультант сразу принесла пять шикарных моделей моего размера. Платье выдали идеально отпаренным вместе с фатой и диадемой!',
  },
  {
    id: 'madina-a',
    brideName: 'Мадина Абдыкадырова',
    venueAndCity: 'Жалал-Абад · Манас',
    weddingDate: 'Август 2026',
    gownAndSize: 'Yasmin Noble · Размер XL',
    quote:
      'Очень переживала, найду ли стильное закрытое платье своего размера XL без тяжелых колец. Здесь оказался огромный выбор до XXXL! Мы подобрали нежнейший шелковый креп с кружевной фатой для нике и регистрации — я чувствовала себя легко весь день.',
  },
  {
    id: 'aruuke-s',
    brideName: 'Арууке Сатыбалдиева',
    venueAndCity: 'Сузак · Жалал-Абад',
    weddingDate: 'Октябрь 2026',
    gownAndSize: 'Aurélie · Размер XS',
    quote:
      'Записалась через WhatsApp за неделю до свадьбы. Девочки встретили нас с мамой так тепло, помогли с выбором туфель и за два дня укоротили подол ровно под мой невысокий рост. Огромное спасибо за заботу и красоту!',
  },
];

export function formatSom(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' сом';
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${SALON_CONTACTS.whatsappRaw}?text=${encodeURIComponent(message)}`;
}
