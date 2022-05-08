/*!
 * Copyright 2022 Justinmind. All rights reserved.
 */

(function(window, undefined) {
	
	
	var iphone_kb = {
		letters: [
			[ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p" ],
			[ "a", "s", "d", "f", "g", "h", "j", "k", "l" ],
			[ "shift", "z", "x", "c", "v", "b", "n", "m", "backspace" ], 
			[ "numbers", "space", "return" ] 
		],
		email: [
			[ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p" ],
			[ "a", "s", "d", "f", "g", "h", "j", "k", "l" ],
			[ "shift", "z", "x", "c", "v", "b", "n", "m", "backspace" ], 
			[ "numbers", "space", "&#64;", "&#46;", "return" ] 
		],
		url: [
			[ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p" ],
			[ "a", "s", "d", "f", "g", "h", "j", "k", "l" ],
			[ "shift", "z", "x", "c", "v", "b", "n", "m", "backspace" ], 
			[ "numbers", "&#46;", "&#47;", ".com", "return" ] 
		],
		numbers: [
			[ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" ],
			[ "&#150;", "&#47;", "&#58;", "&#59;", "&#40;", "&#41;", "&#36;", "&#38;", "&#64;", "&#34;" ],
			[ "signs", "&#46;", "&#44;", "&#63;", "&#33;", "&#39;", "backspace" ],
			[ "letters", "space", "return" ]
		],
		signs: [
			[ "&#91;", "&#93;", "&#123;", "&#125;", "&#35;", "&#37;", "&#136;", "&#42;", "&#43;", "&#61;" ],
			[ "&#95;", "&#92;", "&#124;", "&#126;", "&#60;", "&#62;", "&#128;", "&#163;", "&#165;", "&#149;" ],
			[ "numbers", "&#46;", "&#44;", "&#63;", "&#33;", "&#39;", "backspace" ],
			[ "letters", "space", "return" ]
		]
	},
	ipad_kb = {
		letters: [
			[ "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "backspace" ],
			[ "capsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "return" ],
			[ "shiftLeft", "z", "x", "c", "v", "b", "n", "m", "&#44;", "&#46;", "shiftRight" ], 
			[ "emote", "numbersLeft", "micro", "space", "numbersRight", "exit" ] 
		],
		email: [
			[ "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "backspace" ],
			[ "capsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "return" ],
			[ "shiftLeft", "z", "x", "c", "v", "b", "n", "m", "&#64;", "&#46;", "shiftRight" ], 
			[ "emote", "numbersLeft", "micro", "space", "numbersRight", "exit" ] 
		],
		url: [
			[ "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "backspace" ],
			[ "capsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "return" ],
			[ "shiftLeft", "z", "x", "c", "v", "b", "n", "m", "&#64;", "&#46;", "shiftRight" ], 
			[ "emote", "numbersLeft", "micro", "space", "numbersRight", "exit" ] 
		],
		numbers: [
			[ "tab", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace" ],
			[ "undo", "&#64;", "&#35;", "$", "&", "&#42;", "&#40;", "&#41;", "&#39;", "&#34;", "return" ],
			[ "signsLeft", "&#37;", "&#45;", "&#43;", "&#61;", "&#47;", "&#59;", "&#58;", "&#33;", "&#63;", "signsRight" ], 
			[ "emote", "lettersLeft", "micro", "space", "lettersRight", "exit" ]
		],
		signs: [
			[ "tab", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace" ],
			[ "redo", "&#128;", "&#163;", "&#165;", "&#95;", "&#94;", "&#91;", "&#93;", "&#123;", "&#125;", "return" ],
			[ "numbersLeft", "&#167;", "&#124;", "&#126;", "&#133;", "&#92;", "&#60;", "&#62;", "&#33;", "&#63;", "numbersRight" ], 
			[ "emote", "lettersLeft", "micro", "space", "lettersRight", "exit" ]
		]
	},
	months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
	daysCompressed = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
	monthsCompressed = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
	periods = [ "AM", "PM" ],
	input,
	initialInputValue,
	pressedTarget, 
	ddSize, currentMonth, currentWeekday, currentDay, currentYear,
	lastKeyboard = "#letters",
	dragStart=false;
	
	
	/*********************** START KEYBOARD METHODS ************************/
	
	function createKeyboard() {
		var key = "";
		var html = '<div id='+controller.keyboardKey.substring(1) +' onselectstart="return false;">';
		$.each(jimDevice.isiPhone() ? iphone_kb : ipad_kb, function(key, value) {
			html += ('<div id="' + key + '">');
			var kbname = key;
			$.each(this, function(key, value) {
				html += '<div class="row">';
				var kbrow = key;
				$.each(this, function(key, value) {
					if(value === "shift" || (value === "backspace" && jimDevice.isiPhone()) || value === "emote" || value === "micro" || value === "exit") {
						html += ('<div class="' + value + '"><span /></div>');
					} else if(value === "numbers") {
						html += ('<div class="' + value + '"><div>123</div></div>');
					} else if(value.includes("numbers")) {
						html += ('<div class="' + value + '"><div>.?123</div></div>');
					} else if(value.includes("signs")) {
						html += ('<div class="' + value + '"><div>#+=</div></div>');
					} else if(value.includes("letters")) {
						html += ('<div class="' + value + '"><div>ABC</div></div>');
					} else if(value === "backspace") {
						html += ('<div class="' + value + '"><div>delete</div></div>');
					} else if(value === "capsLock") {
						html += ('<div class="' + value + '"><div>caps lock</div></div>');
					} else if(value.includes("shift")) { 
						html += ('<div class="' + value + '"><div>shift</div></div>');
					} else if(value.includes("space") && !jimDevice.isiPhone()) { 
						html += ('<div class="' + value + '"></div>');
					} else {
						if(jimDevice.isiPhone() && (value.length == 1 || value.startsWith("&#"))) {
							html += ('<div class="' + value + '"><div class="value">' + value + '</div></div>');
						}
						else if(!jimDevice.isiPhone() && (value.length > 1 && !value.startsWith("&#"))) {
							html += ('<div class="' + value + '"><div>' + value + '</div></div>');
						}
						else {
							if(!jimDevice.isiPhone()) {
								var newkb;
								if(kbname === "letters" || kbname === "email" || kbname === "url") { newkb = "signs"; }
								else if(kbname === "numbers" && kbrow>0) { newkb = "signs"; }
						
								if(newkb !== undefined) {
									html += '<div class="' + value + '"><div class="superValue">' + ipad_kb[newkb][kbrow][key] + '</div><div class="value">' + value + '</div></div>';
								}
								else {
									html += ('<div class="' + value + '"><div>' + value + '</div></div>');
								}
							}
							else { html += ('<div class="' + value + '"><div>' + value + '</div></div>'); }
						}
					}
				});
				html += '</div>';
			});
			if(jimDevice.isiPhone()) {
				html += '<div class="row"><div class="emote"/><div class="micro"/></div>';
			}
			html += '</div>';
		});
		html += '</div>';
		
		jQuery("#jim-container").append(html);
	}
	
	function bindKeyboard() {
		jQuery(controller.keyboardKey).on("mouseup", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && realTarget.className === "value") {
				realTarget = jQuery(realTarget.parentElement).context;
			}
			if (realTarget.tagName === "DIV" && realTarget===pressedTarget) {
				var key = realTarget.className;
				if(key.indexOf(" ") > 0)
					key = key.substring(0, key.indexOf(" "));
				if(key) {
					switch(key) {
						case "shiftRight":
						case "shiftLeft":
						case "shift":
						case "capsLock":
						case "undo":
						case "redo":
						case "tab":
						case "emote":
						case "micro":
						case "row":
							break;
						case "letters":
						case "lettersRight":
						case "lettersLeft":
							jQuery("#letters").css('display', 'none');
							jQuery("#numbers").css('display', 'none');
							jQuery("#signs").css('display', 'none');
							jQuery("#email").css('display', 'none');
							jQuery("#url").css('display', 'none');
							jQuery(lastKeyboard).css('display', 'block');
							deactivateSpecialKeys();
							break;
						case "numbers":
						case "numbersRight":
						case "numbersLeft":
							jQuery("#numbers").css('display', 'block');
							jQuery("#signs").css('display', 'none');
							jQuery("#letters").css('display', 'none');
							jQuery("#email").css('display', 'none');
							jQuery("#url").css('display', 'none');
							deactivateSpecialKeys();
							break;
						case "signs":
						case "signsRight":
						case "signsLeft":
							jQuery("#signs").css('display', 'block');							
							jQuery("#letters").css('display', 'none');
							jQuery("#email").css('display', 'none');
							jQuery("#url").css('display', 'none');						
							jQuery("#numbers").css('display', 'none');						
							deactivateSpecialKeys();
							break;
						default:
							changeValueByKeyboard(input, key);
							break;
					}
				}
			}
			jQuery(".divBubble").remove();
			removeEffects(pressedTarget);
			removeEffects(realTarget);
		});
		
		jQuery(controller.keyboardKey).on("mousedown", function(event, data) {
			var realTarget = event.target || event.srcElement;
			pressedTarget = realTarget;
			if (pressedTarget.tagName === "DIV" && (jQuery(pressedTarget).is("#jim-ios15-kb") || jQuery(pressedTarget.parentElement).is("#jim-ios15-kb"))) {
				return;
			}
			if (pressedTarget.tagName === "DIV" && pressedTarget.className === "value") {
				pressedTarget = jQuery(pressedTarget.parentElement).context;
			}
			if (pressedTarget.tagName === "DIV") {
				var key = pressedTarget.className;
				if(key.indexOf(" ")>0)
					key = key.substring(0, key.indexOf(" "));
				switch(key) {
					case "shiftRight":
					case "shiftLeft":
						jQuery(".capsLock").removeClass("pressed");
						if($("#jim-ios15-kb.caps").length) {
							jQuery(".shiftRight, .shiftLeft").removeClass("pressed");
							jQuery("#jim-ios15-kb").removeClass("caps");
						}
						else {
							jQuery(".shiftRight, .shiftLeft").removeClass("pressed").addClass("pressed");
							jQuery("#jim-ios15-kb").removeClass("caps").addClass("caps");
						}
						toggleCapsFromKeyboard($(pressedTarget));
						break;
					case "shift":
						if($("#jim-ios15-kb.caps").length) {
							jQuery(pressedTarget).removeClass("caps").removeClass("capsLock");
							jQuery("#jim-ios15-kb").removeClass("caps");
						}
						else {
							jQuery(pressedTarget).removeClass("caps").addClass("caps");
							jQuery("#jim-ios15-kb").removeClass("caps").addClass("caps");
						}
						toggleCapsFromKeyboard($(pressedTarget));
						break;
					case "capsLock":
						if($(".capsLock.pressed").length) {
							jQuery(pressedTarget).removeClass("pressed");
							jQuery("#jim-ios15-kb").removeClass("caps");
						}
						else {
							jQuery(pressedTarget).removeClass("pressed").addClass("pressed");
							jQuery("#jim-ios15-kb").removeClass("caps").addClass("caps");
						}
						jQuery(".shiftLeft, .shiftRight").removeClass("pressed");
						toggleCapsFromKeyboard($(pressedTarget));
						break;
						break;	
					case "lettersRight":
					case "lettersLeft":
					case "numbersRight":
					case "numbersLeft":
					case "signsRight":
					case "signsLeft":
					case "signs":
					case "numbers":
					case "letters":
					case "row":
					case "tab":
					case "emote":
					case "micro":
					case "undo":
					case "redo":
						break;
					case "backspace":
					case "return":
					case "exit":
					case "space":
						jQuery(pressedTarget).removeClass("pressed").addClass("pressed");
						break;
					default:
						if(jimDevice.isiPhone()) {
							keyBubble = "<div class='divBubble' ";
							var topPos, leftPos, backWidth;
							var zoom = jimDevice.getZoom();
							var height = jQuery(pressedTarget).height();
							var width = jQuery(pressedTarget).width();
							var top = jQuery(pressedTarget).position().top*zoom;
							var left = jQuery(pressedTarget).position().left*zoom;
							var marginLeft = parseInt(jQuery(pressedTarget).css("margin-left"), 10)*zoom;
							
							topPos = top + height - 110; // image height
							if($(realTarget).parent().children()[0] === realTarget && key !== "a") {
								leftPos = left + marginLeft - ($("#jim-mobile").is(".portrait") ? 5.4 : 2);
								backWidth = width + ($("#jim-mobile").is(".portrait") ? 17.8*2 : 18.2*2);	
								keyBubble += " style='top: " + topPos + "px; left: " + leftPos + "px; position: absolute; pointer-events: none;'><div class='keyBubble-back' style='width: " + backWidth + "px;'><div class='bubble4'/><div class='bubble2'/><div class='bubble5'/></div><span class='keyBubble'>" + ($("#jim-ios15-kb.caps").length ? key.toUpperCase() : key) + "</span></div>";
							}
							else if($(realTarget).parent().children()[$(realTarget).parent().children().length - 1] === realTarget && key !== "l") {
								leftPos = left + marginLeft - ($("#jim-mobile").is(".portrait") ? 28.6 : 34);
								backWidth = width + ($("#jim-mobile").is(".portrait") ? 17.8*2 : 18.35*2);	
								keyBubble += " style='top: " + topPos + "px; left: " + leftPos + "px; position: absolute; pointer-events: none;'><div class='keyBubble-back' style='width: " + backWidth + "px;'><div class='bubble5' style='transform: scaleX(-1)'/><div class='bubble2'/><div class='bubble4' style='transform: scaleX(-1)'/></div><span class='keyBubble'>" + ($("#jim-ios15-kb.caps").length ? key.toUpperCase() : key) + "</span></div>";
							}
							else {
								var keyPos = $("#jim-mobile").is(".portrait") ? 15.9 : 17.5;
								keyPos = jQuery(pressedTarget).closest("#numbers, #signs") && jQuery(pressedTarget).parent(".row").parent().children(":nth-child(3)").is(jQuery(pressedTarget).parent(".row")) ? 16.9 : keyPos;
								leftPos = left + marginLeft - keyPos;
								backWidth = width + ($("#jim-mobile").is(".portrait") ? 16.9*2 : 17.5*2);
								keyBubble += " style='top: " + topPos + "px; left: " + leftPos + "px; position: absolute; pointer-events: none;'><div class='keyBubble-back' style='width: " + backWidth + "px;'><div class='bubble1'/><div class='bubble2'/><div class='bubble1' style='transform: scaleX(-1)'/></div><span class='keyBubble'>" + ($("#jim-ios15-kb.caps").length ? key.toUpperCase() : key) + "</span></div>";
							}
						
							jQuery(pressedTarget).parent().parent().append(keyBubble);
						}
						else {
							$target = jQuery(pressedTarget);
							if($target.is(".value"))
								$target = $target.parent();
							$target.removeClass("pressed").addClass("pressed");
						}
						break;
				}
				event.preventDefault();
			}
		});
		
		jQuery(controller.keyboardKey).on("dblclick", function(event, data) {
			if (event.target.tagName === "DIV") {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				if(key === "shift") {
					var hasCaps = jQuery(".shift.caps");
					var hasCapsLock = jQuery(".shift.capsLock");
					if(hasCaps.length > 0) {
						jQuery(".shift").removeClass("caps").addClass("capsLock");
						jQuery("#jim-ios15-kb").removeClass("caps").addClass("caps");
					}
					else if(hasCapsLock.length>0) {
						jQuery(".shift").removeClass("capsLock");
						jQuery("#jim-ios15-kb").removeClass("caps");
					}
					else {
						jQuery(".shift").removeClass("capsLock").addClass("capsLock");
						jQuery("#jim-ios15-kb").removeClass("caps").addClass("caps");
					}
					toggleCapsFromKeyboard(jQuery(".shift"));
				}
			}
		});
		
		jQuery(controller.keyboardKey).on("mouseleave", function(event, data) {
		  if(pressedTarget) {
			jQuery(".divBubble").remove();
			removeEffects(pressedTarget);
		    pressedTarget = null;
		  }
		});
	}

	function deactivateSpecialKeys() {
		jQuery(".shift").removeClass("caps").removeClass("capsLock");
		jQuery(".shiftRight, .shiftLeft").removeClass("caps");
		jQuery("#jim-ios15-kb").removeClass("caps");
		jQuery(".capsLock").removeClass("pressed");
		jQuery(".space").removeClass("pressed");
		jQuery(".backspace").removeClass("pressed");
		jQuery(".return").removeClass("pressed");
		toggleCapsFromKeyboard(jQuery(".space"));
	}
	
	function removeEffects(target) {
		var key = jQuery(target).attr("class");
		if(key !== undefined) {
			if(key.indexOf(" ") > 0)
				key = key.substring(0, key.indexOf(" "));
			if(key.length == 1)
				jQuery(target).removeClass("pressed");
		}
	}

	function changeValueByKeyboard($target, newKey) {
		var action, type, oldValue = "", startPos=0, move = false;
		type = $target.jimGetType();
		switch(type) {
		  case itemType.text:
		  case itemType.password:
			oldValue = $target.find("input").val();
			startPos = $target.find("input").caret().start;
			action = applyNewValue(oldValue, newKey, $target.find("input"));
			if(action.key === "return")
				$target.find("input").val(jimUtil.fromHTML(action.newValue));
			else {
				if(($target.find("input").get(0).offsetWidth + $target.find("input").get(0).scrollLeft >= $target.find("input").get(0).scrollWidth - 1) ||
				   ($target.find("input").get(0).offsetWidth + $target.find("input").get(0).scrollLeft <= $target.find("input").get(0).scrollWidth + 1)) move = true;
				$target.find("input").val(jimUtil.fromHTML(action.newValue)).caret({start: startPos+action.caretDespl, end:startPos+action.caretDespl});
				if(move) $target.find("input").get(0).scrollLeft = $target.find("input").get(0).scrollWidth;
			}
			break;
		  case itemType.textarea:
			oldValue = $target.find("textarea").val();
			startPos = $target.find("textarea").caret().start;
			action = applyNewValue(oldValue, newKey, $target.find("textarea"));
			if(action.key === "return") 
				$target.find("textarea").val(jimUtil.fromHTML(action.newValue));
			else {
				if(($target.find("textarea").get(0).offsetHeight + $target.find("textarea").get(0).scrollTop >= $target.find("textarea").get(0).scrollHeight - 1) ||
				   ($target.find("textarea").get(0).offsetHeight + $target.find("textarea").get(0).scrollTop <= $target.find("textarea").get(0).scrollHeight + 1)) move = true;
				$target.find("textarea").val(jimUtil.fromHTML(action.newValue)).caret({start: startPos+action.caretDespl, end:startPos+action.caretDespl});
				if(move) $target.find("textarea").get(0).scrollTop = $target.find("textarea").get(0).scrollHeight;
			}
			break;
		}
		input.closest(".firer").trigger("keyup.jim", [{"preventTrigger": true, "altKey":false, "ctrlKey":false, "shiftKey":false, "which": (newKey.startsWith("return")) ? 13 : newKey.toLowerCase().charCodeAt(0)-32 }]);
	}

	function applyNewValue(oldValue, newKey, $target) {
		var newValue, hasCaps, beforeCaret, afterCaret, caretDespl;
		newValue = oldValue;
		var hasCaps = jQuery("#jim-ios15-kb.caps");
		if(newKey.indexOf(" ")>0)
			newKey = newKey.substring(0, newKey.indexOf(" "));
		if(hasCaps.length>0 && newKey.length === 1)
			newKey = newKey.toUpperCase();
			
		//calculate value before and after caret	
		beforeCaret = oldValue.substring(0, $target.caret().start);
		afterCaret = oldValue.substring($target.caret().end);
			
		switch(newKey) {
			case "space":
				newValue = beforeCaret + " " + afterCaret;
				jQuery(".space").removeClass("pressed");
				caretDespl = 1;
				break;
			case "backspace":
				newValue = (beforeCaret.length>0) ? beforeCaret.substring(0, beforeCaret.length-1) : "";
				newValue += afterCaret; 
				jQuery(".backspace").removeClass("pressed");
				caretDespl = -1;
				break;
			case "shift":
				if(hasCaps.length > 0) {
					jQuery(".shift").removeClass("caps").removeClass("capsLock");
					jQuery("#jim-ios15-kb").removeClass("caps");
				}
				else { 
					jQuery(".shift").removeClass("caps").addClass("caps");
					jQuery("#jim-ios15-kb").removeClass("caps").addClass("caps");
				}
				caretDespl = 0;
				break;
			case "shiftRight":
			case "shiftLeft":
				if(hasCaps.length>0) {
					jQuery(".shiftLeft, .shiftRight").removeClass("pressed");
					jQuery("#jim-ios15-kb").removeClass("caps");
				}
				else { 
					jQuery(".shiftLeft, .shiftRight").removeClass("pressed").addClass("pressed");
					jQuery("#jim-ios15-kb").removeClass("caps").addClass("caps");
				}
				caretDespl = 0;
				break;
			case "return":
			case "exit":
				jQuery(controller.keyboardKey).hide("slide", { direction: "down" }, 300);
				deactivateSpecialKeys();
				if(initialInputValue !== newValue) {
					input.closest(".firer").trigger("change");
				}
				input.find("input:focus").blur();
				caretDespl = 0;
				break;
			case ".com":
				newValue = beforeCaret + newKey.toLowerCase() + afterCaret;
				jQuery(".shift").removeClass("caps");
				jQuery("#jim-ios15-kb").removeClass("caps");
				jQuery(".shiftLeft, .shiftRight").removeClass("pressed");
				toggleCapsFromKeyboard($(".shift, .shiftLeft, .shiftRight"));
				caretDespl = 4;
				break;
			default:
				newValue = beforeCaret + newKey + afterCaret;
				jQuery(".shift").removeClass("caps");
				if(jQuery(".shift.capsLock").length == 0 && !jQuery(".capsLock.pressed").length)
					jQuery("#jim-ios15-kb").removeClass("caps");
				jQuery(".shiftLeft, .shiftRight").removeClass("pressed");
				toggleCapsFromKeyboard($(".shift, .shiftLeft, .shiftRight"));
				caretDespl = 1;
				break;
		}
		
		return {newValue: newValue, caretDespl: caretDespl, key: newKey};
	}

	function setStartCaretPosition($target) {
		var endPos=0;
		type = $target.jimGetType();
		switch(type) {
		  case itemType.text:
		  case itemType.password:
			endPos = $target.find("input").val().length;
			$target.find("input").caret({start: endPos, end: endPos});
			break;
		  case itemType.textarea:
			endPos = $target.find("textarea").val().length;
			$target.find("textarea").caret({start: endPos, end: endPos});
			break;
		}
	}
	
	function toggleCapsFromKeyboard($key) {
		var $keyboard = $key.parent(".row").parent();
		var hasCaps = jQuery("#jim-ios15-kb.caps");
		toggleCaps($keyboard, hasCaps);
	}
	
	function toggleCaps($keyboard, hasCaps) {
		$.each($keyboard.children(), function(key, value) {
			if ($(value).hasClass("row")) {
				toggleCaps($(value), hasCaps);
			}
			else {
				var span = $(value).find("div.value");
				if (span.length > 0 && span.last().text().length == 1) {
					if (hasCaps.length > 0) {
						span.last().text(span.last().text().toUpperCase());
					}
					else {
						span.last().text(span.last().text().toLowerCase());
					}
				}
			}
		});
	}
	
	/*********************** END KEYBOARD METHODS ************************/
	
	/*********************** START DROPDOWN METHODS ************************/
	
	function createDropDown() {
		var html = '<div id='+controller.dropdownKey.substring(1) +' onselectstart="return false;"><div id="dd_content" class="scrollable" style="overflow:hidden;height:100%;width:100%;"><div class="dd_options"></div></div></div>';
		jQuery("#jim-container").append(html);
		jQuery(controller.dropdownKey+ " #dd_content").overscroll({ showThumbs:true, direction:'vertical', roundCorners:true, backgroundColor:'black', opacity:'0.5', thickness:'2',scrollSpacing:'2.5'});
	}
	
	function bindDropDown() {
		jQuery(controller.dropdownKey).on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
			}
			else if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key === "")
					key = event.target.id;
				if(key) {
					if(key.indexOf(" ")>0)
						key = key.substring(0, key.indexOf(" "));
					switch(key) {
					case "dd_options":
					case "tock":
						//case for IE on option without value
						if(jQuery(".dd_options .pressed").position()===undefined)
							break;
						case "options":
							jQuery(controller.dropdownKey+" .dd_options .selected").removeClass("selected");
							var $target = jQuery(controller.dropdownKey+" .dd_options .pressed");
							$target.removeClass("pressed").addClass("selected");
							jQuery(controller.dropdownKey+" .dd_options .tock").remove();
							$target.append('<div class="tick"></div>');
							setDropDrownValue(input);
							var value = $target.text();
							if(initialInputValue!==value) {
								input.closest(".firer").trigger("change");
								initialInputValue = value;
							}
							jQuery(controller.dropdownKey).hide();
							jQuery(controller.dropdownKey).get(0).style.removeProperty('height');
							jQuery(".nativedropdown").removeClass("pressed");
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery(controller.dropdownKey).on("mousedown", function(event, data) {
			if (event.target.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key = key.substring(0, key.indexOf(" "));
				switch(key) {
					case "tick":
					case "tock":
						//case for IE on option without value
					case "options":
						var $target = jQuery(event.target).closest(".options"),
						$currentPressed = jQuery(controller.dropdownKey+" .dd_options .selected");
						
						if($target[0]===$currentPressed[0]) {
							jQuery(controller.dropdownKey+" .dd_options .tick").removeClass("tick").addClass("tock");
							jQuery(controller.dropdownKey+" .dd_options .pressed").removeClass("pressed");
							$target.parent().removeClass("pressed").addClass("pressed");
						}
						else {
							jQuery(controller.dropdownKey+" .dd_options .tick").removeClass("tick").addClass("tock").hide();
							jQuery(controller.dropdownKey+" .dd_options .pressed").removeClass("pressed");
							$target.parent().removeClass("pressed").addClass("pressed");			
						}
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
		jQuery(controller.dropdownKey).on("openedDD", function(event) {
			var $dropDiv = jQuery(controller.dropdownKey);
			var $dropContentDiv = jQuery(controller.dropdownKey + " #dd_content");
			$dropContentDiv.get(0).style.removeProperty('position');
			//control height overflow
			var deviceHeight = parseInt(jQuery("#jim-container").css("height"));
			var ddRemainingHeight = deviceHeight - parseInt(jQuery(controller.dropdownKey).css("top")) - 10;
			var ddCurrentHeight = $dropDiv.get(0).clientHeight;
			if(ddCurrentHeight>deviceHeight){
				var currentTop = parseInt($dropDiv.css("top"));
				$dropDiv.css("top",currentTop - parseInt(jQuery(controller.dropdownKey).css("top"))+20 +"px");
				$dropDiv.css("height",(deviceHeight-40)+"px");
				$dropContentDiv.css("position","absolute");
			}
			else if(ddCurrentHeight>ddRemainingHeight){
				var currentTop = parseInt($dropDiv.css("top"));
				var overflowHeight = ddCurrentHeight - ddRemainingHeight;
				$dropDiv.css("top",currentTop - overflowHeight + "px");
				$dropDiv.get(0).style.removeProperty('height');
			}
			
			//control width overflow
			var deviceWidth = parseInt(jQuery("#jim-container").css("width"));
			var ddRemainingWidth = deviceWidth - parseInt(jQuery(controller.dropdownKey).css("left"));
			var ddCurrentWidth = $dropDiv.get(0).clientWidth;
			var currentLeft = parseInt($dropDiv.css("left"));
			if(currentLeft<0)
				$dropDiv.css("left",0 + "px");
			if(ddCurrentWidth>ddRemainingWidth){
				var overflowWidth = ddCurrentWidth - ddRemainingWidth;
				$dropDiv.css("left",currentLeft - overflowWidth + "px");
			}
			//jQuery(window).trigger("reloadScrollBars");
		});
		
		jQuery(controller.dropdownKey).on("dragstart", function(event, data) {
			jQuery(controller.dropdownKey+" .dd_options .pressed").removeClass("pressed");
			jQuery(controller.dropdownKey+" .dd_options .tock").removeClass("tock").addClass("tick").show();
			startDDPos = parseInt(jQuery(controller.dropdownKey+" .dd_options").css("top"), 10);
			dragStart = true;
		});
		
	}
	
	function fillDropDownOptions($target) {
		var type = $target.jimGetType();
		jQuery(controller.dropdownKey+" .dd_options >").remove();
		switch(type) {
			case itemType.dropdown:
			case itemType.nativedropdown:
				var html = "";
				$holder = jQuery("#"+$target.attr("id"));
	            $options = $holder.find(".option");
	            ddSize = $options.length;
	            defaultValue = $target.find(".valign").children(".value").text();
	            var newOption;
	            for(i=0, iLen=ddSize; i<iLen; i+=1) {
	            	newOption = "<div class='line_options";
	            	if(defaultValue === jQuery($options[i]).text()) {
	            		selectedPos = i;
	            		newOption += " selected'><div class='tick'></div><div class='options'>" + jQuery($options[i]).text() + "</div></div>";
	            	}
	            	else {
	            		newOption += "'><div class='options'>" + jQuery($options[i]).text() + "</div></div>";
	            	}
	            	html += newOption;
	            }
				var $optionsDiv = jQuery(controller.dropdownKey+" .dd_options");
				$optionsDiv.append(html);
				break;
		}
	}
	
	function setDropDrownValue($target) {
		var type = $target.jimGetType();
		switch(type) {
			case itemType.dropdown:
			case itemType.nativedropdown:
				$options = $target.children(".dropdown-options").children(".option").removeClass("selected").removeAttr("selected");
				var value = jQuery(controller.dropdownKey+" .dd_options .line_options.selected .options").text();
				for(o=0, oLen=$options.length; o<oLen; o+=1) {
				  option = $options[o];
				  if(option.textContent === value || option.innerText === value) {
				    jQuery(option).addClass("selected");
				    jQuery(option).attr("selected","selected");
				    $target.find(".value").html(jimUtil.toHTML(value));
				    return false;
				  }
				}
				break;
		}
	}
	
	/*********************** END DROPDOWN METHODS ************************/
	
	/*********************** START OTHER METHODS ************************/
	
	function checkExternalClick(event, data) {
		var $target = $(event.target || event.srcElement);
		if(input && ( (($target.closest(".text")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) || 
				(($target.closest(".password")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) || 
				(($target.closest(".textarea")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) )
				&& $target[0].id != $(controller.keyboardKey) && !$target.closest(controller.keyboardKey).length && $(controller.keyboardKey).css("display")!=="none" && !$(controller.keyboardKey+":animated").length) {
			jQuery(controller.keyboardKey).hide("slide", { direction: "down" }, 300);
			deactivateSpecialKeys();
			
			var value = "";
			if(input.find("input").length>0)
				value = input.find("input").val();
			else if(input.find("textarea").length>0)
				value = input.find("textarea").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
			input.find("textarea:focus").blur();
		}
		if(input && ($target.closest(".dropdown, .nativedropdown")[0]!==input[0]) && !$target.is(".dropdown, .nativedropdown") && $target[0].id != $(controller.dropdownKey) && !$target.closest(controller.dropdownKey).length && $(controller.dropdownKey).css("display")!=="none" && !$(controller.dropdownKey+":animated").length) {
			jQuery(controller.dropdownKey).hide();
			jQuery(controller.dropdownKey).get(0).style.removeProperty('height');
			jQuery(".dropdown, .nativedropdown").removeClass("pressed");
			var value = input.children(".valign").children(".value").text();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
		}
		
		dragStart=false;
	}
	
	function checkExternalTap(event, data) {
		var $target = $(event.target || event.srcElement);
		if($target.closest(".dropdown, .nativedropdown")[0]===undefined || !$target.is(".dropdown, .nativedropdown")) {
		  jQuery(".dropdown, .nativedropdown").removeClass("pressed");
		  event.stopPropagation();
		}
		
		dragStart=false;
	}
	
	function isComponentAssociatedinDataGrid(newInput) {
		hasDatagridParent = newInput.parents(".datagrid"),
		isOAAssociated = newInput.find("input[name]"),
		OAName = isOAAssociated ? (isOAAssociated.attr("name")!="") ? isOAAssociated.attr("name") : undefined : undefined;
		if(hasDatagridParent && OAName)
			return true;
		else return false;
	}
	
	/*********************** END OTHER METHODS ************************/
	
	
	/*********************** START STATIC ACCESS METHODS ************************/
	
	function bindClickEvents(){
		$("#jim-container").on("mousedown",checkExternalClick);
		if(window.jimDevice.isMobile() && window.jimUtil.isMobileDevice()) {
			$("#simulation").on("mousedown",checkExternalTap);
		}
	}
	
	function unbindClickEvents(){
		$("#jim-container").off("mousedown",checkExternalClick);
		if(window.jimDevice.isMobile() && window.jimUtil.isMobileDevice()) {
			$("#simulation").off("mousedown",checkExternalTap);
		}
	}
	
	var controller = {
		"keyboardKey":"#jim-ios15-kb",
		"dropdownKey":"#jim-ios15-dd",
		"dateKey":"#jim-ios15-da",
		"loadSimulator": function() {
			this.loadKeyboard();
			this.loadDropDown();
			jimDevice.dateControllers['default'].activate();
			bindClickEvents();
		},
		"bindContainer" : function () {
			if (!window.jimUtil.isMobileDevice()) 
			  $("#jim-container").mousedown(checkExternalClick);
		},
		"unloadSimulator": function() {
			this.unloadKeyboard();
			this.unloadDropDown();
			jimDevice.dateControllers['default'].deactivate();
			unbindClickEvents();
		},
		"loadKeyboard": function() {
			createKeyboard();
			bindKeyboard();
			var controller=this;

			jQuery("#simulation").delegate(".text:not(.number, .email, .inputurl) input:not([readonly]), .password input:not([readonly]), textarea:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery(controller.keyboardKey).css("display") || jQuery(controller.keyboardKey).css("display") === "none") {
					jQuery(controller.keyboardKey).show("slide", { direction: "down" }, 300);
				}
				lastKeyboard = "#letters";
				var newInput = jQuery(this).closest(".text");
				initialInputValue = newInput.find("input").val();
				if(newInput.length===0) {
					newInput = jQuery(this).closest(".password");
					initialInputValue = newInput.find("input").val(); 
				}
				if(newInput.length===0) {
					newInput = jQuery(this).closest(".textarea");
					initialInputValue = newInput.val();
				}
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					controller.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
			
			jQuery("#simulation").delegate(".number input:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery(controller.keyboardKey).css("display") || jQuery(controller.keyboardKey).css("display") === "none") {
					jQuery(controller.keyboardKey).show("slide", { direction: "down" }, 300);
				}
				lastKeyboard = "#letters";
				var newInput = jQuery(this).closest(".number");
				initialInputValue = newInput.find("input").val();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					controller.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
			
			jQuery("#simulation").delegate(".email input:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery(controller.keyboardKey).css("display") || jQuery(controller.keyboardKey).css("display") === "none") {
					jQuery(controller.keyboardKey).show("slide", { direction: "down" }, 300);
				}
				if(jQuery("body.iphone5").length>0)
					lastKeyboard = "#letters";
				else
					lastKeyboard = "#email";
				var newInput = jQuery(this).closest(".email");
				initialInputValue = newInput.find("input").val();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					controller.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
			
			jQuery("#simulation").delegate(".inputurl input:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery(controller.keyboardKey).css("display") || jQuery(controller.keyboardKey).css("display") === "none") {
					jQuery(controller.keyboardKey).show("slide", { direction: "down" }, 300);
				}
				if(jQuery("body.iphone5").length>0)
					lastKeyboard = "#letters";
				else
					lastKeyboard = "#url";
				var newInput = jQuery(this).closest(".inputurl");
				initialInputValue = newInput.find("input").val();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					controller.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
		},
		"unloadKeyboard": function() {
			var controller = this;
			if(jQuery(controller.keyboardKey).length>0) {
				jQuery(controller.keyboardKey).off();
				jQuery("#simulation").undelegate(".text:not(.number, .email, .inputurl) input:not([readonly]), .password input:not([readonly]), textarea:not([readonly])", "click");
				jQuery("#simulation").undelegate(".text:not(.number, .email, .inputurl) input:not([readonly]), .password input:not([readonly]), textarea:not([readonly])", "focusin");
				if(jQuery(controller.keyboardKey).css("display") !== "none") {
					jQuery(controller.keyboardKey).hide();
					//jQuery(controller.keyboardKey).hide("slide", { direction: "down" }, 300);
				}
				jQuery(controller.keyboardKey).remove();
			}
		},
		"loadDropDown": function() {
			createDropDown();
			bindDropDown();
			var controller=this;
			jQuery("#simulation").delegate(".dropdown:not([readonly]), .nativedropdown:not([readonly])", "click", function(event, data) {
				controller.resetWidgets();
				fillDropDownOptions($(event.target).closest(".dropdown, .nativedropdown"));
				var newInput = jQuery(this);
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					if(input) {
						jQuery(".dropdown, .nativedropdown").removeClass("pressed");
					}
					input = newInput;
				}
				var position = controller.getCurrentPosition(input),
				height = parseInt(input.css("height"))/(1/jimUtil.getScale());
				jQuery(controller.dropdownKey).css("top", position.y/(1/jimUtil.getScale()) + height + "px");
				jQuery(controller.dropdownKey).css("left", position.x/(1/jimUtil.getScale()) + "px");

				jQuery(controller.dropdownKey).show();
				jQuery(controller.dropdownKey).trigger("openedDD");
			});
		},
		"unloadDropDown": function() {
			var controller=this;
			if(jQuery(controller.dropdownKey).length>0) {
				jQuery(controller.dropdownKey).off();
				jQuery("#simulation").undelegate(".dropdown:not([readonly]), .nativedropdown:not([readonly])", "click");
				if(jQuery(controller.dropdownKey).css("display") !== "none")
					jQuery(controller.keyboardKey).hide();
				jQuery(controller.dropdownKey).remove();
			}
		},
		"resetWidgets": function() {
			var controller=this;
			//keyboard
			if(jQuery(input).closest(".number").find("input").length > 0) {
				jQuery(controller.keyboardKey +" #letters").css('display', 'none');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'block');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #email").css('display', 'none');
				jQuery(controller.keyboardKey +" #url").css('display', 'none');
			}
			else if(jQuery(input).closest(".inputurl").find("input").length > 0) {
				jQuery(controller.keyboardKey +" #letters").css('display', 'none');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'none');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #email").css('display', 'none');
				jQuery(controller.keyboardKey +" #url").css('display', 'block');
			}
			else if(jQuery(input).closest(".email").find("input").length > 0) {
				jQuery(controller.keyboardKey +" #letters").css('display', 'none');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'none');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #email").css('display', 'block');
				jQuery(controller.keyboardKey +" #url").css('display', 'none');
			}
			else  {
				jQuery(controller.keyboardKey +" #letters").css('display', 'block');
				jQuery(controller.keyboardKey +" #numbers").css('display', 'none');
				jQuery(controller.keyboardKey +" #signs").css('display', 'none');
				jQuery(controller.keyboardKey +" #email").css('display', 'none');
				jQuery(controller.keyboardKey +" #url").css('display', 'none');
			}
			deactivateSpecialKeys();
		},
		"hideWidgets": function() {
			var controller = this;
			//keyboard
			jQuery(controller.keyboardKey).css('display', 'none');
			//dropdown
			jQuery(controller.dropdownKey).css('display', 'none');
		},
		"getCurrentPosition": function(element) {
			var positionX = element.jimPosition().left,
			positionY = element.jimPosition().top,
			parent = element.parent(),
			siblingsY, siblingsX, value;
			while(parent.prop("id")!=="simulation") {
				if(parent.hasClass("layout")) {}
				else {
					siblingsX = parent.siblings(".horizontalScroll");
					siblingsY = parent.siblings(".verticalScroll");
					if(siblingsX.length>0) {
						value = parseFloat(jQuery(siblingsX[0]).attr("desplX"));
						if(!isNaN(value) && value!==0) {
							value = parseInt(value);
							positionX += value;
						}
					}
					if(siblingsY.length>0) {
						value = parseFloat(jQuery(siblingsY[0]).attr("desplY"));
						if(!isNaN(value) && value!==0) {
							value = parseInt(value);
							positionY += value;
						}
					}
				}
				
				parent = parent.parent();
			}
			return {"x": positionX, "y": positionY };
		}
	};
	window.jimDevice.controllers["iOS15"] = controller;
	
	/*********************** END STATIC ACCESS METHODS ************************/
	
}) (window);