require("dotenv").config();
const { createPool } = require("./mysql-connection.js");

const DATABASE_NAME = process.env.MYSQL_DATABASE;

const initDB = async () => {
  const pool = createPool();
  await pool.query(`DROP DATABASE IF EXISTS  ${DATABASE_NAME}`);
  await pool.query(`CREATE DATABASE ${DATABASE_NAME} `);
  await pool.query(`USE ${DATABASE_NAME} `);

  await pool.query(`
    CREATE TABLE users(
        id CHAR(36) PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(320) NOT NULL UNIQUE,
        emailValidated BOOL DEFAULT false,
        password VARCHAR(128) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        city VARCHAR(200),
        profile_img VARCHAR(255),
        bio_summary VARCHAR(255),
        is_deleted BOOL DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

  await pool.query(`
    CREATE TABLE validation_codes(
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        code CHAR(8) NOT NULL,
        expiration_date TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

  await pool.query(`
    CREATE TABLE category(
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(150) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

  await pool.query(`
    CREATE TABLE items(
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        estimated_price DECIMAL,
        item_condition ENUM('not_used', 'good', 'ok','damaged','malfunctioning') NOT NULL,
        status ENUM('available', 'sold', 'reserved') NOT NULL,
        category_id INT NOT NULL,
        is_deleted BOOL DEFAULT false,
        FOREIGN KEY (category_id) REFERENCES category(id),
        user_id CHAR(36) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

  await pool.query(`
    CREATE TABLE item_images(
        id CHAR(36) PRIMARY KEY,
        imageURL VARCHAR(300) NOT NULL,
        item_id CHAR(36) NOT NULL,
        FOREIGN KEY (item_id) REFERENCES items(id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

  await pool.query(`
    CREATE TABLE deals(
        id CHAR(36) PRIMARY KEY,
        buyer_id CHAR(36) NOT NULL,
        FOREIGN KEY (buyer_id) REFERENCES users(id),
        seller_id CHAR(36) NOT NULL,
        FOREIGN KEY (seller_id) REFERENCES users(id),
        status ENUM('pending', 'accepted', 'rejected') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

  await pool.query(`
    CREATE TABLE deal_items(
        id CHAR(36) PRIMARY KEY,
        deal_id CHAR(36) NOT NULL,
        FOREIGN KEY (deal_id) REFERENCES deals(id),
        item_id CHAR(36) NOT NULL,
        FOREIGN KEY (item_id) REFERENCES items(id),
        owner_id CHAR(36) NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id),
        type ENUM('offered', 'requested') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

  await pool.query(`
    CREATE TABLE deals_exchange_conditions(
        id CHAR(36) PRIMARY KEY,
        deal_id CHAR(36) NOT NULL,
        FOREIGN KEY (deal_id) REFERENCES deals(id),
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        exchange_date_time TIMESTAMP NOT NULL,
        exchange_comment VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

  await pool.query(`
    CREATE TABLE rejection_reasons(
        id CHAR(36) PRIMARY KEY,
        deal_id CHAR(36) NOT NULL,
        FOREIGN KEY (deal_id) REFERENCES deals(id),
        user_id CHAR(36) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        rejection_comment VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

  await pool.query(`
    CREATE TABLE deals_ratings(
        id CHAR(36) PRIMARY KEY,
        deal_id CHAR(36) NOT NULL,
        FOREIGN KEY (deal_id) REFERENCES deals(id),
        userid CHAR(36) NOT NULL,
        FOREIGN KEY (userid) REFERENCES users(id),
        rating DECIMAL CHECK (rating >= 1 AND rating <= 5) NOT NULL, 
        rating_comment VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

  await pool.query(`
        CREATE TABLE wishlist(
            id CHAR(36) PRIMARY KEY,
            userid CHAR(36) NOT NULL,
            FOREIGN KEY (userid) REFERENCES users(id),
            item_id CHAR(36) NOT NULL,
            FOREIGN KEY (item_id) REFERENCES items(id),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);

  // Insert mock data into the users table
  await pool.query(`
    INSERT INTO users(id, username, email, emailValidated, password, first_name, last_name, city, profile_img, bio_summary, is_deleted) 
        VALUES 
        ('d84f709f-4dd1-4785-8a1c-14f62735df0b', 'plato', 'plato@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Plato', 'Aristocles', 'Albacete', '/img/user1.jpg', 'Hello, I am Plato!', false),
        ('f2e1afd4-c264-4126-80bf-f6731e826121', 'socrates', 'socrates@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Socrates', 'Descartes', 'Cantabria', '/img/user2.jpg', 'Hello, I am Socrates!', false),
        ('3633a9e4-1e59-4af5-9cf7-9abfa03cea1b', 'kant', 'kant@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Immanuel', 'Kant', 'Teruel', '/img/user3.jpg', 'Hello, I am Immanuel!', false),
        ('0e0d2925-e34f-491d-bced-2afbdc24fd53', 'nietzsche', 'nietzsche@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Friedrich', 'Nietzsche', 'Teruel', '/img/user4.jpg', 'Hello, I am Friedrich!', false),
        ('dcbc0d07-1889-46d5-a44f-89e6df34dc0b', 'locke', 'locke@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'John', 'Locke', 'Soria', '/img/user5.jpg', 'Hello, I am John!', false),
        ('06d27949-94fe-4cc1-b7fe-764d68baa0b5', 'descartes', 'descartes@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Rene', 'Descartes', 'Soria', '/img/user20.jpg', 'Hello, I am Rene!', false),
        ('fc7c8f59-22e7-4a18-9c96-aa1668d4d3b1', 'aristotle', 'aristotle@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Aristotle', 'Stagiritis', 'Jaén', '/img/user6.jpg', 'Hello, I am Aristotle!', false),
        ('77f678a2-4985-42e0-9d34-9c05b0512f87', 'kierkegaard', 'kierkegaard@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Søren', 'Kierkegaard', 'Jaén', '/img/user7.jpg', 'Hello, I am Kierkegaard!', false),
        ('af9d24e4-7edf-4db2-9e74-4e6ef48e9c62', 'plutarch', 'plutarch@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Plutarch', 'Epictetus', 'Granada', '/img/user8.jpg', 'Hello, I am Plutarch!', false),
        ('b22f20ef-128f-4a07-8329-f5c7fba4b9b1', 'thomas', 'thomas@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Thomas', 'Aquinas', 'Granada', '/img/user9.jpg', 'Hello, I am Thomas!', false),
        ('43f2ff55-f4de-4f47-bc87-49c8691e5770', 'hume', 'hume@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'David', 'Hume', 'Pontevedra', '/img/user10.jpg', 'Hello, I am Hume!', false),
        ('ea59600b-23c9-41fc-9ab2-d886e348f5f1', 'rousseau', 'rousseau@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Jean-Jacques', 'Rousseau', 'Albacete', '/img/user11.jpg', 'Hello, I am Rousseau!', false),
        ('c1834d47-ae85-477a-8ebf-8d8a2d8c61cc', 'spinoza', 'spinoza@example.com', true, '$2y$12$etXEQTvRSgKrHu7qUNAlHuF6bRLl5g9sTPXO03Ul16dAm.bZWZoXC', 'Baruch', 'Spinoza', 'Cantabria', '/img/user12.jpg', 'Hello, I am Spinoza!', false);
    `);

  // Insert mock data into the category table
  await pool.query(`
    INSERT INTO category(id, category_name) 
        VALUES 
        (1, 'Retro Computers'),
        (2, 'Vintage Consoles'),
        (3, 'Retro Televisions'),
        (4, 'Vintage Audio Equipment'),
        (5, 'Retro Cameras'),
        (6, 'Vintage Mobile Phones'),
        (7, 'Retro Gaming Accessories'),
        (8, 'Vintage Radios'),
        (9, 'Retro Calculators'),
        (10, 'Vintage Watches & Clocks'),
        (11, 'Retro Office Equipment')
        `);

  // Insert mock data into the items table
  await pool.query(`
    INSERT INTO items(id, name, description, estimated_price, item_condition, status, category_id, user_id) 
        VALUES 
        ('3659f8d9-9c4e-4c6d-9606-30824a2d3b2b', 'Commodore 64', 'A classic home computer from the 1980s.', 200.00, 'good', 'available', 1, '06d27949-94fe-4cc1-b7fe-764d68baa0b5'),
        ('93b79a87-767f-473d-bcfd-2ebf1dace69f', 'Atari 2600', 'One of the first video game consoles.', 150.00, 'good', 'available', 2, '06d27949-94fe-4cc1-b7fe-764d68baa0b5'),
        ('fc8c0baa-4914-4663-821f-ae0fdd8e1504', 'Sony Trinitron TV', 'A vintage color television.', 75.00, 'ok', 'available', 3, '06d27949-94fe-4cc1-b7fe-764d68baa0b5'),
        ('a04b0865-ebf0-4a3f-a8a6-bddce2d2c2f1', 'IBM Model M Keyboard', 'A vintage mechanical keyboard with a tactile feel.', 100.00, 'not_used', 'available', 1, '0e0d2925-e34f-491d-bced-2afbdc24fd53'),
        ('e66d2f9f-5836-4d74-af17-1b8f8e6b7854', 'Nintendo Entertainment System (NES)', 'The iconic 8-bit gaming console from the 1980s.', 120.00, 'good', 'available', 2, '0e0d2925-e34f-491d-bced-2afbdc24fd53'),
        ('ff978e89-48ef-4b85-9d92-bd2e9b8992a4', 'Zenith Color TV', 'A classic color television set with retro design.', 80.00, 'good', 'available', 3, '0e0d2925-e34f-491d-bced-2afbdc24fd53'),
        ('b8c38b8c-16e7-4a94-993a-1e3e1d5e61c9', 'Technics Turntable', 'A vintage turntable for playing vinyl records.', 250.00, 'damaged', 'available', 4, '0e0d2925-e34f-491d-bced-2afbdc24fd53'),
        ('3dd3fbf9-012c-4b1d-8227-69ef97ccfa5f', 'Polaroid Land Camera', 'An instant film camera from the 1970s.', 70.00, 'damaged', 'available', 5, '0e0d2925-e34f-491d-bced-2afbdc24fd53'),
        ('60a9f6c1-95da-4d0c-9f96-1459a7a70375', 'Apple Macintosh SE', 'A classic desktop computer from Apple.', 250.00, 'good', 'available', 1, 'c1834d47-ae85-477a-8ebf-8d8a2d8c61cc'),
        ('8e70ce5f-9c1e-49cc-bce7-3e4a80e6925c', 'Sega Genesis', '16-bit gaming console with a diverse game library.', 150.00, 'ok', 'available', 2, 'c1834d47-ae85-477a-8ebf-8d8a2d8c61cc'),
        ('51c6b6af-4296-4b9c-a57c-36e64d2d7d48', 'Sony Walkman', 'A portable cassette player for enjoying music on the go.', 80.00, 'ok', 'available', 6, 'c1834d47-ae85-477a-8ebf-8d8a2d8c61cc'),
        ('0d8c0c9e-84e9-4f8a-94b2-045c97d8c8f6', 'NES Advantage Controller', 'A retro gaming controller for the NES console.', 40.00, 'ok', 'available', 7, 'c1834d47-ae85-477a-8ebf-8d8a2d8c61cc'),
        ('ca0e9ebd-1d6c-4143-8fde-4bbaae342350', 'Vintage Grundig Radio', 'A classic radio with AM/FM tuner and vintage charm.', 120.00, 'good', 'available', 8, 'c1834d47-ae85-477a-8ebf-8d8a2d8c61cc'),
        ('0c20982e-3a64-4a07-ba84-7d8895d6b858', 'IBM Model M Keyboard', 'Classic mechanical keyboard with a satisfying tactile feel.', 100.00, 'good', 'available', 1, 'af9d24e4-7edf-4db2-9e74-4e6ef48e9c62'),
        ('e0b26e33-4779-441f-9fcd-9e6d0d22e9df', 'Atari Lynx', 'Handheld gaming console with color LCD screen.', 80.00, 'not_used', 'available', 2, 'af9d24e4-7edf-4db2-9e74-4e6ef48e9c62'),
        ('7fb0ef1b-198d-4a92-86f0-3d5a7dbb0136', 'Polaroid SX-70 Camera', 'Vintage instant camera for capturing nostalgic photos.', 150.00, 'not_used', 'available', 5, 'af9d24e4-7edf-4db2-9e74-4e6ef48e9c62'),
        ('9835e858-f007-41d9-aa43-41c545b10172', 'Motorola DynaTAC 8000X', 'First commercially available mobile phone.', 250.00, 'good', 'available', 6, 'af9d24e4-7edf-4db2-9e74-4e6ef48e9c62'),
        ('f8ce7c4e-ae3f-4619-90d1-933baeb518d1', 'NES Zapper Light Gun', 'Accessory for the NES console for shooting games.', 50.00, 'malfunctioning', 'available', 7, 'af9d24e4-7edf-4db2-9e74-4e6ef48e9c62'),
        ('b4c82efc-714b-41a4-9573-2b462a007c0f', 'Sinclair ZX Spectrum', 'Iconic home computer popular in the 1980s.', 120.00, 'good', 'available', 1, 'ea59600b-23c9-41fc-9ab2-d886e348f5f1'),
        ('a1f21f07-9429-41a5-9be6-cf774474f3a6', 'Game Boy Color', 'Handheld gaming console with a color display.', 60.00, 'not_used', 'available', 2, 'ea59600b-23c9-41fc-9ab2-d886e348f5f1'),
        ('7e6603fe-2f4e-4a2d-aae0-7e2b26e0144a', 'Sony Walkman Cassette Player', 'Portable audio player for cassette tapes.', 90.00, 'good', 'available', 4, 'ea59600b-23c9-41fc-9ab2-d886e348f5f1'),
        ('c3a58f13-7db4-4d75-8923-4db651dd9d63', 'Polaroid OneStep 2', 'Modern instant camera with a vintage design.', 140.00, 'not_used', 'available', 5, 'ea59600b-23c9-41fc-9ab2-d886e348f5f1'),
        ('df2bcf3d-979e-4e97-8a3f-9b0fe8b2a408', 'Sega Dreamcast VMU', 'Memory card with a built-in LCD screen for the Dreamcast console.', 30.00, 'damaged', 'available', 7, 'ea59600b-23c9-41fc-9ab2-d886e348f5f1'),
        ('9bf8a76a-8525-4a07-988c-ae0c8e29a808', 'Nintendo Entertainment System (NES)', 'Popular gaming console from the 1980s.', 150.00, 'good', 'available', 2, 'f2e1afd4-c264-4126-80bf-f6731e826121'),
        ('e76a6c34-6f3e-4bb2-b3a4-41e71cc1b7fe', 'Sony Discman', 'Portable CD player for enjoying music on the go.', 80.00, 'not_used', 'available', 4, 'f2e1afd4-c264-4126-80bf-f6731e826121'),
        ('b2351bdc-3ea5-4e6d-87e6-5e22f90613f2', 'Pentax K1000', 'Classic 35mm film SLR camera.', 100.00, 'good', 'available', 5, 'f2e1afd4-c264-4126-80bf-f6731e826121'),
        ('bb7e90ff-89df-44f3-9476-5f356c7c5e19', 'Sega Mega Drive (Genesis)', '16-bit video game console known for its popular game library.', 120.00, 'ok', 'available', 2, 'f2e1afd4-c264-4126-80bf-f6731e826121'),
        ('781a1553-9ff3-42e4-9186-51cc1e9a773b', 'Vintage Game Boy', 'Handheld gaming console that started the portable gaming trend.', 70.00, 'not_used', 'available', 2, 'f2e1afd4-c264-4126-80bf-f6731e826121');
    `);

  // Insert mock data into the deal table
  await pool.query(`
    INSERT INTO deals(id, buyer_id, seller_id, status) 
        VALUES 
        ('dfefd715-ceba-4250-8eb3-10cf7d36eb44', 'f2e1afd4-c264-4126-80bf-f6731e826121', 'd84f709f-4dd1-4785-8a1c-14f62735df0b', 'pending');

    `);

  // Insert mock data into the deal_items table
  await pool.query(`
    INSERT INTO deal_items(id, deal_id, item_id, owner_id, type) 
        VALUES 
        ('81d42dea-e793-4d14-82ee-42f0e394492d', 'dfefd715-ceba-4250-8eb3-10cf7d36eb44', '93b79a87-767f-473d-bcfd-2ebf1dace69f', 'f2e1afd4-c264-4126-80bf-f6731e826121', 'offered'),
        ('506e1fe7-de08-4445-b5e7-0ec1c78351f6', 'dfefd715-ceba-4250-8eb3-10cf7d36eb44', 'fc8c0baa-4914-4663-821f-ae0fdd8e1504', 'd84f709f-4dd1-4785-8a1c-14f62735df0b', 'requested')
    `);

  // Insert mock data into the exchange_conditions table
  await pool.query(`
    INSERT INTO deals_exchange_conditions(id, deal_id, street, city, state, country, postal_code, exchange_date_time) 
        VALUES 
        ('62b22346-4b07-425d-b612-866de42d063a', 'dfefd715-ceba-4250-8eb3-10cf7d36eb44', '123 Main St', 'Anytown', 'Anystate', 'USA', '12345', '2023-06-25 12:00:00');
    `);

  await pool.end();
};

initDB();
