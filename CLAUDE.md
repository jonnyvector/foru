# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify theme called "Wonder" (v2.0.0) by Nethype. It's a complete e-commerce theme with modern features including video sections, product galleries, cart functionality, multilingual support, and responsive design.

## Architecture

### Directory Structure
- `assets/` - CSS, JavaScript, fonts, and other static assets
- `config/` - Theme settings and configuration files
- `layout/` - Base Liquid templates (theme.liquid, password.liquid)
- `locales/` - Translation files for 30+ languages
- `sections/` - Reusable Liquid sections for theme customization
- `snippets/` - Reusable Liquid code snippets
- `templates/` - Page templates and customer account templates

### Key Components
- **Multi-language Support**: 30+ locales with schema files for theme editor translations
- **Asset Management**: Modular CSS/JS with Swiper.js, PhotoSwipe, and custom components
- **Template System**: JSON-based template configuration with Liquid rendering
- **Product Features**: Quick add, recommendations, galleries, variant selection
- **Cart System**: Drawer-based cart with cross-sell functionality

## Development Commands

### Theme Development
```bash
# Start development server with live reload
shopify theme dev

# Validate theme files
shopify theme check

# Pull theme files from store
shopify theme pull

# Push theme files to store
shopify theme push

# Package theme for distribution
shopify theme package
```

### Theme Management
```bash
# List all themes in store
shopify theme list

# Open theme preview
shopify theme open

# Publish theme as live
shopify theme publish

# Create shareable theme link
shopify theme share
```

## Key Files

### Configuration
- `config/settings_schema.json` - Theme customization options
- `config/settings_data.json` - Current theme settings values

### Core Templates
- `layout/theme.liquid` - Main HTML structure
- `templates/index.json` - Homepage template configuration
- `templates/product.json` - Product page template
- `templates/collection.json` - Collection page template

### Critical Assets
- `assets/base.js` - Core JavaScript functionality
- `assets/global.js` - Global theme utilities
- `assets/main.css` - Primary stylesheet
- `assets/critical.css` - Above-the-fold styles

## Development Notes

### Liquid Template System
- Uses Shopify's Liquid templating language
- JSON templates in `templates/` define section layouts
- Sections in `sections/` contain reusable components
- Snippets in `snippets/` contain small reusable code blocks

### Asset Pipeline
- CSS and JS files are served directly from `assets/`
- Uses Swiper.js for carousels and sliders
- PhotoSwipe for product image galleries
- Custom JavaScript modules for cart, product forms, and UI components

### Customization
- Theme settings controlled via `config/settings_schema.json`
- Section settings allow per-section customization
- Supports custom CSS and JavaScript injection

### Multilingual
- Default language: English (`en.default.json`)
- Schema translations for theme editor in multiple languages
- RTL support for Arabic and Hebrew