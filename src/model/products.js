const db = require('../database/db.js');

const select_products = db.prepare(/*sql*/ `
  SELECT
    id,
    name,
    quantity_per_unit,
    FORMAT('£%.2f', unit_price) AS unit_price,
    units_in_stock,
    FORMAT('£%.2f', unit_price * units_in_stock) AS stock_value,
    units_on_order
  FROM products
`);

const search_products = db.prepare(/*sql*/ `
  SELECT
    id,
    name
  FROM products
  WHERE name LIKE ?
`);

const get_product = db.prepare(/*sql*/ `
  SELECT
    products.id,
    products.name,
    categories.name AS category_name,
    categories.description AS category_description
  FROM products
  JOIN categories ON products.category_id = categories.id
  WHERE products.id = ?
`);

const insert_product = db.prepare(/*sql*/ `
  INSERT INTO products (name, quantity_per_unit, category_id)
  VALUES(
    $name,
    $quantity_per_unit,
    $category_id
  )
  RETURNING id
`);

function listProducts() {
	return select_products.all();
}

function searchProducts(term) {
	return search_products.all('%' + term + '%');
}

function getProduct(id) {
	return get_product.get(id);
}

function createProduct(product) {
	return insert_product.get(product);
}

module.exports = { listProducts, searchProducts, getProduct, createProduct };
