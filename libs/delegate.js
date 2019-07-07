function delegate(ele, type, fn, selector = '') {
  const selectorItem = selector;
  const selectorList = selector.split(' ');
  const selectorDic = {
    '.': 'class',
    '#': 'id'
  };
  const handlers = [];
  _addEvent(ele, type, cb);

  function _addEvent(ele, type, fn) {
    ele.addEventListener(type, fn, false);
  }

  function cb(event) {
    let target = event.target;
    selectorList.forEach((selectorItem, ids) => {
      console.log('selectorItem:', selectorItem);
      const selectAttr = selectorDic[selectorItem.substring(0, 1)];
      while(target !== ele) {
        if(selectAttr) {
          const attr = target.getAttribute(selectAttr);
          if(attr.indexOf(selectorItem.substring(1)) !== -1) {
            fn.call(target, event);
          }
        } else {
          fn.call(target, event);
        }
        target = target.parentNode;
      }
    });
  }
}
