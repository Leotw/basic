/**
 * 请求入参
 * @param option [ { url, params, type } ]
 */
function Ajaxes(option, success, fail) {
  this.count = 0;
  this.option = option;
  this.datas = [];
  this.success = success;
  this.fail = fail;
  this.cancel = false;
}

/**
 * 装载所有请求
 */
Ajaxes.prototype.mount = function() {
  const self = this;
  for(let i = 0, len = this.option.length; i < len; i++) {
    const opt = this.option[i];
    const { url, params, type } = opt;
    this.count++;
    self.createAjax(url, params, type, ids);
  }
};

Ajaxes.prototype.createAjax = function(url, params, type, ids) {
  const self = this;
  const XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function() {
    if(+XHR.readyState === 4) {
      self.count--;
      if(+XHR.status >= 200 || +XHR.status === 304) {
        // do success
        self.data[ids] = XHR.responseText;
      } else {
        // do fail
        self.cancel = true;
      }
      if(self.count === 0 && !self.cancel) {
        self.getData();
      } else {
        self.getError('error');
      }
    }
  };
  XHR.open(type, url, true);
  XHR.send();
};

Ajaxes.prototype.getData = function() {
  const datas = this.datas;
  this.success(datas);
};

Ajaxes.prototype.getError = function(msg) {
  this.fail(msg);
};
