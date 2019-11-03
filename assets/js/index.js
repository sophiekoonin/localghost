// https://codepen.io/DirkWeber/pen/eyxbmq

(function() {
  var ua = navigator.userAgent;

  if (!/firefox/gi.test(ua)) {
    return;
  }
  // Browsersniffing. Yes, I'm lazy.

  var fragmentID;
  var feImgs = document.querySelectorAll('feImage');
  var cssList = document.styleSheets;
  var cssAnimations = {};

  for (var i = 0; i < cssList.length; i++) {
    var css = cssList[i];

    for (var j = 0; j < css.cssRules.length; j++) {
      var rule = css.cssRules[j];

      //is rule a keyframe animation?
      if (rule.type === 7) {
        cssAnimations[rule.name] = rule.cssText;
      }
    }
  }

  for (var i = 0, j = feImgs.length; i < j; i++) {
    fragmentID =
      feImgs[i].getAttribute('xlink:href') || feImgs[i].getAttribute('xlink');

    if (/#/.test(fragmentID) && !/data\:image\/svg\+xml/.test(fragmentID)) {
      fragmentAsURIintoFilter(fragmentID, feImgs[i]);
    }
  }

  function fragmentAsURIintoFilter(identifier, fePrimitive) {
    var el = document.querySelector(identifier);
    var styledEl = inlineStyles(el);
    var nsAttr = 'http://www.w3.org/2000/svg';
    if (!styledEl.getAttribute('xmlns')) {
      styledEl.setAttribute('xmlns', nsAttr);
    }
    var text = encodeURIComponent(
      styledEl.outerHTML.replace(/100%/g, '256')
    ).replace('"', "'");
    var target = fePrimitive;

    target.setAttribute(
      'xlink:href',
      'data:image/svg+xml;charset=utf-8,' + text
    );
  }

  // When URLencoded, global styles will no longer apply to the SVG Fragment. So we must inline every rule before:
  function inlineStyles(element) {
    var children = element.querySelectorAll('*');
    var animations = [];

    [].forEach.call(children, function(child) {
      var style = getComputedStyle(child);
      child.cssText = style;

      // Look for animations:
      for (var i = 0; i < style.length; i++) {
        var prop = style.item(i);
        var rule = style.getPropertyValue(prop);

        // is there a CSS keyframe animation applied to this element?
        // Copy it to an inlined style.
        if (/animation\-name/.test(prop) && rule !== 'none') {
          if (animations.toString().indexOf(rule) < 0) {
            var svgStyle = document.createElement('style');

            svgStyle.innerHTML = cssAnimations[rule];
            element.appendChild(svgStyle);
            animations.push(rule);
          }
        }

        child.style[prop] = rule;
      }
    });

    return element;
  }
})();
