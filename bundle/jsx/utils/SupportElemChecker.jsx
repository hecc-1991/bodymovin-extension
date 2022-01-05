
$.__bodymovin.bm_SupportElemChecker = (function () {
    'use strict';

    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;


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
        false,  //light : 14
    ];

    function getMaskMode(num) {
        switch (num) {
            case MaskMode.NONE:
                return 0;
            case MaskMode.ADD:
                return 1;
            case MaskMode.SUBTRACT:
                return 2;
            case MaskMode.INTERSECT:
                return 3;
            case MaskMode.LIGHTEN:
                return 4;
            case MaskMode.DARKEN:
                return 5;
            case MaskMode.DIFFERENCE:
                return 6;
            default:
                return undefined;
        }
    }

    var maskTypesEnble = [
        true,   //mode:MaskMode.NONE
        true,   //mode:MaskMode.ADD
        true,   //mode:MaskMode.SUBTRACT
        true,   //mode:MaskMode.INTERSECT
        false,  //mode:MaskMode.LIGHTEN
        false,  //mode:MaskMode.DARKEN
        true,   //mode:MaskMode.DIFFERENCE
    ];
    var maskTypesName = [
        "空",   //mode:MaskMode.NONE    
        "相加", //mode:MaskMode.ADD
        "相减", //mode:MaskMode.SUBTRACT
        "交集", //mode:MaskMode.INTERSECT
        "变亮", //mode:MaskMode.LIGHTEN
        "变暗", //mode:MaskMode.DARKEN
        "差值", //mode:MaskMode.DIFFERENCE
    ];


    function getBlendMode(bm) {
        switch (bm) {
            case BlendingMode.NORMAL:
                return 0;
            case BlendingMode.DISSOLVE:
                return 1;
            case BlendingMode.DANCING_DISSOLVE:
                return 2;
            case BlendingMode.DARKEN:
                return 3;
            case BlendingMode.MULTIPLY:
                return 4;
            case BlendingMode.CLASSIC_COLOR_BURN:
                return 5;
            case BlendingMode.LINEAR_BURN:
                return 6;
            case BlendingMode.COLOR_BURN:
                return 7;
            case BlendingMode.DARKER_COLOR:
                return 8;
            case BlendingMode.ADD:
                return 9;
            case BlendingMode.LIGHTEN:
                return 10;
            case BlendingMode.SCREEN:
                return 11;
            case BlendingMode.COLOR_DODGE:
                return 12;
            case BlendingMode.CLASSIC_COLOR_DODGE:
                return 13;
            case BlendingMode.LINEAR_DODGE:
                return 14;
            case BlendingMode.LIGHTER_COLOR:
                return 15;
            case BlendingMode.OVERLAY:
                return 16;
            case BlendingMode.SOFT_LIGHT:
                return 17;
            case BlendingMode.HARD_LIGHT:
                return 18;
            case BlendingMode.LINEAR_LIGHT:
                return 19;
            case BlendingMode.VIVID_LIGHT:
                return 20;
            case BlendingMode.PIN_LIGHT:
                return 21;
            case BlendingMode.HARD_MIX:
                return 22;
            case BlendingMode.DIFFERENCE:
                return 23;
            case BlendingMode.CLASSIC_DIFFERENCE:
                return 24;
            case BlendingMode.EXCLUSION:
                return 25;
            case BlendingMode.SUBTRACT:
                return 26;
            case BlendingMode.DIVIDE:
                return 27;
            case BlendingMode.HUE:
                return 28;
            case BlendingMode.SATURATION:
                return 29;
            case BlendingMode.COLOR:
                return 30;
            case BlendingMode.LUMINOSITY:
                return 31;
            case BlendingMode.STENCIL_ALPHA:
                return 32;
            case BlendingMode.STENCIL_LUMA:
                return 33;
            case BlendingMode.SILHOUETE_ALPHA:
                return 34;
            case BlendingMode.SILHOUETTE_LUMA:
                return 35;
            case BlendingMode.ALPHA_ADD:
                return 36;
            case BlendingMode.LUMINESCENT_PREMUL:
                return 37;
        }
    }

    var blendModeTypesEnble = [
        true,
        false,
        false,
        true,
        true,
        true,
        false,
        false,
        false,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
    ];

    var blendModeTypesName = [
        "正常",
        "溶解",
        "动态抖动溶解",
        "变暗",
        "相乘",
        "颜色加深",
        "经典颜色加深",
        "线性加深",
        "较深的颜色",
        "相加",
        "变亮",
        "屏幕",
        "颜色减淡",
        "经典颜色减淡",
        "线性减淡",
        "较浅的颜色",
        "叠加",
        "柔光",
        "强光",
        "线性光",
        "亮光",
        "点光",
        "纯色混合",
        "差值",
        "经典差值",
        "排除",
        "相减",
        "相除",
        "色相",
        "饱和度",
        "颜色",
        "发光度",
        "模板Alpha",
        "模板亮度",
        "轮廓Alpha",
        "轮廓亮度",
        "Alpha添加",
        "冷光预乘",
    ];

    var effectTypesName = [
        "ADBE Tile",
        "ADBE Venetian Blinds",
        "ADBE Radial Wipe",
        "ADBE Linear Wipe",
        "ADBE Sharpen",
        "ADBE Radial Blur",
        "ADBE Gaussian Blur 2",
        "ADBE BEZMESH",
        "ADBE Corner Pin",
        "ADBE Fill",
        "ADBE Ramp",
        "ADBE Drop Shadow",
        "ADBE Tritone",
        "ADBE Color Balance (HLS)",
    ];

    function findEffect(name) {

        for (var index = 0; index < effectTypesName.length; index++) {
            var element = effectTypesName[index];
            if (element == name)
                return true;
        }

        return false;
    }

    function checkLayer(unSupportElem, type, layer) {
        var name = layer.name;
        var enabled = layer.enabled;

        if (!layerTypesEnble[type] && enabled) {
            var id = unSupportElem.length;
            var e = {
                msg: {
                    id: id,
                    type: "图层",
                    content: "图层<" + name + ">"
                },
                layer: layer
            };

            unSupportElem.push(e);
            bm_eventDispatcher.log("hecc-- " + e.msg.content);
        }
    }

    function checkMask(unSupportElem, maskName, maskMode, expansion, enabled, layer) {
        var layerName = layer.name;
        var idx = getMaskMode(maskMode);

        if (!maskTypesEnble[idx] && enabled) {
            var id = unSupportElem.length;
            var e = {
                msg: {
                    id: id,
                    type: "蒙版",
                    content: "图层<" + layerName + ">的<" + maskName + ">属性：" + maskTypesName[idx]
                },
                layer: layer
            };

            unSupportElem.push(e);
            bm_eventDispatcher.log("hecc-- " + e.msg.content);
        }

        var hasExpansion = true;
        if (expansion instanceof Object) {
            hasExpansion = expansion.k != 0;
        }

        if (hasExpansion && enabled) {
            var id = unSupportElem.length;
            var e = {
                msg: {
                    id: id,
                    type: "蒙版",
                    content: "图层<" + layerName + ">的<" + maskName + ">属性：蒙版扩展"
                },
                layer: layer
            };
            unSupportElem.push(e);
            bm_eventDispatcher.log("hecc-- " + e.msg.content);
        }
    }

    function checkBlendMode(unSupportElem, blendMode, layerType, layer) {
        var layerName = layer.name;

        var idx = getBlendMode(blendMode);

        if (!blendModeTypesEnble[idx] || (layerType == 12 && idx != 0)) {
            var id = unSupportElem.length;
            var e = {
                msg: {
                    id: id,
                    type: "混合模式",
                    content: "图层<" + layerName + ">的<" + blendModeTypesName[idx] + ">"
                },
                layer: layer
            };
            unSupportElem.push(e);
            bm_eventDispatcher.log("hecc-- " + e.msg.content);
        }
    }

    function checkEffect(unSupportElem, effectMatchName, effectName, enabled, layer) {
        var layerName = layer.name;

        if (!findEffect(effectMatchName) && enabled) {
            var id = unSupportElem.length;
            var e = {
                msg: {
                    id: id,
                    type: "效果",
                    content: "图层<" + layerName + ">的<" + effectName + ">"
                },
                layer: layer
            };
            unSupportElem.push(e);
            bm_eventDispatcher.log("hecc-- " + e.msg.content);
        }
    }

    var ob = {};

    ob.checkLayer = checkLayer;
    ob.checkMask = checkMask;
    ob.checkBlendMode = checkBlendMode;
    ob.checkEffect = checkEffect;

    return ob;
})();