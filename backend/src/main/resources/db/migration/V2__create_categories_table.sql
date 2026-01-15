CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);
