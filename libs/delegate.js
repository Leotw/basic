function delegate(ele, type, fns, selector = '') {
  const selectorItem = selector;
  const selectorDic = {
    '.': 'class',
    '#': 'id'
  };
  const handlers = [];
  _addEvent(ele, type, cb);

  // 注册事件
  function _addEvent(ele, type, fn) {
    ele.addEventListener(type, fn, false);
  }

  // 事件回调
  function cb(event) {
    let target = event.target;
    const selectAttr = selectorDic[selectorItem.substring(0, 1)];
    while(target !== ele) {
      if(selectAttr) {
        const attr = target.getAttribute(selectAttr);
        if(attr.indexOf(selectorItem.substring(1)) !== -1) {
          Array.isArray(fns) ? fns[0].call(target, event) : fns.call(target, event);
        }
      } else {
        Array.isArray(fns) ? fns[0].call(target, event) : fns.call(target, event);
      }
      target = target.parentNode;
    }
  }
}
