const createBrowserStorage = (type = 'LS') => {
  let localStorageInstace = null,
    sessinStorageInstance = null;
  if (type === 'LS') {
    let storage = window.localStorage;
    if (!localStorageInstace) {
      localStorageInstace = new Store(storage);
    }
    return localStorageInstace;
  }
  if (type === 'SS') {
    let storage = window.sessionStorage;
    if (!sessinStorageInstance) {
      sessinStorageInstance = new Store(storage);
    }
    return sessinStorageInstance;
  }

  return null;
};

function isJSON(obj) {
  const newObj = JSON.stringify(obj);
  if (!/^\{[\s\S]*\}$/.test(newObj)) {
    return false;
  }
  return true;
}

function stringify(val) {
  return val === undefined || typeof val === 'function' ? val + '' : JSON.stringify(val);
}

function deserialize(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function dealIncognito(storage) {
  var _KEY = '_Is_Incognit',
    _VALUE = 'yes';
  try {
    storage.setItem(_KEY, _VALUE);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      var _nothing = function () {};
      storage.__proto__ = {
        setItem: _nothing,
        getItem: _nothing,
        removeItem: _nothing,
        clear: _nothing,
      };
    }
  } finally {
    if (storage.getItem(_KEY) === _VALUE) storage.removeItem(_KEY);
  }
  return storage;
}

function Store(storage) {
  this.storage = dealIncognito(storage);
}
Store.prototype = {
  set: function (key, val) {
    if (key && !isJSON(key)) {
      this.storage.setItem(key, stringify(val));
    } else if (isJSON(key)) {
      for (var a in key) this.set(a, key[a]);
    }
    return this;
  },
  get: function (key) {
    if (!key) {
      var ret = {};
      this.forEach((key, val) => (ret[key] = val));
      return ret;
    }
    if (key.charAt(0) === '?') {
      return this.has(key.substr(1));
    }
    const args = arguments;
    if (args.length > 1) {
      const dt = {};
      for (var i = 0, len = args.length; i < len; i++) {
        const value = deserialize(this.storage.getItem(args[i]));
        if (value) {
          dt[args[i]] = value;
        }
      }
      return dt;
    }
    return deserialize(this.storage.getItem(key));
  },
  clear: function () {
    this.storage.clear();
    return this;
  },
  remove: function (key) {
    var val = this.get(key);
    this.storage.removeItem(key);
    return val;
  },
  has: function (key) {
    return {}.hasOwnProperty.call(this.get(), key);
  },
  keys: function () {
    var d = [];
    this.forEach((k) => {
      d.push(k);
    });
    return d;
  },
  forEach: function (callback) {
    for (var i = 0, len = this.storage.length; i < len; i++) {
      var key = this.storage.key(i);
      callback(key, this.get(key));
    }
    return this;
  },
  search: function (str) {
    var arr = this.keys(),
      dt = {};
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i].indexOf(str) > -1) dt[arr[i]] = this.get(arr[i]);
    }
    return dt;
  },
};

export const LocalInstance = createBrowserStorage('LS');

export const SessionInstance = createBrowserStorage('SS');
