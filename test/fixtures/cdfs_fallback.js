/*
  This files intention is to give the tests a way to confirm
  that 
*/
/* jshint evil: true */
document.write(
  [
    '<div style="width:',
    window.banner.params.width,
    'px;height:',
    window.banner.params.height,
    'px;background:green;color:white;"></div>'
  ].join('')
);

/*try {
    window.parent[window.banner.id] = window.banner.id;
} catch (e) {
    if (window.console) {
        window.console.log(e);
    }
    throw e;
}*/