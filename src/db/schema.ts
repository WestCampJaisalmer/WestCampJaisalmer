/**
 * Idempotent schema. Run with `npm run db:setup` (safe to re-run).
 * Content tables use readable text ids (slugs) so existing links/ids keep working.
 */
export const SCHEMA_SQL = `
create extension if not exists pgcrypto;

create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'editor' check (role in ('admin','editor','viewer')),
  active        boolean not null default true,
  last_login_at timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists login_attempts (
  id         bigserial primary key,
  email      text,
  ip         text,
  success    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_email_idx on login_attempts (email, created_at desc);
create index if not exists login_attempts_ip_idx on login_attempts (ip, created_at desc);

create table if not exists activity_log (
  id         bigserial primary key,
  user_id    uuid,
  user_name  text,
  action     text not null,
  entity     text,
  entity_id  text,
  summary    text,
  created_at timestamptz not null default now()
);
create index if not exists activity_log_created_idx on activity_log (created_at desc);

create table if not exists settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists hotels (
  id          text primary key,
  name        text not null,
  rating      numeric(2,1) not null default 4.5,
  reviews     integer not null default 0,
  location    text not null default '',
  price       integer not null default 0,
  image       text not null default '',
  tag         text,
  amenities   jsonb not null default '[]',
  description text not null default '',
  active      boolean not null default true,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists camps (like hotels including all);

create table if not exists tours (
  id          text primary key,
  title       text not null,
  price       integer not null default 0,
  unit        text not null default 'person',
  image       text not null default '',
  duration    text not null default '',
  rating      numeric(2,1) not null default 4.5,
  reviews     integer not null default 0,
  location    text not null default '',
  tag         text,
  description text not null default '',
  active      boolean not null default true,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists destinations (
  id          text primary key,
  name        text not null,
  subtitle    text not null default '',
  image       text not null default '',
  distance    text not null default '',
  description text not null default '',
  active      boolean not null default true,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists testimonials (
  id          text primary key,
  name        text not null,
  city        text not null default '',
  avatar      text not null default '',
  rating      integer not null default 5,
  review      text not null default '',
  active      boolean not null default true,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Guest-submitted reviews wait here until an admin approves them.
alter table testimonials add column if not exists status text not null default 'approved';
alter table testimonials add column if not exists guest_email text;
alter table testimonials add column if not exists ip text;
create index if not exists testimonials_status_idx on testimonials (status);

create table if not exists packages (
  id             text primary key,
  name           text not null,
  duration       text not null default '',
  rating         numeric(2,1) not null default 4.5,
  reviews        integer not null default 0,
  price          integer not null default 0,
  original_price integer,
  category       text not null default 'desert',
  image          text not null default '',
  tag            text,
  location       text not null default '',
  description    text not null default '',
  inclusions     jsonb not null default '[]',
  itinerary      jsonb not null default '[]',
  active         boolean not null default true,
  featured       boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists gallery_categories (
  id         text primary key,
  label      text not null,
  sort_order integer not null default 0,
  active     boolean not null default true,
  featured   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery_images (
  id         text primary key,
  src        text not null,
  title      text not null,
  category   text not null default 'camps',
  location   text not null default '',
  aspect     text not null default 'landscape',
  active     boolean not null default true,
  featured   boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media (
  id         uuid primary key default gen_random_uuid(),
  file_id    text not null,
  url        text not null,
  name       text not null,
  size       integer,
  mime       text,
  width      integer,
  height     integer,
  folder     text,
  uploaded_by text,
  created_at timestamptz not null default now()
);
create index if not exists media_created_idx on media (created_at desc);

create sequence if not exists enquiry_ref_seq start 1001;

create table if not exists enquiries (
  id         uuid primary key default gen_random_uuid(),
  ref        text not null unique default ('WCJ-' || nextval('enquiry_ref_seq')),
  type       text not null default 'contact'
             check (type in ('booking','plan_trip','contact','gallery','other')),
  name       text not null,
  email      text,
  phone      text,
  subject    text,
  message    text,
  details    jsonb not null default '{}',
  item_type  text,
  item_id    text,
  item_name  text,
  status     text not null default 'new'
             check (status in ('new','contacted','quoted','confirmed','completed','cancelled','spam')),
  assigned_to uuid references admin_users(id) on delete set null,
  source_page text,
  ip         text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on enquiries (created_at desc);
create index if not exists enquiries_status_idx on enquiries (status);
create index if not exists enquiries_ip_idx on enquiries (ip, created_at desc);

create table if not exists enquiry_notes (
  id         bigserial primary key,
  enquiry_id uuid not null references enquiries(id) on delete cascade,
  user_name  text,
  body       text not null,
  kind       text not null default 'note',
  created_at timestamptz not null default now()
);
create index if not exists enquiry_notes_enquiry_idx on enquiry_notes (enquiry_id, created_at);
`;
