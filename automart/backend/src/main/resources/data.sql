-- Seed Categories
INSERT INTO categories (category_id, name, slug, description, image_url, created_at, updated_at) 
VALUES 
(1, 'Cars', 'cars', 'Complete car vehicle models, body styles, and luxury editions.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Auto Parts', 'auto-parts', 'Genuine mechanical components, engine parts, brakes, suspension, and filters.', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Accessories', 'accessories', 'Interior and exterior accessories, car electronics, helmets, seat covers, and detailing kits.', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Subcategories
INSERT INTO subcategories (subcategory_id, category_id, name, slug, description, image_url, created_at, updated_at)
VALUES
-- Cars Subcategories
(1, 1, 'Sedan', 'sedan', 'Sleek, comfortable, and executive sedan vehicles.', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'SUV', 'suv', 'Rugged, high clearance, and spacious sports utility vehicles.', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 'Hatchback', 'hatchback', 'Compact, fuel efficient, and agile city hatchbacks.', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'Luxury Cars', 'luxury-cars', 'Premium high-end performance luxury automobiles.', 'https://images.unsplash.com/photo-1555215695-3004980ad54e', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Auto Parts Subcategories
(5, 2, 'Engine Parts', 'engine-parts', 'High performance spark plugs, pistons, valves, and oil filters.', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 2, 'Brakes', 'brakes', 'Ceramic brake pads, ventilated brake rotors, and calipers.', 'https://images.unsplash.com/photo-1600706432520-5c0745717551', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 2, 'Suspension', 'suspension', 'Heavy duty shock absorbers, struts, and lowering springs.', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 2, 'Filters', 'filters', 'High efficiency air, cabin, and fuel filters.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Accessories Subcategories
(9, 3, 'Helmets', 'helmets', 'DOT and ECE certified full-face and modular riding helmets.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 3, 'Seat Covers', 'seat-covers', 'Custom fitted Nappa leather and breathable fabric seat covers.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 3, 'Floor Mats', 'floor-mats', '7D all-weather waterproof custom fit car floor mats.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 3, 'Car Electronics', 'car-electronics', 'Android touch stereos, 4K dash cams, and reverse cameras.', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 3, 'Car Care', 'car-care', 'Ceramic coating, micro-fiber cloths, and polish wash kits.', 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Sample Products
INSERT INTO products (product_id, category_id, subcategory_id, name, slug, vehicle_type, brand, short_description, description, price, original_price, discount_percentage, rating, review_count, stock, sku, compatibility, featured, trending, new_arrival, created_at, updated_at)
VALUES
(1, 1, 1, 'Honda City 5th Gen Sedan', 'honda-city-5th-gen-sedan', 'cars', 'Honda', 'Premium 1.5L i-VTEC executive sedan with sunroof and ADAS safety features.', 'The Honda City 5th Gen is the benchmark of executive sedans featuring full LED headlamps, leather upholstery, 8-inch touchscreen infotainment, and Honda Sensing ADAS tech.', 1580000.00, 1650000.00, 4, 4.8, 45, 10, 'CAR-HONDA-CITY', 'Universal Honda', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 1, 1, 'Hyundai Verna Turbo Sedan', 'hyundai-verna-turbo-sedan', 'cars', 'Hyundai', '1.5L Turbo GDi futuristic sedan with Bose 8-speaker audio and dual screen setup.', 'Futuristic design meets 160 PS turbocharged power. Equipped with ventilated front seats, smart trunk, and level 2 ADAS.', 1740000.00, 1820000.00, 4, 4.7, 38, 8, 'CAR-HYUNDAI-VERNA', 'Universal Hyundai', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 1, 2, 'Mahindra Scorpio N Z8 L SUV', 'mahindra-scorpio-n-z8-l-suv', 'cars', 'Mahindra', 'Big daddy of SUVs with 4XPLOR terrain management system and Sony 12-speaker audio.', 'Built on a heavy-duty ladder frame chassis with 2.2L mHawk Diesel engine, frequency dependent damping, and panoramic view camera.', 2450000.00, 2550000.00, 4, 4.9, 82, 5, 'CAR-MAHINDRA-SCORPIO', '4x4 Offroad', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 1, 2, 'Tata Harrier Fearless+ SUV', 'tata-harrier-fearless-plus-suv', 'cars', 'Tata Motors', 'Bold 2.0L Kryotec Diesel SUV built on OMEGA ARC platform with 360 camera.', 'Dominating road presence featuring welcome light animation, knee airbag, touch climate control, and JBL 10-speaker system.', 2600000.00, 2720000.00, 4, 4.8, 64, 6, 'CAR-TATA-HARRIER', 'Universal Tata', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 1, 3, 'Maruti Swift ZXi+ Hatchback', 'maruti-swift-zxi-plus-hatchback', 'cars', 'Maruti Suzuki', 'Iconic sporty hatchback powered by all-new Z-Series 1.2L engine.', 'India’s favorite sporty hatchback with floating 9-inch SmartPlay Pro+ screen, 6 airbags, LED DRLs, and exceptional 25.7 kmpl efficiency.', 890000.00, 930000.00, 4, 4.6, 110, 15, 'CAR-MARUTI-SWIFT', 'Universal Maruti', false, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 1, 4, 'BMW 3 Series Gran Limousine', 'bmw-3-series-gran-limousine', 'cars', 'BMW', 'Luxury executive sedan with extended wheelbase and BMW Curved Display.', 'Unrivalled comfort with 110mm extra legroom, M Sport package, twin-power turbo engine, wireless Apple CarPlay, and ambient lighting.', 6090000.00, 630000.00, 3, 4.9, 29, 3, 'CAR-BMW-320LD', 'BMW Luxury', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 2, 5, 'Engine Oil Filter Heavy Duty', 'engine-oil-filter-heavy-duty', 'auto-parts', 'Bosch', 'Synthetic fiber engine oil filter capturing 99% of contaminants.', 'Multi-pass synthetic filtration technology ensuring continuous smooth oil flow and engine life extension for petrol and diesel engines.', 499.00, 799.00, 37, 4.7, 54, 100, 'PART-BOSCH-OILFLT', 'Universal Cars', false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, 2, 6, 'Brembo Front Ceramic Brake Pads', 'brembo-front-ceramic-brake-pads', 'auto-parts', 'Brembo', 'Low dust high performance ceramic front brake pads set.', 'Designed for superior thermal dissipation, noise insulation shims, and instant stopping power under severe driving conditions.', 3499.00, 4999.00, 30, 4.9, 91, 40, 'PART-BREMBO-PADS', 'Honda, Hyundai, Toyota', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, 2, 7, 'Monroe Heavy Duty Shock Absorber Kit', 'monroe-heavy-duty-shock-absorber-kit', 'auto-parts', 'Monroe', 'Twin-tube nitrogen gas charged front suspension struts pair.', 'Advanced Velocity Proportional Valving (VPV) technology delivers improved vehicle control and smooth dampening over potholes.', 6800.00, 8999.00, 24, 4.8, 37, 25, 'PART-MONROE-SHOCK', 'Sedan, SUV', false, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, 2, 8, 'Bosch High Flow Air Filter', 'bosch-high-flow-air-filter', 'auto-parts', 'Bosch', 'Micro-pleated cellulose engine air filter for optimum airflow.', 'Engineered with high dirt-holding capacity, preventing abrasive dust particles from entering engine cylinders.', 649.00, 999.00, 35, 4.6, 73, 80, 'PART-BOSCH-AIRFLT', 'Universal Cars & SUVs', false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(11, 3, 9, 'Steelbird SBA-7 7Th Element Helmet', 'steelbird-sba7-helmet', 'accessories', 'Steelbird', 'ECE & ISI certified aerodynamic full face riding helmet with inner visor.', 'High-impact ABS shell with quick-release micrometric buckle, dynamic airflow ventilation system, and anti-scratch polycarbonate visor.', 1899.00, 2499.00, 24, 4.8, 142, 50, 'ACC-STEELBIRD-HMT', 'Motorcycles & Scooters', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(12, 3, 10, 'Royal Oak Premium Leather Seat Cover Set', 'royal-oak-premium-leather-seat-cover-set', 'accessories', 'AutoStyle', 'Custom fitted Nappa leather seat cover set with high density foam padding.', 'Bucket fit luxury seat covers crafted with breathable perforated leather, double stitching, and stain resistant spill-proof coating.', 4999.00, 7999.00, 37, 4.9, 88, 30, 'ACC-SEATCOV-NAPPA', 'Sedan & SUV', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(13, 3, 11, '7D All-Weather Waterproof Floor Mats', '7d-all-weather-waterproof-floor-mats', 'accessories', 'AutoStyle', 'Deep dish custom molded 7D car floor mats with detachable grass mat.', 'Complete floor protection featuring anti-skid backing, waterproof leatherette material, and raised edges catching mud and water spills.', 2999.00, 4499.00, 33, 4.7, 65, 45, 'ACC-7DMATS-BLACK', 'Universal Cars', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(14, 3, 12, 'Sony XAV-AX8500 9-Inch Android Stereo', 'sony-xav-ax8500-9-inch-android-stereo', 'accessories', 'Sony', 'Wireless Apple CarPlay & Android Auto media receiver with capacitive screen.', 'HD 9-inch anti-glare touchscreen, 55W x 4 built-in amplifier, DSP sound tuning, dual camera inputs, and lossless FLAC playback.', 28990.00, 34990.00, 17, 4.9, 41, 15, 'ACC-SONY-STEREO', 'Universal Cars', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(15, 3, 13, '3M Complete Car Care Cleaning Kit', '3m-complete-car-care-cleaning-kit', 'accessories', '3M', 'Professional detailing pack with Car Wash Shampoo, Wax Polish & Tyre Dresser.', 'Restores showroom shine! Contains 500ml Car Wash, 200g Liquid Wax, Tyre Restorer, dashboard polish, and 2 premium microfiber towels.', 1199.00, 1799.00, 33, 4.8, 120, 60, 'ACC-3M-CAREKIT', 'Universal Vehicles', false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Product Images
INSERT INTO product_images (image_id, product_id, image_url)
VALUES
(1, 1, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'),
(2, 2, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'),
(3, 3, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b'),
(4, 4, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'),
(5, 5, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'),
(6, 6, 'https://images.unsplash.com/photo-1555215695-3004980ad54e'),
(7, 7, 'https://images.unsplash.com/photo-1486006920555-c77dce18193b'),
(8, 8, 'https://images.unsplash.com/photo-1600706432520-5c0745717551'),
(9, 9, 'https://images.unsplash.com/photo-1486006920555-c77dce18193b'),
(10, 10, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e'),
(11, 11, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc'),
(12, 12, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'),
(13, 13, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'),
(14, 14, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c'),
(15, 15, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9');
