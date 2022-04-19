/* 
 *  Create & init site content
 */

-- ITEMS --

CREATE TABLE IF NOT EXISTS min_max_vals (
  id INTEGER PRIMARY KEY,
  rect_id INTEGER DEFAULT 0,
  min_val DOUBLE DEFAULT 0.0,
  max_val DOUBLE DEFAULT 0.0,
  mean_val DOUBLE DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS rect_pos (
  id INTEGER PRIMARY KEY,
  min_x INTEGER DEFAULT 0,
  max_x INTEGER DEFAULT 0,
  min_y INTEGER DEFAULT 0,
  max_y INTEGER DEFAULT 0
);

