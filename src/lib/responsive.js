module.exports.getCSS = function(isResponsive){
    var wrappingCSS = [
        'object, embed, div, img, iframe { display: block; vertical-align: bottom; }',
        'body,html { overflow: hidden; background: transparent; display: inline; }',
        '#GARDR {display: inline-block; vertical-align: bottom;}'
    ];

    var responsiveCSS = [
        'body, html, #GARDR, div, iframe { display: block; vertical-align: bottom; }',
        'body, html, #GARDR { background: transparent; width: 100%; height: 100%; overflow: hidden; }'
    ];

    return isResponsive ? responsiveCSS.join('') : wrappingCSS.join('');
};