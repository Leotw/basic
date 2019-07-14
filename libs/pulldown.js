(function(window) {
  const _defaults = {
    instructionsPullToRefresh: 'pull to refresh', // text
    instructionsReleaseToRefresh: 'Release to refresh', //text
    instructionsRefreshing: 'refreshing', // text
    threshold: 60, // minimum distance required to trigger the refresh.
    end: false,
    onPull: () => location.reload()
  };
  // 监听异步返回的结果
  const _observer = {
    end: _defaults.end
  };
  let _pullLengh = 0;
  let _startLength = 0;
  let _ptrEle = '';
  let _ptrTextEle = '';
  let _element = '';
  let _cfg;
  let _use = true;
  let pullToRefresh = {
    init: function(cfg) {
      Object.keys(_defaults).forEach((key) => {
        cfg[key] = cfg[key] || _defaults[key];
      });
      _cfg = cfg;
      _element = document.querySelector(cfg.targetElement);
      _ptrEle = document.querySelector(cfg.ptrElement);
      _ptrTextEle = document.querySelector(cfg.ptrTextElement);

      // init style
      _element.style.position = 'relative';
      _ptrEle.style.position = 'absolute';
      _ptrTextEle.innerText = cfg.instructionsPullToRefresh;

      // blind event
      _element.addEventListener('touchstart', function(event) {
        if(!_use) return;
        _startLength = event.touches[0].pageY;
        // _element.removeAttribute('style');
        _element.style['transition'] = 'transform 0s';
        // 'pull to refresh'
        _ptrTextEle.innerText = cfg.instructionsPullToRefresh;
        _element.addEventListener('touchmove', moveEventListener);
      });
      _element.addEventListener('touchend', function() {
        // console.log(document.body.scrollTop)
        if(!_use) return;
        _use = false;
        _element.removeEventListener('touchmove', moveEventListener);
        document.removeEventListener('touchmove', moveEventListener);
        cfg.onPull();
        Object.defineProperty(_observer, 'end', {
          set: function(newValue) {
            if(newValue) _endEvent();
          }
        });
        if(_pullLengh > cfg.threshold) {
          // 'refreshing'
          _ptrTextEle.innerText = cfg.instructionsRefreshing;
          _pullLengh = 0;
        }
        function _endEvent() {
          _observer.end = false;
          _use = true;
          _element.style['transition'] = 'transform 0.6s ease';
          _element.style['transform'] = 'translate(0, 0px)';
        }
      });
    },
    endDown: setEndDown
  };

  let moveEventListener = function(event) {
    if(!_use) return;
    _pullLengh = event.touches[0].pageY - _startLength;
    if(_pullLengh > 0 && document.documentElement.scrollTop <= 0) {
      preventDefault(event);
      pullElement(_element, _pullLengh, _cfg);
    }
  };

  let pullElement = function(element, length, cfg) {
    const maxMoveHeight = getVisibleHeight() - 300;
    // _ptrEle.offsetHeight
    if(length < maxMoveHeight) {
      element.style['transform'] = 'translate(0, ' + length + 'px)';
      if(length > cfg.threshold) {
        // 'release to fresh'
        _ptrTextEle.innerText = cfg.instructionsReleaseToRefresh;
      }
    }
  };

  function setEndDown() {
    _observer.end = true;
  }

  // 阻止浏览器默认事件
  function preventDefault (event) {
    event && event.cancelable && !event.defaultPrevented && event.preventDefault();
  }

  // 获取可视区域最大高度
  function getVisibleHeight() {
    return window.outerHeight;
  }


  window.pullToRefresh = pullToRefresh;
})(window);
