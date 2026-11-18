import { CatalogCategory, CatalogProduct } from '../types/companion';

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  'Face Care',
  'Body Care',
  'Hair Care',
  'Sun Protection',
  'Health & Fitness',
  "Women's Wellness",
  'Sleep & Wellbeing',
  'Kits & Combos',
];

/**
 * Be Bodywise product catalogue sourced from https://bebodywise.com/shop/all and https://bebodywise.com/sitemap.
 * Official availability reflects verified store stock status ("In Stock", "Out of Stock"), or "Availability not verified"
 * where stock status cannot be verified on the live site. No product data or stock status is guessed.
 */
export const BE_BODYWISE_CATALOG: CatalogProduct[] = [
  {
    "id": "bw-benzoyl-peroxide-facewash",
    "name": "2.5% Benzoyl Peroxide Facewash",
    "category": "Face Care",
    "subcategory": "Face Cleanser",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_BenzPFW%20%281%29_fmfhn3.png?tr=w-600",
    "shortDescription": "For Persistent Severe Acne | All Skin Types | Suitable for 13+ yrs",
    "keyIngredients": [
      "2.5% Benzoyl Peroxide",
      "Aloe Vera Extract"
    ],
    "variants": [
      {
        "label": "100 ml Tube",
        "sizeOrPack": "100 ml",
        "url": "https://bebodywise.com/product/benzoyl-peroxide-facewash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00437.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/benzoyl-peroxide-facewash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "100 ml",
      "benzoyl peroxide",
      "facewash",
      "acne",
      "MC - Acne"
    ]
  },
  {
    "id": "bw-2-salicylic-face-wash",
    "name": "2% Salicylic Acid Face Wash",
    "category": "Face Care",
    "subcategory": "Face Cleanser",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_SAFW_4uzp3w.jpg?tr=w-600",
    "shortDescription": "For Mild Occasional Acne | Oily Skin Type | Suitable for 13+ yrs",
    "keyIngredients": [
      "2% Salicylic Acid",
      "Allantoin"
    ],
    "variants": [
      {
        "label": "100 ml",
        "sizeOrPack": "100 ml",
        "url": "https://bebodywise.com/product/2-salicylic-acid-face-wash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00169.B0_N"
      },
      {
        "label": "Pack of 2",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/2-salicylic-acid-face-wash-pack-2",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Sample",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/2-salicylic-acid-face-wash-sample",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/2-salicylic-acid-face-wash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "100 ml",
      "salicylic acid",
      "facewash",
      "acne",
      "MC - Acne"
    ]
  },
  {
    "id": "bw-1-salicylic-foam-face-wash",
    "name": "1% Salicylic Acid Face Wash (Foam-Based)",
    "category": "Face Care",
    "subcategory": "Face Cleanser",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/acne-control-wash/AppThumbnail_1SalicylicAcid_FaceWash_Foam.blend%20%281%29_eyicuh.jpeg?tr=w-600",
    "shortDescription": "For Mild Occasional Acne | Dry/Combination Skin Type | Suitable for 13+ yrs",
    "keyIngredients": [
      "1% Glycolic Acid",
      "1% Salicylic Acid"
    ],
    "variants": [
      {
        "label": "120 ml Pump",
        "sizeOrPack": "120 ml",
        "url": "https://bebodywise.com/product/acne-control-wash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.0001.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/acne-control-wash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "120 ml",
      "salicylic acid",
      "facewash",
      "acne",
      "MC - Acne"
    ]
  },
  {
    "id": "bw-1-peptide-ceramide-moisturizer",
    "name": "1% Peptide & Ceramide Moisturizer",
    "category": "Face Care",
    "subcategory": "Moisturizer",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_PeptideMoisturizer_8u63h3.jpg?tr=w-600",
    "shortDescription": "For Repairing Skin Barrier & Slowing Ageing",
    "keyIngredients": [
      "1% Copper Tripeptide-1 (2000 ppm)",
      "1% D-Panthenol",
      "0.5% Ceramide Complex"
    ],
    "variants": [
      {
        "label": "50 g",
        "sizeOrPack": "50 g",
        "url": "https://bebodywise.com/product/1-peptide-ceramide-moisturizer",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00533.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/1-peptide-ceramide-moisturizer",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 g",
      "peptide",
      "ceramide",
      "cream",
      "wrinkles",
      "MC - Ageing"
    ]
  },
  {
    "id": "bw-brow-lash-serum",
    "name": "Brow & Lash Growth Serum",
    "category": "Face Care",
    "subcategory": "Targeted Serum",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_Brow%26LashSerum_2p1r87.jpg?tr=w-600",
    "shortDescription": "For thicker and fuller brows and lash",
    "keyIngredients": [
      "4% Anagain",
      "3% Redensyl",
      "2% LashLD",
      "1% Aminexil"
    ],
    "variants": [
      {
        "label": "5 ml",
        "sizeOrPack": "5 ml",
        "url": "https://bebodywise.com/product/brow-lash-serum",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00587.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/brow-lash-serum",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "5 ml",
      "LashLD",
      "serum",
      "Anagain",
      "Aminexil",
      "Redensyl",
      "Brow and Lash growth",
      "Normal | Combination Skin"
    ]
  },
  {
    "id": "bw-hydrocolloid-pimple-patch",
    "name": "Hydrocolloid Acne Pimple Patch",
    "category": "Face Care",
    "subcategory": "Spot Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_AcnePack_hszowj.jpg?tr=w-600",
    "shortDescription": "Easy and effective way to reduce acne",
    "keyIngredients": [
      "Hydrocolloid"
    ],
    "variants": [
      {
        "label": "24 Patches",
        "sizeOrPack": "24 Patches",
        "url": "https://bebodywise.com/product/hydrocolloid-acne-pimple-patch",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00201.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hydrocolloid-acne-pimple-patch",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "24 pcs",
      "hydrocolloid",
      "pimple patch",
      "acne",
      "MC - Acne"
    ]
  },
  {
    "id": "bw-ice-roller",
    "name": "Ice Roller",
    "category": "Face Care",
    "subcategory": "Facial Tool",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/ice-roller/AppThumbnail_IceRoller_c2qp5f.jpg?tr=w-600",
    "shortDescription": "For: Reducing Skin Puffiness & Redness",
    "keyIngredients": [],
    "variants": [
      {
        "label": "1 Unit",
        "sizeOrPack": "1 N",
        "url": "https://bebodywise.com/product/ice-roller",
        "availabilityStatus": "Out of Stock",
        "sku": "MWBWSKP.00504.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/ice-roller",
    "availabilityStatus": "Out of Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "1 pc",
      "roller",
      "tool",
      "dull-dry-skin"
    ]
  },
  {
    "id": "bw-2-salicylic-acid-gel",
    "name": "2% Salicylic Acid Gel",
    "category": "Face Care",
    "subcategory": "Spot Care",
    "imageUrl": "https://i.mscwlns.co/mosaic-wellness/image/upload/v1648210348/staging/products/acne-spot-correction/0_2SAG/PRODUCT%20IMAGES/2SAG_1000x750.jpg?tr=w-800",
    "shortDescription": "Acne & Spot Clearing Gel",
    "keyIngredients": [
      "2% Salicylic Acid (BHA)",
      "1% Glycolic Acid (AHA)",
      "4% Niacinamide"
    ],
    "variants": [
      {
        "label": "30 g",
        "sizeOrPack": "30 g",
        "url": "https://bebodywise.com/product/acne-spot-correction",
        "availabilityStatus": "Out of Stock"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/acne-spot-correction",
    "availabilityStatus": "Out of Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-face-razor",
    "name": "Face Razor for Women",
    "category": "Face Care",
    "subcategory": "Facial Tool",
    "imageUrl": "https://i.mscwlns.co/mosaic-wellness/image/upload/v1649680705/staging/products/face-razor-for-women/PRODUCT%20IMAGES/FR_1000x750.jpg?tr=w-800",
    "shortDescription": "Pain free and precise facial hair removal",
    "keyIngredients": [
      "Stainless Steel Blades",
      "Protective cover",
      "Anti-slip handle"
    ],
    "variants": [
      {
        "label": "Pack of 3",
        "sizeOrPack": "3 N",
        "url": "https://bebodywise.com/product/face-razor-for-women",
        "availabilityStatus": "In Stock"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/face-razor-for-women",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-10-niacinamide-serum",
    "name": "10% Niacinamide Serum",
    "category": "Face Care",
    "subcategory": "Face Serum",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/skin-clarifying",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/skin-clarifying",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-20-vitamin-c-serum",
    "name": "20% Vitamin C Face Serum",
    "category": "Face Care",
    "subcategory": "Face Serum",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/skin-rejuvenation-serum",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/skin-rejuvenation-serum",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-1-retinol-night-cream",
    "name": "1% Retinol Liposome Night Cream",
    "category": "Face Care",
    "subcategory": "Night Cream",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/skin-regenerate-night",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/skin-regenerate-night",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-hyaluronic-face-wash",
    "name": "Hyaluronic Acid Face Wash",
    "category": "Face Care",
    "subcategory": "Face Cleanser",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/skin-hydrating-cleanser",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/skin-hydrating-cleanser",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-5-lactic-acid-toner",
    "name": "5% Lactic Acid Toner",
    "category": "Face Care",
    "subcategory": "Toner",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/pore-tightening-toner",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/pore-tightening-toner",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-2-salicylic-acid-serum",
    "name": "2% Salicylic Acid Face Serum",
    "category": "Face Care",
    "subcategory": "Face Serum",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/2-salicylic-acid-serum",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/2-salicylic-acid-serum",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-oil-control-moisturizer",
    "name": "Oil Control Moisturizer",
    "category": "Face Care",
    "subcategory": "Moisturizer",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/oil-control-moisturiser",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/oil-control-moisturiser",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-2-bio-retinol-undereye",
    "name": "2% Bio Retinol Under Eye Cream",
    "category": "Face Care",
    "subcategory": "Eye Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/2-bio-retinol-undereye-cream",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/2-bio-retinol-undereye-cream",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-adapalene-benzoyl-gel",
    "name": "Adapalene and Benzoyl Peroxide Gel",
    "category": "Face Care",
    "subcategory": "Spot Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/adapalene-benzoyl",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/adapalene-benzoyl",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-1-salicylic-body-wash",
    "name": "1% Salicylic Acid Body Wash",
    "category": "Body Care",
    "subcategory": "Body Wash",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_SABW250ml_h38n6e.jpg?tr=w-600",
    "shortDescription": "For Body Acne",
    "keyIngredients": [
      "1% Salicylic Acid",
      "Chamomile Extract"
    ],
    "variants": [
      {
        "label": "250 ml",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/1-salicylic-acid-body-wash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWBCP.00166.B0_N"
      },
      {
        "label": "100 ml",
        "sizeOrPack": "100 ml",
        "url": "https://bebodywise.com/product/1-salicylic-acid-body-wash-100ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00626.B0_N"
      },
      {
        "label": "375 ml",
        "sizeOrPack": "375 ml",
        "url": "https://bebodywise.com/product/1-salicylic-acid-body-wash-350ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00214.B0_N"
      },
      {
        "label": "Pack of 2",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/1-salicylic-acid-body-wash-pack-2",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/1-salicylic-acid-body-wash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "250 ml",
      "salicylic acid",
      "bodywash",
      "bacne",
      "bestseller",
      "bestseller_body",
      "strawberry",
      "MC - Body Acne"
    ]
  },
  {
    "id": "bw-salicylic-ceramide-bodywash",
    "name": "1% Salicylic Ceramide Body Wash",
    "category": "Body Care",
    "subcategory": "Body Wash",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/salicylic-ceramide-bodywash/AppThumbnail_SalicylicCeramideBW%20NEWER%20%281%29_bz4j9m.jpg?tr=w-600",
    "shortDescription": "For Body Acne and Dry Skin",
    "keyIngredients": [],
    "variants": [
      {
        "label": "250 ml",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/salicylic-ceramide-bodywash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWBCP.00168.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/salicylic-ceramide-bodywash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "250 ml",
      "salicylic",
      "ceramide",
      "Glycerin",
      "Chamomile",
      "bacne",
      "urea",
      "bodywash"
    ]
  },
  {
    "id": "bw-5-niacinamide-body-wash",
    "name": "5% Niacinamide Body Wash",
    "category": "Body Care",
    "subcategory": "Body Wash",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_NiaBW250ml_lcdeap.jpg?tr=w-600",
    "shortDescription": "For Dull & Dry skin | Sourced from Netherlands",
    "keyIngredients": [
      "5% Niacinamide",
      "Aloe Vera"
    ],
    "variants": [
      {
        "label": "250 ml",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/5-niacinamide-body-wash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00328.B0_N"
      },
      {
        "label": "700 ml",
        "sizeOrPack": "700 ml",
        "url": "https://bebodywise.com/product/niacinamide-body-wash-700",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00626.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/5-niacinamide-body-wash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "250 ml",
      "niacinamide",
      "bodywash",
      "aloe vera",
      "dull-dry-skin",
      "MC - Dry skin",
      "700 ml"
    ]
  },
  {
    "id": "bw-5-aha-bha-body-wash",
    "name": "5% AHA BHA Exfoliating Body Wash",
    "category": "Body Care",
    "subcategory": "Body Wash",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_EBW700ml_1_i2qf6p.jpg?tr=w-600",
    "shortDescription": "All in one body wash that exfoliates, detans and hydrates skin!",
    "keyIngredients": [],
    "variants": [
      {
        "label": "700 ml",
        "sizeOrPack": "700 ml",
        "url": "https://bebodywise.com/product/5-aha-bha-bodywash-700ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWBCP.00167.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/5-aha-bha-bodywash-700ml",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "700 ML",
      "AHA BHA",
      "bodywash"
    ]
  },
  {
    "id": "bw-2-5-benzoyl-bodywash",
    "name": "2.5% Benzoyl Peroxide Body Wash",
    "category": "Body Care",
    "subcategory": "Body Wash",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_BenzPBW_3o13rw.jpg?tr=w-600",
    "shortDescription": "FOR: Reducing Severe Back, Butt & Body Acne",
    "keyIngredients": [
      "2.5% Benzoyl Peroxide",
      "Aloe Vera Extract",
      "Centella Asiatica",
      "Glycerin"
    ],
    "variants": [
      {
        "label": "250 ml",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/2-5-benzoyl-peroxide-bodywash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00586.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/2-5-benzoyl-peroxide-bodywash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "250 ml",
      "benzoyl peroxide",
      "bodywash",
      "bacne",
      "MC - Body Acne"
    ]
  },
  {
    "id": "bw-triple-milk-bodywash",
    "name": "Triple Milk Deep Hydrating Body Wash",
    "category": "Body Care",
    "subcategory": "Body Wash",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/triple-milk-deep-hydrating-bodywash/AppThumbnail_TripleMilkDeepHydrating_BW_hwyvut.jpg?tr=w-600",
    "shortDescription": "For dry, dehydrated skin",
    "keyIngredients": [],
    "variants": [
      {
        "label": "250 ml",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/triple-milk-deep-hydrating-bodywash",
        "availabilityStatus": "In Stock",
        "sku": "MWBWBCP.00170.B0_N"
      },
      {
        "label": "250 ml (Variant)",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/triple-milk-deep-hydrating-bodywash-xp",
        "availabilityStatus": "In Stock",
        "sku": "MWBBBCK.00174.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/triple-milk-deep-hydrating-bodywash",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "250 ml",
      "urea",
      "bodywash",
      "dull-dry-skin",
      "Glycerin",
      "Hyaluronic Acid",
      "Shea",
      "Coconut"
    ]
  },
  {
    "id": "bw-10-urea-lotion",
    "name": "10% Urea Body Lotion",
    "category": "Body Care",
    "subcategory": "Body Lotion",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_UreaLotion300ml_hfkpjk.jpg?tr=w-600",
    "shortDescription": "For: Mild to Moderate Dry Skin",
    "keyIngredients": [
      "10% Urea",
      "3% Mango Seed Butter",
      "3% Kokum Seed Butter"
    ],
    "variants": [
      {
        "label": "300 ml",
        "sizeOrPack": "300 ml",
        "url": "https://bebodywise.com/product/10-urea-lotion-300ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00659.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/10-urea-lotion-300ml",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "300 ml",
      "urea",
      "lotions",
      "bestseller",
      "bestseller_body",
      "dull-dry-skin",
      "MC - Dry skin"
    ]
  },
  {
    "id": "bw-20-urea-lotion",
    "name": "20% Urea Body Lotion",
    "category": "Body Care",
    "subcategory": "Body Lotion",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/20-urea-lotion-xp/AppThumbnail_20%25UreaLotion300ml_4nhfot.jpg?tr=w-600",
    "shortDescription": "For: Dry to Very Dry & Flaky Skin",
    "keyIngredients": [
      "20% Urea",
      "Hydrating Butter Blend",
      "Ceramide Complex"
    ],
    "variants": [
      {
        "label": "300 ml",
        "sizeOrPack": "300 ml",
        "url": "https://bebodywise.com/product/20-urea-lotion-xp",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00797.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/20-urea-lotion-xp",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "300 ml",
      "urea",
      "lotion",
      "dull-dry-skin",
      "bestseller"
    ]
  },
  {
    "id": "bw-5-lactic-acid-lotion",
    "name": "5% Lactic Acid Body Lotion",
    "category": "Body Care",
    "subcategory": "Body Lotion",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_LacticLotion_3huwy8.jpg?tr=w-600",
    "shortDescription": "FOR: Improving Skin Texture",
    "keyIngredients": [
      "5% Lactic Acid",
      "Cica Extract",
      "Aloe Vera Extract"
    ],
    "variants": [
      {
        "label": "200 ml",
        "sizeOrPack": "200 ml",
        "url": "https://bebodywise.com/product/5-lactic-acid-body-lotion",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00241.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/5-lactic-acid-body-lotion",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "200 ml",
      "lactic acid",
      "lotions",
      "aloevera",
      "MC - Exfoliation / Strawberry Skin"
    ]
  },
  {
    "id": "bw-10-niacinamide-lotion",
    "name": "10% Niacinamide Body Lotion",
    "category": "Body Care",
    "subcategory": "Body Lotion",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_NiaLotion_250ml_3xpl85.jpg?tr=w-600",
    "shortDescription": "FOR : Nourishing & protecting skin",
    "keyIngredients": [
      "10% Niacinamide",
      "Aloe Vera Extract"
    ],
    "variants": [
      {
        "label": "200 ml",
        "sizeOrPack": "200 ml",
        "url": "https://bebodywise.com/product/niacinamide-body-lotion",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00240.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/niacinamide-body-lotion",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "200 ml",
      "niacinamide",
      "lotions",
      "bacne",
      "MC - Odour Control / Pigmentation"
    ]
  },
  {
    "id": "bw-20-urea-foot-roll-on",
    "name": "20% Urea Foot Roll On",
    "category": "Body Care",
    "subcategory": "Foot & Heel Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_UFRO75ml_8tcspk.jpg?tr=w-600",
    "shortDescription": "For Cracked & Rough heels",
    "keyIngredients": [
      "20% Urea",
      "2% Lactic Acid",
      "1% Olea Europaea (Olive) Fruit Oil",
      "0.5% Tocopheryl Acetate"
    ],
    "variants": [
      {
        "label": "75 ml",
        "sizeOrPack": "75 ml",
        "url": "https://bebodywise.com/product/20-urea-roll-on-75ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00687.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/20-urea-roll-on-75ml",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "75 ml",
      "urea",
      "roll on",
      "MC - Cracked Heels"
    ]
  },
  {
    "id": "bw-30-urea-foot-roll-on",
    "name": "30% Urea Foot Roll On",
    "category": "Body Care",
    "subcategory": "Foot & Heel Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/30-urea-foot-roll-on/image%20%2853%29_ic4tyd.png?tr=w-600",
    "shortDescription": "For Cracked & Rough heels",
    "keyIngredients": [
      "30% Urea",
      "5% Lactic Acid",
      "1% Glycolic Acid",
      "Olive Oil"
    ],
    "variants": [
      {
        "label": "50 ml",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/30-urea-foot-roll-on",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00777.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/30-urea-foot-roll-on",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 ml",
      "urea",
      "roll on",
      "heels",
      "foot"
    ]
  },
  {
    "id": "bw-4-aha-bha-underarm-roll-on",
    "name": "4% AHA BHA Underarm Roll On",
    "category": "Body Care",
    "subcategory": "Underarm Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_UARO_Flora_a3aoe4.jpg?tr=w-600",
    "shortDescription": "With 0% Alcohol & 0% Aluminium | Reduces 99.5% bacteria in 10 minutes",
    "keyIngredients": [
      "1% Salicylic Acid",
      "1% Mandelic Acid",
      "2% Lactic Acid"
    ],
    "variants": [
      {
        "label": "Flora · 50 ml",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/4-aha-bha-underarm-roll-on",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00418.B0_N"
      },
      {
        "label": "Watermelon · 50 ml",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/4-aha-bha-underarm-roll-on-watermelon",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00525.B0_N"
      },
      {
        "label": "No Fragrance · 50 ml",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/4-aha-bha-underarm-roll-on-no-fragrance",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00526.B0_N"
      },
      {
        "label": "Fragrance Free · 75 ml",
        "sizeOrPack": "75 ml",
        "url": "https://bebodywise.com/product/4-aha-bha-underarm-rollon-frag-free-75",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00646.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/4-aha-bha-underarm-roll-on",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 ml",
      "flora",
      "aha bha",
      "4% aha bha",
      "roll on",
      "bestseller",
      "bestseller_body",
      "Underarms"
    ]
  },
  {
    "id": "bw-6-aha-bha-underarm-roll-on",
    "name": "6% AHA BHA Underarm Roll On",
    "category": "Body Care",
    "subcategory": "Underarm Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_6_UARO_Flora_kihum2.jpg?tr=w-600",
    "shortDescription": "For Pigmentation Reduction & Odour Control",
    "keyIngredients": [
      "4% Lactic Acid",
      "1% Salicylic Acid",
      "1% Kojic Acid",
      "1% Mandelic Acid"
    ],
    "variants": [
      {
        "label": "Flora · 50 ml",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/6-aha-bha-underarm-roll-on",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00684.B0_N"
      },
      {
        "label": "Flora · 75 ml",
        "sizeOrPack": "75 ml",
        "url": "https://bebodywise.com/product/6-aha-bha-underarm-roll-on-flora-75ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00787.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/6-aha-bha-underarm-roll-on",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 ml",
      "6% aha bha",
      "aha bha",
      "underarms",
      "MC - Odour Control / Pigmentation",
      "bestseller",
      "bestseller_body",
      "roll-on"
    ]
  },
  {
    "id": "bw-10-aha-body-scrub",
    "name": "10% AHA Body Scrub",
    "category": "Body Care",
    "subcategory": "Body Scrub",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_12_AHAScrub200g_f92y3a.jpg?tr=w-600",
    "shortDescription": "De-tans, Reduces Strawberry Skin, Exfoliates",
    "keyIngredients": [
      "10% Lactic Acid",
      "Oat Extract",
      "Aloe Vera Extract"
    ],
    "variants": [
      {
        "label": "200 g",
        "sizeOrPack": "200 g",
        "url": "https://bebodywise.com/product/10-aha-body-scrub",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00428.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/10-aha-body-scrub",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "200 g",
      "aha",
      "MC - Exfoliation / Strawberry Skin",
      "bestseller",
      "bestseller_body",
      "scrub"
    ]
  },
  {
    "id": "bw-12-aha-scrub",
    "name": "12% AHA Scrub",
    "category": "Body Care",
    "subcategory": "Body Scrub",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_12_AHAScrub_7qciqc.jpg?tr=w-600",
    "shortDescription": "Gently exfoliates & smoothens skin",
    "keyIngredients": [
      "10% Lactic Acid",
      "2% Glycolic Acid",
      "Oat Extract",
      "Aloe Vera Extract"
    ],
    "variants": [
      {
        "label": "300 g",
        "sizeOrPack": "300 g",
        "url": "https://bebodywise.com/product/12-aha-scrub",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00697.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/12-aha-scrub",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "300 g",
      "aha",
      "scrub",
      "strawberry"
    ]
  },
  {
    "id": "bw-7-glycolic-body-stick",
    "name": "7% Glycolic Acid Exfoliating Body Stick",
    "category": "Body Care",
    "subcategory": "Targeted Body Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_GlycolicStick_510b8q.jpg?tr=w-600",
    "shortDescription": "For Strawberry Skin and Ingrown Hair",
    "keyIngredients": [],
    "variants": [
      {
        "label": "30 g",
        "sizeOrPack": "30 g",
        "url": "https://bebodywise.com/product/glycolic-acid-stick",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00651.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/glycolic-acid-stick",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "30 g",
      "glycolic acid",
      "stick",
      "bestseller",
      "roll on",
      "strawberry"
    ]
  },
  {
    "id": "bw-anti-stretch-mark-roll-on",
    "name": "Anti-Stretch Mark Serum Roll On",
    "category": "Body Care",
    "subcategory": "Targeted Body Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/anti-stretch-mark-roll-on/IMG_8119_7296bd.jpg?tr=w-600",
    "shortDescription": "Reduces Stretch Mark Appearance",
    "keyIngredients": [],
    "variants": [
      {
        "label": "50 ml",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/anti-stretch-mark-roll-on",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00771.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/anti-stretch-mark-roll-on",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 ml",
      "Regeneryl",
      "Striover",
      "Stretch marks",
      "shea butter",
      "bakuchiol",
      "roll on",
      "Stretch"
    ]
  },
  {
    "id": "bw-pigmentation-repair-cream",
    "name": "Pigmentation Repair Cream",
    "category": "Body Care",
    "subcategory": "Targeted Body Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_PRC_eilf4y.jpg?tr=w-600",
    "shortDescription": "For Pigmentation & Dark Patches on Body Folds",
    "keyIngredients": [],
    "variants": [
      {
        "label": "100 g",
        "sizeOrPack": "100 g",
        "url": "https://bebodywise.com/product/pigmentation-repair-cream",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00436.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/pigmentation-repair-cream",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "100 g",
      "lactic acid",
      "cream",
      "retinol",
      "kojic acid",
      "Oily",
      "Sensitive",
      "Combination"
    ]
  },
  {
    "id": "bw-3-aha-bha-back-spray",
    "name": "3% AHA-BHA Back and Body Spray",
    "category": "Body Care",
    "subcategory": "Targeted Body Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/3-aha-bha-back-and-body-acne-spray",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/3-aha-bha-back-and-body-acne-spray",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-biotin-hair-gummies",
    "name": "Biotin Hair Gummies",
    "category": "Hair Care",
    "subcategory": "Hair Nutrition",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_HG30_kmcln5.jpg?tr=w-600",
    "shortDescription": "Vegetarian Hair Vitamins with No Added Refined Sugar",
    "keyIngredients": [
      "Biotin",
      "Zinc & Multivitamins",
      "Chicory Root"
    ],
    "variants": [
      {
        "label": "30 Gummies",
        "sizeOrPack": "30 Gummies",
        "url": "https://bebodywise.com/product/hair-health-gummies",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00531.B0_N"
      },
      {
        "label": "120 Gummies",
        "sizeOrPack": "120 Gummies",
        "url": "https://bebodywise.com/product/biotin-hair-gummies-120",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00310.B0_N"
      },
      {
        "label": "60 Gummies",
        "sizeOrPack": "60 Gummies",
        "url": "https://bebodywise.com/product/biotin-multivitamin-hair-gummies-2m",
        "availabilityStatus": "In Stock"
      },
      {
        "label": "90 Gummies",
        "sizeOrPack": "90 Gummies",
        "url": "https://bebodywise.com/product/hair-health-gummies-pack-3",
        "availabilityStatus": "In Stock"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-health-gummies",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "30 pcs",
      "biotin",
      "gummies",
      "hairfall",
      "bestseller",
      "bestseller_hair",
      "120 pcs"
    ]
  },
  {
    "id": "bw-advanced-hair-growth-serum",
    "name": "Advanced Hair Growth Serum",
    "category": "Hair Care",
    "subcategory": "Scalp Serum & Roll-On",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_HGRO_b9ytvj.jpg?tr=w-600",
    "shortDescription": "For Hair Thinning & New Hair Growth",
    "keyIngredients": [
      "3% Redensyl",
      "2% Aminexil",
      "2% Anagain",
      "3% Rosemary"
    ],
    "variants": [
      {
        "label": "Roll-On · 25 ml",
        "sizeOrPack": "25 ml",
        "url": "https://bebodywise.com/product/hair-growth-serum-roll-on",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00575.B0_N"
      },
      {
        "label": "Serum · 30 ml",
        "sizeOrPack": "30 ml",
        "url": "https://bebodywise.com/product/advanced-hair-growth-serum-30ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00635.B0_N"
      },
      {
        "label": "Serum · 50 ml",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/advanced-hair-growth-serum",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00541.B0_N"
      },
      {
        "label": "Roll-On · Pack of 2",
        "sizeOrPack": "2 × 25 ml",
        "url": "https://bebodywise.com/product/hair-growth-serum-roll-on-2-months-xp",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFK.00614.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-growth-serum-roll-on",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "25 ml",
      "rosemary",
      "roll on",
      "serum",
      "bestseller",
      "thinning",
      "bestseller_hair",
      "30 ml"
    ]
  },
  {
    "id": "bw-folli-advanced-plus-serum",
    "name": "Folli Advanced+ Hair Growth Serum Roll On",
    "category": "Hair Care",
    "subcategory": "Scalp Serum & Roll-On",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/folli-advanced-plus-hair-growth-serum/AppThumbnail_Folli_HGRO%20%282%29_a25jr5.jpg?tr=w-600",
    "shortDescription": "For Advanced Hair Thinning & Improved Hair Volume",
    "keyIngredients": [],
    "variants": [
      {
        "label": "25 ml Roll-On",
        "sizeOrPack": "25 ml",
        "url": "https://bebodywise.com/product/folli-advanced-plus-hair-growth-serum",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00188.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/folli-advanced-plus-hair-growth-serum",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "25 ml",
      "Microneedle",
      "hairfall",
      "thinning"
    ]
  },
  {
    "id": "bw-hair-growth-serum-spray",
    "name": "Hair Growth Serum Spray",
    "category": "Hair Care",
    "subcategory": "Scalp Serum & Roll-On",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/hair-growth-serum-spray/ChatGPT%20Image%20Aug%2011%2C%202026%2C%2004_17_12%20PM_6s2zpw.png?tr=w-600",
    "shortDescription": "For Hair Thinning & New Hair Growth",
    "keyIngredients": [],
    "variants": [
      {
        "label": "30 ml Spray",
        "sizeOrPack": "30 ml",
        "url": "https://bebodywise.com/product/hair-growth-serum-spray",
        "availabilityStatus": "In Stock",
        "sku": "MWBBHFP.00199.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-growth-serum-spray",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "30 ml",
      "rosemary"
    ]
  },
  {
    "id": "bw-hair-strengthening-serum",
    "name": "Hair Strengthening Serum",
    "category": "Hair Care",
    "subcategory": "Hair Serum",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_HairStrenghteningSerum_100ml_3nh8dn.jpg?tr=w-600",
    "shortDescription": "FOR: Frizz reduction | Dry & damaged hair",
    "keyIngredients": [
      "Argan Oil",
      "Olive Oil"
    ],
    "variants": [
      {
        "label": "100 ml",
        "sizeOrPack": "100 ml",
        "url": "https://bebodywise.com/product/hair-strengthening-serum",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.0020.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-strengthening-serum",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "100 ml",
      "Argan Oil",
      "Olive Oil",
      "serum",
      "Straight",
      "Wavy",
      "Curly",
      "Coloured"
    ]
  },
  {
    "id": "bw-anti-frizz-serum",
    "name": "Frizz Control and Damage Repair Hair Serum",
    "category": "Hair Care",
    "subcategory": "Hair Serum",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/hf_20261023_083148_28ad759a-3528-4fcf-9c9b-30fa3322ea81%20%281%29_fz71ta.png?tr=w-600",
    "shortDescription": "FOR: Frizz reduction | Dry & damaged hair",
    "keyIngredients": [],
    "variants": [
      {
        "label": "100 ml",
        "sizeOrPack": "100 ml",
        "url": "https://bebodywise.com/product/anti-frizz-serum",
        "availabilityStatus": "In Stock",
        "sku": "MWBBHFP.00201.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/anti-frizz-serum",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "100 ML",
      "Biphasic",
      "serum",
      "damaged",
      "frizz",
      "frizzy"
    ]
  },
  {
    "id": "bw-anti-dandruff-serum",
    "name": "Anti-Dandruff Serum",
    "category": "Hair Care",
    "subcategory": "Scalp Serum & Roll-On",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_AntiDandruffSerum_cxhczj.jpg?tr=w-600",
    "shortDescription": "For Scalp Inflammation & Dandruff",
    "keyIngredients": [
      "ICHTHYOL® PALE",
      "Zinc Pyrithione",
      "Menthol"
    ],
    "variants": [
      {
        "label": "60 ml",
        "sizeOrPack": "60 ml",
        "url": "https://bebodywise.com/product/anti-dandruff-serum",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00538.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/anti-dandruff-serum",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 ml",
      "Tea Tree Oil",
      "Ichthyol Pale",
      "Zinc Pyrithione",
      "serum",
      "dandruff",
      "MC - Dandruff"
    ]
  },
  {
    "id": "bw-1-zpto-shampoo",
    "name": "1% ZPTO Anti-Dandruff Shampoo",
    "category": "Hair Care",
    "subcategory": "Shampoo",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/1-zpto-anti-dandruff-shampoo/AppThumbnail_ZPTO_Shampoo_fuuj4l.jpg?tr=w-600",
    "shortDescription": "To control moderate dandruff without the dryness",
    "keyIngredients": [
      "1% ZPTO",
      "Salicylic Acid",
      "Pentavitin",
      "Allantoin"
    ],
    "variants": [
      {
        "label": "200 ml",
        "sizeOrPack": "200 ml",
        "url": "https://bebodywise.com/product/1-zpto-anti-dandruff-shampoo",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00707.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/1-zpto-anti-dandruff-shampoo",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "200 ml",
      "zpto",
      "Climbazole",
      "Piroctone",
      "Olamine",
      "shampoo",
      "dandruff"
    ]
  },
  {
    "id": "bw-1-ketoconazole-shampoo",
    "name": "1% Ketoconazole Anti-Dandruff Shampoo",
    "category": "Hair Care",
    "subcategory": "Shampoo",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_KetoShampoo_Big_fyk2qa.jpg?tr=w-600",
    "shortDescription": "For Reducing Dandruff & Flakiness",
    "keyIngredients": [
      "Ketoconazole"
    ],
    "variants": [
      {
        "label": "250 ml",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-250ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00229.B0_N"
      },
      {
        "label": "150 ml",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-150ml",
        "availabilityStatus": "In Stock"
      },
      {
        "label": "Pack of 2",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-pack-2",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/1-ketoconazole-dandruff-shampoo-250ml",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "250 ml",
      "ketoconazole",
      "shampoo",
      "Straight",
      "Wavy",
      "Curly",
      "dandruff",
      "15-19"
    ]
  },
  {
    "id": "bw-keratin-shampoo",
    "name": "Keratin Shampoo for Hair Fall",
    "category": "Hair Care",
    "subcategory": "Shampoo",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_KerShampoo_kfz6tt.jpg?tr=w-600",
    "shortDescription": "Sulphate Free Shampoo for Hair Fall Clinically Tested",
    "keyIngredients": [
      "Keratin",
      "Biotin"
    ],
    "variants": [
      {
        "label": "250 ml",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/hair-fall-control-shampoo",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.0018.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-fall-control-shampoo",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "200 ml",
      "keratin",
      "shampoo",
      "biotin",
      "hairfall",
      "MC - Hairfall / Thinning"
    ]
  },
  {
    "id": "bw-keratin-conditioner",
    "name": "Keratin Conditioner",
    "category": "Hair Care",
    "subcategory": "Conditioner",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_KeratinConditioner_7tmjzz.jpg?tr=w-600",
    "shortDescription": "Argan Oil & Biotin Enriched Hair Conditioner for Women",
    "keyIngredients": [
      "Biotin",
      "Argan Oil"
    ],
    "variants": [
      {
        "label": "200 ml",
        "sizeOrPack": "200 ml",
        "url": "https://bebodywise.com/product/deep-moisturizing-conditioner",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.0019.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/deep-moisturizing-conditioner",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "200 ml",
      "biotin",
      "conditioner",
      "argan oil",
      "damaged",
      "MC - Hairfall / Thinning"
    ]
  },
  {
    "id": "bw-scalp-massager",
    "name": "Scalp Massager",
    "category": "Hair Care",
    "subcategory": "Hair Tool",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_ScalpMassager_doqere.jpg?tr=w-600",
    "shortDescription": "",
    "keyIngredients": [
      "Medical Grade Silicone Bristles",
      "Ergonomic Design"
    ],
    "variants": [
      {
        "label": "1 Unit",
        "sizeOrPack": "1 N",
        "url": "https://bebodywise.com/product/scalp-massager",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFP.00161.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/scalp-massager",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "1 pc",
      "massager",
      "tool",
      "thinning",
      "MC - Hairfall / Thinning"
    ]
  },
  {
    "id": "bw-water-hardness-test-strip",
    "name": "Water Hardness Test Strip (Sample)",
    "category": "Hair Care",
    "subcategory": "Hair Tool",
    "imageUrl": "https://i.mscwlns.co/mosaic-wellness/image/upload/v1647517392/staging/products/water-hardness-test-strip/SAMPLE/WHTSS_Hero.jpg?tr=w-800",
    "shortDescription": "Hard Water Testing Trip for Healthier Hair",
    "keyIngredients": [
      "Chelating Agents"
    ],
    "variants": [
      {
        "label": "1 Strip",
        "sizeOrPack": "1 N",
        "url": "https://bebodywise.com/product/water-hardness-test-strip-sample",
        "availabilityStatus": "In Stock"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/water-hardness-test-strip-sample",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-saw-palmetto-shampoo",
    "name": "1% Saw Palmetto DHT Blocking Shampoo",
    "category": "Hair Care",
    "subcategory": "Shampoo",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/saw-palmetto-dht-blocking-shampoo",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/saw-palmetto-dht-blocking-shampoo",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-dht-blocker-capsules",
    "name": "DHT Blocker Capsules",
    "category": "Hair Care",
    "subcategory": "Hair Nutrition",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/dht-blocker-capsules",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/dht-blocker-capsules",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-onion-hair-growth-oil",
    "name": "Onion Hair Growth Oil",
    "category": "Hair Care",
    "subcategory": "Hair Oil",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/hair-nourish",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Sample",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/hair-nourish-oil-sample",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-nourish",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-1-redensyl-hair-oil",
    "name": "1% Redensyl Hair Oil",
    "category": "Hair Care",
    "subcategory": "Hair Oil",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/onion-redensyl-hair-oil",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/onion-redensyl-hair-oil",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-3-redensyl-solution",
    "name": "3% Redensyl Topical Solution",
    "category": "Hair Care",
    "subcategory": "Scalp Solution",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/hair-growth-concentrate",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-growth-concentrate",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-1-darkenyl-hair-serum",
    "name": "1% Darkenyl Hair Serum",
    "category": "Hair Care",
    "subcategory": "Scalp Serum & Roll-On",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/darkenyl-hair-serum",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/darkenyl-hair-serum",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-5-minoxidil-solution",
    "name": "5% Minoxidil Topical Solution",
    "category": "Hair Care",
    "subcategory": "Scalp Solution",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/minoxidil-topical",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/minoxidil-topical",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-2-ketoconazole-shampoo",
    "name": "2% Ketoconazole Shampoo",
    "category": "Hair Care",
    "subcategory": "Shampoo",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/clinical-strength-dandruff-shampoo",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/clinical-strength-dandruff-shampoo",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-anti-dandruff-lotion",
    "name": "Anti Dandruff Lotion",
    "category": "Hair Care",
    "subcategory": "Scalp Lotion",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/intense-action-dandruff-treatment",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/intense-action-dandruff-treatment",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-effervescent-biotin-tablets",
    "name": "Effervescent Biotin Tablets",
    "category": "Hair Care",
    "subcategory": "Hair Nutrition",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Single Pack",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/effervescent-biotin-tablets",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 3",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/effervescent-biotin-tablets-pack-3",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 4",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/effervescent-biotin-tablets-pack-of-4",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 6",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/effervescent-biotin-tablets-pack-6",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/effervescent-biotin-tablets",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-chelate-water-softener",
    "name": "Chelate Water Softener",
    "category": "Hair Care",
    "subcategory": "Hair Treatment",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/chelate-water-softener",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/chelate-water-softener",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-ultra-light-sunscreen",
    "name": "Ultra Light Sunscreen SPF50+",
    "category": "Sun Protection",
    "subcategory": "Face Sunscreen",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_ULSS_d113wm.jpg?tr=w-600",
    "shortDescription": "For broad-spectrum sun protection",
    "keyIngredients": [
      "Microencapsulated SUNONE J",
      "ACZERO",
      "Niacinamide",
      "Centella Asiatica (Gotu Kola)"
    ],
    "variants": [
      {
        "label": "50 g",
        "sizeOrPack": "50 g",
        "url": "https://bebodywise.com/product/ultra-light-sunscreen-spf50",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00672.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/ultra-light-sunscreen-spf50",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 ml",
      "spf 50",
      "sunscreen",
      "SunOne J",
      "centella asiatica",
      "Niacinamide",
      "Aczero",
      "facesun"
    ]
  },
  {
    "id": "bw-mineral-sunscreen-spf50",
    "name": "Lightest Mineral Sunscreen SPF 50+",
    "category": "Sun Protection",
    "subcategory": "Face Sunscreen",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_MineralSunscreen_h5nhvd.jpg?tr=w-600",
    "shortDescription": "100% Mineral Sunscreen | Pregnancy & Lactating Safe",
    "keyIngredients": [
      "Microencapsulated Mineral Filters",
      "Pollufence",
      "Niacinamide"
    ],
    "variants": [
      {
        "label": "50 g",
        "sizeOrPack": "50 g",
        "url": "https://bebodywise.com/product/lightest-mineral-sunscreen-spf50",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00677.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/lightest-mineral-sunscreen-spf50",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "50 ml",
      "spf 50",
      "sunscreen",
      "mineral",
      "facesun",
      "MC - Face Sunscreen"
    ]
  },
  {
    "id": "bw-detan-body-sunscreen-lotion",
    "name": "De-Tan SPF 50+ Body Sunscreen Lotion",
    "category": "Sun Protection",
    "subcategory": "Body Sunscreen",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/body-sunscreen-lotion-with-spf-50/AppThumbnail_DeTan_SPF50_Lotion%20%281%29_lne86c.png?tr=w-600",
    "shortDescription": "For: Tan correction and sun protection",
    "keyIngredients": [
      "SunOne J™ Filters",
      "Niacinamide",
      "Guava Extract",
      "Papaya Extract",
      "Pomegranate Extract"
    ],
    "variants": [
      {
        "label": "175 ml",
        "sizeOrPack": "175 ml",
        "url": "https://bebodywise.com/product/body-sunscreen-lotion-with-spf-50",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00801.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/body-sunscreen-lotion-with-spf-50",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "175 ML",
      "SPF",
      "bodysun"
    ]
  },
  {
    "id": "bw-body-sunscreen-spray",
    "name": "Body Sunscreen Spray with SPF 50",
    "category": "Sun Protection",
    "subcategory": "Body Sunscreen",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_BodySunscreenSpray_e9e5jg.jpg?tr=w-600",
    "shortDescription": "For easy, mess-free sun protection",
    "keyIngredients": [
      "9.5% SunCat DE",
      "1% Niacinamide",
      "1% Red Algae",
      "2.5% Glycerin"
    ],
    "variants": [
      {
        "label": "100 ml",
        "sizeOrPack": "100 ml",
        "url": "https://bebodywise.com/product/body-sunscreen-spray-with-spf-50",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00584.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/body-sunscreen-spray-with-spf-50",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "100 ml",
      "SPF 50",
      "spray",
      "Suncat",
      "Red algae",
      "Glycerin",
      "bodysun",
      "MC - Body Sunscreen"
    ]
  },
  {
    "id": "bw-spf-30-sunscreen",
    "name": "SPF 30 Sunscreen",
    "category": "Sun Protection",
    "subcategory": "Face Sunscreen",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/broad-spectrum-sunscreen",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/broad-spectrum-sunscreen",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-multivitamin-gummies",
    "name": "Multivitamin Gummies",
    "category": "Health & Fitness",
    "subcategory": "Daily Gummies",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_MVG_grjhio.jpg?tr=w-600",
    "shortDescription": "Nutritionist Developed formula to boost energy, immunity, balance hormone levels and relieve stress",
    "keyIngredients": [
      "Vitamin B-complex",
      "Vitamin D3",
      "Zinc",
      "Vitamin E",
      "Vitamin C"
    ],
    "variants": [
      {
        "label": "60 Gummies",
        "sizeOrPack": "60 Gummies",
        "url": "https://bebodywise.com/product/multivitamin-gummies",
        "availabilityStatus": "In Stock",
        "sku": "MWBWNTP.00168.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/multivitamin-gummies",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "60 pcs",
      "iron",
      "zinc",
      "folic acid",
      "Vitamin A",
      "Vitamin B‑6",
      "Vitamin B‑12",
      "Vitamin C"
    ]
  },
  {
    "id": "bw-calcium-gummies",
    "name": "Calcium Gummies",
    "category": "Health & Fitness",
    "subcategory": "Daily Gummies",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_CalG30_3zyiku.jpg?tr=w-600",
    "shortDescription": "Calcium Gummies with No Added Refined Sugar",
    "keyIngredients": [
      "Calcium",
      "Vitamin D3 derived from Lichen",
      "Chicory Root (Prebiotic Fibre)"
    ],
    "variants": [
      {
        "label": "30 Gummies",
        "sizeOrPack": "30 Gummies",
        "url": "https://bebodywise.com/product/calcium-gummies",
        "availabilityStatus": "In Stock",
        "sku": "MWBWNTP.00345.B0_N"
      },
      {
        "label": "Pack of 2 (60 Gummies)",
        "sizeOrPack": "60 Gummies",
        "url": "https://bebodywise.com/product/calcium-gummies-xp",
        "availabilityStatus": "In Stock",
        "sku": "MWBWNTK.00351.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/calcium-gummies",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "30 pcs",
      "calcium",
      "gummies",
      "Calcium Citrate",
      "Vitamin D3",
      "Vitamins & Supplements",
      "60 pcs",
      "calcium citrate"
    ]
  },
  {
    "id": "bw-glutathione-gummies",
    "name": "Glutathione Gummies",
    "category": "Health & Fitness",
    "subcategory": "Daily Gummies",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_Gluta60_ks7x96.jpg?tr=w-600",
    "shortDescription": "For Glowing, Radiant, and Nourished Skin",
    "keyIngredients": [
      "Glutathione",
      "Multivitamins",
      "Chicory ( Prebiotic Fibre)"
    ],
    "variants": [
      {
        "label": "60 Gummies",
        "sizeOrPack": "60 Gummies",
        "url": "https://bebodywise.com/product/glutathione-gummies-60",
        "availabilityStatus": "In Stock",
        "sku": "MWBWNTP.00348.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/glutathione-gummies-60",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "60 pcs",
      "glutathione",
      "gummies"
    ]
  },
  {
    "id": "bw-collagen-builder-gummies",
    "name": "Collagen Builder Gummies",
    "category": "Health & Fitness",
    "subcategory": "Daily Gummies",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_Collagen60_g14mdy.jpg?tr=w-600",
    "shortDescription": "For Hydrated and Youthful Skin",
    "keyIngredients": [
      "10000 mcg Sesbania Extract",
      "115 mg Collagen Boosting Blend",
      "23 mg Multivitamin"
    ],
    "variants": [
      {
        "label": "60 Gummies (240 g)",
        "sizeOrPack": "60 Gummies",
        "url": "https://bebodywise.com/product/collagen-skin-gummies",
        "availabilityStatus": "Out of Stock",
        "sku": "MWBWSKP.00132.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/collagen-skin-gummies",
    "availabilityStatus": "Out of Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "60 pcs",
      "collagen",
      "gummies",
      "Sea buckthorn",
      "Curcumin",
      "Bamboo extract",
      "Fine Lines and Wrinkles",
      "Dry"
    ]
  },
  {
    "id": "bw-skin-health-gummies",
    "name": "Skin Health Gummies",
    "category": "Health & Fitness",
    "subcategory": "Daily Gummies",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "30 Gummies",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/skin-health-gummies",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "60 Gummies",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/ha-vitamin-c-skin-gummies-60",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 2",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/skin-health-gummies-pack-2",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 3",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/skin-health-gummies-pack-3",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/skin-health-gummies",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-acv-gummies",
    "name": "Apple Cider Vinegar Gummies",
    "category": "Health & Fitness",
    "subcategory": "Weight & Nutrition",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "30 Gummies",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/active-assist-acv-gummies",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "60 Gummies",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/active-assist-acv-gummies-pack-2",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "3 Packs",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/active-assist-acv-gummies-pack-3",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/active-assist-acv-gummies",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-acv-effervescent",
    "name": "Apple Cider Vinegar Effervescent Tablets",
    "category": "Health & Fitness",
    "subcategory": "Weight & Nutrition",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Single Pack",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/apple-cider-vinegar-effervescent-tablets",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 2",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/apple-cider-vinegar-effervescent-tablets-pack-2",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 3",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/apple-cider-vinegar-effervescent-tablets-pack-3",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 4",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/apple-cider-vinegar-effervescent-tablets-pack-4",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 6",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/apple-cider-vinegar-effervescent-tablets-pack-6",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/apple-cider-vinegar-effervescent-tablets",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-vegan-plant-protein",
    "name": "Vegan Plant Protein Powder",
    "category": "Health & Fitness",
    "subcategory": "Protein & Fitness",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/vegan-plant-protein-powder",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/vegan-plant-protein-powder",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-weight-management-tea",
    "name": "Weight Management Tea",
    "category": "Health & Fitness",
    "subcategory": "Weight & Nutrition",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Single Pack",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/active-assist-weight-tea",
        "availabilityStatus": "In Stock"
      },
      {
        "label": "3 Packs",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/active-assist-weight-tea-pack-3",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/active-assist-weight-tea",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-tpe-yoga-mat",
    "name": "TPE Yoga Mat",
    "category": "Health & Fitness",
    "subcategory": "Fitness Gear",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/tpe-yoga-mat",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/tpe-yoga-mat",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-post-pregnancy-hair-gummies",
    "name": "Hair Gummies for Post-Pregnancy Hair Fall",
    "category": "Women's Wellness",
    "subcategory": "Post-Pregnancy Care",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_HG30_d1ffzy.jpg?tr=w-600",
    "shortDescription": "Vegetarian Hair Vitamins, No Added Refined Sugar",
    "keyIngredients": [
      "Biotin",
      "Zinc & Multivitamins",
      "Nu-Mega DHA",
      "Chicory Root"
    ],
    "variants": [
      {
        "label": "30 Gummies",
        "sizeOrPack": "30 Gummies",
        "url": "https://bebodywise.com/product/biotin-hair-gummies-breastfeeding-moms-30n-xp",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFK.00551.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/biotin-hair-gummies-breastfeeding-moms-30n-xp",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "30 pcs",
      "biotin",
      "gummies",
      "hairfall",
      "MC - Hairfall"
    ]
  },
  {
    "id": "bw-pms-gummies",
    "name": "PMS Gummies",
    "category": "Women's Wellness",
    "subcategory": "Cycle & PCOS Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/pms-gummies",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/pms-gummies",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-pcos-balance-capsule",
    "name": "PCOS Balance Capsule",
    "category": "Women's Wellness",
    "subcategory": "Cycle & PCOS Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/pcos-balance-capsule",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/pcos-balance-capsule",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-pcos-superfood",
    "name": "PCOS Superfood",
    "category": "Women's Wellness",
    "subcategory": "Cycle & PCOS Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/pcos-drink-super-food",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Sample",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/pcos-super-food-sample",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "Pack of 2",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/pcos-drink-super-food-pack-2",
        "availabilityStatus": "Availability not verified"
      },
      {
        "label": "30 Pack",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/pcos-super-food-30-pack",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/pcos-drink-super-food",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-period-pain-patch",
    "name": "Period Pain Relief Patch",
    "category": "Women's Wellness",
    "subcategory": "Cycle & PCOS Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/period-pain-relief-patch",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/period-pain-relief-patch",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-uti-test-kit",
    "name": "UTI Test Kit",
    "category": "Women's Wellness",
    "subcategory": "Intimate & UTI Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/uti-detection-strip",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/uti-detection-strip",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-intimate-wash",
    "name": "Intimate Wash",
    "category": "Women's Wellness",
    "subcategory": "Intimate & UTI Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/intimate-wash",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/intimate-wash",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-intimate-care-serum",
    "name": "Intimate Care Serum",
    "category": "Women's Wellness",
    "subcategory": "Intimate & UTI Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/intimate-care-serum",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/intimate-care-serum",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-anti-rash-chafing-gel",
    "name": "Anti Rash and Chafing Gel",
    "category": "Women's Wellness",
    "subcategory": "Intimate & UTI Care",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/anti-chafing-rash-cream-gel-based",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/anti-chafing-rash-cream-gel-based",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-magnesium-glycinate-gummies",
    "name": "5-in-1 Magnesium Gummies with Glycinate & Vitamin D3",
    "category": "Sleep & Wellbeing",
    "subcategory": "Magnesium & Relaxation",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_MgGummies60N_bbpixy.jpg?tr=w-600",
    "shortDescription": "Five Magnesium Complex with Vitamins B6, D3, B9",
    "keyIngredients": [
      "Magnesium",
      "MagnaSorb™ Beads",
      "Chicory (Prebiotic Fibre)"
    ],
    "variants": [
      {
        "label": "60 Gummies",
        "sizeOrPack": "60 Gummies",
        "url": "https://bebodywise.com/product/magnesium-glycinate-gummies-60n",
        "availabilityStatus": "In Stock",
        "sku": "MWBWNTP.00341.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/magnesium-glycinate-gummies-60n",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "60 pcs",
      "magnesium",
      "sleep",
      "stress",
      "gummies",
      "Vitamins & Supplements",
      "Muscle Recovery",
      "MC - Muscle Relaxation"
    ]
  },
  {
    "id": "bw-10-magnesium-lotion",
    "name": "10% Magnesium Body Lotion",
    "category": "Sleep & Wellbeing",
    "subcategory": "Magnesium & Relaxation",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_MagLotion_300ml_iunqab.jpg?tr=w-600",
    "shortDescription": "For: Muscle Pain and Cramps",
    "keyIngredients": [
      "Magnesium Chloride",
      "Lavender Oil",
      "Mango Seed Butter",
      "Cocoa Butter",
      "Shea Butter"
    ],
    "variants": [
      {
        "label": "300 ml",
        "sizeOrPack": "300 ml",
        "url": "https://bebodywise.com/product/10-magnesium-lotion-300ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKP.00652.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/10-magnesium-lotion-300ml",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "300 ml",
      "magnesium",
      "lotions",
      "mango seed butter",
      "cocoa butter",
      "Muscle Recovery",
      "MC - Muscle Relaxation"
    ]
  },
  {
    "id": "bw-melatonin-sleep-gummies",
    "name": "Melatonin Sleep Gummies",
    "category": "Sleep & Wellbeing",
    "subcategory": "Sleep Gummies",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/melatonin-sleep-gummies",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/melatonin-sleep-gummies",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-personal-body-massager",
    "name": "Personal Body Massager",
    "category": "Sleep & Wellbeing",
    "subcategory": "Relaxation Tool",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/personal-body-massager",
        "availabilityStatus": "In Stock"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/personal-body-massager",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  },
  {
    "id": "bw-advanced-hair-growth-pack",
    "name": "Advanced Hair Growth Pack with Roll On 25ml",
    "category": "Kits & Combos",
    "subcategory": "Hair Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_HGP_6ebs2q.jpg?tr=w-600",
    "shortDescription": "For : Hair Thinning & Hair fall",
    "keyIngredients": [
      "3% Rosemary",
      "3% Redensyl",
      "Biotin",
      "Zinc & Multivitamins",
      "2% Aminexil",
      "2% Anagain"
    ],
    "variants": [
      {
        "label": "2-Step Pack (25 ml + Gummies)",
        "sizeOrPack": "25 ml",
        "url": "https://bebodywise.com/product/hair-growth-pack-rosemary-roll-on-xp-2",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFK.00615.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-growth-pack-rosemary-roll-on-xp-2",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "rosemary",
      "serum",
      "roll on",
      "gummies",
      "kit",
      "bestseller",
      "bestseller_hair"
    ]
  },
  {
    "id": "bw-stress-hair-loss-kit",
    "name": "Stress-Induced Hair Loss Solution",
    "category": "Kits & Combos",
    "subcategory": "Hair Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_StressHair_673aiq.jpg?tr=w-600",
    "shortDescription": "For hair fall due to stress",
    "keyIngredients": [
      "Biotin",
      "Zinc & Multivitamins",
      "Magnesium",
      "MagnaSorb™ Beads",
      "Chicory (Prebiotic Fibre)"
    ],
    "variants": [
      {
        "label": "60 Gummies Kit",
        "sizeOrPack": "60 Gummies",
        "url": "https://bebodywise.com/product/hair-magnesium-gummies-kit-30n",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFK.00668.B0_N"
      },
      {
        "label": "30 N Kit",
        "sizeOrPack": "30 N",
        "url": "https://bebodywise.com/product/anti-stress-hairfall-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFK.00681.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/hair-magnesium-gummies-kit-30n",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "biotin",
      "magnesium",
      "gummies",
      "kit"
    ]
  },
  {
    "id": "bw-intense-dandruff-kit",
    "name": "Intense Dandruff Kit",
    "category": "Kits & Combos",
    "subcategory": "Hair Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_IntenseDandruffKit_1jcmwd.jpg?tr=w-600",
    "shortDescription": "For Dandruff & Scalp itchiness",
    "keyIngredients": [
      "Ketoconazole",
      "ICHTHYOL® PALE",
      "Zinc Pyrithione",
      "Menthol"
    ],
    "variants": [
      {
        "label": "2-Step Kit (250 ml + Serum)",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/intense-dandruff-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFK.00577.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/intense-dandruff-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "ketoconazole",
      "shampoo",
      "serum",
      "dandruff"
    ]
  },
  {
    "id": "bw-anti-dandruff-hairfall-zpto-kit",
    "name": "Anti-Dandruff & Hair Fall Kit",
    "category": "Kits & Combos",
    "subcategory": "Hair Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/1-zpto-ads-hg30-kit/AppThumbnail_ZPTO_HG30_ap7gv5.jpg?tr=w-600",
    "shortDescription": "Controls dandruff, dryness & hair fall",
    "keyIngredients": [
      "1% ZPTO",
      "Piroctone Olamine",
      "Climbazole",
      "Tea Tree Extract",
      "Salicylic Acid",
      "Pentavitin",
      "Allantoin",
      "Erythritol",
      "Biotin",
      "Zinc & Multivitamins",
      "Chicory Root"
    ],
    "variants": [
      {
        "label": "ZPTO Shampoo + Biotin Gummies",
        "sizeOrPack": "200 ml",
        "url": "https://bebodywise.com/product/1-zpto-ads-hg30-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBBHFK.2055.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/1-zpto-ads-hg30-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "shampoo",
      "kit",
      "hairfall",
      "dandruff"
    ]
  },
  {
    "id": "bw-dandruff-hairfall-keto-kit",
    "name": "Dandruff & Hairfall Kit",
    "category": "Kits & Combos",
    "subcategory": "Hair Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/dandruff-and-hairfall-kit/AppThumbnail_Keto_HG30_26nyvl.jpg?tr=w-600",
    "shortDescription": "FOR: Treating damage caused by dandruff",
    "keyIngredients": [
      "Ketoconazole",
      "Biotin",
      "Zinc & Multivitamins"
    ],
    "variants": [
      {
        "label": "Ketoconazole + Biotin Gummies",
        "sizeOrPack": "30 N",
        "url": "https://bebodywise.com/product/dandruff-and-hairfall-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWHFK.00465.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/dandruff-and-hairfall-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "KIT OF 2",
      "KETOCONAZOLE"
    ]
  },
  {
    "id": "bw-sun-care-duo",
    "name": "Sun Care Duo for Face and Body",
    "category": "Kits & Combos",
    "subcategory": "Sun Protection Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_SPF_ULSS%20%281%29_cv0igh.png?tr=w-600",
    "shortDescription": "For: Tan correction and sun protection",
    "keyIngredients": [],
    "variants": [
      {
        "label": "2-Step Sun Duo",
        "sizeOrPack": "50 g",
        "url": "https://bebodywise.com/product/sun-care-duo-head-to-toe",
        "availabilityStatus": "In Stock",
        "sku": "MWBBSKK.00814.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/sun-care-duo-head-to-toe",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "KIT OF 2",
      "SPF"
    ]
  },
  {
    "id": "bw-daily-sun-shield-kit",
    "name": "Daily Sun Shield Kit",
    "category": "Kits & Combos",
    "subcategory": "Sun Protection Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_SuncareDuo_elz05e.jpg?tr=w-600",
    "shortDescription": "For complete sun protection",
    "keyIngredients": [
      "Microencapsulated SUNONE J",
      "SunCat DE",
      "ACZERO",
      "Niacianamide",
      "Centella Asiatica (Gotu Kola)"
    ],
    "variants": [
      {
        "label": "Face + Body Spray Kit",
        "sizeOrPack": "50 g",
        "url": "https://bebodywise.com/product/face-body-sunscreen-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00699.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/face-body-sunscreen-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "SPF 50",
      "Spray",
      "sunscreen",
      "kit",
      "SunOne J",
      "Suncat"
    ]
  },
  {
    "id": "bw-summer-essentials-trio",
    "name": "Summer Essentials Trio",
    "category": "Kits & Combos",
    "subcategory": "Sun & Body Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_SuncareTrio%20%281%29_b1o08z.jpg?tr=w-600",
    "shortDescription": "For staying cool and protected",
    "keyIngredients": [
      "Microencapsulated SUNONE J",
      "ACZERO",
      "Salicylic Acid",
      "Mandelic Acid"
    ],
    "variants": [
      {
        "label": "3-Step Trio",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/summer-essentials-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00702.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/summer-essentials-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 3",
      "SPF 50",
      "Spray",
      "sunscreen",
      "kit",
      "bodywash",
      "SunOne J",
      "Suncat"
    ]
  },
  {
    "id": "bw-aha-bha-body-pack",
    "name": "AHA-BHA Body Pack",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_AHABHABodyPackblend_7tkx54.jpg?tr=w-600",
    "shortDescription": "FOR: Strawberry Skin, Ingrown Hair & Bumpy Skin",
    "keyIngredients": [
      "Salicylic Acid (BHA)",
      "5% Lactic Acid"
    ],
    "variants": [
      {
        "label": "Body Wash + Body Lotion",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/aha-bha-body-pack",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00337.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/aha-bha-body-pack",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "aha bha",
      "bodywash",
      "lotion",
      "salicylic acid",
      "lactic acid"
    ]
  },
  {
    "id": "bw-strawberry-skin-pack",
    "name": "Strawberry Skin Pack",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_StrawberySkinPack_f5nd3y.jpg?tr=w-600",
    "shortDescription": "FOR: Keratosis Pilaris, Bumps & Strawberry Skin",
    "keyIngredients": [
      "Salicylic Acid (BHA)",
      "5% Lactic Acid"
    ],
    "variants": [
      {
        "label": "3-Step Pack",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/strawberry-skin-pack",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00545.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/strawberry-skin-pack",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "KIT of 3",
      "salicylic acid",
      "lactic acid",
      "AHA",
      "kit",
      "bodywash",
      "lotion",
      "scrub"
    ]
  },
  {
    "id": "bw-strawberry-exfoliation-kit",
    "name": "Strawberry Skin Exfoliation Kit",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_StrawberrySkinExfoKit_4pf31a.jpg?tr=w-600",
    "shortDescription": "FOR: Bumps & Strawberry Skin",
    "keyIngredients": [
      "Salicylic Acid (BHA)",
      "5% Lactic Acid"
    ],
    "variants": [
      {
        "label": "Body Wash + Scrub",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/sabodywash-scrub",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00582.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/sabodywash-scrub",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "salicylic Acid",
      "lactic acid",
      "aha",
      "kit",
      "scrub",
      "bodywash",
      "strawberry"
    ]
  },
  {
    "id": "bw-body-acne-pack",
    "name": "Body Acne Pack",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_BodyCareMiniPack_3pzf3t.jpg?tr=w-600",
    "shortDescription": "FOR: Body Acne and Body Acne Marks",
    "keyIngredients": [
      "Salicylic Acid (BHA)",
      "10% Niacinamide"
    ],
    "variants": [
      {
        "label": "2-Step Body Acne Pack",
        "sizeOrPack": "250 ml",
        "url": "https://bebodywise.com/product/body-care-mini-pack",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00321.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/body-care-mini-pack",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "salicylic acid",
      "niacinamide",
      "bodywash",
      "lotion",
      "bha",
      "bacne"
    ]
  },
  {
    "id": "bw-daily-hydration-kit",
    "name": "Daily Hydration Kit",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/daily-hydration-kit/AppThumbnail_10%25UreaLotion300ml_TripleMilk_bv9w5v.jpg?tr=w-600",
    "shortDescription": "For: Mild to Moderate Dryness",
    "keyIngredients": [
      "10% Urea",
      "Hydrating Butter Blend",
      "Lactic Acid"
    ],
    "variants": [
      {
        "label": "2-Step Hydration Kit",
        "sizeOrPack": "300 ml",
        "url": "https://bebodywise.com/product/daily-hydration-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWBCK.00189.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/daily-hydration-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "dull-dry-skin",
      "urea"
    ]
  },
  {
    "id": "bw-deep-moisturization-kit",
    "name": "Deep Moisturization Kit",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/deep-moisturization-kit/AppThumbnail_20UL_TripleMilk_jpe335.jpg?tr=w-600",
    "shortDescription": "For: Very dry & dehydrated skin",
    "keyIngredients": [],
    "variants": [
      {
        "label": "20% Urea + Triple Milk",
        "sizeOrPack": "250 mL",
        "url": "https://bebodywise.com/product/deep-moisturization-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBBBCK.00186.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/deep-moisturization-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": []
  },
  {
    "id": "bw-body-detan-kit",
    "name": "De-Tan Kit",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/pdp_rcl/body-de-tan-kit/AppThumbnail_EBW_SPF_700ml_g5bvm5.jpg?tr=w-600",
    "shortDescription": "For: Tan correction and sun protection",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Body Wash + SPF Lotion",
        "sizeOrPack": "700 mL",
        "url": "https://bebodywise.com/product/body-de-tan-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBBSKK.00815.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/body-de-tan-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": []
  },
  {
    "id": "bw-urea-heel-repair-kit",
    "name": "Urea Skin & Heel Repair Kit",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_UreaKit_ce00s9.jpg?tr=w-600",
    "shortDescription": "For: Dry Skin & Cracked Heels",
    "keyIngredients": [
      "10% Urea",
      "Lactic Acid",
      "Kokum Seed Butter"
    ],
    "variants": [
      {
        "label": "Standard Kit (200 ml)",
        "sizeOrPack": "200 ml",
        "url": "https://bebodywise.com/product/urea-skin-heel-repair-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00701.B0_N"
      },
      {
        "label": "75 ml Roll-On Kit",
        "sizeOrPack": "200 ml",
        "url": "https://bebodywise.com/product/urea-skin-heel-repair-kit-75ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00723.B0_N"
      },
      {
        "label": "Advanced 50 ml Kit",
        "sizeOrPack": "300 ml",
        "url": "https://bebodywise.com/product/advanced-urea-skin-heel-repair-kit-50ml",
        "availabilityStatus": "In Stock",
        "sku": "MWBBBCK.00171.BO_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/urea-skin-heel-repair-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "urea",
      "dull-dry-skin",
      "heels",
      "lotion",
      "roll on",
      "kit",
      "bestseller"
    ]
  },
  {
    "id": "bw-advanced-underarm-kit",
    "name": "Advanced Underarm Pigmentation Kit",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_APRK_91ljnf.jpg?tr=w-600",
    "shortDescription": "For Underarm Odour and Severe Pigmentation",
    "keyIngredients": [
      "1% Salicylic Acid",
      "4% Lactic Acid",
      "0.1% Retinol"
    ],
    "variants": [
      {
        "label": "6% AHA BHA + Cream",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/advanced-underarm-pigmentation-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00711.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/advanced-underarm-pigmentation-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "6% aha bha",
      "aha bha",
      "roll on",
      "bestseller",
      "bestseller_body",
      "cream",
      "kit"
    ]
  },
  {
    "id": "bw-underarm-kit-no-fragrance",
    "name": "Underarm Pigmentation Kit - No Fragrance",
    "category": "Kits & Combos",
    "subcategory": "Body Care Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_PRK_FF_7y6t15.jpg?tr=w-600",
    "shortDescription": "For Underarm Odour and Severe Pigmentation",
    "keyIngredients": [
      "1% Salicylic Acid",
      "1% Mandelic Acid",
      "0.1% Retinol"
    ],
    "variants": [
      {
        "label": "4% AHA BHA + Cream",
        "sizeOrPack": "50 ml",
        "url": "https://bebodywise.com/product/underarm-pigmentation-kit-no-fragrance",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00547.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/underarm-pigmentation-kit-no-fragrance",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "4% aha bha",
      "roll on",
      "cream",
      "kit",
      "Oily",
      "Sensitive",
      "Combination"
    ]
  },
  {
    "id": "bw-complete-magnesium-care",
    "name": "Complete Magnesium Care",
    "category": "Kits & Combos",
    "subcategory": "Sleep & Wellbeing Kits",
    "imageUrl": "https://i.mscwlns.co/media/misc/others/AppThumbnail_MgKit_1yy5wt.jpg?tr=w-600",
    "shortDescription": "For restful sleep, reduced stress & faster muscle recovery",
    "keyIngredients": [
      "MagnaSorb™ Beads",
      "Magnesium Chloride",
      "Chicory (Prebiotic Fibre)"
    ],
    "variants": [
      {
        "label": "Gummies + 300 ml Lotion",
        "sizeOrPack": "300 ml",
        "url": "https://bebodywise.com/product/magnesium-gummies-and-lotion-kit",
        "availabilityStatus": "In Stock",
        "sku": "MWBWSKK.00700.B0_N"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/magnesium-gummies-and-lotion-kit",
    "availabilityStatus": "In Stock",
    "verificationStatus": "Verified on bebodywise.com",
    "sourceOrigin": "shop/all",
    "tags": [
      "kit of 2",
      "magnesium",
      "gummies",
      "lotion",
      "kit",
      "Muscle Recovery"
    ]
  },
  {
    "id": "bw-body-acne-dandruff-kit",
    "name": "Body Acne & Dandruff Control Kit",
    "category": "Kits & Combos",
    "subcategory": "Body & Hair Kits",
    "imageUrl": "",
    "shortDescription": "Historical Be Bodywise sitemap entry; product page is archived with no live description documented.",
    "keyIngredients": [],
    "variants": [
      {
        "label": "Standard",
        "sizeOrPack": "",
        "url": "https://bebodywise.com/product/body-acne-dandruff-control-kit",
        "availabilityStatus": "Availability not verified"
      }
    ],
    "officialUrl": "https://bebodywise.com/product/body-acne-dandruff-control-kit",
    "availabilityStatus": "Availability not verified",
    "verificationStatus": "Availability not verified on bebodywise.com",
    "sourceOrigin": "sitemap",
    "tags": []
  }
];
