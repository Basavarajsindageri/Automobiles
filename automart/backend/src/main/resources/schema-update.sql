-- MySQL Database Schema Update Migration Script for AutoVerse / AutoMart

CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE IF NOT EXISTS subcategories (
    subcategory_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    INDEX idx_subcategory_category (category_id),
    INDEX idx_subcategory_slug (slug)
);

-- Ensure category_id & subcategory_id columns exist on products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id BIGINT;

-- Add indexes for filtering optimization
CREATE INDEX IF NOT EXISTS idx_product_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_product_vehicle_type ON products(vehicle_type);
