function jsonp(option) {
  const { params = {}, url, timeout = 2 } = option;
  const { error, success } = option;
  const { callback = 'jsonpCallback' } = params;
  const scriptTag = document.createElement('script');
  const bodyTag = document.getElementsByTagName('body')[0];
  bodyTag.appendChild(scriptTag);
  scriptTag.src = `${url}?callback=${callback}&${formatParams(params)}`;
  window[callback] = function(data) {
    bodyTag.removeChild(scriptTag);
    clearTimeout(scriptTag.timer);
    window[callback] = null;
    success && success(data);
  };
  // 超时设定
  scriptTag.timer = setTimeout(function() {
    bodyTag.removeChild(scriptTag);
    clearTimeout(scriptTag.timer);
    window[callback] = null;
    error && error({
      message: 'timeout'
    });
  }, timeout * 1000);
  // 错误处理
  scriptTag.onerror = function() {
    bodyTag.removeChild(scriptTag);
    clearTimeout(scriptTag.timer);
    window[callback] = null;
    error && error({
      message: 'error'
    });
  };

  // 格式化参数
  function formatParams(data) {
    const arr = [];
    for(let name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    arr.push('v=' + random());
    return arr.join('&');
  }

  // 获取随机数
  function random() {
    return Math.floor(Math.random() * 10000 + 500);
  }
}
