# Electra Mobile Store

A premium, fully interactive mobile phone e-commerce web application with a built-in admin dashboard. Built with Vanilla HTML, CSS and JavaScript, connected to Supabase PostgreSQL.

## Features

### Storefront (`index.html`)
- 🎨 Glassmorphic dark/light theme with animated UI
- 🔍 Live search and brand/price filters
- 📱 Hero flagship product slider (auto-rotating)
- 🛒 Dynamic shopping cart with localStorage persistence
- ⚖️ Side-by-side product comparison (up to 3 devices)
- 🎛️ Product customization modal (color, storage options)
- 💳 Mock checkout form with real Supabase order submission

### Admin Panel (`admin.html`)
- 🔐 Passcode-protected session authentication
- 📊 Analytics dashboard (revenue, orders, AOV, inventory)
- 🗂️ Full CRUD management for products
- 📦 Orders ledger with fulfillment status toggling
- ➕ Add new products with JSON configuration
- 🔄 Live Supabase sync

## Database Setup

Run [schema.sql](schema.sql) in your Supabase SQL Editor to:
- Create `products`, `orders`, and `order_items` tables
- Seed the 6 initial flagship devices
- Configure Row Level Security policies

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Database**: Supabase (PostgreSQL) via REST API
- **Fonts**: Google Fonts (Inter, Outfit)
- **Icons**: Inline SVG

## Running Locally

Open `index.html` directly in your browser (Chrome, Edge, Firefox).

Admin access: open `admin.html` and enter `admin` or `admin123` as the passcode.
