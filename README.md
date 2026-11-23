# The Wedding of Seno & Jattu

Official digital wedding invitation for **Seno & Jattu** (Theme: *SENJA*).

## Project Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://uazfzmuvunmhnjdfxbbi.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
   VITE_CUSTOMER_ID=0df84d42-e5cf-4873-8236-522fde515f0f
   VITE_OWNER_ID=0809f3e3-2be1-4fad-9d44-14c46b956d41
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```
