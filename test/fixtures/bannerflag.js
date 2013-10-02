/* jshint evil: true */
document.write('<div id="bannerFlag"></div>');

window.banner.getBannerFlag(window.banner.params.flag1key, function(value){
    var elem = document.getElementById('bannerFlag');
    if (elem){
        elem.innerHtml = '<div style="width:100%;height:225px;">'+value+'</div>';
        window.banner.processSize();
    }
});


window.banner.setBannerFlag(window.banner.name+'_flag', window.banner.name, function(result){
    var elem = document.getElementById('bannerFlag');
    if (elem){
        elem.innerHtml = '<div style="width:100%;height:225px;">'+result+'</div>';
        window.banner.processSize();
    }
});

