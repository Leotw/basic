const beginTime = performance.now();
console.log('beginTime', beginTime);
const data = initData();
const root = document.getElementById('root');
let timeout;

function initData() {
  const arr = [];
  const count = 100000;
  for(let i = 0; i < count; i++) {
    arr.push({
      imgUrl: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
      title: `My data ${i}`,
      key: i
    });
  }
  return arr;
}

/**
 * 'all'全部渲染|'part'切片渲染|'frame'使用requestAnimationFrame优化切片渲染
 * 'partObs'|'partObs' 使用IntersectionObserver优化 'part' 'frame's
 * @param renderType
 */
function render(renderType) {
  console.log('Render way:', renderType);
  clearTimeout(timeout);
  const startTime = (new Date()).getSeconds();
  const totalCount = data.length; // 总数据条目数
  const fragCount = 100; // 分段渲染的条目数
  let totalLaps = Math.ceil(totalCount / fragCount); // 需要渲染的趟数
  // 具体渲染的执行
  switch (renderType) {
    case 'frame':
      _renderAnimation();
      break;
    case 'frameObs':
      _renderAnimationObserver();
      break;
    case 'part':
      _renderPart();
      break;
    case 'partObs':
      _renderPartObserver(true);
      break;
    case 'all':
    default:
      _renderAll();
      break;
  }

  // 切片渲染
  function _renderPart() {
    const splitData = data.splice(0, fragCount);
    const fragment = document.createDocumentFragment();
    splitData.forEach(item => {
      // 创建li节点
      const li = document.createElement('li');
      // 创建span节点
      const span = document.createElement('span');
      const textContent = document.createTextNode(item.title);
      span.appendChild(textContent);
      // 创建img节点
      const img = document.createElement('img');
      img.src = item.imgUrl;
      // 完成li节点
      li.appendChild(span);
      li.appendChild(img);
      fragment.appendChild(li);
    });
    root.appendChild(fragment);
    if(totalLaps <= 0) {
      getAddTime();
    }
    if(totalLaps > 0) {
      timeout = setTimeout(function() {
        totalLaps--;
        _renderPart();
      }, 50);
    }
  }

  // 全部渲染
  function _renderAll() {
    const fragment = document.createDocumentFragment();
    data.forEach(item => {
      // 创建li节点
      const li = document.createElement('li');
      // 创建span节点
      const span = document.createElement('span');
      const textContent = document.createTextNode(item.title);
      span.appendChild(textContent);
      // 创建img节点
      const img = document.createElement('img');
      img.src = item.imgUrl;
      // 完成li节点
      li.appendChild(span);
      li.appendChild(img);
      fragment.appendChild(li);
    });
    root.appendChild(fragment);
    getAddTime();
  }

  // 使用requestAnimationFrame优化切片渲染
  function _renderAnimation() {
    requestAnimationFrame(_renderExec);

    function _renderExec() {
      const splitData = data.splice(0, fragCount);
      const fragment = document.createDocumentFragment();
      splitData.forEach(item => {
        // 创建li节点
        const li = document.createElement('li');
        // 创建span节点
        const span = document.createElement('span');
        const textContent = document.createTextNode(item.title);
        span.appendChild(textContent);
        // 创建img节点
        const img = document.createElement('img');
        img.src = item.imgUrl;
        // 完成li节点
        li.appendChild(span);
        li.appendChild(img);
        fragment.appendChild(li);
      });
      root.appendChild(fragment);
      if(totalLaps <= 0) {
        getAddTime();
      }
      if(totalLaps > 0) {
        totalLaps--;
        requestAnimationFrame(_renderExec);
      }
    }
  }

  // 切片渲染|使用监听指定节点
  function _renderPartObserver(first) {
    const splitData = data.splice(0, fragCount);
    const fragment = document.createDocumentFragment();
    splitData.forEach((item, id) => {
      // 创建li节点
      const li = document.createElement('li');
      // 创建span节点
      const span = document.createElement('span');
      const textContent = document.createTextNode(item.title);
      span.appendChild(textContent);
      // 创建img节点
      const img = document.createElement('img');
      img.loadUrl = item.imgUrl;
      if(first) {
        img.src = item.imgUrl;
      } else {
        // 这里对图片进行懒加载
        const io = new IntersectionObserver(function(changes) {
          const change = changes[0];
          const { target, intersectionRatio } = change;
          if(intersectionRatio > 0) {
            target.src = target.loadUrl;
            io.unobserve(target);
          }
        });
        io.observe(img);
      }
      // 完成li节点
      li.appendChild(span);
      li.appendChild(img);
      fragment.appendChild(li);
      if(id === splitData.length - 1) {
        // 这里使用IntersectionObserver对当前片段的最后一个节点进行监听，一旦进入可视区域就继续添加节点并移除当前节点的监听
        const io = new IntersectionObserver(function(changes) {
          const change = changes[0];
          const { target, intersectionRatio } = change;
          if(intersectionRatio > 0 && totalLaps > 0) {
            _renderPartObserver(false);
            io.unobserve(target);
          }
          totalLaps--;
        });
        io.observe(li);
      }
    });
    root.appendChild(fragment);
    if(totalLaps <= 0) {
      getAddTime();
    }
  }

  // requestAnimationFrame切片渲染|使用监听指定节点
  function _renderAnimationObserver() {
    requestAnimationFrame(_renderExec);

    function _renderExec() {
      const splitData = data.splice(0, fragCount);
      const fragment = document.createDocumentFragment();
      splitData.forEach((item, id) => {
        // 创建li节点
        const li = document.createElement('li');
        // 创建span节点
        const span = document.createElement('span');
        const textContent = document.createTextNode(item.title);
        span.appendChild(textContent);
        // 创建img节点
        const img = document.createElement('img');
        img.src = item.imgUrl;
        // 完成li节点
        li.appendChild(span);
        li.appendChild(img);
        fragment.appendChild(li);
        if(id === splitData.length - 1) {
          // 这里使用IntersectionObserver对当前片段的最后一个节点进行监听，一旦进入可视区域就继续添加节点并移除当前节点的监听
          const io = new IntersectionObserver(function(changes) {
            const change = changes[0];
            const { target, intersectionRatio } = change;
            if(intersectionRatio > 0 && totalLaps > 0) {
              requestAnimationFrame(_renderExec);
              io.unobserve(target);
            }
            totalLaps--;
          });
          io.observe(li);
        }
      });
      root.appendChild(fragment);
      if(totalLaps <= 0) {
        getAddTime();
      }
    }
  }

  // 获取全部li添加完成的时间
  function getAddTime() {
    const endTime = (new Date()).getSeconds();
    const disTime = endTime - startTime;
    console.log('Add time:', `${disTime}秒`);
  }
}
