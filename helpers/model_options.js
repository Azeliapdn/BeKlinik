const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

class ModelOptionsBuilder {
  constructor() {
    this.options = {};
  }

  timestamps(enable = true) {
    this.options.timestamps = enable;
    return this;
  }

  tableName(name) {
    this.options.tableName = name;
    this.options.modelName = name;
    return this;
  }

  paranoid(enable = true) {
    this.options.paranoid = enable;
    return this;
  }

  underscored(enable = true) {
    this.options.underscored = enable;
    return this;
  }

  indexes(indexArray) {
    if (!Array.isArray(indexArray)) {
      throw new Error('Indexes must be an array');
    }
    this.options.indexes = indexArray;
    return this;
  }

  freezeTableName(enable = true) {
    this.options.freezeTableName = enable;
    return this;
  }

  engine(engineName) {
    this.options.engine = engineName;
    return this;
  }

  charset(charsetName) {
    this.options.charset = charsetName;
    return this;
  }

  collate(collation) {
    this.options.collate = collation;
    return this;
  }

  hooks(hooksObject = {}) {
    const defaultHooks = {
      beforeCreate: (record) => {
        record.createdAt = dayjs().tz('Asia/Makassar').toDate();
        record.updatedAt = dayjs().tz('Asia/Makassar').toDate();
      },
      beforeUpdate: (record) => {
        record.updatedAt = dayjs().tz('Asia/Makassar').toDate();
      },
    };

    this.options.hooks = { ...defaultHooks, ...hooksObject };
    return this;
  }

  defaultScope(scopeObject) {
    this.options.defaultScope = scopeObject;
    return this;
  }

  scopes(scopesObject) {
    this.options.scopes = scopesObject;
    return this;
  }

  comment(commentText) {
    this.options.comment = commentText;
    return this;
  }

  version(enable = true) {
    this.options.version = enable;
    return this;
  }

  build() {
    return this.options;
  }
}

function db_model_options() {
  const builder = new ModelOptionsBuilder();
  return new Proxy(builder, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return (...args) => {
          target[prop](...args);
          return target; // Return the builder instance for chaining
        };
      }
      return target[prop];
    },
  });
}

module.exports = db_model_options;
