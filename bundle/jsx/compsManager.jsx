/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File */

$.__bodymovin.bm_compsManager = (function () {
    'use strict';

    var compositions = [], projectComps, ob, currentComposition;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_projectManager = $.__bodymovin.bm_projectManager;


    function getCompositionData(comp) {
        //
        var i = 0, len = compositions.length, compData;
        while (i < len) {
            if (compositions[i].id === comp.id) {
                compData = compositions[i];
                break;
            }
            i += 1;
        }
        if (!compData) {
            compData = {
                id: comp.id,
                name: comp.name,
                width: comp.width,
                height: comp.height
            };
        }

        return compData;
    }

    function searchCompositionDestination(id, absoluteURI, standalone) {
        /*var i = 0, len = compositions.length, compData;
        while (i < len) {
            if (compositions[i].id === id) {
                compData = compositions[i];
                break;
            }
            i += 1;
        }*/
        var uri;
        if (absoluteURI) {
            uri = absoluteURI;
        } else {
            uri = Folder.desktop.absoluteURI + '/data';
            uri += standalone ? '.js' : '.json';
        }

        var f = new File(uri);
        var saveFileData = f.saveDlg();
        if (saveFileData !== null) {
            //compData.absoluteURI = saveFileData.absoluteURI;
            //compData.destination = saveFileData.fsName;
            var idx = saveFileData.absoluteURI.lastIndexOf("/");
            var abs = saveFileData.absoluteURI.substring(0, idx) + "/data.json";

            idx = saveFileData.fsName.lastIndexOf("\\");
            var dst = saveFileData.fsName.substring(0, idx) + "\\data.json";
            var compositionDestinationData = {
                absoluteURI: abs,
                destination: dst,
                id: id
            }
            bm_eventDispatcher.sendEvent('bm:composition:destination_set', compositionDestinationData);
        }
    }

    function searchCompositionLutPath(id, absoluteURI) {
        /*var i = 0, len = compositions.length, compData;
        while (i < len) {
            if (compositions[i].id === id) {
                compData = compositions[i];
                break;
            }
            i += 1;
        }*/

        var uri;
        if (absoluteURI) {
            uri = absoluteURI;
        } else {
            uri = Folder.desktop.absoluteURI;
        }

        var f = new Folder(uri);
        var saveFileData = f.selectDlg();
        if (saveFileData !== null) {
            //compData.absoluteURI = saveFileData.absoluteURI;
            //compData.destination = saveFileData.fsName;
            var compositionDestinationData = {
                lutURI: saveFileData.absoluteURI,
                lutPath: saveFileData.fsName,
                id: id
            }

            bm_eventDispatcher.sendEvent('bm:composition:lutPath_set', compositionDestinationData);
        }
    }

    //Opens folder where json is rendered
    function browseFolder(destination) {
        var file = new File(destination);
        file.parent.execute();
    }

    function updateData() {
        bm_projectManager.checkProject();
        getCompositions();
    }

    function getCompositions() {
        var compositions = [];
        projectComps = bm_projectManager.getCompositions();
        var i, len = projectComps.length;
        for (i = 0; i < len; i += 1) {
            compositions.push(getCompositionData(projectComps[i]));
        }
        bm_eventDispatcher.sendEvent('bm:compositions:list', compositions);
    }

    function renderComposition(compositionData) {
        ob.cancelled = false;
        currentComposition = compositionData;
        projectComps = bm_projectManager.getCompositions();
        var comp;
        var i = 0, len = projectComps.length;
        while (i < len) {
            if (projectComps[i].id === currentComposition.id) {
                comp = projectComps[i];
                break;
            }
            i += 1;
        }

        var lutPath = '';
        if (currentComposition.lutPath) {
            lutPath = currentComposition.lutPath;
        }


        bm_eventDispatcher.sendEvent('bm:render:start', currentComposition.id);
        var destination = currentComposition.absoluteURI;
        var fsDestination = currentComposition.destination;
        $.__bodymovin.bm_renderManager.render(comp, destination, fsDestination, currentComposition.settings, lutPath);
    }

    function renderComplete() {
        bm_eventDispatcher.sendEvent('bm:render:complete', currentComposition.id);
    }

    function cancel() {
        ob.cancelled = true;
        $.__bodymovin.bm_textShapeHelper.removeComps();
        bm_eventDispatcher.sendEvent('bm:render:cancel');
    }

    ob = {
        updateData: updateData,
        searchCompositionDestination: searchCompositionDestination,
        searchCompositionLutPath: searchCompositionLutPath,
        renderComplete: renderComplete,
        browseFolder: browseFolder,
        renderComposition: renderComposition,
        cancel: cancel,
        cancelled: false
    };

    return ob;
}());