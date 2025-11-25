# Product Comparison Table - Specification

## Component Overview
A product comparison table section showing FÖRU products vs. competitors across multiple feature rows.

## Layout Structure

### Desktop (3 Columns)
- **Column 1 (Left)**: Feature names/categories
- **Column 2 (Center)**: FÖRU product details (with gray background)
- **Column 3 (Right)**: Competitor comparison (shows ✕ marks)

### Mobile (Horizontal Slider)
- Same 3 columns but in a swipeable carousel
- Shows ~2 columns visible at once
- User swipes to see remaining content

## Content Structure

### Header Section
- **Pre-title**: "Difference" (small text, top-right)
- **Main Heading**: "QUALITY THAT YOU CAN'T FIND ELSEWHERE"

### Table Structure
- **Column Headers**:
  - Column 1: (No header - feature labels)
  - Column 2: "FÖRU"
  - Column 3: "LEADING COMPETITORS"

### Row Content
Each row has:
- **Feature Label** (Column 1): e.g., "BRANCHED-CHAIN AMINO ACIDS"
- **FÖRU Value** (Column 2): Product-specific details, e.g., "LEUCINE, ISOLEUCINE, VALINE (2:1:1 RATIO)"
- **Competitor Value** (Column 3): ✕ symbol (indicating absence)

---

## Metaobject Definition Setup

### Create Metaobject: `comparison_table_row`
**Type**: `comparison_table_row`

**Fields:**
1. **Feature Label**
   - Field name: `feature_label`
   - Type: Single line text
   - Required: Yes
   - Description: Left column feature name (e.g., "BRANCHED-CHAIN AMINO ACIDS")

2. **FÖRU Value**
   - Field name: `foru_value`
   - Type: Multi-line text
   - Required: Yes
   - Description: Product-specific value for FÖRU column (e.g., "LEUCINE, ISOLEUCINE, VALINE (2:1:1 RATIO)")

3. **Competitor Has Feature**
   - Field name: `competitor_has`
   - Type: Boolean (true/false)
   - Required: Yes
   - Default: false
   - Description: If false, shows ✕. If true, shows ✓

---

### Product Metafield Setup

**Metafield Definition:**
- **Namespace and Key**: `custom.comparison_table`
- **Name**: "Comparison Table Data"
- **Type**: Metaobject
- **Metaobject Type**: `comparison_table_row`
- **List of entries**: Yes (allows multiple rows)
- **Applied to**: Products
- **Validation**: None required

---

## Section Settings Schema

**Section file**: `sections/product-comparison-table.liquid`

### Section Settings:
```json
{
  "name": "Product Comparison Table",
  "tag": "section",
  "class": "section-comparison-table",
  "settings": [
    {
      "type": "text",
      "id": "pre_title",
      "label": "Pre-title",
      "default": "Difference"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "QUALITY THAT YOU CAN'T FIND ELSEWHERE"
    },
    {
      "type": "text",
      "id": "column_2_header",
      "label": "Column 2 Header",
      "default": "FÖRU"
    },
    {
      "type": "text",
      "id": "column_3_header",
      "label": "Column 3 Header",
      "default": "LEADING COMPETITORS"
    },
    {
      "type": "color",
      "id": "foru_column_bg",
      "label": "FÖRU Column Background",
      "default": "#F5F5F5"
    },
    {
      "type": "range",
      "id": "section_padding_top",
      "label": "Padding Top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "default": 36
    },
    {
      "type": "range",
      "id": "section_padding_bottom",
      "label": "Padding Bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "default": 36
    }
  ],
  "presets": [
    {
      "name": "Product Comparison Table"
    }
  ]
}
```

---

## Liquid Logic Structure

### Data Flow:
1. **Get metafield data**: `product.metafields.custom.comparison_table.value`
2. **Check if data exists**: `{% if comparison_rows.size > 0 %}`
3. **Loop through rows**: `{% for row in comparison_rows %}`
4. **Render each row** with 3 columns:
   - `row.feature_label`
   - `row.foru_value`
   - Icon based on `row.competitor_has` (✕ or ✓)

---

## Component Breakdown

### Desktop Layout (CSS Grid)
```css
.comparison-table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
}

.comparison-table__row {
  display: contents;
}

.comparison-table__cell {
  padding: 20px;
  border-bottom: 1px solid #E5E5E5;
}

.comparison-table__cell--foru {
  background: var(--foru-column-bg);
}
```

### Mobile Layout (Swiper Slider)
```css
.comparison-table-mobile {
  .swiper-slide {
    width: 85%;
  }
}

// Use existing Swiper.js instance
// Configure: slidesPerView: 'auto', spaceBetween: 16
```

---

## Example Metafield Data Entry

### Product: "Pre-Workout Formula"

**Metafield: `custom.comparison_table`** (list of metaobjects)

**Entry 1:**
- feature_label: "BRANCHED-CHAIN AMINO ACIDS"
- foru_value: "LEUCINE, ISOLEUCINE, VALINE (2:1:1 RATIO)"
- competitor_has: false

**Entry 2:**
- feature_label: "CELLULAR ANTIOXIDANTS"
- foru_value: "COENZYME Q10, N-ACETYL CYSTEINE"
- competitor_has: false

**Entry 3:**
- feature_label: "PUMP & CIRCULATION SUPPORT"
- foru_value: "ARGININE AKG"
- competitor_has: false

**Entry 4:**
- feature_label: "THIRD-PARTY TESTED"
- foru_value: "YES – EVERY BATCH"
- competitor_has: false

**Entry 5:**
- feature_label: "CERTIFIED FOR SPORT"
- foru_value: "INFORMED SPORT CERTIFIED"
- competitor_has: false

**Entry 6:**
- feature_label: "MULTI-FUNCTION FORMULA"
- foru_value: "HYDRATION + RECOVERY"
- competitor_has: false

---

## Shopify Admin Setup Steps

### Step 1: Create Metaobject Definition
1. Settings → Custom Data → Metaobjects
2. Add definition → Name: "Comparison Table Row"
3. Type: `comparison_table_row`
4. Add 3 fields as specified above

### Step 2: Create Product Metafield
1. Settings → Custom Data → Products
2. Add definition
3. Name: "Comparison Table Data"
4. Namespace/key: `custom.comparison_table`
5. Type: List of metaobjects → Select `comparison_table_row`

### Step 3: Add Data to Products
1. Go to product → Metafields section
2. Click "Comparison Table Data"
3. Add entries for each row
4. Fill in feature_label, foru_value, competitor_has for each

---

## Implementation Checklist

- [ ] Create metaobject definition (`comparison_table_row`)
- [ ] Create product metafield (`custom.comparison_table`)
- [ ] Create section file (`product-comparison-table.liquid`)
- [ ] Implement desktop 3-column grid layout
- [ ] Implement mobile swiper/slider
- [ ] Add section settings schema
- [ ] Style with theme variables (fonts, colors)
- [ ] Test with sample product data
- [ ] Add to product template JSON
- [ ] Verify responsive behavior

---

## File Structure

```
sections/
  └── product-comparison-table.liquid

snippets/ (optional)
  └── comparison-icon.liquid  (for ✕/✓ icons)

assets/
  └── (use existing Swiper.js - no new files needed)
```

---

## Status
- **Created**: 2025-11-25
- **Status**: Pending Implementation
- **Designer**: (from Figma)
- **Developer**: TBD
