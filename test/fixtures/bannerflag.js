/* jshint evil: true */
document.write('<div id="bannerFlag"></div>');
var elem = document.getElementById('bannerFlag');


/*window.banner.getBannerFlag('foo', function(value){
    elem.innerHtml = '<div style="width:100%;height:225px;">'+value+'</div>';
    window.banner.processSize();
});*/

window.banner.setBannerFlag('flag', window.banner.id, function(result){
    elem.innerHtml = '<div style="width:100%;height:225px;">'+result+'</div>';
    window.banner.processSize();
});