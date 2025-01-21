
const { DataTypes } = require('sequelize');
const dotenv = require('dotenv').config();
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

class ColumnBuilder {
  constructor(columnName, dialect) {
    this.columnName = columnName;
    this.columnDefinition = {};
    this.dialect = dialect;
  }

  // Data Type Methods
  integer(length = 11) {
    if (this.dialect === 'mysql') {
      this.columnDefinition.type = DataTypes.INTEGER(length);
    } else {
      this.columnDefinition.type = DataTypes.INTEGER; // PostgreSQL doesn't support length for INTEGER
    }
    return this;
  }

  int(length = 11) {
    return this.integer(length);
  }
  
  // Timestamp Methods (using dayjs)
  createdAt(asString = true, timezone = 'Asia/Makassar') {
    const defaultTimestamp = dayjs().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    if (asString) {
      this.columnDefinition.type = DataTypes.STRING;
      this.columnDefinition.defaultValue = defaultTimestamp;
    } else {
      this.columnDefinition.type = DataTypes.DATE;
      this.columnDefinition.defaultValue = new Date(defaultTimestamp); // Use JavaScript Date object for Sequelize
    }
    return this;
  }

  updatedAt(asString = true, timezone = 'Asia/Makassar') {
    const defaultTimestamp = dayjs().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    if (asString) {
      this.columnDefinition.type = DataTypes.STRING;
      this.columnDefinition.defaultValue = defaultTimestamp;
    } else {
      this.columnDefinition.type = DataTypes.DATE;
      this.columnDefinition.defaultValue = new Date(defaultTimestamp); // Use JavaScript Date object for Sequelize
    }
    return this;
  }

  string(length = 253) {
    if (this.dialect === 'mysql') {
      this.columnDefinition.type = DataTypes.STRING(length);
    } else {
      this.columnDefinition.type = DataTypes.STRING; // PostgreSQL doesn't support length for STRING
    }
    return this;
  }

  str(length = 253) {
    return this.string(length);
  }

  text() {
    this.columnDefinition.type = DataTypes.TEXT;
    return this;
  }

  tinyBlob() {
    if (this.dialect === 'mysql') {
      this.columnDefinition.type = DataTypes.BLOB('tiny');
    } else {
      this.columnDefinition.type = DataTypes.BLOB
    }
    return this;
  }

  mediumBlob() {
    if (this.dialect === 'mysql') {
      this.columnDefinition.type = DataTypes.BLOB('medium');
    } else {
      this.columnDefinition.type = DataTypes.BLOB
    }
    return this;
  }

  longBlob() {
    if (this.dialect === 'mysql') {
      this.columnDefinition.type = DataTypes.BLOB('long');
    } else {
      this.columnDefinition.type = DataTypes.BLOB
    }
    return this;
  }

  boolean() {
    this.columnDefinition.type = DataTypes.BOOLEAN;
    return this;
  }

  bool() {
    return this.boolean();
  }

  timestamps() {
    this.columnDefinition.type = DataTypes.DATE;
    return this;
  }

  time() {
    this.columnDefinition.type = DataTypes.TIME;
    return this;
  }

  dateonly() {
    this.columnDefinition.type = DataTypes.DATEONLY;
    return this;
  }

  float() {
    this.columnDefinition.type = DataTypes.FLOAT;
    return this;
  }

  decimal(precision = 10, scale = 2) {
    this.columnDefinition.type = DataTypes.DECIMAL(precision, scale);
    return this;
  }

  json() {
    if (this.dialect === 'mysql') {
      this.columnDefinition.type = DataTypes.JSON;
    } else if (this.dialect === 'postgres') {
      this.columnDefinition.type = DataTypes.JSONB; // JSONB is preferred in PostgreSQL
    } else {
      throw new Error('JSON is not supported in this dialect.');
    }
    return this;
  }

  enum(values) {
    if (!Array.isArray(values)) {
      throw new Error('Enum values must be an array');
    }
    this.columnDefinition.type = DataTypes.ENUM(values);
    return this;
  }

  uuid() {
    this.columnDefinition.type = DataTypes.UUID;
    return this;
  }

  // Column Attributes
  primaryKey() {
    this.columnDefinition.primaryKey = true;
    return this;
  }

  pk() {
    return this.primaryKey();
  }

  autoIncrement() {
    this.columnDefinition.autoIncrement = true;
    return this;
  }

  increment() {
    return this.autoIncrement();
  }

  allowNull(allow = true) {
    this.columnDefinition.allowNull = allow;
    return this;
  }

  null() {
    return this.allowNull(true);
  }

  notNull() {
    return this.allowNull(false);
  }

  unique(name) {
    this.columnDefinition.unique = name;
    return this;
  }

  references(tableName, key = 'id') {
    this.columnDefinition.references = {
      model: tableName,
      key,
    };
    return this;
  }

  ref(tableName, key = 'id') {
    return this.references(tableName, key);
  }

  defaultValue(value) {
    this.columnDefinition.defaultValue = value;
    return this;
  }

  default(value) {
    return this.defaultValue(value);
  }

  comment(commentText) {
    this.columnDefinition.comment = commentText;
    return this;
  }

  onUpdate(action) {
    if (!this.columnDefinition.references) {
      throw new Error('Cannot set onUpdate without references.');
    }
    this.columnDefinition.onUpdate = action;
    return this;
  }

  onDelete(action) {
    if (!this.columnDefinition.references) {
      throw new Error('Cannot set onDelete without references.');
    }
    this.columnDefinition.onDelete = action;
    return this;
  }

  index() {
    this.columnDefinition.index = true;
    return this;
  }

  unsigned() {
    if (!this.columnDefinition.type) {
      throw new Error('Data type must be defined before marking as unsigned');
    }
    if (this.dialect === 'mysql') {
      this.columnDefinition.type = this.columnDefinition.type.UNSIGNED;
    } else {
      throw new Error('Unsigned is not supported in PostgreSQL.');
    }
    return this;
  }

  build() {
    return { [this.columnName]: this.columnDefinition };
  }
}

function db_column(columnName) {
  const dialect = process.env.DB_DIALECT || 'mysql'; // Default to MySQL if not specified
  const column = new ColumnBuilder(columnName, dialect);
  return new Proxy(column, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return (...args) => target[prop](...args); // Allow method chaining
      }
      return target[prop];
    },
  });
}

module.exports = db_column;
