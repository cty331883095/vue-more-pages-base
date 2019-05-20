; (function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var { __BASE_WIDTH__, __BASE_HEIGHT__ } = win
  var recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = 100 * (clientWidth / __BASE_WIDTH__) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  recalc()

  var writeStyle = function () {
    var scale = __BASE_WIDTH__ / __BASE_HEIGHT__
    var cssText = `
    #app{
      width:${_BASE_WIDTH__ / 100}rem;
      height:${scale > 16 / 9 ? _BASE_HEIGHT__ / 100 + 'rem' : '100%'};
    }
    `
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = cssText
    doc.head.appendChild(style)
  }
  writeStyle()
})(document, window)