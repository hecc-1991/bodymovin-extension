/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global layerElement, $, RQItemStatus, File, app, PREFType */
$.__bodymovin.bm_lutHelper = (function () {

    var lutSources = [];
    var lutCount = 0;
    var REG_LUT = /^使用:\s((.)+)/g;

    /*
    色表特效
     */
    function lutEffect(elem, effectType) {

        var i, len = elem.numProperties, prop;
        for (i = 0; i < len; i += 1) {
            prop = elem.property(i + 1);

            var ret = REG_LUT.exec(prop.name);
            if (ret && ret.length > 1) {
                var colorTableName = ret[1];
                lutSources.push({
                    name: colorTableName,
                    id: 'color_' + lutCount,
                });
                return lutSources[lutSources.length - 1].id;
            }
        }

        return '';
    }

    /*
    查找色表
    */
    function checkLutSource(effectElement, effectType, frameRate) {

        if (!effectElement) {
            return;
        }
        var id = '';
        if ('ADBE Apply Color LUT2' === effectElement.matchName) {
            id = lutEffect(effectElement, effectType);
        }


        return id;
    }

    function exportLut(dstPath, lutPath, lut, compId, _originalNamesFlag) {
        if (lutSources.length === 0) {
            return;
        }

        var file = new File(dstPath);
        var folder = file.parent;
        folder.changePath('luts/');
        if (!folder.exists) {
            folder.create();
        }

        lut.assets = [];

        var i;
        for (i = 0; i < lutSources.length; i += 1) {
            var currentSourceData = lutSources[i];
            var oriFile = new File(lutPath + '/' + currentSourceData.name);
            var colorTableName = 'lut_' + i + '.cube';
            var currentSavingAsset = {
                ty: 5,
                id: currentSourceData.id,
                u: 'luts/',
                p: colorTableName,
                src: currentSourceData.name
            };

            lut.push(currentSavingAsset);

            //save lut
            if (oriFile.exists) {
                oriFile.copy(folder.absoluteURI + '/' + currentSavingAsset.p);
            }
        }

    }

    function reset() {
        lutSources.length = 0;
        lutCount = 0;
    }

    return {
        exportLut: exportLut,
        checkLutSource: checkLutSource,
        reset: reset
    };
}());