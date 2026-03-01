create table users(
	user_id serial primary key,
	user_email varchar(100) unique not null,
	user_password varchar(100) not null,
	user_type varchar(10) not null check (user_type in ('admin', 'user'))
)

create table products(
	product_id serial primary key,
	product_name varchar(60) not null,
	product_category varchar(40) not null,
	product_cost decimal(10,2) not null CHECK (product_cost >= 0),
	product_stock int not null CHECK (product_stock >= 0),
	product_image_url varchar(500) not null,
	product_added_by int not null,
	product_addition_timestamp timestamptz not null default current_timestamp,
	foreign key (product_added_by) references users(user_id) on delete restrict
)

create table product_logs(
	log_id serial primary key,
	log_type varchar(10) not null check(log_type in ('insert', 'update', 'delete')),
	log_by int not null,
	log_timestamp timestamptz not null default current_timestamp,
	log_on int default null,
	foreign key (log_by) references users(user_id) on delete restrict,
	foreign key (log_on) references products(product_id) on delete set null
)