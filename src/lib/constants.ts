import { ClientRecord, EstimatorState, PrintTemplate } from '@/types/estimator';

export const INITIAL_CLIENTS: ClientRecord[] = [];

export const JOB_CATEGORIES = [
  'Leaflet',
  'Visiting Card',
  'Brochure',
  'Book',
  'Carton Box',
  'Memo Pad',
  'Poster / Banner',
  'Envelope',
  'Calendar',
];

export const PAPER_TYPES = [
  { id: 'art_paper', label: 'Art Paper (আর্ট পেপার)', defaultGsm: 150, defaultReamPrice: 3500 },
  { id: 'offset', label: 'Offset Paper (অফসেট পেপার)', defaultGsm: 80, defaultReamPrice: 2400 },
  { id: 'art_card', label: 'Art Card (আর্ট কার্ড)', defaultGsm: 300, defaultReamPrice: 4800 },
  { id: 'swedish_board', label: 'Swedish Board (সুইডিশ বোর্ড)', defaultGsm: 300, defaultReamPrice: 5200 },
  { id: 'duplex_board', label: 'Duplex Board (ডুপ্লেক্স বোর্ড)', defaultGsm: 250, defaultReamPrice: 2800 },
  { id: 'newsprint', label: 'Newsprint Paper (নিউজপ্রিন্ট)', defaultGsm: 55, defaultReamPrice: 1400 },
];

export const FULL_SHEET_SIZES = [
  '23 × 36 inch',
  '20 × 30 inch',
  '25 × 38 inch',
  '28 × 40 inch',
  'Custom Size',
];

export const LAMINATION_TYPES = [
  'Matte Lamination',
  'Gloss Lamination',
  'Thermal',
  'Spot UV',
];

export const BINDING_TYPES = [
  'Saddle Stitch',
  'Perfect Bind',
  'Pad Gluing',
  'Hard Cover',
  'Spiral Wire',
];

export const DEFAULT_ESTIMATOR_STATE: EstimatorState = {
  jobSpecs: {
    jobTitle: 'Company Leaflet',
    client: 'ABC Pharma Ltd.',
    category: 'Leaflet',
    targetQuantity: 10000,
  },
  paperConfig: {
    paperType: 'Art Paper (আর্ট পেপার)',
    fullSheetSize: '23 × 36 inch',
    gsm: 150,
    priceMode: 'ream',
    pricePerReam: 3500,
    pricePerSheet: 7.0,
    piecesPerFullSheet: 24,
    wastagePercent: 5,
  },
  pressConfig: {
    colors: '4 Color (CMYK)',
    sides: 'One Side',
    costPerPlate: 700,
    impressionRatePerThousand: 150,
  },
  finishingConfig: {
    lamination: {
      enabled: true,
      type: 'Matte Lamination',
      ratePerPcs: 2.5, // Reference screenshot input: 2.50
    },
    dieCutting: {
      enabled: true,
      dieSetupCharge: 2500, // Reference screenshot input: 2,500
      punchRatePerPcs: 0.4, // Reference screenshot input: 0.40
    },
    binding: {
      enabled: false,
      type: 'Saddle Stitch',
      ratePerPcs: 0.0,
    },
  },
  additionalExpenses: {
    transport: 2000,
    otherExpenses: 1000,
    notes: 'Urgent delivery required by Thursday 5:00 PM. High quality offset finish.',
  },
  profitMarginPercent: 25,
};

export const PRESET_TEMPLATES: PrintTemplate[] = [
  {
    id: 'template-default-leaflet',
    name: 'Company Leaflet (10,000 pcs)',
    description: '4 Color CMYK, Matte Lamination, Die Cutting, 25% Margin (Screenshot Match)',
    category: 'Leaflet',
    state: DEFAULT_ESTIMATOR_STATE,
  },
  {
    id: 'template-visiting-card',
    name: 'Premium Visiting Cards (1,000 pcs)',
    description: '300 GSM Art Card, 4 Color Both Sides, Matte Lamination + Spot UV',
    category: 'Visiting Card',
    state: {
      jobSpecs: {
        jobTitle: 'Corporate Executive Visiting Cards',
        client: 'Beximco Consumer Brands',
        category: 'Visiting Card',
        targetQuantity: 1000,
      },
      paperConfig: {
        paperType: 'Art Card (আর্ট কার্ড)',
        fullSheetSize: '20 × 30 inch',
        gsm: 300,
        priceMode: 'ream',
        pricePerReam: 4800,
        pricePerSheet: 9.6,
        piecesPerFullSheet: 36,
        wastagePercent: 5,
      },
      pressConfig: {
        colors: '4 Color (CMYK)',
        sides: 'Two Side (Work & Turn)',
        costPerPlate: 700,
        impressionRatePerThousand: 200,
      },
      finishingConfig: {
        lamination: {
          enabled: true,
          type: 'Matte Lamination',
          ratePerPcs: 1.2,
        },
        dieCutting: {
          enabled: true,
          dieSetupCharge: 1200,
          punchRatePerPcs: 0.3,
        },
        binding: {
          enabled: false,
          type: 'Saddle Stitch',
          ratePerPcs: 0,
        },
      },
      additionalExpenses: {
        transport: 500,
        otherExpenses: 300,
        notes: 'Round corner cutting and embossed logo on front.',
      },
      profitMarginPercent: 30,
    },
  },
  {
    id: 'template-brochure',
    name: 'Corporate Tri-Fold Brochure (5,000 pcs)',
    description: '170 GSM Art Paper, 4 Color Both Sides, Gloss Lamination, Folding',
    category: 'Brochure',
    state: {
      jobSpecs: {
        jobTitle: 'Annual Products & Services Brochure',
        client: 'Square Toiletries & Healthcare',
        category: 'Brochure',
        targetQuantity: 5000,
      },
      paperConfig: {
        paperType: 'Art Paper (আর্ট পেপার)',
        fullSheetSize: '25 × 38 inch',
        gsm: 170,
        priceMode: 'ream',
        pricePerReam: 4200,
        pricePerSheet: 8.4,
        piecesPerFullSheet: 8,
        wastagePercent: 5,
      },
      pressConfig: {
        colors: '4 Color (CMYK)',
        sides: 'Two Side (Work & Turn)',
        costPerPlate: 700,
        impressionRatePerThousand: 180,
      },
      finishingConfig: {
        lamination: {
          enabled: true,
          type: 'Gloss Lamination',
          ratePerPcs: 1.5,
        },
        dieCutting: {
          enabled: true,
          dieSetupCharge: 1800,
          punchRatePerPcs: 0.25,
        },
        binding: {
          enabled: false,
          type: 'Saddle Stitch',
          ratePerPcs: 0,
        },
      },
      additionalExpenses: {
        transport: 1500,
        otherExpenses: 800,
        notes: 'Precise 3-fold crease line and moisture-resistant packaging.',
      },
      profitMarginPercent: 28,
    },
  },
  {
    id: 'template-carton-box',
    name: 'Pharma Medicine Carton Box (20,000 pcs)',
    description: '300 GSM Duplex Board, 4 Color, Die Cutting & Automatic Side Pasting',
    category: 'Carton Box',
    state: {
      jobSpecs: {
        jobTitle: 'Antibiotic Syrup 100ml Carton Box',
        client: 'ABC Pharma Ltd.',
        category: 'Carton Box',
        targetQuantity: 20000,
      },
      paperConfig: {
        paperType: 'Duplex Board (ডুপ্লেক্স বোর্ড)',
        fullSheetSize: '28 × 40 inch',
        gsm: 300,
        priceMode: 'sheet',
        pricePerReam: 5400,
        pricePerSheet: 11.5,
        piecesPerFullSheet: 12,
        wastagePercent: 6,
      },
      pressConfig: {
        colors: '4 Color (CMYK)',
        sides: 'One Side',
        costPerPlate: 900,
        impressionRatePerThousand: 220,
      },
      finishingConfig: {
        lamination: {
          enabled: true,
          type: 'Thermal',
          ratePerPcs: 0.65,
        },
        dieCutting: {
          enabled: true,
          dieSetupCharge: 4500,
          punchRatePerPcs: 0.35,
        },
        binding: {
          enabled: true,
          type: 'Pad Gluing',
          ratePerPcs: 0.4,
        },
      },
      additionalExpenses: {
        transport: 3500,
        otherExpenses: 2000,
        notes: 'Pharma grade food-safe varnish and lot number embossing.',
      },
      profitMarginPercent: 22,
    },
  },
  {
    id: 'template-memo-pad',
    name: 'Official Cash Memo Pad (500 Pads × 50 Leaves)',
    description: 'Offset 70 GSM, 2 Color, Numbering & Perforation, Pad Gluing',
    category: 'Memo Pad',
    state: {
      jobSpecs: {
        jobTitle: 'Duplicate Cash Receipt Memo Pad',
        client: 'Arambagh Publications',
        category: 'Memo Pad',
        targetQuantity: 25000,
      },
      paperConfig: {
        paperType: 'Offset Paper (অফসেট পেপার)',
        fullSheetSize: '20 × 30 inch',
        gsm: 70,
        priceMode: 'ream',
        pricePerReam: 2200,
        pricePerSheet: 4.4,
        piecesPerFullSheet: 16,
        wastagePercent: 5,
      },
      pressConfig: {
        colors: '2 Color',
        sides: 'One Side',
        costPerPlate: 600,
        impressionRatePerThousand: 120,
      },
      finishingConfig: {
        lamination: {
          enabled: false,
          type: 'Matte Lamination',
          ratePerPcs: 0,
        },
        dieCutting: {
          enabled: false,
          dieSetupCharge: 0,
          punchRatePerPcs: 0,
        },
        binding: {
          enabled: true,
          type: 'Pad Gluing',
          ratePerPcs: 0.25,
        },
      },
      additionalExpenses: {
        transport: 1200,
        otherExpenses: 500,
        notes: 'Consecutive serial numbering from #0001 to #25000 with clean tear perforation.',
      },
      profitMarginPercent: 25,
    },
  },
];
