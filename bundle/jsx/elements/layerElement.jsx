/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global  bm_timeremapHelper, bm_shapeHelper, bm_generalUtils, CompItem, PlaceholderSource, AVLayer, CameraLayer, LightLayer, ShapeLayer, TextLayer, TrackMatteType, bm_sourceHelper, bm_transformHelper, bm_maskHelper, bm_textHelper, bm_effectsHelper, bm_layerStylesHelper, bm_cameraHelper*/

$.__bodymovin.bm_layerElement = (function () {
    'use strict';
    var layerTypes = $.__bodymovin.layerTypes;
    var getLayerType = $.__bodymovin.getLayerType;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var bm_transformHelper = $.__bodymovin.bm_transformHelper;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_maskHelper = $.__bodymovin.bm_maskHelper;
    var bm_timeremapHelper = $.__bodymovin.bm_timeremapHelper;
    var bm_effectsHelper = $.__bodymovin.bm_effectsHelper;
    var bm_layerStylesHelper = $.__bodymovin.bm_layerStylesHelper;
    var bm_cameraHelper = $.__bodymovin.bm_cameraHelper;
    var bm_textHelper = $.__bodymovin.bm_textHelper;
    var bm_imageSeqHelper = $.__bodymovin.bm_imageSeqHelper;
    var bm_blendModes = $.__bodymovin.bm_blendModes;
    var bm_SupportElemChecker = $.__bodymovin.bm_SupportElemChecker;

    var completeCallback;

    var ob = {};

    function prepareLayer(layerInfo, ind) {
        var layerData = {};
        var layerType = getLayerType(layerInfo);


        if (layerType === layerTypes.light || layerType === layerTypes.pholderStill || layerType === layerTypes.pholderVideo) {
            layerData.isValid = false;
            layerData.render = false;
        }

        if (layerInfo.guideLayer) {
            layerData.isGuide = true;
            layerData.render = false;
        }

        if (layerInfo.enabled === false) {
            layerData.enabled = false;
            layerData.render = false;
        }
        if (layerInfo.threeDLayer) {
            layerData.ddd = 1;
        } else {
            layerData.ddd = 0;
        }
        layerData.ind = layerInfo.index;
        layerData.ty = layerType;
        layerData.isAdjustment = layerType === layerTypes.adjustment;
        layerData.nm = layerInfo.name;
        var layerAttributes = bm_generalUtils.findAttributes(layerInfo.name);
        if (layerAttributes.ln) {
            layerData.ln = layerAttributes.ln;
        }
        if (layerAttributes.cl) {
            layerData.cl = layerAttributes.cl;
        }
        if (layerAttributes.tg) {
            layerData.tg = layerAttributes.tg;
        }
        if (layerInfo.parent !== null) {
            layerData.parent = layerInfo.parent.index;
        }

        if (layerInfo.hasTrackMatte) {
            switch (layerInfo.trackMatteType) {
                case TrackMatteType.ALPHA:
                    layerData.tt = 1;
                    break;
                case TrackMatteType.ALPHA_INVERTED:
                    layerData.tt = 2;
                    break;
                case TrackMatteType.LUMA:
                    layerData.tt = 3;
                    break;
                case TrackMatteType.LUMA_INVERTED:
                    layerData.tt = 4;
                    break;
            }
            bm_SupportElemChecker.checkMatteDst(layerType,layerInfo);

        } else if (layerInfo.isTrackMatte) {
            if (layerInfo.isValid !== false) {
                layerData.render = true;
                layerData.td = 1;
            }
            bm_SupportElemChecker.checkMatteSrc(layerType,layerInfo);
        }
        return layerData;
    }

    var compCount = 0;

    function checkLayerSource(layerInfo, layerData, framerate) {
        if (layerData.render === false) {
            return;
        }
        var bm_sourceHelper = $.__bodymovin.bm_sourceHelper;
        var layerType = layerData.ty;
        var sourceId;
        if (layerType === layerTypes.precomp) {
            sourceId = bm_sourceHelper.checkCompSource(layerInfo, layerType);
            if (sourceId !== false) {
                layerData.refId = sourceId;
            } else {
                //layerData.compId = bm_generalUtils.random(7);
                layerData.compId = 'comp_' + compCount;
                compCount += 1;
                layerData.refId = layerData.compId;
                bm_sourceHelper.setCompSourceId(layerInfo.source, layerData.compId);
            }
        } else if (layerType === layerTypes.still) {
            layerData.refId = bm_sourceHelper.checkImageSource(layerInfo, framerate);
            //alert("find image------------id = "+layerData.refId);
        } else if (layerType === layerTypes.solid) {
            //alert("find solid------------");
        } else if (layerType === layerTypes.nullLayer) {
            //alert("find nullLayer------------");
        } else if (layerType === layerTypes.shape) {
            //alert("find shape------------");
        } else if (layerType === layerTypes.text) {
            //alert("find text------------");
            layerData.refId = bm_sourceHelper.checkTextSource(layerInfo, framerate);
        } else if (layerType === layerTypes.audio) {
            layerData.refId = bm_sourceHelper.checkAudioSource(layerInfo, framerate);
            //alert("find audio------------id = "+layerData.refId+" name= "+layerInfo.name);
        } else if (layerType === layerTypes.pholderVideo) {
            //alert("find pholderVideo------------");
        } else if (layerType === layerTypes.imageSeq) {
            sourceId = bm_sourceHelper.searchSequenceSource(layerInfo);
            layerData.refId = sourceId;
            if (!sourceId) {
                sourceId = bm_sourceHelper.addSequenceSource(layerInfo);
                layerData.refId = sourceId;
                layerData.compId = sourceId;
            }
        } else if (layerType === layerTypes.video) {
            layerData.refId = bm_sourceHelper.checkVideoSource(layerInfo, framerate);
            //alert("find video------------");
        } else if (layerType === layerTypes.pholderStill) {
            //alert("find pholderStill------------");
        } else if (layerType === layerTypes.guide) {
            //alert("find guide------------");
        } else if (layerType === layerTypes.adjustment) {
            //alert("find adjustment------------");
        } else if (layerType === layerTypes.camera) {
            //alert("find camera------------");
        } else if (layerType === layerTypes.light) {
            //alert("find light------------");
        }
    }

    function renderLayer(layerOb, includeHiddenData, callback) {
        var layerInfo = layerOb.layer;
        var layerData = layerOb.data;
        var frameRate = layerOb.framerate;
        completeCallback = callback;

        bm_SupportElemChecker.checkLayer(layerData.ty,layerInfo);

        if (layerData.render === false) {
            completeCallback();
            return;
        }

        layerData.sr = layerInfo.stretch / 100;

        var lType = layerData.ty;
        if (lType !== layerTypes.camera) {
            bm_transformHelper.exportTransform(layerInfo, layerData, frameRate);
            bm_maskHelper.exportMasks(layerInfo, layerData, frameRate);
            bm_effectsHelper.exportEffects(layerInfo, layerData, frameRate, includeHiddenData);
            bm_layerStylesHelper.exportStyles(layerInfo, layerData, frameRate);
            bm_timeremapHelper.exportTimeremap(layerInfo, layerData, frameRate);
        }

        if (lType === layerTypes.shape) {
            var extraParams = { is_rubberhose_autoflop: false };
            if (layerInfo.name.indexOf('::AutoFlop') !== -1) {
                extraParams.is_rubberhose_autoflop = true;
            }
            $.__bodymovin.bm_shapeHelper.exportShape(layerInfo, layerData, frameRate, false, extraParams, includeHiddenData);
        } else if (lType === layerTypes.solid) {
            layerData.sw = layerInfo.source.width;
            layerData.sh = layerInfo.source.height;
            layerData.sc = bm_generalUtils.arrayRgbToHex(layerInfo.source.mainSource.color);
        } else if (lType === layerTypes.text) {
            bm_textHelper.exportText(layerInfo, layerData, frameRate);
        } else if (lType === layerTypes.precomp) {
            layerData.w = layerInfo.width;
            layerData.h = layerInfo.height;
        } else if (lType === layerTypes.imageSeq) {
            bm_imageSeqHelper.exportStills(layerInfo, layerData, frameRate);
        } else if (lType === layerTypes.camera) {
            bm_cameraHelper.exportCamera(layerInfo, layerData, frameRate);
        }else if(lType === layerTypes.adjustment){
            layerData.sw = layerInfo.source.width;
            layerData.sh = layerInfo.source.height;
        }
        layerData.ip = layerInfo.inPoint * frameRate;
        layerData.op = layerInfo.outPoint * frameRate;
        layerData.st = layerInfo.startTime * frameRate;
        layerData.cp = layerInfo.collapseTransformation;
        if (layerInfo.motionBlur) {
            layerData.hasmb = true;
            bm_SupportElemChecker.checkMotionBlur(layerData.ty,layerInfo);
        }
        layerData.bm = bm_blendModes.getBlendMode(layerInfo.blendingMode);

        bm_SupportElemChecker.checkBlendMode(layerInfo.blendingMode,layerData.ty,layerInfo);

        completeCallback();
    }

    function reset() {
        compCount = 0;
    }

    ob.prepareLayer = prepareLayer;
    ob.checkLayerSource = checkLayerSource;
    ob.renderLayer = renderLayer;
    ob.reset = reset;
    return ob;
}());