#!/bin/bash
set -e
mkdir -p app prisma
cat << 'STYLE' > app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0d0d0d;
  --bg-secondary: #141414;
  --bg-card: #1a1a1a;
  --border: #2a2a2a;
  --accent: #C8952A;
  --accent-hover: #d4a53a;
  --text-primary: #ffffff;
  --text-secondary: #888888;
}

body {
  color: var(--text-primary);
  background: var(--bg-primary);
}

.bg-dot-grid {
  background-image: radial-gradient(circle, #2a2a2a 1px, transparent 1px);
  background-size: 24px 24px;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
STYLE

cat << 'STYLE2' > tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        card: "var(--bg-card)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
      },
    },
  },
  plugins: [],
};
export default config;
STYLE2

cat << 'LAYOUT' > app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SHOWROOM JR",
  description: "WhatsApp E-commerce Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
LAYOUT

mkdir -p prisma
cat << 'SCHEMA' > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model SiteConfig {
  id                    Int      @id @default(1)
  siteName              String   @default("SHOWROOM JR")
  siteSlogan            String?
  logoUrl               String?
  faviconUrl            String?
  primaryColor          String   @default("#0d0d0d")
  secondaryColor        String   @default("#C8952A")
  whatsappNumber        String?
  whatsappMessage       String?
  whatsappButtonText    String   @default("Consultar por WhatsApp")
  whatsappButtonEnabled Boolean  @default(true)
  heroTitle             String?
  heroSubtitle          String?
  heroImageUrl          String?
  bannerImageUrl        String?
  twitterHandle         String?
  instagramHandle       String?
  facebookUrl           String?
  metaTitle             String?
  metaDescription       String?
  metaKeywords          String?
  footerText            String?
  showProductCount      Boolean  @default(true)
  showCategoryCount     Boolean  @default(true)
  shippingBadge         String?
  warrantyBadge         String?
  returnsBadge          String?
  supportBadge          String?
  currencySymbol        String   @default("$")
  currencyCode          String   @default("ARS")
  maintenanceMode       Boolean  @default(false)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  imageUrl    String?
  active      Boolean   @default(true)
  sortOrder   Int       @default(0)
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id                      String         @id @default(uuid())
  name                    String
  slug                    String         @unique
  description             String?
  shortDescription        String?
  price                   Decimal
  compareAtPrice          Decimal?
  categoryId              String
  category                Category       @relation(fields: [categoryId], references: [id])
  featured                Boolean        @default(false)
  active                  Boolean        @default(true)
  stock                   Int            @default(0)
  sortOrder               Int            @default(0)
  viewCount               Int            @default(0)
  whatsappMessageOverride String?
  images                  ProductImage[]
  createdAt               DateTime       @default(now())
  updatedAt               DateTime       @updatedAt
}

enum ImageSourceType {
  UPLOAD
  URL
}

model ProductImage {
  id         String          @id @default(uuid())
  productId  String
  product    Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  url        String
  altText    String?
  sourceType ImageSourceType @default(UPLOAD)
  localPath  String?
  isPrimary  Boolean         @default(false)
  sortOrder  Int             @default(0)
  createdAt  DateTime        @default(now())
}

enum AdminRole {
  SUPER_ADMIN
  EDITOR
}

model AdminUser {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String?
  role      AdminRole @default(EDITOR)
  lastLogin DateTime?
  createdAt DateTime  @default(now())
}

enum BannerPosition {
  HERO
  MIDDLE
  FOOTER
  SIDEBAR
}

model Banner {
  id        String         @id @default(uuid())
  title     String
  imageUrl  String
  linkUrl   String?
  linkText  String?
  position  BannerPosition @default(HERO)
  active    Boolean        @default(true)
  sortOrder Int            @default(0)
  startDate DateTime?
  endDate   DateTime?
}
SCHEMA

cat << 'ENVFILE' > .env
DATABASE_URL="postgresql://showroomjr:showroomjr@localhost:5432/showroomjr?schema=public"
NEXTAUTH_SECRET="showroomjr-secret-key-for-nextauth"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE_MB="10"
ENVFILE

cat << 'SEED' > prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@showroom.com' },
    update: {},
    create: {
      email: 'admin@showroom.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  })

  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'SHOWROOM JR',
    },
  })

  console.log({ admin, config })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
SEED

sudo -u postgres psql -c "CREATE USER showroomjr WITH PASSWORD 'showroomjr';" -c "CREATE DATABASE showroomjr;" -c "GRANT ALL PRIVILEGES ON DATABASE showroomjr TO showroomjr;" || true
sudo -u postgres psql -d showroomjr -c "ALTER SCHEMA public OWNER TO showroomjr;" || true

npx prisma generate
npx prisma db push
npm install -D ts-node
npx ts-node prisma/seed.ts
