/*
    # Format 225h
    class: responsive_225h
*/
// todo, need test
// var re_width = /width\s*\:\s*100%/i;
// var re_height = /height\s*\:\s*225/i;

// function checkTaggedResponsive(elem) {
//     var tags = elem.getElementsByClassName('responsive_225h');
//     return tags.length > 0;
// }

// function checkResponsive(elem) {
//     var children = elem.children;
//     var res = false;
//     var style;
//     for (var i = 0, len = children.length; i < len; i++) {
//         if (children[i].tagName === 'DIV') {
//             style = children[i].getAttribute('style').toString();
//             if (style.match(re_width) && style.match(re_height)) {
//                 res = true;
//                 break;
//             }
//         }
//     }
//     return res;
// }


module.exports.getCSS = function(isResponsive){
    var wrappingCSS = [
        'object, embed, div, img, iframe { display: block; vertical-align: bottom; }',
        'body,html { overflow: hidden; background: transparent; display: inline; }',
        '#PASTIES {display: inline-block; vertical-align: bottom;}'
    ];

    var responsiveCSS = [
        'body, html, #PASTIES, div, iframe { display: block; vertical-align: bottom; }',
        'body, html, #PASTIES { background: transparent; width: 100%; height: 100%; overflow: hidden; }'
    ];

    return isResponsive ? responsiveCSS.join('') : wrappingCSS.join('');
};

function hasResponsiveTag(elem){
    var elems = elem.children;
    if (elems && elems.length){
        for(var i = 0, len = elems.length; i < len; i++){
            //console.log('data:', elems[i].getAttribute('data-responsive'));
            if (elems[i].getAttribute('data-responsive') != null){
                return true;
            }
        }
    }
    return false;
}

// data-responsive="225h"
module.exports.isResponsive = function(h, elem){
    return (h === 225) || elem && hasResponsiveTag(elem);
};
