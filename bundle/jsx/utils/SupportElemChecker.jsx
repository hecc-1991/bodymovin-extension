
$.__bodymovin.bm_SupportElemChecker = (function(){
    'use strict';

    var layerTypesEnble = [
        true,   //precomp : 0,
        true,   //solid : 1,
        true,   //still : 2,
        true,   //nullLayer : 3,
        true,   //shape : 4,
        true,   //text : 5,
        true,   //audio : 6,
        false,  //pholderVideo : 7,
        false,  //imageSeq : 8,
        true,   //video : 9,
        false,  //pholderStill : 10,
        false,  //guide : 11,
        true,   //adjustment : 12,
        true,   //camera : 13,
        false   //light : 14
    ];

    function checkLayer(unSupportElem,type,name,enabled) {

        if(!layerTypesEnble[type] && enabled){
            var e = {
                type:"layer",
                content:"图层<"+name+"> 不支持"
            };
            unSupportElem.push(e);
            //alert("hecc-- "+e.content);
        }
    }
    
    var ob = {};

    ob.checkLayer = checkLayer;

    return ob;
})();