/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

/*
 * jimShapes: provides all the variables and functions necessary to build all the shapes out of Prototyper specifications (ellipses, triangles, callouts, etc.)
 */

(function(window, undefined) {
    var jimShapes = {
        "code" : "SVG",

        //this method takes the current CSS style of shapeSVG. @style argument must be provided because some style attributes cannot be retrieved from CSS (size, padding, etc).
        //@style must provide with:
             // - width
             // - height
             // - top
             // - left
             // - border-top-width
             // - padding-top, padding-bottom, padding-left, padding-right
             // - opacity
             // - position
             // - transform
        "updateStyle" : function(shapeSVG, style, shapePath) {
            if(this.code === "SVG"){
                SVGEngine.updateStyle(shapeSVG,style,shapePath,false);
            }
        },

        "renderAll" : function(shapes) {
            shapes.each(function(evt) {
                SVGEngine.createSVGShape($(this));
            });
        }
    }

    window.jimShapes = jimShapes;

    function cloneElement(origin, target) {
        //$(origin).removeClass("non-processed-shape");
        if(this.code === "SVG"){
            $(target).attr("class", origin.prop("className"));
        }
        $(target).attr("id", origin.prop("id"));
        $(target).attr("title", origin.prop("title"));
    }

    function getEventClasses(shape) {
          //get child content
          var allClasses = $(shape).attr("class");
          var allClassesArray = allClasses.split(" ");
          var eventClasses = [];
          for(var i=0; i<allClassesArray.length;i++){
              if($.inArray(allClassesArray[i],jimUtil.eventTypes)!= -1){
                  eventClasses.push(allClassesArray[i]);
              }
          }
          return eventClasses.toString().replace(/\,/g, ' ');
    }


    $.fn.shapeStyle = function(property){
        //first check special properties stored in css2svg
        if(this[0].css2svg && jimUtil.exists(this[0].css2svg[property]))
            return this[0].css2svg[property];
        else{
        	if(property == "width" || property == "height" || property == "top" || property == "left" || property == "transform"){
				var wrapper = this.closest(".shapewrapper");
				if (property == "transform")
					wrapper.jimForceVisibility();
				
        		var res = wrapper.css(property);
        		if (property !== "transform")
        			res = parseInt(res);
				
				if (property == "transform")
					wrapper.jimUndoVisibility();
				
        		this[0].css2svg[property] = res;
        		return res;
        	}
        	else if(property == "background-color" || property == "background-gradient"){
        		var lookupProperty = property;
        		if(property == "background-gradient")
        			lookupProperty = "background-image";
        		var res = this.closest(".shapewrapper").children(".backgroundLayer").children(".colorLayer").css(lookupProperty);
        		return res;
        	}
        	else if(property == "background-image" || property == "background-repeat" || property == "background-size" || property == "background-position" || property == "background-image-opacity"){
        		var lookupProperty = property;
        		if(property == "background-image-opacity")
        			lookupProperty = "opacity";
        		var res = this.closest(".shapewrapper").children(".backgroundLayer").children(".imageLayer").css(lookupProperty);
        		return res; 
        	}

            return this.css(property);
        }
    }

    var SVGEngine = {
        "defaults" : {
            "svgNS" : "http://www.w3.org/2000/svg",
            "svgDashed" : 3
        },

    "createSVGShape" : function($shape) {
        var $mainDiv = $shape.closest(".shapewrapper");
        var mainDiv = $mainDiv[0];
            var svg = $shape.closest("svg")[0];
            var shapeSVG = $shape[0];
            shapeSVG.svg = svg;
            shapeSVG.shapewrapper = mainDiv;
            if($shape.is(".line"))
            	shapeSVG.shapeType = "line";
            else if($shape.is(".ellipse"))
            	shapeSVG.shapeType = "ellipse";
            else if($shape.is(".triangle"))
            	shapeSVG.shapeType = "triangle";
            else if($shape.is(".callout"))
            	shapeSVG.shapeType = "callout";

            var $paddingLayer = $(mainDiv).find(".paddingLayer");

            var wrapperWidth = parseInt($mainDiv.attr("datasizewidthpx"));
            var wrapperHeight = parseInt($mainDiv.attr("datasizeheightpx"));
            shapeSVG.svg.style["width"] = wrapperWidth;
            shapeSVG.svg.style["height"] = wrapperHeight;

                //css2svg stores all the CSS properties of SVG elements that cannot be retrieved from CSS
                shapeSVG.css2svg = {
                    "border-width": parseInt($(shapeSVG).css("stroke-width")) / 2,
                    "padding-top" : parseInt($(shapeSVG).css("padding-top")),
                    "padding-bottom" : parseInt($(shapeSVG).css("padding-bottom")),
                    "padding-left" : parseInt($(shapeSVG).css("padding-left")) ,
                    "original-padding-right" : parseInt($(shapeSVG).css("padding-right")),
                    "original-padding-top" : parseInt($(shapeSVG).css("padding-top")),
                    "original-padding-bottom" : parseInt($(shapeSVG).css("padding-bottom")),
                    "original-padding-left" : parseInt($(shapeSVG).css("padding-left")) ,
                    "padding-left" : parseInt($(shapeSVG).css("padding-left")) ,
                    "padding-right" : parseInt($(shapeSVG).css("padding-right")),
                    "margin-top": parseInt($(shapeSVG).css("margin-top")),
                    "margin-bottom": parseInt($(shapeSVG).css("margin-bottom")),
                    "margin-left": parseInt($(shapeSVG).css("margin-left")),
                    "margin-right": parseInt($(shapeSVG).css("margin-right")),
                    "original-path": $shape.attr("d"),
                    "original-width":  wrapperWidth,  //border & padding included / margin not included
                    "original-height": wrapperHeight, //border & padding included / margin not included
                    "text-min-height": 0,
                    "textbox-top":parseInt($paddingLayer.css("top")),//this value is fixed shouldn't change during simulation
                    "textbox-bottom":parseInt($paddingLayer.css("bottom")),//this value is fixed shouldn't change during simulation
                    "textbox-left":parseInt($paddingLayer.css("left")),//this value is fixed shouldn't change during simulation
                    "textbox-right":parseInt($paddingLayer.css("right")),//this value is fixed shouldn't change during simulation
                    "non-textbox-width": parseInt($paddingLayer.css("left"))+ parseInt($paddingLayer.css("right")),//this value is fixed shouldn't change during simulation
                    "non-textbox-height": parseInt($paddingLayer.css("top"))+ parseInt($paddingLayer.css("bottom"))//this value is fixed shouldn't change during simulation
                }

                //move classes to wrapper
                var manualfitClass = $shape.is(".manualfit")?" manualfit":"";
                var autofitClass = $shape.is(".autofit")?" autofit":"";
                var hiddenClass = $shape.is(".hidden")?" hidden":"";
                var percentageClass = $shape.is(".percentage")?" percentage":"";
                var nonProcessedPercentageClass = $shape.is(".non-processed-percentage")?" non-processed-percentage":"";
                this.removeSVGClass($shape, "autofit");
                this.removeSVGClass($shape, "manualfit");
                this.removeSVGClass($shape, "hidden");
                this.removeSVGClass($shape, "percentage");
                var pinClasses = "";
                if($shape.is(".pin")){
                	pinClasses = " pin non-processed-pin";
                	this.removeSVGClass($shape, "pin");
                	this.removeSVGClass($shape, "non-processed-pin");
	                var classList = $shape.attr('class').split(/\s+/);
	                $.each(classList, function(index, item) {
	                    if (item.startsWith("vpin") || item.startsWith("hpin")) {
	                        pinClasses += " "+item;
	                        SVGEngine.removeSVGClass($shape, item);
	                    }
	                });
                }
                var allClasses = $(mainDiv).attr("class");
                $(mainDiv).attr("class", allClasses+manualfitClass+autofitClass+percentageClass+nonProcessedPercentageClass+pinClasses+hiddenClass);
				        $(mainDiv).data("width", $shape.data('width'));
                $(mainDiv).data("widthUnit", $shape.data('widthUnit'));
                $(mainDiv).data("oldWidthUnit", $(mainDiv).data('widthUnit')); // TODO check
                $(mainDiv).data("height", $shape.data('height'));
                $(mainDiv).data("heightUnit", $shape.data('heightUnit'));
                $(mainDiv).data("oldHeightUnit", $(mainDiv).data('heightUnit'));
                $(mainDiv).data("offsetX", $shape.data('offsetX'));
                $(mainDiv).data("offsetY", $shape.data('offsetY'));

                this.removeSVGClass($shape, "non-processed-shape");
                this.updateMargin(shapeSVG);

                var style = undefined;
                if(!$shape.is(".line")){
                  style = {
                      "attributes" : {
                          "width" : $(mainDiv).is(".autofit") ? "auto" : parseInt(shapeSVG.css2svg["original-width"]),
                          "min-height" : $(mainDiv).is(".autofit") ? 0 : parseInt($(shapeSVG).css("min-height"))
                  }};
                }else {
                  shapeSVG.svg.style["height"] = parseInt(shapeSVG.css2svg["original-height"]);
                }
                var shapePath = $shape.attr("d");
                //UPDATE SHAPE FROM CSS and Style
                this.updateStyle(shapeSVG, style, shapePath, true);

            return shapeSVG;
        },

        "isPath" : function(shapeSVG) {
            return shapeSVG.shapeType==="triangle" || shapeSVG.shapeType==="callout";
        },

         // saves styles that cannot be retrieved from CSS style sheet
        "translateCSSChanges" : function(shapeSVG, style) {
            var newWidth, newHeight;
            //check border width
            if (style.attributes) {
                if (style.attributes['stroke-width'] != null) {
                    this._setBorderWidth(shapeSVG, parseInt(style.attributes['stroke-width']));
                }
                if (style.attributes['top'] != null && style.attributes['left'] != null) {
                    this._setPosition(shapeSVG, parseInt(style.attributes['top']), parseInt(style.attributes['left']), style.attributes['position']);
                }
                if (style.attributes['width'] != null || style.attributes['min-height'] != null) {
                    //if($(shapeSVG).shapeStyle("width") != -1 && $(shapeSVG).shapeStyle("height") != -1){

                    //this should set width && minheight(if manual mode)
                  this._setSize(shapeSVG, parseInt(style.attributes['width']), parseInt(style.attributes['min-height']));
                  //init min text height
                  var nonTextboxSize = this.getNonTextboxSize(shapeSVG);
                  var borderTextPadding = this.getBorderTextPadding(shapeSVG);
                  var minTextHeight = parseInt($(shapeSVG).shapeStyle("min-height")) - parseInt($(shapeSVG).shapeStyle("padding-top")) - parseInt($(shapeSVG).shapeStyle("padding-bottom")) - nonTextboxSize.height -(borderTextPadding*2);
                  shapeSVG.css2svg["text-min-height"] = minTextHeight;
                }
                if (style.attributes['padding-top'] != null && style.attributes['padding-bottom'] != null && style.attributes['padding-left'] != null && style.attributes['padding-right'] != null) {
                    var padding = {
                        "top" : parseInt(style.attributes['padding-top']),
                        "bottom" : parseInt(style.attributes['padding-bottom']),
                        "left" : parseInt(style.attributes['padding-left']),
                        "right" : parseInt(style.attributes['padding-right'])
                    };
                    this._setPadding(shapeSVG, padding);
                    //this._setSize(shapeSVG, $(shapeSVG).shapeStyle("width")+padding.left + padding.right, $(shapeSVG).shapeStyle("height")+padding.top+padding.bottom);
                }
                if (style.attributes['margin-top'] != null && style.attributes['margin-bottom'] != null && style.attributes['margin-left'] != null && style.attributes['margin-right'] != null) {
                    var margin = {
                        "top" : parseInt(style.attributes['margin-top']),
                        "bottom" : parseInt(style.attributes['margin-bottom']),
                        "left" : parseInt(style.attributes['margin-left']),
                        "right" : parseInt(style.attributes['margin-right'])
                    };
                    this._setMargin(shapeSVG, margin);
                }
                if (style.attributes['-webkit-transform'] != null && style.attributes['-webkit-transform'] !== "none") {
                    this._setTransform(shapeSVG, style.attributes['-webkit-transform']);
                }
                if(style.attributes['z-index']){
                    this._setZIndex(shapeSVG, style.attributes['z-index']);
                }
                if(style.attributes['box-shadow']){
                    this._setBoxShadow(shapeSVG, style.attributes['box-shadow']);
                }
            }
            if (style.expressions) {
                if (style.expressions['width'] != null && style.expressions['height'] != null) {
                    newWidth = (isNaN(parseInt(style.expressions['width'], 10))) ? eval(style.expressions['width']) : style.expressions['width'];
                    newHeight = (isNaN(parseInt(style.expressions['height'], 10))) ? eval(style.expressions['height']) : style.expressions['height'];
                    //update values, needs old size and old text bounds
                  //  this._setTextBoxBounds(shapeSVG,{'width':$(shapeSVG).shapeStyle("width"), 'height':$(shapeSVG).shapeStyle("height")},{'width':newWidth, 'height':newHeight});
                    this._setSize(shapeSVG, parseInt(newWidth), parseInt(newHeight));
                }
            }
        },

    "updateStyle" : function(shapeSVG, style, shapePath, init) {
            if (style) {
        		    var oldSize;
                var oldFullTextBoxSize;
            	  if(init){
            		    oldSize = {"width":style.attributes["width"], "height":style.attributes["min-height"]}
                    oldFullTextBoxSize = {"width":style.attributes["width"], "height":style.attributes["min-height"]}
            	  }else{
        			       oldSize = {
                        "width" : $(shapeSVG).shapeStyle("width"),
                        "height" : $(shapeSVG).shapeStyle("height")
                    };
                    var $paddingLayer = $(shapeSVG.shapewrapper).children(".paddingLayer");
                    oldFullTextBoxSize = {
                       "width" : parseInt($paddingLayer.css("width"))+ parseInt(shapeSVG.css2svg['original-padding-left']) + parseInt(shapeSVG.css2svg['original-padding-right']) +(this.getBorderTextPadding(shapeSVG)*2),
                       "height" : parseInt($paddingLayer.css("height"))+ parseInt(shapeSVG.css2svg['original-padding-top']) + parseInt(shapeSVG.css2svg['original-padding-bottom']) +(this.getBorderTextPadding(shapeSVG)*2)
                   };
            	  }
                //translate changes in CSS
                SVGEngine.translateCSSChanges(shapeSVG, style);
                //end translate

                //RESPECT STYLE ORDER UPDATE
                //UPDATE BORDER may change size
                if(shapeSVG.shapeType === 'line')
                	SVGEngine.updateBorder(shapeSVG);
                if (style.attributes) {
                    //UPDATE POSITION
                    if (style.attributes["top"] != null || style.attributes["left"] != null)
                        SVGEngine.updatePosition(shapeSVG);

                    if(style.attributes["stroke-width"]){
                        $(shapeSVG).css("stroke-width",parseInt(style.attributes["stroke-width"]));
                        shapeSVG.css2svg['border-width'] = parseInt(style.attributes["stroke-width"])/2;
                    }


                }
                //UPDATE SIZE (width, height, paddings ...)$(mainDiv).is(".autofit") ?
                //if ((style.attributes && (style.attributes["width"] != null || style.attributes["height"] != null)) || style.expressions) {
                SVGEngine.updateSize(shapeSVG,oldFullTextBoxSize,init);
                //}
            }

        	  if(shapeSVG.shapeType === "line"){
				         SVGEngine.updateLine(shapeSVG, shapePath, style);
         	  }
            if(!init || shapeSVG.shapeType !== "line"){
            	//UPDATE TRANSFORM (rotation)
            	SVGEngine._updateTransform(shapeSVG);
            	if (style.attributes["margin-top"] != null || style.attributes["margin-bottom"] != null || style.attributes["margin-left"] != null || style.attributes["margin-right"] != null)
	                //UPDATE MARGIN
	                SVGEngine.updateMargin(shapeSVG);
              //UPDATE SHAPE PATH
        		  SVGEngine.updateShape(shapeSVG, shapePath, oldSize);
            }
            if(init){
                //UPDATE ID's (for datagrids)
                SVGEngine.updateIDs(shapeSVG);
            }
            //UPDATE BACKGROUND
            SVGEngine.updateBackground(shapeSVG);
        },
        "updateLine" : function(shapeSVG, shapePath, style){
			if(style)
        		shapeSVG.setAttribute("d", SVGEngine._getLinePathClipped(shapeSVG,shapePath));
            //update MARKERS
			//TODO should be prebuild like path
            SVGEngine._updateMarkers(shapeSVG);
        },
        "updateIDs" : function(shapeSVG) {
        	var clippingPath;
            //create random id to avoid repeated clips (ej:datagrids)
            var random4Id = Math.round(Math.random() * 10000);
            var shapeId = $(shapeSVG).prop("id");
            var clipID = "clip-" + shapeId + random4Id;

            //clip object
            var $defs = $(shapeSVG.svg).children("defs");
            var $clipping = $defs.children("clipPath");

   	         switch (shapeSVG.shapeType) {
   	             case "ellipse":
   		             clippingPath = $clipping.children("ellipse")[0];
   		             break;
   	             case "triangle":
   	             case "callout":
   	             	 clippingPath = $clipping.children("path")[0];
   	                 break;
   	             case "line":
   	                 //markers id
   	                 var defs = $(shapeSVG.svg).children("defs");
   	                 var $startMarker = defs.children('[id^=start-marker]');
   	                 if($startMarker.length != 0){
   	                	var startMarkerId = "start-marker-" + shapeId + random4Id;
   	                	$startMarker.attr("id", startMarkerId);
   	                	shapeSVG.setAttribute("marker-start","url(#"+startMarkerId+")");
   	                 }
   	                 var $endMarker = defs.children('[id^=end-marker]');
   	                 if($endMarker.length != 0){
    	                var endMarkerId = "end-marker-" + shapeId + random4Id;
       	                $endMarker.attr("id", endMarkerId);
       	                shapeSVG.setAttribute("marker-end","url(#"+endMarkerId+")");
   	                 }
   	                 break;
   	             default:
   	                 break;
   	         }

   	         if (clippingPath) {
   	        	$clipping.attr("id", clipID);
                $(shapeSVG).parent("g")[0].setAttribute("clip-path", "url(#" + clipID + ")");
            }
        },
        "updateMargin" : function(shapeSVG) {
        	$(shapeSVG.shapewrapper).css("border-top-width",$(shapeSVG).shapeStyle("margin-top"));
        	$(shapeSVG.shapewrapper).css("border-bottom-width",$(shapeSVG).shapeStyle("margin-bottom"));
        	$(shapeSVG.shapewrapper).css("border-left-width",$(shapeSVG).shapeStyle("margin-left"));
        	$(shapeSVG.shapewrapper).css("border-right-width",$(shapeSVG).shapeStyle("margin-right"));
			$(shapeSVG.shapewrapper).css("border-style","solid");
			$(shapeSVG.shapewrapper).css("border-color","transparent");

        	// $(shapeSVG.svg).css("padding",$(shapeSVG.shapewrapper).css("border-width"));
        	$(shapeSVG.svg).css("margin","");

        	 // Update svg
        // 	SVGEngine._setComputedSize(shapeSVG,parseInt($(shapeSVG.shapewrapper).css("width")) ,parseInt($(shapeSVG.shapewrapper).css("height")));
        },
        "updateBackground" : function(shapeSVG) {
        	var backgroundColor=$(shapeSVG).shapeStyle('background-color');
            $(shapeSVG).css("fill", backgroundColor);
            
        	if(shapeSVG.shapeType === "line"){
        		return;
        	}
            
            var defsContent;
            var backgroundImg = $(shapeSVG).shapeStyle('background-image');
            var backgroundImgOpacity=$(shapeSVG).shapeStyle('background-image-opacity');
            var backgroundGradient = $(shapeSVG).shapeStyle('background-gradient');

            //delete current defs
            $(shapeSVG.svg).children("defs").children("pattern").remove();
            $(shapeSVG.svg).children("defs").children("linearGradient").remove();

            //create random id to avoid repeated patterns (ej:datagrids)
            var random4Id = Math.round(Math.random() * 10000);

            if(backgroundColor!=='transparent' && backgroundImg.match('url')!=null){
                var patternContainer = document.createElementNS(SVGEngine.defaults.svgNS, "pattern");
                patternContainer.setAttribute("id","svg-fill-pattern-" + $(shapeSVG).prop("id") + random4Id);
                patternContainer.setAttribute("patternUnits", "objectBoundingBox");
                patternContainer.setAttribute("height", 1);
                patternContainer.setAttribute("width", 1);
            }
            
            //background image
            if (backgroundImg && backgroundImg.match('url') != null){
            	var repeat = $(shapeSVG).shapeStyle('background-repeat');
                var bgSize = $(shapeSVG).shapeStyle('background-size');
                var bgPosition = $(shapeSVG).shapeStyle('background-position');
                var shapeSize = {
                	width : parseInt($(shapeSVG).shapeStyle("width")),
                    height : parseInt($(shapeSVG).shapeStyle("height"))
                };
                defsContent = this._getImagePattern(backgroundImg, repeat, bgPosition, bgSize, shapeSize);
                defsContent.setAttribute("id", "svg-fill-image-"+ $(shapeSVG).prop("id") + random4Id);
                
                if(patternContainer){
                	patternContainer.appendChild(defsContent);
                }
            }
            
            //gradient
            if(backgroundGradient && backgroundGradient.match('gradient') != null){
	            /*if (backgroundGradient.match('-moz-linear-gradient') != null ) {
	            	//moz gradient
	            	defsContent = this._getMozGradient(backgroundGradient);
	            	defsContent.setAttribute("id", "svg-fill-gradient-"+ $(shapeSVG).prop("id") + random4Id);
	            } else if (backgroundGradient.match('-webkit-gradient') != null) {
	                //webkit gradient
	                defsContent = this._getWebkitGradient(backgroundGradient);
	                defsContent.setAttribute("id", "svg-fill-gradient-"+ $(shapeSVG).prop("id") + random4Id);
	            } else if*/
				if (backgroundGradient.match("linear-gradient") || backgroundGradient.match("radial-gradient")){
	                //final proposed draft
	                defsContent = this._getStandardGradient(backgroundGradient, parseInt($(shapeSVG).shapeStyle("width")), parseInt($(shapeSVG).shapeStyle("height")));
	                defsContent.setAttribute("id", "svg-fill-gradient-"+ $(shapeSVG).prop("id") + random4Id);
	             }
	             if(patternContainer){
	            	 patternContainer.appendChild(defsContent);
	             }
            }

            var $defsObj = $(shapeSVG.svg).children("defs");
            if(patternContainer){
                $defsObj.append(patternContainer);
                var shapeColorOrGradient = $(shapeSVG).clone().get(0);
                shapeColorOrGradient.attributes.removeNamedItem("id");
                shapeColorOrGradient.attributes.removeNamedItem("class");
                if(shapeColorOrGradient.attributes.getNamedItem("style")!=null)
                	shapeColorOrGradient.attributes.removeNamedItem("style");

                var shapeImage = $(shapeSVG).clone().get(0);
                shapeImage.attributes.removeNamedItem("id");
                shapeImage.attributes.removeNamedItem("class");
                if(shapeImage.attributes.getNamedItem("style")!=null)
                	shapeImage.attributes.removeNamedItem("style");

                if(backgroundColor!=='transparent' && backgroundGradient.match('gradient')==null){
                	jQuery(shapeColorOrGradient).css("fill", backgroundColor);
                }else{
                	jQuery(shapeColorOrGradient).css("fill", "url(#svg-fill-gradient-" + $(shapeSVG).prop("id") + random4Id + ")");
                }
                jQuery(shapeImage).css("fill", "url(#svg-fill-image-" + $(shapeSVG).prop("id") + random4Id + ")");
                jQuery(shapeImage).css("fill-opacity",backgroundImgOpacity);

                if(backgroundColor==='transparent' || backgroundColor=='undefined'){
                    jQuery(shapeColorOrGradient).css("fill-opacity","0");
                }
                else{
                	jQuery(shapeColorOrGradient).css("fill-opacity","1");
                }

                patternContainer.appendChild(shapeColorOrGradient);
                patternContainer.appendChild(shapeImage);

                jQuery(shapeSVG).css("fill", "url(#" + patternContainer.getAttribute("id") + ")");
            } else if (defsContent != null) {
                defsContent.setAttribute("id", "svg-fill-" + $(shapeSVG).prop("id") + random4Id);
                //delete current defs
                $(shapeSVG.svg).children("defs").children("pattern").remove();
                $(shapeSVG.svg).children("defs").children("linearGradient").remove();
                $defsObj.append(defsContent);
                jQuery(shapeSVG).css("fill", "url(#" + defsContent.getAttribute("id") + ")");
            }
        },

        "_setBorderWidth" : function(shapeSVG, borderWidth) {
            shapeSVG.css2svg["stroke-width"] = borderWidth;
        },

        "updateBorder" : function(shapeSVG) {
              //update markers color
              SVGEngine._updateColorMarkers(shapeSVG);
        },
        "_setSize" : function(shapeSVG, width, minheight) {
            if(jimUtil.exists(width) && (width==="auto" || !isNaN(width)))
                shapeSVG.css2svg["width"] = width;
            if(jimUtil.exists(minheight) && !isNaN(minheight))
                shapeSVG.css2svg["min-height"] = minheight;
            shapeSVG.css2svg["height"] = "auto";
        },
        "_setComputedSize" : function(shapeSVG, width, height) {
            if(jimUtil.exists(width) && !isNaN(width))
                shapeSVG.css2svg["width"] = width;
            if(jimUtil.exists(height) && !isNaN(height))
                shapeSVG.css2svg["height"] = height;
        },

        "updateSize" : function(shapeSVG,oldSize,init) {
            var shapeWidth = $(shapeSVG).shapeStyle("width"),
            shapeHeight = $(shapeSVG).shapeStyle("height"),
            shapeMinHeight = $(shapeSVG).shapeStyle("min-height");


            if(shapeSVG.shapeType === "line"){
                //border width is height + arrows
            	shapeHeight = SVGEngine._getLineHeight(shapeSVG);
                $(shapeSVG.svg).css("width",  shapeWidth);
                $(shapeSVG.svg).css("height", shapeHeight);
                $(shapeSVG.shapewrapper).css("width", shapeWidth);
                $(shapeSVG.shapewrapper).css("height", shapeHeight);
            }else {
              $(shapeSVG.shapewrapper).css("width", shapeWidth);//needed to compute text pref height correctly
              $(shapeSVG.shapewrapper).css("height", shapeHeight);//needed to compute text pref height correctly
              $(shapeSVG.shapewrapper).css("min-height", shapeMinHeight);//needed to compute text pref height correctly
              var $paddingLayer = $(shapeSVG.shapewrapper).children(".paddingLayer");
              var nonTextboxSize = this.getNonTextboxSize(shapeSVG); //callout tail size  (0 for other shapes)
              var borderTextPadding = this.getBorderTextPadding(shapeSVG);
            //  var minTextHeight = shapeMinHeight - parseInt($(shapeSVG).shapeStyle("padding-top")) - parseInt($(shapeSVG).shapeStyle("padding-bottom")) - nonTextboxSize.height -(borderTextPadding*2);
              var minTextHeight = $(shapeSVG).shapeStyle("text-min-height");
              $paddingLayer.css("height", minTextHeight);//needed to compute text pref height correctly
              var textboxSize = this.updateTextboxSize(shapeSVG, shapeWidth, minTextHeight);

              shapeWidth= textboxSize.width+parseInt($(shapeSVG).shapeStyle("padding-left")) + parseInt($(shapeSVG).shapeStyle("padding-right")) + (borderTextPadding*2);
              shapeHeight= textboxSize.height+parseInt($(shapeSVG).shapeStyle("padding-top")) + parseInt($(shapeSVG).shapeStyle("padding-bottom"))+ (borderTextPadding*2);



              var newNonTextboxWidth = init ? nonTextboxSize.width : ((shapeWidth / oldSize.width)*nonTextboxSize.width);
              var newNonTextboxHeight = init ? nonTextboxSize.height : ((shapeHeight / oldSize.height)*nonTextboxSize.height);
              if(!isNaN(newNonTextboxWidth)){
                shapeWidth+= newNonTextboxWidth;

                if(shapeSVG.css2svg["textbox-right"]>0)
                  shapeSVG.css2svg["textbox-right"] = newNonTextboxWidth;
                else
                  shapeSVG.css2svg["textbox-left"] = newNonTextboxWidth;
                shapeSVG.css2svg["non-textbox-width"] = newNonTextboxWidth;
              }
              if(!isNaN(newNonTextboxHeight)){
                  shapeHeight+= newNonTextboxHeight;
                  if(shapeSVG.css2svg["textbox-bottom"]>0)
                    shapeSVG.css2svg["textbox-bottom"] = newNonTextboxHeight;
                  else
                    shapeSVG.css2svg["textbox-top"] = newNonTextboxHeight;

                  shapeSVG.css2svg["non-textbox-height"] = newNonTextboxHeight;
              }

              var textBoxLeft = shapeSVG.css2svg["textbox-left"];
              var textBoxRight = shapeSVG.css2svg["textbox-right"];
              var textBoxTop = shapeSVG.css2svg["textbox-top"];
              var textBoxBottom = shapeSVG.css2svg["textbox-bottom"];

              if(textBoxRight>0){
                $paddingLayer.css("left","initial");
                $paddingLayer.css("right",textBoxRight+parseInt($(shapeSVG).shapeStyle("padding-right"))+borderTextPadding);
              }else{
                $paddingLayer.css("right","initial");
                $paddingLayer.css("left",textBoxLeft+parseInt($(shapeSVG).shapeStyle("padding-left"))+borderTextPadding);
              }

              if(textBoxBottom>0){
                $paddingLayer.css("top","initial");
                $paddingLayer.css("bottom",textBoxBottom+parseInt($(shapeSVG).shapeStyle("padding-bottom"))+borderTextPadding);
              }else{
                $paddingLayer.css("bottom","initial");
                $paddingLayer.css("top",textBoxTop+parseInt($(shapeSVG).shapeStyle("padding-top"))+borderTextPadding);
              }
            }

            SVGEngine._setComputedSize(shapeSVG,shapeWidth,shapeHeight);
            //set viewBox
            $(shapeSVG.shapewrapper).css("width", shapeWidth);
            $(shapeSVG.shapewrapper).css("height", shapeHeight);

            $(shapeSVG.svg).css("width", shapeWidth);
            $(shapeSVG.svg).css("height", shapeHeight);

            //TODO update original-width & original-height if its initial updateSize (textbox recompute could change the size obtained from generation)

            //re-layout
            this._updateSVGBox(shapeSVG, shapeWidth, shapeHeight);

            if($(shapeSVG.shapewrapper).is(".autofit")) {
            	jimResponsive.setNewHeight($(shapeSVG.shapewrapper), shapeHeight, "px");
            }
        },

        "_setPosition" : function(shapeSVG, top, left, position) {
            shapeSVG.css2svg["top"] = top;
            shapeSVG.css2svg["left"] = left;
            shapeSVG.css2svg["position"] = position;
        },

        "updatePosition" : function(shapeSVG) {
            //change svg wrapper position
            $(shapeSVG.shapewrapper).css("position", $(shapeSVG).shapeStyle("position"));
            $(shapeSVG.shapewrapper).css("left", parseInt($(shapeSVG).shapeStyle("left")) + "px");
            $(shapeSVG.shapewrapper).css("top", parseInt($(shapeSVG).shapeStyle("top")) + "px");
        },
        "_setPadding" : function(shapeSVG, padding) {
            shapeSVG.css2svg["padding-top"] = padding.top;
            shapeSVG.css2svg["padding-bottom"] = padding.bottom;
            shapeSVG.css2svg["padding-left"] = padding.left;
            shapeSVG.css2svg["padding-right"] = padding.right;
            shapeSVG.css2svg["original-padding-top"] = padding.top;
            shapeSVG.css2svg["original-padding-bottom"] = padding.bottom;
            shapeSVG.css2svg["original-padding-left"] = padding.left;
            shapeSVG.css2svg["original-padding-right"] = padding.right;
        },

        "_setMargin" : function(shapeSVG, margin) {
            shapeSVG.css2svg["margin-top"] = margin.top;
            shapeSVG.css2svg["margin-bottom"] = margin.bottom;
            shapeSVG.css2svg["margin-left"] = margin.left;
            shapeSVG.css2svg["margin-right"] = margin.right;
        },
        "getBorderTextPadding" : function(shapeSVG) {
          if(shapeSVG.shapeType==="callout")
            return parseInt($(shapeSVG).shapeStyle("border-width"));
          return 0;
        },
        "getNonTextboxSize": function(shapeSVG) {
            return {
                "width" : shapeSVG.css2svg["non-textbox-width"] ,
                "height" : shapeSVG.css2svg["non-textbox-height"]
              };
        },
        "updateTextboxSize" : function(shapeSVG, shapeNewWidth, textMinHeight) {
            //set global text attributes: line-height
            var $paddingLayer = $(shapeSVG.shapewrapper).children(".paddingLayer");
            var $content = $(shapeSVG.shapewrapper).find(".content");
            var $shapertContentSpan = $content.find("span");
            if($shapertContentSpan.length>0 && $shapertContentSpan.text().length>0)
            	$content.css("font-size", $shapertContentSpan.shapeStyle("font-size"));

            var textSize = this.calculateTextPrefSize(shapeSVG,shapeNewWidth);
            var borderTextPadding = this.getBorderTextPadding(shapeSVG); //returns border size for callouts, 0 otherwise

            var textBoxLeft = shapeSVG.css2svg["textbox-left"];
            var textBoxRight = shapeSVG.css2svg["textbox-right"];
            var textBoxTop = shapeSVG.css2svg["textbox-top"];
            var textBoxBottom = shapeSVG.css2svg["textbox-bottom"];

            if(textBoxRight>0){
              $paddingLayer.css("left","initial");
              $paddingLayer.css("right",textBoxRight+parseInt($(shapeSVG).shapeStyle("padding-right"))+borderTextPadding);
            }else{
              $paddingLayer.css("right","initial");
              $paddingLayer.css("left",textBoxLeft+parseInt($(shapeSVG).shapeStyle("padding-left"))+borderTextPadding);
            }

            if(textBoxBottom>0){
              $paddingLayer.css("top","initial");
              $paddingLayer.css("bottom",textBoxBottom+parseInt($(shapeSVG).shapeStyle("padding-bottom"))+borderTextPadding);
            }else{
              $paddingLayer.css("bottom","initial");
              $paddingLayer.css("top",textBoxTop+parseInt($(shapeSVG).shapeStyle("padding-top"))+borderTextPadding);
            }

            //move this code to init & updatemargin
            $paddingLayer.css("margin-top",parseInt($(shapeSVG).shapeStyle("margin-top")));
            $paddingLayer.css("margin-bottom",parseInt($(shapeSVG).shapeStyle("margin-bottom")));
            $paddingLayer.css("margin-left",parseInt($(shapeSVG).shapeStyle("margin-left")));
            $paddingLayer.css("margin-right",parseInt($(shapeSVG).shapeStyle("margin-right")));

            var textboxWidth =  textSize.width;
            var textboxHeight = Math.max(textMinHeight, textSize.height);
            $paddingLayer.css("width", textboxWidth);
            $paddingLayer.css("height", textboxHeight);

            //set display table again for Safari bug
            $content.css("display","");

            return {
                "width" : textboxWidth,
                "height" : textboxHeight
              };
        },
        "calculateTextPrefSize" : function(shapeSVG, shapeNewWidth) {
            var textWidth;
            if($(shapeSVG.shapewrapper).is(".autofit")) {
              textWidth = this.calculateTextPrefWidth(shapeSVG);
            }else{
              var nonTextboxSize = this.getNonTextboxSize(shapeSVG); //callout tail size  (0 for other shapes)
              textWidth = parseInt(shapeNewWidth) - parseInt($(shapeSVG).shapeStyle("padding-left")) - parseInt($(shapeSVG).shapeStyle("padding-right")) - nonTextboxSize.width - (this.getBorderTextPadding(shapeSVG)*2);
            }
            var $paddingLayer = $(shapeSVG.shapewrapper).children(".paddingLayer");
            $paddingLayer.css("width", textWidth);//needed to compute text pref height correctly

            return {
                "width" : textWidth,
                "height" : this.calculateTextPrefHeight(shapeSVG)
              };
        },
        "calculateTextPrefWidth" : function(shapeSVG) {
          var minX=0,maxX=0;
          var t,tLen,spans,span;
          var $content = $(shapeSVG.shapewrapper).find(".content");
        //  return parseInt($content.css("width"));
          var spans = $content.find("span");

          for(t=0, tLen=spans.length; t<tLen; t+=1) {
           span = spans[t];
           var bounds = span.getBoundingClientRect();
            maxX = Math.max(maxX,parseInt(bounds.right));
            if(t==0)
              minX = parseInt(bounds.left);
            else
              minX = Math.min(minX,parseInt(bounds.left));
          }

          return maxX-minX;
        },
        "calculateTextPrefHeight" : function(shapeSVG) {
          var minY=0,maxY=0;
          var t,tLen,spans,span;
          var $content = $(shapeSVG.shapewrapper).find(".content");
          var spans = $content.find("span");
          for(t=0, tLen=spans.length; t<tLen; t+=1) {
            span = spans[t];
            var bounds = span.getBoundingClientRect();
            maxY = Math.max(maxY,parseInt(bounds.bottom));
            if(t==0) {
              minY = parseInt(bounds.top);
			  maxY = parseInt(bounds.bottom);
            } else
              minY = Math.min(minY,parseInt(bounds.top));
          }
          return maxY-minY;
        },
        "_setTransform" : function(shapeSVG, transform) {
            shapeSVG.css2svg["transform"] = transform;
        },

        "_updateTransform" : function(shapeSVG) {
            //$(shapeSVG.shapewrapper).css("transform", $(shapeSVG).shapeStyle('transform'));
            $(shapeSVG).css("transform",'rotate(0deg)');
            $(shapeSVG).css("-webkit-transform",'rotate(0deg)');
        },

      /*  "_setTextBoxBounds" : function(shapeSVG,  newSize){
            if(jimUtil.exists(newSize.width) && jimUtil.exists(newSize.height)){
                shapeSVG.css2svg["text-top"] = (parseInt(newSize.height) * parseInt( shapeSVG.css2svg["original-text-top"]))/ parseInt(oldSize.height);
                shapeSVG.css2svg["text-left"] = (parseInt(newSize.width) * parseInt( shapeSVG.css2svg["original-text-left"]))/ parseInt(oldSize.width);
                shapeSVG.css2svg["text-width"] = (parseInt(newSize.width) * parseInt( shapeSVG.css2svg["original-text-width"]))/ parseInt(oldSize.width);
                shapeSVG.css2svg["text-height"] = (parseInt(newSize.height) * parseInt( shapeSVG.css2svg["original-text-height"]))/ parseInt(oldSize.height);
            }
        },*/

        "_setZIndex" : function(shapeSVG, index) {
            shapeSVG.css2svg["z-index"] = index;
        },

        "updateZIndex" : function(shapeSVG) {
            $(shapeSVG.shapewrapper).css("z-index", $(shapeSVG).shapeStyle("z-index"));
        },

        "_setBoxShadow" : function(shapeSVG, shadow) {
            shapeSVG.css2svg["box-shadow"] = shadow;
        },

        "_updateSVGBox" : function(shapeSVG, width, height) {
            $(shapeSVG.svg).css("width", width);
            $(shapeSVG.svg).css("height", height);
        },

        "updateShape" : function(shapeSVG, shapePath, oldSize) {
         var clippingPath,size;

         //create clip object
         var $defs = $(shapeSVG.svg).children("defs");
         var $clipping = $defs.children("clipPath");


	         switch (shapeSVG.shapeType) {
	             case "ellipse":
	             	 size = {
	             		"width" : $(shapeSVG).shapeStyle("width"),
	             		"height" : $(shapeSVG).shapeStyle("height")
	                 };
		             var rx = (size.width / 2), ry = (size.height / 2), cx = rx, cy = ry;

		             shapeSVG.setAttribute("cx", cx);
		             shapeSVG.setAttribute("cy", cy);
		             shapeSVG.setAttribute("rx", Math.max(0,rx));
		             shapeSVG.setAttribute("ry", Math.max(0,ry));

		             clippingPath = $clipping.children("ellipse")[0];
		             clippingPath.setAttribute("cx", cx);
		             clippingPath.setAttribute("cy", cy);
		             clippingPath.setAttribute("rx", Math.max(0,rx));
		             clippingPath.setAttribute("ry", Math.max(0,ry));
		             break;
	             case "triangle":
	             case "callout":
	            	 size = {
	             	 	"width" : $(shapeSVG).shapeStyle("width"),
	             	 	"height" : $(shapeSVG).shapeStyle("height")
	             	 };
	             	 clippingPath = $clipping.children("path")[0];
	                 if (shapePath) {
	                     var newPath = SVGEngine._getScaledPath(shapeSVG.css2svg["original-path"], {"width": shapeSVG.css2svg["original-width"],"height": shapeSVG.css2svg["original-height"]}, size, true);
						 shapeSVG.css2svg["original-width"] = size.width;
	                     shapeSVG.css2svg["original-height"] = size.height;
	                     shapeSVG.css2svg["original-path"] = newPath;
	                     clippingPath.setAttribute("d", newPath);
	                     shapeSVG.setAttribute("d", newPath);
	                 } else if (oldSize) {
	                     //check size change
	                     var newPath = SVGEngine._getScaledPath(shapeSVG.css2svg["original-path"], {"width": shapeSVG.css2svg["original-width"],"height": shapeSVG.css2svg["original-height"]}, size, true);
	                     clippingPath.setAttribute("d", newPath);
	                     shapeSVG.setAttribute("d", newPath);
	                 }
	                 break;
	             default:
	                 break;
	         }
     },

         "_updateMarkers" : function(shapeSVG) {
			var startMarker = $(shapeSVG).is(".sMarker");
			var endMarker = $(shapeSVG).is(".eMarker");
			var borderWidth=0;
			if(startMarker || endMarker){
				 borderWidth = parseInt($(shapeSVG).shapeStyle("stroke-width"));
			}
            var markerWidth;
            //scale markers
			if(startMarker){
	            var $startMarker = $(shapeSVG.svg).children("defs").children('[id^=start-marker]');
	            if($startMarker.length != 0){
	                markerWidth = SVGEngine._getMarkerHeight($startMarker,borderWidth);
	                $startMarker[0].setAttribute("markerWidth",markerWidth+"px");
	                $startMarker[0].setAttribute("markerHeight",markerWidth+"px");
	                $startMarker[0].setAttribute("refX", parseInt((100 * (markerWidth - borderWidth)) / markerWidth));
	                $startMarker[0].setAttribute("refY","50");
	            }
			}

			if(endMarker){
	            var $endMarker = $(shapeSVG.svg).children("defs").children('[id^=end-marker]');
	            if($endMarker.length != 0){
	                markerWidth = SVGEngine._getMarkerHeight($endMarker,borderWidth);
	                $endMarker[0].setAttribute("markerWidth",markerWidth+"px");
	                $endMarker[0].setAttribute("markerHeight",markerWidth+"px");
	                $endMarker[0].setAttribute("refX",parseInt((100 * (markerWidth - borderWidth)) / markerWidth));
	                $endMarker[0].setAttribute("refY","50");
	            }
			}
         },

         "_updateColorMarkers" : function(shapeSVG) {
            var $startMarker = $(shapeSVG.svg).children("defs").children('[id^=start-marker]');
            if($startMarker.length != 0){
                $startMarker.css('fill',$(shapeSVG).shapeStyle('stroke'));
            }
            var $endMarker = $(shapeSVG.svg).children("defs").children('[id^=end-marker]');
            if($endMarker.length != 0){
                $endMarker.css('fill',$(shapeSVG).shapeStyle('stroke'));
            }
         },

         "_getLinePathClipped" : function(shapeSVG, path) {
             var width = parseInt($(shapeSVG).shapeStyle("width")),
             height = parseInt($(shapeSVG).shapeStyle("height")),
             lineWidth = parseInt($(shapeSVG).shapeStyle("stroke-width")),
             leftClipping = 0,
             rightClipping = width;

             if($(shapeSVG).is(".sMarker")){
				var $startMarker = jQuery(shapeSVG.shapewrapper).find(".startmarker");
				if($startMarker.length > 0 && !$startMarker.is(".none"))
                	leftClipping = lineWidth;
			}
			if($(shapeSVG).is(".eMarker")){
			  	var $endMarker = jQuery(shapeSVG.shapewrapper).find(".endmarker");
             	if($endMarker.length > 0 && !$endMarker.is(".none"))
                	rightClipping = width - lineWidth;
			}

              return "M "+ leftClipping + " " + parseInt(height/2) +" L "+ rightClipping + " " + parseInt(height/2);
         },

         "_getLineMarkerPath" : function(markerType) {
             if(markerType === 'block')
                return "M 0 0 L 100 50 L 0 100 Z";
             else if (markerType === 'classic')
                return "M 100 50 L 0 0 L 31 50 L 0 100";
             else
                return "M 39.688716 40.466926 39.818418 60.051881 7.9118028 79.24773 C -6.6058565 88.636494 5.3977603 106.07944 19.844358 97.146562 L 99.610893 50.324254 21.53048 3.7613489 C 4.631474 -8.1505951 -6.7257532 14.353316 7.6523994 20.881971 Z";
         },

        "_getMozGradient" : function(background) {
            var sParams = background.substring(background.indexOf('(', 0) + 1, background.length - 1);
            var params = sParams.split(',');

            var pattern = params[0],
            regExp3Colors = /(rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)), (rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)) \d{1,3}\%, (rgb\(\d{1,3}, \d{1,3}, \d{1,3}\))/,
            regExp2Colors = /(rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)), (rgb\(\d{1,3}, \d{1,3}, \d{1,3}\))/,
            colors = sParams.match(regExp3Colors);

            if (colors == null) {
                colors = sParams.match(regExp2Colors)
            }

            var gradientObj = document.createElementNS(SVGEngine.defaults.svgNS, "linearGradient");

            //normal gradient
            if (colors.length == 3) {
                var stopObj1 = document.createElementNS(SVGEngine.defaults.svgNS, "stop"),
                stopObj2 = document.createElementNS(SVGEngine.defaults.svgNS, "stop");

                stopObj1.setAttribute("offset", "0%");
                stopObj1.setAttribute("stop-color", colors[1]);
                stopObj2.setAttribute("offset", "100%");
                stopObj2.setAttribute("stop-color", colors[2]);

                gradientObj.appendChild(stopObj1);
                gradientObj.appendChild(stopObj2);
            }
            //double gradient
            else if (colors.length == 4) {
                var stopObj1 = document.createElementNS(SVGEngine.defaults.svgNS, "stop"), stopObj2 = document.createElementNS(SVGEngine.defaults.svgNS, "stop"), stopObj3 = document.createElementNS(SVGEngine.defaults.svgNS, "stop");

                stopObj1.setAttribute("offset", "0%");
                stopObj1.setAttribute("stop-color", colors[1]);
                stopObj2.setAttribute("offset", "50%");
                stopObj2.setAttribute("stop-color", colors[2]);
                stopObj3.setAttribute("offset", "100%");
                stopObj3.setAttribute("stop-color", colors[3]);

                gradientObj.appendChild(stopObj1);
                gradientObj.appendChild(stopObj2);
                gradientObj.appendChild(stopObj3);
            }

            var oArray = pattern.split(" ");
            gradientObj.setAttribute("x1", "0%");
            gradientObj.setAttribute("x2", (oArray[1] != "0%") ? "100%" : "0%");
            gradientObj.setAttribute("y1", "0%");
            gradientObj.setAttribute("y2", (oArray[0] != "0%") ? "100%" : "0%");

            return gradientObj;
        },

        "_getWebkitGradient" : function(background) {
            var sParams = background.substring(background.indexOf('(', 0) + 1, background.length - 1), params = sParams.split(',');

            var orient = params[2], regExpOrient = /(\d{1,3})\% (\d{1,3})\%/, oPattern = orient.match(regExpOrient);

            var gradientObj = document.createElementNS(SVGEngine.defaults.svgNS, "linearGradient");

            gradientObj.setAttribute("x1", "0%");
            gradientObj.setAttribute("x2", oPattern[1] + "%");
            gradientObj.setAttribute("y1", "0%");
            gradientObj.setAttribute("y2", oPattern[2] + "%");

            var colorFrom = sParams.match(/from\((rgb\(\d{1,3}, \d{1,3}, \d{1,3}\))\)/), colorStop = sParams.match(/color-stop\(0.5, (rgb\(\d{1,3}, \d{1,3}, \d{1,3}\))\)/), colorTo = sParams.match(/to\((rgb\(\d{1,3}, \d{1,3}, \d{1,3}\))\)/);

            if (colorFrom != null && colorTo != null) {
                var stopObj1 = document.createElementNS(SVGEngine.defaults.svgNS, "stop"), stopObj2 = document.createElementNS(SVGEngine.defaults.svgNS, "stop"), stopObj3 = document.createElementNS(SVGEngine.defaults.svgNS, "stop");

                stopObj1.setAttribute("offset", "0%");
                stopObj1.setAttribute("stop-color", colorFrom[1]);
                gradientObj.appendChild(stopObj1);
                if (colorStop != null) {
                    stopObj2.setAttribute("offset", "50%");
                    stopObj2.setAttribute("stop-color", colorStop[1]);
                    gradientObj.appendChild(stopObj2);
                }
                stopObj3.setAttribute("offset", "100%");
                stopObj3.setAttribute("stop-color", colorTo[1]);
                gradientObj.appendChild(stopObj3);
            }

            return gradientObj;
        },

         "_getStandardGradient" : function(background, width, height) {
            var sParams = background.substring(background.indexOf('(', 0) + 1, background.length - 1), params = sParams.split(',');
			var colorMatches = background.match(/rgba{0,1}\(([0-9]+, [0-9]+, [0-9]+(?:, ([0-9\.]+)){0,1})\) (-?[0-9\.]+)%,{0,1}/mg);
			
			if (background.indexOf("linear-gradient") >= 0) {
				var degreesMatches = background.match(/([0-9\.]+)deg/mg);
				var degrees = degreesMatches==null ? 180 : parseFloat(degreesMatches[0]);
				var radians = degrees * Math.PI / 180.0;
				var linearGradientObj = document.createElementNS(SVGEngine.defaults.svgNS, "linearGradient");
				
				linearGradientObj.setAttribute("gradientUnits" , "userSpaceOnUse");
				
				// START AND END
				var center = { x : width / 2, y : height / 2};
				var gradientLength = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));
				var start = { x : center.x, y : center.y + gradientLength / 2};
				var rotatedStart = {};
				rotatedStart.x = center.x + (start.x - center.x) * Math.cos(radians) - (start.y - center.y) * Math.sin(radians);
				rotatedStart.y = center.y + (start.x - center.x) * Math.sin(radians) + (start.y - center.y) * Math.cos(radians);				
				
				var end = { x : center.x, y : center.y - gradientLength / 2};
				var rotatedEnd = {};
				rotatedEnd.x = center.x + (end.x - center.x) * Math.cos(radians) - (end.y - center.y) * Math.sin(radians);
				rotatedEnd.y = center.y + (end.x - center.x) * Math.sin(radians) + (end.y - center.y) * Math.cos(radians);
				
				linearGradientObj.setAttribute("x1", rotatedStart.x);
				linearGradientObj.setAttribute("x2", rotatedEnd.x);
				linearGradientObj.setAttribute("y1", rotatedStart.y);
				linearGradientObj.setAttribute("y2", rotatedEnd.y);
				
				// COLORS
				for (var i = 0; i < colorMatches.length; ++i) {
					var current = colorMatches[i];									
					var stopObj = document.createElementNS(SVGEngine.defaults.svgNS, "stop");					
					var offset = parseFloat(current.match(/-?[0-9\.]+%/mg)[0]);
									
					stopObj.setAttribute("offset", offset + "%");
					stopObj.setAttribute("stop-color", current.match(/rgba{0,1}\([0-9]+, [0-9]+, [0-9]+(?:, ([0-9\.]+)){0,1}\)/mg)[0]);
					linearGradientObj.appendChild(stopObj);
				}
								
				return linearGradientObj;
 			} else if (background.indexOf("radial-gradient") >= 0) {
				var circleMatches = background.match(/-?[0-9\.]+% -?[0-9\.]+% at -?[0-9\.]+% -?[0-9\.]+%/mg)[0].match(/(-?[0-9\.]+)%/mg);
				var radialGradientObj = document.createElementNS(SVGEngine.defaults.svgNS, "radialGradient");
				console.log(circleMatches);
				
				// CENTER AND RADIUS
				radialGradientObj.setAttribute("cx", parseFloat(circleMatches[2]) + "%");
				radialGradientObj.setAttribute("cy", parseFloat(circleMatches[3]) + "%");
				
				var minRadius = Math.min(parseFloat(circleMatches[0]), parseFloat(circleMatches[1]));
				console.log(minRadius);
				radialGradientObj.setAttribute("r", (minRadius + "%"));
				
				// COLORS
				var stops = [];
				for (var i = 0; i < colorMatches.length; ++i) {
					var current = colorMatches[i];
										
					var stopObj = document.createElementNS(SVGEngine.defaults.svgNS, "stop");
					stopObj.setAttribute("offset", current.match(/[0-9\.]+%/mg)[0]);
					stopObj.setAttribute("stop-color", current.match(/rgba{0,1}\([0-9]+, [0-9]+, [0-9]+(?:, ([0-9\.]+)){0,1}\)/mg)[0]);
					radialGradientObj.appendChild(stopObj);
				}
				
				return radialGradientObj;
			}

            var gradientObj = document.createElementNS(SVGEngine.defaults.svgNS, "linearGradient");
            return gradientObj;
        },

        "_getImagePattern" : function(background, repeat, bgPosition, bgSize, shapeSize) {
            var sImage = background.replace(/"/g, '');
            sImage = sImage.replace(/'/g,'');
            var patternObj = document.createElementNS(SVGEngine.defaults.svgNS, "pattern"), imageObj = document.createElementNS(SVGEngine.defaults.svgNS, "image");

            sImage = sImage.substring(sImage.indexOf('(', 0) + 1, sImage.lastIndexOf(')'));

            patternObj.setAttribute("patternUnits", "objectBoundingBox");

            this._getImgSize(sImage, function(imageSize) {
                var width = imageSize.width, height = imageSize.height;

                var repeatString = repeat.split(',');
                var alignmentString = bgPosition.split(' ');
                var hAlign = alignmentString[0];
                var vAlign = alignmentString[1];
                var repeatH = false;
                var repeatV = false;
                //chrome sends us strings like "repeat, repeat", "repeat-x, repeat-x", etc...
                switch (repeatString[0]) {
                    case "repeat":
                        patternObj.setAttribute("patternUnits", "userSpaceOnUse");
                        repeatH = true;
                        repeatV = true;
                        break;
                    case "repeat-x":
                        patternObj.setAttribute("patternUnits", "objectBoundingBox");
                        width = imageSize.width / shapeSize.width;
                        height = 1;
                        repeatH = true;
                        break;
                    case "repeat-y":
                        patternObj.setAttribute("patternUnits", "objectBoundingBox");
                        width = 1;
                        height = imageSize.height / shapeSize.height;
                        repeatV = true;
                        break;
                    default:
                        patternObj.setAttribute("patternUnits", "objectBoundingBox");
                        width = 1;
                        height = 1;
                        if(imageSize.width > shapeSize.width)
                          width = imageSize.width / shapeSize.width;
                        if(imageSize.height > shapeSize.height)
                          height = imageSize.height / shapeSize.height;

                        break;
                }
                patternObj.setAttribute("width", width);
                patternObj.setAttribute("height", height);

                imageObj.setAttribute("x", 0);
                imageObj.setAttribute("y", 0);
                if(bgSize!=null && bgSize=="cover"){
                  var ratioX = shapeSize.width / imageSize.width;
                  var ratioY = shapeSize.height / imageSize.height;
                  var ratio = Math.max(0, Math.max(ratioX, ratioY));

                  var imgWidth = Math.max(0, ratio * imageSize.width);
                  var imgHeight = Math.max(0, ratio * imageSize.height);

                  imageObj.setAttribute("width", imgWidth + "px");
                  imageObj.setAttribute("height", imgHeight + "px");

                  var imageXPos = 0;
                  var imageYPos = 0;

                  if (hAlign === "100%")
                    imageXPos = shapeSize.width - imgWidth;
                  if (hAlign === "50%")
                	imageXPos = (shapeSize.width / 2) - (imgWidth / 2);

                  if (vAlign === "100%")
                	imageYPos = shapeSize.height - imgHeight;
                  if (vAlign === "50%")
                	imageYPos = (shapeSize.height / 2) - (imgHeight / 2);

                  imageObj.setAttribute("x", imageXPos + "px");
                  imageObj.setAttribute("y", imageYPos + "px");
                  imageObj.setAttribute("preserveAspectRatio","none");
                } else if (bgSize != null && bgSize == "contain") {
                  var ratioX = shapeSize.width / imageSize.width;
                  var ratioY = shapeSize.height / imageSize.height;
                  var ratio = Math.max(0, Math.min(ratioX, ratioY));

                  var imgWidth = Math.max(0, ratio * imageSize.width);
                  var imgHeight = Math.max(0, ratio * imageSize.height);
                  if (ratioX <= ratioY) {
                	imageObj.setAttribute("width", "100%");
                	imageObj.setAttribute("height", imgHeight + "px");
                  }
                  else {
                	imageObj.setAttribute("width", imgWidth + "px");
                	imageObj.setAttribute("height", "100%");
                  }

                  var imageXPos = 0;
                  var imageYPos = 0;

                  if (hAlign === "100%")
                    imageXPos = shapeSize.width - imgWidth;
                  if (hAlign === "50%")
                	imageXPos = (shapeSize.width / 2) - (imgWidth / 2);

                  if (vAlign === "100%")
                	imageYPos = shapeSize.height - imgHeight;
                  if (vAlign === "50%")
                	imageYPos = (shapeSize.height / 2) - (imgHeight / 2);

                  imageObj.setAttribute("x", imageXPos + "px");
                  imageObj.setAttribute("y", imageYPos + "px");
                } else {
                 imageObj.setAttribute("width", imageSize.width);
                 imageObj.setAttribute("height", imageSize.height);
                 var patternUnitFactorX = shapeSize.width;
                 var patternUnitFactorY = shapeSize.height;
                 if(repeatH && repeatV){
                   patternUnitFactorX = 1;
                   patternUnitFactorY = 1;
                 }

                 var deltaX =  shapeSize.width - imageSize.width;
                 if(repeatH)
                  deltaX = shapeSize.width - (Math.ceil(shapeSize.width / imageSize.width) * imageSize.width);
                 if(hAlign === "50%"){
                  if(!repeatH)
                    patternObj.setAttribute("x", (deltaX/2)/patternUnitFactorX);
                  else{
                    var w2 = (shapeSize.width/2) - (imageSize.width/2);
                    if(w2<0)
                      patternObj.setAttribute("x", w2/patternUnitFactorX);
                    else{
                      var w3 = (w2) - (Math.ceil(w2 / imageSize.width) * imageSize.width);
                      patternObj.setAttribute("x", w3/patternUnitFactorX);
                    }
                  }
                 }
                 else if(hAlign === "100%"){
                   patternObj.setAttribute("x", deltaX/patternUnitFactorX);
                 }

                 var deltaY =  shapeSize.height - imageSize.width;
                 if(repeatV)
                  deltaY = shapeSize.height - (Math.ceil(shapeSize.height / imageSize.height) * imageSize.height);
                 if(vAlign === "50%"){
                  if(!repeatV)
                    patternObj.setAttribute("y", (deltaY/2)/patternUnitFactorY);
                  else{
                    var y2 = (shapeSize.height/2) - (imageSize.height/2);
                    if(y2<0)
                      patternObj.setAttribute("y", y2/patternUnitFactorY);
                    else{
                      var y3 = (y2) - (Math.ceil(y2 / imageSize.height) * height);
                      patternObj.setAttribute("y", y3/patternUnitFactorY);
                    }
                  }
                 }
                 else if(vAlign === "100%"){
                   patternObj.setAttribute("y", deltaY/patternUnitFactorY);
                 }
                }

                imageObj.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', sImage);

                patternObj.appendChild(imageObj);
            });

            return patternObj;
        },

        "_getImgSize" : function(imgSrc, callback) {
            var newImg = new Image();
            newImg.src = imgSrc;
            var height = newImg.height;
            var width = newImg.width;
            newImg.onload = function() {
                var size = {
                    width : newImg.width,
                    height : newImg.height
                };
                callback(size);
            };
        },

        "_getLineHeight" : function(shapeSVG) {
            //CODE FROM SHAPEUTILS
            var borderWidth = parseInt($(shapeSVG).shapeStyle("stroke-width"));
            var $startMarker = $(shapeSVG.svg).children("defs").children('[id^=start-marker]');
            var $endMarker = $(shapeSVG.svg).children("defs").children('[id^=end-marker]');
            return Math.max(SVGEngine._getMarkerHeight($startMarker,borderWidth),SVGEngine._getMarkerHeight($endMarker,borderWidth));
        },

        "_getMarkerHeight" : function(marker,borderWidth) {
        	var markerType = "none";
        	if(marker.is(".open"))
        		markerType = "open";
        	else if(marker.is(".block"))
        		markerType = "block";
        	else if(marker.is(".classic"))
        		markerType = "classic";

            //CODE FROM SHAPEUTILS
            var height=0;
            if(markerType=== "open"){
                //biggest arrow type
                // get triangle base
                var triangleHeight = borderWidth * 3.8;
                height = parseInt((triangleHeight * Math.tan(Math.PI / 6)) * 2);
                // add arcs extra size
                height += 2 * (parseInt((borderWidth / 2) - ((borderWidth / 2) * Math.sin(Math.PI / 3)))) + 3;
            }
            else if(markerType !== "none"){
                //other types of arrow, all have the same size
                height = borderWidth * 3;
            }
            else{
                //no marker
                height = borderWidth;
            }
            return height;
        },

        "_getScaledPath" : function(path, oldSize, newSize, closedPath) {
            var regExpPathM = /^M\s(\d*.\d*\s\d*.\d*)/,
            scaledPoint = {
                "x" : 0,
                "y" : 0
            };

            var tempPath = path;

            var LS = tempPath.replace(" Z","").split("L ");
            var pointsL = [];
            for (var i = 1; i < LS.length; i++) {
                if( LS[i].indexOf("Z")==-1 && LS[i].indexOf("M")==-1)
                    pointsL.push(LS[i].trim());
            }

            var pointM = tempPath.match(regExpPathM)[1].split(" "),
            scaledPath = "";

            (pointM[0] == 0) ? scaledPoint.x = 0 : scaledPoint.x = parseInt((newSize.width * pointM[0]) / oldSize.width);
            (pointM[1] == 0) ? scaledPoint.y = 0 : scaledPoint.y = parseInt((newSize.height * pointM[1]) / oldSize.height);
            scaledPath = "M " + scaledPoint.x + " " + scaledPoint.y;

            for (var i = 0; i < pointsL.length; i++) {
                   var point = pointsL[i].split(" ");
                   (point[0] == 0) ? scaledPoint.x = 0 : scaledPoint.x = parseInt((newSize.width * point[0]) / oldSize.width);
                   (point[1] == 0) ? scaledPoint.y = 0 : scaledPoint.y = parseInt((newSize.height * point[1]) / oldSize.height);
                   scaledPath += " L " + scaledPoint.x + " " + scaledPoint.y;
            }
            if(closedPath)
                scaledPath += " Z";
            return scaledPath;
        },
        "removeSVGClass" : function($shape, classname) {
            var removedClass = $shape.attr('class').replace(new RegExp('(\\s|^)' + classname + '(\\s|$)', 'g'), '$2');
            $shape.attr('class', removedClass);
        }
    }

})(window);
