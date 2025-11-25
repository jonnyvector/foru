# Shopify Metafields & Metaobjects Guide

**Purpose**: Stop wasting time figuring out how to access metafield values in Liquid. This guide documents the correct patterns based on actual implementation.

## Key Principles

1. **Metaobjects require `.value` to access**: `product.metafields.custom.product_rating.value`
2. **Fields within metaobjects are accessed directly**: `metaobject.field_name` (no `.value`)
3. **EXCEPT for special field types** (Rating, List) which have their own access patterns
4. **Liquid cannot convert strings to numbers** - you must work around this

## Accessing Metaobjects

### Basic Pattern

```liquid
{%- assign metaobject = product.metafields.custom.metaobject_name.value -%}

{% if metaobject %}
  {%- assign field_value = metaobject.field_name -%}
{% endif %}
```

### Example: Health Benefits Section

```liquid
{% assign hb = product.metafields.custom.health_benefits_section.value %}

{% if hb %}
  <h2>{{ hb.title }}</h2>
  <div>{{ hb.body | metafield_tag }}</div>

  {%- assign benefits = hb.benefits.value -%}
  {% for benefit in benefits %}
    <p>{{ benefit.title }}</p>
  {% endfor %}
{% endif %}
```

**Key Points**:
- Get metaobject: `.value` on the metafield reference
- Access simple fields: Direct access (`.title`, `.body`)
- Access list fields: Need `.value` again (`.benefits.value`)
- Use `metafield_tag` for rich text fields

## Field Type Reference

### Simple Field Types (String, Number, Boolean, Rich Text)

```liquid
{% assign metaobj = product.metafields.custom.my_metaobject.value %}
{{ metaobj.text_field }}        {%- comment -%} String - direct access {%- endcomment -%}
{{ metaobj.number_field }}      {%- comment -%} Number - direct access {%- endcomment -%}
{{ metaobj.boolean_field }}     {%- comment -%} Boolean - direct access {%- endcomment -%}
{{ metaobj.rich_text | metafield_tag }}  {%- comment -%} Rich text - use metafield_tag {%- endcomment -%}
```

### Rating Field Type

**THE PROBLEM**: Rating fields return an object like:
```json
{"scale_min":"1.0","scale_max":"5.0","value":"5.0"}
```

The `.value` property is a **STRING**, not a number, so Liquid math doesn't work:
```liquid
{%- assign rating = metaobj.rating.value -%}  {%- comment -%} "5.0" (string) {%- endcomment -%}
{{ rating | times: 20 }}  {%- comment -%} Returns 0 - DOESN'T WORK! {%- endcomment -%}
```

**THE SOLUTION**: Split the string and do math on the parts:
```liquid
{%- assign rating_str = metaobj.rating.value -%}
{%- assign rating_parts = rating_str | split: '.' -%}
{%- assign whole = rating_parts[0] | times: 20 -%}
{%- assign decimal = rating_parts[1] | times: 2 -%}
{%- assign percent = whole | plus: decimal -%}
```

**Example**: "4.7" → ["4", "7"] → (4 × 20) + (7 × 2) → 80 + 14 → 94%

**Full Working Example** (from `snippets/rating.liquid`):
```liquid
{%- assign product_rating_obj = product.metafields.custom.product_rating.value -%}

{% if product_rating_obj %}
  {%- assign use_data = product_rating_obj.use_review_data -%}

  {% if use_data == true %}
    {%- assign rating_str = product_rating_obj.rating.value -%}
    {%- assign rating_parts = rating_str | split: '.' -%}
    {%- assign whole = rating_parts[0] | times: 20 -%}
    {%- assign decimal = rating_parts[1] | times: 2 -%}
    {%- assign percent = whole | plus: decimal -%}
    {%- assign review_count = product_rating_obj.review_count -%}

    {%- comment -%} Now percent is 0-100 for star width {%- endcomment -%}
    <div class="stars" style="width: {{ percent }}%;"></div>
    <span>({{ review_count }} reviews)</span>
  {% endif %}
{% endif %}
```

### List Field Types

Lists require `.value` to iterate:

```liquid
{%- assign metaobj = product.metafields.custom.my_metaobject.value -%}
{%- assign items = metaobj.list_field.value -%}

{% for item in items %}
  {{ item.property }}
{% endfor %}
```

### File/Image Fields

```liquid
{%- assign metaobj = product.metafields.custom.my_metaobject.value -%}

{% if metaobj.hero_media %}
  {{ metaobj.hero_media | image_url: width: 600 | image_tag: loading: 'lazy', alt: metaobj.title }}
{% endif %}
```

## Common Mistakes & Fixes

### ❌ WRONG: Trying to access metaobject without `.value`
```liquid
{% assign metaobj = product.metafields.custom.my_metaobject %}
{{ metaobj.field }}  {%- comment -%} Won't work! {%- endcomment -%}
```

### ✅ CORRECT:
```liquid
{% assign metaobj = product.metafields.custom.my_metaobject.value %}
{{ metaobj.field }}
```

---

### ❌ WRONG: Adding `.value` to simple fields within metaobject
```liquid
{{ metaobj.title.value }}  {%- comment -%} Wrong! {%- endcomment -%}
```

### ✅ CORRECT:
```liquid
{{ metaobj.title }}
```

---

### ❌ WRONG: Forgetting `.value` on list fields
```liquid
{% for item in metaobj.list_field %}  {%- comment -%} Won't iterate! {%- endcomment -%}
```

### ✅ CORRECT:
```liquid
{% for item in metaobj.list_field.value %}
```

---

### ❌ WRONG: Trying to do math with rating value strings
```liquid
{{ metaobj.rating.value | times: 20 }}  {%- comment -%} Returns 0! {%- endcomment -%}
```

### ✅ CORRECT:
```liquid
{%- assign rating_parts = metaobj.rating.value | split: '.' -%}
{%- assign whole = rating_parts[0] | times: 20 -%}
{%- assign decimal = rating_parts[1] | times: 2 -%}
{%- assign percent = whole | plus: decimal -%}
```

## Debugging Metafields

When things don't work, add debug output:

```liquid
<!-- DEBUG: metaobject exists: {{ product.metafields.custom.my_metaobject }} -->
<!-- DEBUG: metaobject.value: {{ product.metafields.custom.my_metaobject.value }} -->
<!-- DEBUG: field value: {{ metaobj.field_name }} -->
```

**Note**: Use HTML comments, not JavaScript console.log (Liquid can't be used inside `<script>` tags)

## Quick Reference Chart

| Field Location | Access Pattern | Example |
|----------------|----------------|---------|
| Metaobject itself | `.value` | `product.metafields.custom.obj.value` |
| String field in metaobject | Direct | `metaobj.title` |
| Number field in metaobject | Direct | `metaobj.count` |
| Boolean field in metaobject | Direct | `metaobj.enabled` |
| Rich text field in metaobject | Direct + filter | `metaobj.body \| metafield_tag` |
| Rating field in metaobject | `.value` then split | `metaobj.rating.value \| split: '.'` |
| List field in metaobject | `.value` | `metaobj.items.value` |
| Image field in metaobject | Direct + filter | `metaobj.image \| image_url: width: 600` |

## Why This is Confusing

1. **Inconsistent API**: Metaobjects need `.value`, but fields within them don't (usually)
2. **Type System**: Liquid doesn't distinguish between strings and numbers well
3. **No Type Conversion**: Can't convert "5.0" string to 5.0 number easily
4. **Documentation**: Shopify docs don't always make the distinction clear
5. **Error Messages**: Often silent failures (returns empty/0 instead of error)

## Best Practices

1. **Always test with real data** - test in dev environment with actual metafields
2. **Use debug comments** - add HTML comments to see what values you're getting
3. **Reference working examples** - check `health-benefits.liquid` and `rating.liquid` sections
4. **Document weird patterns** - if you find a workaround, document it here
5. **Prefer simple field types** - use Number instead of Rating when possible

## Related Files

- `/sections/health-benefits.liquid` - Working metaobject example
- `/snippets/rating.liquid` - Working rating field example with string-to-number conversion
- `/sections/ingredients-product.liquid` - Another metaobject example
- `/.shopify/metafields.json` - Metafield definitions

## When to Update This Guide

- When you discover a new metafield type pattern
- When you find a bug in this guide
- When Shopify changes how metafields work
- When you waste more than 10 minutes on metafield access issues
