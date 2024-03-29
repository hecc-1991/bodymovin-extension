/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global layerElement, $, RQItemStatus, File, app, PREFType */
$.__bodymovin.bm_sourceHelper = (function () {
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_compsManager = $.__bodymovin.bm_compsManager;
    var bm_renderManager = $.__bodymovin.bm_renderManager;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var compSources = [], imageSources = [],psdImageSources = [],videoSources = [],audioSources = [],textSources = [], fonts = [],
	currentExportingImage, 
	destinationPath, assetsArray, folder, helperComp, 
	currentCompID, 
	originalNamesFlag, 
	imageName = 0,audioName = 0,
	imageCount = 0, videoCount = 0 ,audioCount = 0,textCount=0;
    var currentSavingAsset;
    var temporaryFolder;
    var queue, playSound, autoSave, canEditPrefs = true;

    function checkCompSource(item) {
        var arr = compSources;
        var i = 0, len = arr.length, isRendered = false;
        while (i < len) {
            if (arr[i].source === item.source) {
                isRendered = true;
                break;
            }
            i += 1;
        }
        if (isRendered) {
            return arr[i].id;
        }
        arr.push({
            source: item.source
        });
        return false;
    }
    
	/*
	查找图片
	*/
    function checkImageSource(item,framerate) {
        var arr = imageSources;
        var i = 0, len = arr.length, isRendered = false;
        while (i < len) {
            if (arr[i].source === item.source) {
                return arr[i].id;
            }
            i += 1;
        }


        arr.push({
            source: item.source,
            width: item.source.width,
            height: item.source.height,
            source_name: item.source.name,
            name: item.name,
            id: 'image_' + imageCount
        });

        imageCount += 1;
        return arr[arr.length - 1].id;
    }
	
	/*
	查找视频
	*/
    function checkVideoSource(item,framerate) {
		
        var arr = videoSources;
        var i = 0, len = arr.length;
        while (i < len) {
            if (arr[i].source === item.source) {

				arr[i].io.push({
					st: item.startTime *framerate,
					ip:item.inPoint*framerate,
					op:item.outPoint*framerate
					});

                return arr[i].id;
            }
            i += 1;
        }
		
        var io = {
			st: item.startTime *framerate,
			ip:item.inPoint*framerate,
			op:item.outPoint*framerate			
		};
		
        arr.push({
            source: item.source,
            width: item.source.width,
            height: item.source.height,
            frameRate: item.source.frameRate,
            frameDuration: item.source.frameDuration,
            audioEnabled: item.audioEnabled,
            source_name: item.source.name,
            name: item.name,
            id: 'video_' + videoCount,
			io: [io]
		});
        videoCount += 1;
        return arr[arr.length - 1].id;
    }	
	
	/*
	查找音频
	*/
    function checkAudioSource(item,framerate) {
		if(item.audioEnabled == false)
			return;
        var arr = audioSources;
        var i = 0, len = arr.length;
        while (i < len) {
            if (arr[i].source === item.source) {
				arr[i].io.push({
					st: item.startTime *framerate,
					ip:item.inPoint*framerate,
					op:item.outPoint*framerate
					});
					
                return arr[i].id;
            }
            i += 1;
        }
		
        var io = {
			st: item.startTime *framerate,
			ip:item.inPoint*framerate,
			op:item.outPoint*framerate			
		};
		
        arr.push({
            source: item.source,
            source_name: item.source.name,
            name: item.name,
            id: 'audio_' + audioCount,
			io: [io]
		});
        audioCount += 1;
        return arr[arr.length - 1].id;
    }	
	
	/*
	查找文字
	*/
	function checkTextSource(item,framerate) {

		var res = item.name.search("re_txt_");
		var prefix = "text_";
		if(res != 0){
			prefix = "textnor_";
		}
		var textDocument = item.property("Source Text").value;
		
        var arr = textSources;
		
        var i = 0, len = arr.length;
        while (i < len) {
            if (arr[i].source === item.source) {
                return arr[i].id;
            }
            i += 1;
        }
		
        arr.push({
            //source: item.source,
            //source_name: item.source.name,
            name: item.name,
            id: prefix + textCount,
			t: 	textDocument.text
        });
        textCount += 1;
        return arr[arr.length - 1].id;
    }	
    
    function setCompSourceId(source, id) {
        var i = 0, len = compSources.length;
        while (i < len) {
            if (compSources[i].source === source) {
                compSources[i].id = id;
            }
            i += 1;
        }
    }

    var reservedChars = ['/','?','<','>','\\',':','*','|','"','\''];
    function isReserverChar(charString){
        var i = 0, len = reservedChars.length;
        while( i < len) {
            if(reservedChars[i] === charString){
                return true;
            }
            i += 1;
        }
        return false
    }

    //                  A-Z      - .    0 - 9     _      a-z
    var validRanges = [[65,90],[45,46],[48,57],[95,95],[97,122]]

    function isValidChar(charCode) {
        var i = 0, len = validRanges.length;
        while(i < len) {
            if(charCode >= validRanges[i][0] && charCode <= validRanges[i][1]){
                return true
            }
            i += 1;
        }
        return false
    }

    function checkSanitizedNameExists(name) {
        var i = 0, len = assetsArray.length;
        while (i < len) {
            if(assetsArray[i].p === name) {
                return true
            }
            i += 1;
        }
        return false
    }

    function incrementSanizitedName(name) {
        return name + '_' + imageName++
    }

    function formatImageName(name,type) {
		
		var suffix = ".png";
		if(type==1){
			suffix=".mp3";
		}
		
        var sanitizedName = '';
        var totalChars = name.lastIndexOf('.');
        if(totalChars < 0){
            totalChars = name.length;
        }
        var i;
        for(i = 0; i < totalChars; i += 1) {
            /*var newChar = String.fromCharCode(name.charCodeAt(i) % (2 << 7))
            if(!isReserverChar(newChar)){
                sanitizedName += newChar
            }*/
            var charCode = name.charCodeAt(i)
            if(isValidChar(charCode)) {
                sanitizedName += name.substr(i,1)
            } else {
                sanitizedName += '_'
            }
            if(checkSanitizedNameExists(sanitizedName + suffix)){
                sanitizedName = incrementSanizitedName(sanitizedName)
            }
        }
        return sanitizedName + suffix;
    }

    function saveFilesToFolder() {
        var i, len = assetsArray.length;
        var copyingFile;
        for(i = 0; i < len; i += 1) {
            if(!assetsArray[i].e) {
                copyingFile = new File(temporaryFolder.absoluteURI+'/'+assetsArray[i].p);
                if(copyingFile.exists) {
                    if(!folder.exists) {
                        folder.create()
                    }
                    copyingFile.copy(folder.absoluteURI+'/'+copyingFile.name);
                }
            }
        }
        var files = temporaryFolder.getFiles();
        len = files.length;
        for(i = 0; i < len; i += 1) {
            files[i].remove();
        }
        temporaryFolder.remove();
    }

    //// IMAGE SEQUENCE FUNCTIONS

    var sequenceSources = [], sequenceSourcesStills = []
    var currentExportingImageSequenceIndex = 0;
    var sequenceSourcesStillsCount = 0;
    var currentStillIndex = 0;
    var currentSequenceTotalFrames = 0;
    var sequenceCount = 0;
    var helperSequenceComp = null;

    function searchSequenceSource(item) {
        var i = 0, len = sequenceSources.length;
        while (i < len) {
            if (sequenceSources[i].source === item.source) {
                return sequenceSources[i].id;
            }
            i += 1;
        }
        return false;
    }

    function addSequenceSource(item) {
        var sequenceSource = {
            source: item.source,
            id: 'sequence_' + sequenceCount++,
        }
        sequenceSources.push(sequenceSource);
        return sequenceSource.id;
    }

    function addImageSequenceStills(source, totalFrames) {

        var i = 0;
        var sequenceRange = []
        for(i = 0; i < totalFrames; i += 1) {
            sequenceRange.push('imgSeq_' + sequenceSourcesStillsCount++)
        }

        var sequenceStills = {
            totalFrames: totalFrames,
            source: source,
            name: source.name,
            source_name: source.name,
            range: sequenceRange,
            width: source.width,
            height: source.height,
            
        }
        sequenceSourcesStills.push(sequenceStills);
        sequenceSourcesStillsCount += totalFrames;
        return sequenceStills.range;
    }

    function getSequenceSourceBySource(source) {
        var i = 0, len = sequenceSources.length;
        while (i < len) {
            if (sequenceSources[i].source === source) {
                return sequenceSources[i].id;
            }
            i += 1;
        }
    }

    function saveNextStillInSequence() {

        if (currentStillIndex === currentSequenceTotalFrames) {
            currentExportingImageSequenceIndex += 1;
            helperSequenceComp.remove();
            saveNextImageSequence();
            return;
        }

        var currentSourceData = sequenceSourcesStills[currentExportingImageSequenceIndex];
        var totalFrames = currentSourceData.totalFrames;

        bm_eventDispatcher.sendEvent('bm:render:update', 
            {
                type: 'update', 
                message: 'Exporting sequence: ' + currentSourceData.name,
                compId: currentCompID,
                progress: currentStillIndex / totalFrames
            }
        );
        var imageName = originalNamesFlag ? 
            formatImageName(currentSourceData.source_name) 
            : 
            'seq_' + currentExportingImageSequenceIndex + '_' + currentStillIndex + '.png';

        currentSavingAsset = {
            id: currentSourceData.range[currentStillIndex],
            w: currentSourceData.width,
            h: currentSourceData.height,
            t: 'seq',
            u: 'images/',
            p: imageName,
            e: 0
        }
        assetsArray.push(currentSavingAsset);

        var file = new File(temporaryFolder.absoluteURI + '/' + imageName);

        // Overwrite any existing file.
        if (file.exists) {
            file.remove();
        }

        helperSequenceComp.workAreaStart = currentStillIndex / currentSourceData.source.frameRate;
        helperSequenceComp.workAreaDuration = 1 / currentSourceData.source.frameRate;

        // Add composition item to render queue and set to render.
        var item = app.project.renderQueue.items.add(helperSequenceComp);
        item.render = true;

        // Set output parameters.
        // NOTE: Use hidden template '_HIDDEN X-Factor 8 Premul', which exports png with alpha.
        var outputModule = item.outputModule(1);
        outputModule.applyTemplate("_HIDDEN X-Factor 8 Premul");
        outputModule.file = file;

        // Set cleanup.
        item.onStatusChanged = function() {
            if (item.status === RQItemStatus.DONE) {
                // Due to an apparent bug, "00000" is appended to the file extension.
                // NOTE: This appears to be related to the "File Template" setting's
                //       frame number parameter ('[#####]').
                //       However, attempts to fix this by setting the "File Template"
                //       and/or "File Name" parameter of the output module's "Output
                //       File Info" setting had no effect.
                // NOTE: Also tried setting output module's "Use Comp Frame Number"
                //       setting to false.
                // NOTE: Bug confirmed in Adobe After Effects CC v15.0.1 (build 73).

                var imgIndex = currentStillIndex.toString();
                while(imgIndex.length < 5) {
                    imgIndex = '0' + imgIndex;
                }

                var bug = new File(temporaryFolder.absoluteURI + '/' + imageName + imgIndex);
                if (bug.exists) {
                    bug.rename(imageName);
                }

                bm_eventDispatcher.sendEvent('bm:image:process', {
                    path: temporaryFolder.fsName + '/' + imageName, 
                    should_compress: bm_renderManager.shouldCompressImages(), 
                    compression_rate: bm_renderManager.getCompressionQuality()/100,
                    should_encode_images: bm_renderManager.shouldEncodeImages()
                })
            }
        };

        // Render.
        app.project.renderQueue.render();
        
    }

    function saveSequence() {
        var currentSourceData = sequenceSourcesStills[currentExportingImageSequenceIndex];
        currentStillIndex = 0;
        currentSequenceTotalFrames = currentSourceData.totalFrames;
        var frameRate = currentSourceData.source.frameRate;

        helperSequenceComp = app.project.items.addComp('tempConverterComp', Math.max(4, currentSourceData.width), Math.max(4, currentSourceData.height), 1, (currentSourceData.totalFrames + 1) / frameRate, frameRate);
        helperSequenceComp.layers.add(currentSourceData.source);
        saveNextStillInSequence();

    }

    function saveNextImageSequence() {
        if (currentExportingImageSequenceIndex === sequenceSourcesStills.length) {
            finishImageSave();
        } else {
            saveSequence();
        }
    }

    //// IMAGE SEQUENCE FUNCTIONS END

    function finishImageSave() {

        saveFilesToFolder();
        restoreRenderQueue(queue);

        if(canEditPrefs) {
            app.preferences.savePrefAsLong("Misc Section", "Play sound when render finishes", playSound, PREFType.PREF_Type_MACHINE_INDEPENDENT);  
            app.preferences.savePrefAsLong("Auto Save", "Enable Auto Save RQ2", autoSave, PREFType.PREF_Type_MACHINE_INDEPENDENT);   
        }
        bm_renderManager.imagesReady();
    }
    
    function saveNextImage() {
        if (bm_compsManager.cancelled) {
            return;
        }
		
        if (currentExportingImage === psdImageSources.length) {
            saveNextImageSequence();
            return;
        }
		
		var currentSourceData = psdImageSources[currentExportingImage];
        bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Exporting image: ' + currentSourceData.name, compId: currentCompID, progress: currentExportingImage / psdImageSources.length});
        var currentSource = currentSourceData.source;

		//当资源文件来自同一源文件时，需要保持输出图层名一致
		var imageName = "psd_"+currentExportingImage + ".png";
        
        currentSavingAsset = {
			ty: 1,
            id: currentSourceData.id,
            w: currentSourceData.width,
            h: currentSourceData.height,
            u: 'images/',
            p: imageName,
            e: 0,
			src: currentSourceData.source_name,
			nm: currentSourceData.name
        }
		
        assetsArray.push(currentSavingAsset);
        var helperComp = app.project.items.addComp('tempConverterComp', Math.max(4, currentSource.width), Math.max(4, currentSource.height), 1, 1, 1);
        helperComp.layers.add(currentSource);
        var file = new File(temporaryFolder.absoluteURI + '/' + imageName);

        // Overwrite any existing file.
        if (file.exists) {
            file.remove();
        }

        // Add composition item to render queue and set to render.
        var item = app.project.renderQueue.items.add(helperComp);
        item.render = true;

        // Set output parameters.
        // NOTE: Use hidden template '_HIDDEN X-Factor 8 Premul', which exports png with alpha.
        var outputModule = item.outputModule(1);
        outputModule.applyTemplate("_HIDDEN X-Factor 8 Premul");
        outputModule.file = file;

        // Set cleanup.
        item.onStatusChanged = function() {
            if (item.status === RQItemStatus.DONE) {
                // Due to an apparent bug, "00000" is appended to the file extension.
                // NOTE: This appears to be related to the "File Template" setting's
                //       frame number parameter ('[#####]').
                //       However, attempts to fix this by setting the "File Template"
                //       and/or "File Name" parameter of the output module's "Output
                //       File Info" setting had no effect.
                // NOTE: Also tried setting output module's "Use Comp Frame Number"
                //       setting to false.
                // NOTE: Bug confirmed in Adobe After Effects CC v15.0.1 (build 73).
                var bug = new File(temporaryFolder.absoluteURI + '/' + imageName + '00000');
                if (bug.exists) {
                    bug.rename(imageName);
                }

                bm_eventDispatcher.sendEvent('bm:image:process', {
                    path: temporaryFolder.fsName + '/' + imageName, 
                    should_compress: bm_renderManager.shouldCompressImages(), 
                    compression_rate: bm_renderManager.getCompressionQuality()/100,
                    should_encode_images: bm_renderManager.shouldEncodeImages()
                })
            }
        };

        // Render.
        app.project.renderQueue.render();

        helperComp.remove();
    }

    function imageProcessed(changedFlag, encoded_data) {
        if(changedFlag) {
            currentSavingAsset.p = currentSavingAsset.p.replace(new RegExp('png' + '$'), 'jpg')
        }
        if(encoded_data) {
            currentSavingAsset.p = encoded_data;
            currentSavingAsset.u = '';
            currentSavingAsset.e = 1;
        }
        if(currentSavingAsset.t === 'seq') {
            currentStillIndex += 1;
            saveNextStillInSequence();
        } else {
            currentExportingImage += 1;
            saveNextImage();
        }
    }
    
    function renderQueueIsBusy() {
        for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
            if (app.project.renderQueue.item(i).status == RQItemStatus.RENDERING) {
                return true;
            }
        }
        return false;
    }

    function backupRenderQueue() {
        var queue = [];
        for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
            var item = app.project.renderQueue.item(i);
            if (item.status == RQItemStatus.QUEUED) {
                queue.push(i);
                item.render = false;
            }
        }
        return queue;
    }

    function restoreRenderQueue(queue) {
        for (var i = 0; i < queue.length; i++) {
            app.project.renderQueue.item(queue[i]).render = true;
        }
    }

    function exportImages(path, assets, compId, _originalNamesFlag) {
        if ((imageSources.length === 0 && sequenceSourcesStills.length === 0) || bm_renderManager.shouldSkipImages()) {
            bm_renderManager.imagesReady();
            return;
        }
		
		var file = new File(path);
        folder = file.parent;
        folder.changePath('images/');
		
		var hasRenderImageCount = 0;
		//如果是png或者jpg那么复制原图
		for(i = 0; i < imageSources.length; i += 1){
			var currentSourceData = imageSources[i];	
			if(currentSourceData.source_name.match(".png") || currentSourceData.source_name.match(".jpg")){
				//获取图片后缀名
				var fileExt;
				if(currentSourceData.source_name.match(".png"))
					fileExt = ".png";
				else if(currentSourceData.source_name.match(".jpg"))
					fileExt = ".jpg";
				
				var imageName = "img_"+hasRenderImageCount + fileExt;
				
				var curImgAsset = {
					ty: 1,
					id: currentSourceData.id,
					w: currentSourceData.width,
					h: currentSourceData.height,
					u: 'images/',
					p: imageName,
					e: 0,
					src: currentSourceData.source_name,
					nm: currentSourceData.name
				}
				
				assets.push(curImgAsset);
				
				//保存图片
				if(currentSourceData.source.file.exists) {
					if(!folder.exists) {
						folder.create();
					}
					currentSourceData.source.file.copy(folder.absoluteURI+'/'+imageName);
				}
				hasRenderImageCount++;
			}else{
				//psd格式图片
				psdImageSources.push(currentSourceData);
			}
		}

		if(hasRenderImageCount >= imageSources.length){
            bm_renderManager.imagesReady();			
			return;
		}
		
        if (renderQueueIsBusy()) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Render queue is currently busy. \n\rCan\'t continue with render.\n\rCheck for elements in AE\'s render queue in a Rendering status, remove them and try again.'});
            return;
        }
        currentCompID = compId;
        originalNamesFlag = _originalNamesFlag;
        bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Exporting images', compId: currentCompID, progress: 0});
        currentExportingImage = 0;
        currentExportingImageSequenceIndex = 0;

        var folder_random_name = bm_generalUtils.random(10);
        temporaryFolder = new Folder(Folder.temp.absoluteURI);
        temporaryFolder.changePath('Bodymovin/'+folder_random_name);
        assetsArray = assets;
        if (!temporaryFolder.exists) {
            if (!temporaryFolder.create()) {
                bm_eventDispatcher.sendEvent('alert', 'folder failed to be created at: ' + temporaryFolder.fsName);
                return;
            }
        }

        try {
            playSound = app.preferences.getPrefAsLong("Misc Section", "Play sound when render finishes", PREFType.PREF_Type_MACHINE_INDEPENDENT);  
            autoSave = app.preferences.getPrefAsLong("Auto Save", "Enable Auto Save RQ2", PREFType.PREF_Type_MACHINE_INDEPENDENT);  
            app.preferences.savePrefAsLong("Misc Section", "Play sound when render finishes", 0, PREFType.PREF_Type_MACHINE_INDEPENDENT);  
            app.preferences.savePrefAsLong("Auto Save", "Enable Auto Save RQ2", 0, PREFType.PREF_Type_MACHINE_INDEPENDENT);
        }  catch(err) {
            canEditPrefs = false;
        }

        queue = backupRenderQueue();
        saveNextImage();  
    }
		
	function exportVideos(path, assets, compId, _originalNamesFlag){
        if (videoSources.length === 0 ) {
            return;
        }

		var file = new File(path);
        folder = file.parent;
        folder.changePath('videos/');
		
        if(!folder.exists) {
            folder.create();
        }		
		
		var i;
		for(i = 0; i < videoSources.length; i += 1){
			var currentSourceData = videoSources[i];
			var currentSource = currentSourceData.source;
			var j;			
			var videoName = 'video_' + i + '.mp4';
			
			var curVidAsset = {
				ty: 4,
				id: currentSourceData.id,
				fd: currentSourceData.frameDuration,
				fr: currentSourceData.frameRate,
				ae: currentSourceData.audioEnabled,
				w: currentSourceData.width,
				h: currentSourceData.height,
				u: 'videos/',
				p: videoName,
				e: 0,
				src: currentSourceData.source_name,
				nm: currentSourceData.name,
				du: currentSource.duration,
				io: currentSourceData.io
				
			}
				//save video
			var videoFilename = folder.fsName + '/'+curVidAsset.p;

			if(currentSourceData.source_name.match(".mov")){
				if(currentSourceData.name.match("fix_mask_")){

				var srcFile = File.decode(currentSource.file);
				var cmd = "\"C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/com.tutucloud.export/util/movproc.exe\"  \""+currentSource.file.fsName+"\" \""+videoFilename+"\"";

				system.callSystem(cmd);
				}
			}else{
				currentSource.file.copy(videoFilename);
			}				
			
			assets.push(curVidAsset);			
		}
	}
    
	function exportAudios(path, assets, compId, _originalNamesFlag) {
		
        if (audioSources.length === 0 ) {
            return;
        }

        var file = new File(path);
        folder = file.parent;
        folder.changePath('audios/');
        if(!folder.exists) {
            folder.create();
        }
		
		var i;
		for(i = 0; i < audioSources.length; i += 1){
			var currentSourceData = audioSources[i];
	
	
			var currentSource = currentSourceData.source;
			var audioName = 'audio_' + i + '.mp3'
			currentSavingAsset = {
				ty: 2,
				id: currentSourceData.id,
				u: 'audios/',
				p: audioName,
				e: 0,
				src: currentSourceData.source_name,				
				nm: currentSourceData.name,
				du: currentSource.duration,
				io: currentSourceData.io
				
			}
			
			assets.push(currentSavingAsset);
			
			//save audio
            if(currentSource.file.exists) {
                currentSource.file.copy(folder.absoluteURI+'/'+currentSavingAsset.p);
            }			
		}

    }
    
	function exportTexts(path, assets, compId, _originalNamesFlag) {
		var i;
		for(i = 0; i < textSources.length; i += 1){
			var currentSourceData = textSources[i];
			
			var res = currentSourceData.id.search("textnor_");
			if(res == 0){
				continue;
			}
	
			var currentSource = currentSourceData.source;
			currentSavingAsset = {
				ty: 3,
				id: currentSourceData.id,
				nm: currentSourceData.name,
				io: currentSourceData.io
			}
			
			assets.push(currentSavingAsset);
		}
	}
	
	function searchText(name){
		for(i = 0; i < textSources.length; i += 1){
			var data = textSources[i];
			if(data.name == name ){
				return {id:data.id,t:data.t};
			}
		}
		return "";		
	}
	
    function addFont(fontName, fontFamily, fontStyle,fontLocation) {
        var i = 0, len = fonts.length;
        while (i < len) {
            
            if (fonts[i].name == fontName && fonts[i].family == fontFamily && fonts[i].style == fontStyle) {
                return;
            }
            i += 1;
        }
        fonts.push({
            name: fontName,
            family: fontFamily,
            style: fontStyle,
            location: fontLocation
        }
                  );
    }
    
    function getFonts() {
        return fonts;
    }
    
    function reset() {
        compSources.length = 0;
        imageSources.length = 0;
        psdImageSources.length = 0;
        audioSources.length = 0;
        videoSources.length = 0;
        textSources.length = 0;
        sequenceSources.length = 0;
        sequenceSourcesStills.length = 0;
        fonts.length = 0;
        imageCount = 0;
        audioCount = 0;
        videoCount = 0;
        textCount = 0;
        sequenceCount = 0;
        sequenceSourcesStillsCount = 0;
        imageName = 0;
    }
    
    return {
        imageProcessed: imageProcessed,
        checkCompSource: checkCompSource,
        checkImageSource: checkImageSource,
        searchSequenceSource: searchSequenceSource,
        addSequenceSource: addSequenceSource,
        addImageSequenceStills: addImageSequenceStills,
        getSequenceSourceBySource: getSequenceSourceBySource,
        checkVideoSource: checkVideoSource,
        checkAudioSource: checkAudioSource,
        checkTextSource: checkTextSource,
        setCompSourceId: setCompSourceId,
        exportImages : exportImages,
        exportVideos : exportVideos,
        exportAudios : exportAudios,
        exportTexts : exportTexts,
        addFont : addFont,
        getFonts : getFonts,
        searchText : searchText,
        reset: reset
    };
    
}());