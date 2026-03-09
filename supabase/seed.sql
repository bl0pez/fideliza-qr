-- SEED DATA - Fidelilocal

-- 1. Plans
INSERT INTO public.plans (id, name, max_branches, max_scans_monthly, max_card_types, custom_qr, price, features, is_popular, sort_order)
VALUES 
('basic', 'Básico', 1, 50, 1, false, null, ARRAY['1 Sucursal', '50 escaneos/mes', '1 Tipo de tarjeta', 'QR Estándar', 'Soporte por comunidad'], false, 1),
('pro', 'Pro', 3, -1, 10, true, 5000, ARRAY['Hasta 3 Sucursales', 'Escaneos ilimitados', 'Tarjetas personalizables', 'QR con tu Logo', 'Historial de clientes', 'Soporte prioritario'], true, 2)
ON CONFLICT (id) DO NOTHING;

-- 2. Categories
INSERT INTO public.categories (id, name, icon_name)
VALUES 
('c1', 'Cafeterías', 'Tag'),
('c4', 'Panaderías', 'Tag'),
('c2', 'Barberías', 'Scissors'),
('c3', 'Restaurantes', 'Utensils')
ON CONFLICT (id) DO NOTHING;

-- 3. Countries
INSERT INTO public.countries (id, name, code)
VALUES 
('0004e71e-6807-419e-87e5-ce4085f65ced', 'Chile', 'CL'),
('9985c6b9-f03d-4463-ad6a-e3b593be289e', 'Argentina', 'AR'),
('48daa9bf-5973-43ef-b504-d6e1f97376da', 'Bolivia', 'BO'),
('51d547aa-0a13-4404-80be-abc8d5b8152b', 'Uruguay', 'UY'),
('2580cde6-d248-4b1f-9251-22d8ad3a80fc', 'Perú', 'PE'),
('4f36f183-55bb-43e2-82f4-655d76921be3', 'Colombia', 'CO'),
('e0f86f53-4007-4718-8bf9-3cf36208f44c', 'México', 'MX')
ON CONFLICT (id) DO NOTHING;

-- 4. Cities
INSERT INTO public.cities (id, name, country_id)
VALUES 
('c1190d51-5ae0-47de-bbd8-d17445afc8c8', 'Santiago', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('513cfe57-7ce8-43e3-92f5-34fbf16cfe30', 'Valparaíso', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('74de0c25-e42c-4262-b776-109dd9f9dfa9', 'Concepción', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('389acefb-743a-4715-a088-69f2c0254b96', 'La Serena', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('ceaaeae0-a9f4-4a54-85fa-68f2c4ca3082', 'Antofagasta', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('eb137738-7c3a-4d4f-928d-2c30d9088fce', 'Temuco', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('72e6d52c-aba1-42db-ba21-46b409f9d490', 'Rancagua', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('6228ab33-df1d-4a40-bc87-8a500d999dca', 'Talca', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('f0c1052f-6dbe-4978-8f8d-6cb5d2c4f87c', 'Puerto Montt', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('6fa60e54-382f-46d4-bbe7-4b800e899906', 'Iquique', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('4bfa946b-0973-4df2-8cac-6e06f3ccc0dc', 'Arica', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('d74044d8-417b-431f-9fac-707615585289', 'Copiapó', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('43c50aee-1621-468c-96aa-9fd083d313ef', 'Curicó', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('449b264d-db55-43a6-b5a2-fc2a6c4cd509', 'Osorno', '0004e71e-6807-419e-87e5-ce4085f65ced'),
('be6107ce-8267-4cfc-9714-e66b840787ab', 'Punta Arenas', '0004e71e-6807-419e-87e5-ce4085f65ced')
ON CONFLICT (id) DO NOTHING;

-- 5. Businesses (Simplified/Demo data or existing ones)
INSERT INTO public.businesses (id, name, type, image_url, rewards_available, category_id, plan_id, scans_this_month, city, address, city_id, country_id, status, slug)
VALUES 
('b1', 'Central Coffee', 'Cafetería', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7PNP8fhtvfez41Q7b24iUa1Hxi0futyGFDfuCynE0_6j4XBtHQ1Dk_WOprK-3uy2DCcpiFv-70FmR7Gocdw4JiKVvXG-REIlWGlJ_MbaD3_lvxBqgx33UviftQZqXqK6XCRfrTtuTI--C2Da2nYexPaADP98jxb-A72sPNJz6iayK7ZnTBDk6Umh2eOPdCTRDK5VCqMJOwBWAKJS4QDsU8szL7sF2-Zt4zc0xiSpcjsr9KfMf-NSSW19sGtvqvWWW0WKMQVlFPw', 5, 'c1', 'basic', 0, 'Santiago', null, 'c1190d51-5ae0-47de-bbd8-d17445afc8c8', '0004e71e-6807-419e-87e5-ce4085f65ced', 'active', 'central-coffee'),
('b2', 'Urban Style Cuts', 'Barbería', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy4gzHEHxfqNxeImq9xGznAnOBtTfw1srCmJNhytpb_XkCaZ93TUyTE_mWKNYRFLIuDUpR4BnbmCWRw-jWkOky_kPnimLrai1BE60jEbM3xhb_fJaMMuCWbpavuuiwH-pUG1IA60KVRJEww0eWPx_i1mz1jXmQ5k5e2RGg7IYEj1Vnx1r80Evlxab6lQ5HzCp0BugQv0v1FtLhJZpdWRLVdLqkl7tv_TiJU83lqeL0nDcIPRS4_dev1OKjHFSTp50v7rbXY6gn4w', 3, 'c2', 'basic', 0, 'Santiago', null, 'c1190d51-5ae0-47de-bbd8-d17445afc8c8', '0004e71e-6807-419e-87e5-ce4085f65ced', 'active', 'urban-style-cuts'),
('b3', 'La Abuela Panadería', 'Panadería', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQqA8Qk3N_2C4w44V-A0gO3q5Uf3s5oUQq1gB_xYJ3GQQJ2o0qR1H9I_5qYwz6UeXQc_120r2sQcM13q1nQ-Z8q1q3oZQYJm_P0XlE1rVb3L_715M3oKqV91b4P0O6sVz2wY6L7Q75mOq1J1K9mP_0A8Z--qPZ1w8aJ1Y1_6c_6A_7', 2, 'c4', 'basic', 0, 'Santiago', null, 'c1190d51-5ae0-47de-bbd8-d17445afc8c8', '0004e71e-6807-419e-87e5-ce4085f65ced', 'active', 'la-abuela-panaderia')
ON CONFLICT (id) DO NOTHING;

-- NOTE: Profiles and personal data are not seeded here because they depend on auth.users IDs.
-- If you want to migrate existing users, you must use a tool for auth migration or manually recreate users
-- and then link them in the profiles table.
