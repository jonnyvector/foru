# Bug: Add to Cart Button Not Updating on Variant Change

## Status
🔴 **OPEN** - Not yet resolved

## Priority
High - Affects core purchase functionality

## Description
The Add to Cart button's disabled state is not updating correctly when clicking between in-stock and out-of-stock variants via JavaScript. The server-rendered state on page load is correct, but the JavaScript variant change handler is not properly enabling/disabling the button.

## Steps to Reproduce

### Setup
Product with multiple variants where some options are in-stock and others are completely out of stock.

Example:
- **Taste Option**: Berry (in stock), Mango (out of stock)

### Bug Flow

1. **Arrive on product page with Berry selected (in stock)**
   - ✅ Result: Add to Cart button is ENABLED (correct)

2. **Click to Mango (out of stock)**
   - ❌ Result: Add to Cart button STAYS ENABLED (should disable)
   - **BUG #1**: Button does not disable when switching to out-of-stock variant

3. **Refresh page on Mango**
   - ✅ Result: Add to Cart button is DISABLED (correct)
   - Note: Server-rendered state is correct

4. **Click to Berry (in stock)**
   - ❌ Result: Add to Cart button STAYS DISABLED (should enable)
   - **BUG #2**: Button does not enable when switching to in-stock variant

5. **Refresh page on Berry**
   - ✅ Result: Add to Cart button is ENABLED (correct)
   - Note: Server-rendered state is correct

## Root Cause

The issue is in `/assets/variants.js` at lines 337-345:

```javascript
const addButtonUpdated = html.getElementById(
  `ProductSubmitButton-${sectionId}`,
);
this.toggleAddButton(
  addButtonUpdated
    ? addButtonUpdated.hasAttribute("disabled")
    : true,
  window.variantStrings.soldOut,
);
```

**Problem**: The code is checking the `disabled` attribute from the fetched HTML response instead of using the actual variant availability data (`this.currentVariant.available`). This means it's relying on potentially stale server-rendered HTML rather than the current JavaScript state.

## Expected Behavior
- When clicking to an out-of-stock variant → Button should immediately disable
- When clicking to an in-stock variant → Button should immediately enable
- Button state should update instantly via JavaScript without requiring page refresh

## Actual Behavior
- Button state does not update when clicking between variants
- Only page refresh shows correct button state (server-rendered)

## Technical Details

### Affected Files
- `/assets/variants.js` (lines 337-345)
- Custom button component: `/snippets/custom-button-pp.liquid`
- Product form: `/sections/main-product.liquid` (lines 1780-1788)

### Custom Button Usage
```liquid
{% render 'custom-button-pp',
  text: button_text,
  type: 'submit',
  aria_label: button_text,
  class: 'js-add-to-cart product-form__submit button--full-width',
  id: 'ProductSubmitButton-' | append: section.id,
  style: 'primary',
  disabled: disable_button
%}
```

### toggleAddButton Function
Located in `/assets/variants.js` (lines 357-375):
- Takes parameters: `disable` (boolean), `text` (string), `modifyClass` (boolean)
- Finds button by `name="add"` attribute
- Sets/removes `disabled` attribute
- Updates button text

## Attempted Fixes

### ❌ Attempt #1 (Reverted)
Changed logic to use `this.currentVariant.available` instead of checking HTML:

```javascript
this.toggleAddButton(
  !this.currentVariant || !this.currentVariant.available,
  this.currentVariant && !this.currentVariant.available ? window.variantStrings.soldOut : null,
);
```

**Result**: Did not fix the issue, changes reverted.

## Environment
- Theme: Wonder (v2.0.0) by Nethype
- Branch: staging
- Custom button component in use

## Next Steps
1. Debug to understand why variant availability isn't being properly detected
2. Check if custom button component is interfering with state updates
3. Verify that `this.currentVariant` has correct availability data
4. Check if there's a timing issue with when the button state is updated vs when variant data is available

## Notes
- This may have been a pre-existing issue, not necessarily caused by recent changes
- Server-side rendering works correctly, so the Liquid logic is fine
- The issue is specifically in the JavaScript variant change handler
