/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, MaskMode*/
$.__bodymovin.bm_maskHelper = (function () {
    var bm_keyframeHelper = $.__bodymovin.bm_keyframeHelper;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_SupportElemChecker = $.__bodymovin.bm_SupportElemChecker;

    var ob = {};

    function getMaskMode(num) {
        switch (num) {
        case MaskMode.NONE:
            return 'n';
        case MaskMode.ADD:
            return 'a';
        case MaskMode.SUBTRACT:
            return 's';
        case MaskMode.INTERSECT:
            return 'i';
        case MaskMode.LIGHTEN:
            return 'l';
        case MaskMode.DARKEN:
            return 'd';
        case MaskMode.DIFFERENCE:
            return 'f';
        default:
            return undefined;
        }
    }
    
    function exportMasks(layerInfo, layerData, frameRate,unSupportElem) {
        if (!(layerInfo.mask && layerInfo.mask.numProperties > 0)) {
            return;
        }
        var stretch = layerData.sr;
        layerData.hasMask = true;
        layerData.masksProperties = [];
        var masks = layerInfo.mask;
        var i, len = masks.numProperties, maskElement;
        for (i = 0; i < len; i += 1) {
            maskElement = masks(i + 1);

            var shapeData = {
                inv: maskElement.inverted,
                mode: getMaskMode(maskElement.maskMode)
            };
            shapeData.pt = bm_keyframeHelper.exportKeyframes(maskElement.property('maskShape'), frameRate, stretch);
            $.__bodymovin.bm_shapeHelper.checkVertexCount(shapeData.pt.k);
            shapeData.o = bm_keyframeHelper.exportKeyframes(maskElement.property('Mask Opacity'), frameRate, stretch);
            shapeData.x = bm_keyframeHelper.exportKeyframes(maskElement.property('Mask Expansion'), frameRate, stretch);
            if ($.__bodymovin.bm_renderManager.shouldIncludeNotSupportedProperties()) {
                shapeData.f = bm_keyframeHelper.exportKeyframes(maskElement.property('Mask Feather'), frameRate, stretch);
            }
            shapeData.nm = maskElement.name;
            layerData.masksProperties.push(shapeData);

            bm_SupportElemChecker.checkMask(unSupportElem,maskElement.name,maskElement.maskMode,shapeData.x,maskElement.enabled,layerInfo.name);
        }
    }
    
    ob.exportMasks = exportMasks;
    
    return ob;
}());