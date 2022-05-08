/*!
 * Copyright 2022 Justinmind. All rights reserved.
 */

(function (window, undefined) {
	var dp = $.datepicker;
	
	function addYearMonthSelector(html) {
		var headerRegex = /(<span class="ui-datepicker-year">[0-9 ]+<\/span>)/;
		var yearMonthButton = "<div class=\"ui-datepicker-yearmonth-parent\"><span class=\"ui-datepicker-yearmonth\"></span></div>";
		return html.replace(headerRegex, "$1" + yearMonthButton);
	}
	
	function addDoneAndClearButtons(html) {
		// Add separator
		html = html + "<div class=\"ui-datepicker-separator\"></div>";
		
		// Add Clear and Done Buttons
		var buttons = "<div class=\"ui-datepicker-bottom-buttons\">";
		buttons += "<span class=\"ui-datepicker-button ui-datepicker-reset\">Reset</span>";
		buttons += "<span class=\"ui-datepicker-button ui-datepicker-done\">Done</span>";
		buttons += "</div>";
		return html + buttons;
	}
	
	function addTimeOption(html, time) {
		var timeDiv = "<div class=\"jp-ui-timepicker\">"
		timeDiv += "<div class=\"jp-ui-floating-timepicker\"></div>";
		timeDiv += "<span class=\"jp-ui-datepicker-time-label\">Time</span>";
		
		var currentTimeString = jimUtil.fromHTML(format(time, "hh:mm a"));
		timeDiv += "<span class=\"jp-ui-datepicker-time\">" + currentTimeString + "</span>";
	
		timeDiv += "</div>";
		
		var overlayDiv = "<div class=\"jp-ui-timepicker-overlay\"></div>";
		return html + overlayDiv + timeDiv;
	}
	
	function activateFloatingTimepicker(elem, inst, input) {
		var html = window.timepicker.getTimepickerHTML();
		elem.html(html);
		
		var tp = elem.find("#jp-ui-scroll-timepicker");
		window.timepicker.fillTimepicker(tp, undefined, function (newDate) {
			elem.closest(".ui-datepicker").find(".jp-ui-datepicker-time").text(jimUtil.fromHTML(format(newDate, "hh:mm a")));
			inst.currentMinute = newDate.getMinutes();
			inst.currentHour = newDate.getHours();
			
			var date = new Date(inst.currentYear, 
							inst.currentMonth,
							inst.currentDay,
							inst.currentHour,
							inst.currentMinute);
			
			if (input != undefined) {		
				try {
					input.val(jimUtil.fromHTML(format(date, inst.settings['dateFormat'])));
					inst.input.trigger('change');
					input.closest(".date,.time,.datetime").trigger("parsedate");
				} catch (error) {}
			}
		});
		
		elem.closest(".ui-datepicker").find(".jp-ui-timepicker-overlay").css("display", "block");
		elem.fadeIn();
	}
	
	function deactivateFloatingTimepicker(elem) {
		elem.fadeOut();
		elem.closest(".ui-datepicker").find(".jp-ui-timepicker-overlay").css("display", "none");
	}
	
	function activateYearSelector(elem, inst, dp) {
		var button = elem.closest(".ui-datepicker").find($(".ui-datepicker-yearmonth"));
		
		if (!button.is(".active")) {
			var html = window.datepicker.getDatepickerHTML();
			elem.html(html);
			
			var tp = elem.find("#jp-ui-scroll-datepicker");
			var parent = elem.closest(".ui-datepicker");
			window.datepicker.fillDatepicker(tp, {
				onDateChange : function (newDate) {
					inst.drawYear = parseInt(jimUtil.fromHTML(format(newDate, "yyyy")));
					inst.drawMonth = newDate.getMonth();
					parent.find(".ui-datepicker-month").text(jimUtil.fromHTML(format(newDate, "MMMM")));
					parent.find(".ui-datepicker-year").text(inst.drawYear);
				},
				currentDate : new Date(inst.drawYear, inst.drawMonth)
			});
			
			parent.find("table").css({"opacity": "0", "pointer-events": "none"});
			parent.find(".jp-ui-timepicker").css({"opacity": "0", "pointer-events" : "none" });
			parent.find(".ui-datepicker-next, .ui-datepicker-prev").css({"opacity": "0", "pointer-events" : "none" });
			parent.find(".ui-datepicker-title").addClass("active");
			button.addClass("active");
			
			// Position yearpicker
			elem.show();
			
			var height = tp.find("#da_options").outerHeight();
			var yearTop = tp.find("#da_options").offset().top;
			var headerBottom = parent.find(".ui-datepicker-header").offset().top + parent.find(".ui-datepicker-header").outerHeight();
			var separatorTop = parent.find(".ui-datepicker-separator").offset().top;
			
			var topOffset = yearTop - headerBottom;
			var bottomOffset = separatorTop - (yearTop + height);
			var offset = (topOffset - bottomOffset) / 2;
			tp.parent().css("transform", "translateY(" + -offset + "px)");
			
			elem.hide();
			
			elem.fadeIn();
		} else {
			dp._updateDatepicker(inst);
			button.removeClass("active");
		}
	}
	
	function getTimepicker() {
		return $(".ui-datepicker #jp-ui-scroll-timepicker");
	}
	
	function repositionDP() {
		if (dp) {
			var currentDP = $("body > div.ui-datepicker");
			if (currentDP.css("display") != "none") {
				var inst = dp._curInst;
				if (inst) {
					var offset = dp._checkOffset(inst, null, false);
					inst.dpDiv.css({position: 'absolute', left: offset.left + 'px', top: offset.top + 'px'});
				}
			}
		}
	}
	
	var dateController = {
		"activate" : function () {
			if (dp.oldSetDateFromField == undefined || dp.oldSetDateFromField == null) {
				dp.oldSetDateFromField = dp._setDateFromField;
			}
			
			if (dp.oldGenerate == undefined || dp.oldGenerate == null) {
				dp.oldGenerate = dp._generateHTML;
			}
			
			if (dp.oldAttachHandlers == undefined || dp.oldAttachHandlers == null) {
				dp.oldAttachHandlers = dp._attachHandlers;
			}
			
			if (dp.oldSelectDate == undefined || dp.oldSelectDate == null) {
				dp.oldSelectDate = dp._selectDate;
			}
			
			if (dp.oldCheckOffset == undefined || dp.oldCheckOffset == null) {
				dp.oldCheckOffset = dp._checkOffset;
			}
			
			// Modify Month literals
			dp._defaults['dayNamesShort'] = ['SUN','MON','TUE','WEN','THU','FRI','SAT'];
			
			dp._generateHTML = function (inst) {		
				var result = dp.oldGenerate(inst);		
				inst.jimPermanent = true;
				
				if (!inst.settings.timeOnly) {
					result = addYearMonthSelector(result);
					result += "<div class=\"jp-ui-year-selector\"></div>";
				} else {
					// Only Time
					result = window.timepicker.getTimepickerHTML();
				}
				
				// Add small time menu
				if (inst.settings.showTime && !inst.settings.timeOnly) {
					var date = new Date(inst.currentYear, 
									inst.currentMonth,
									inst.currentDay,
									inst.currentHour,
									inst.currentMinute);			
					result = addTimeOption(result, date);
				}
				
				result = addDoneAndClearButtons(result);
				return result;
			}
	
			dp._attachHandlers = function (inst) {
				dp.oldAttachHandlers(inst);
				var input = inst.input;
				
				if (inst.settings.timeOnly) {
					var tp = getTimepicker();
					$(".ui-datepicker.ui-widget-content").addClass("ui-only-timepicker");
					window.timepicker.fillTimepicker(tp, input, 
						function () {
							input.trigger('change');
						},
						inst.currentHour, inst.currentMinute);
				} else {
					$(".ui-datepicker.ui-widget-content").removeClass("ui-only-timepicker");
					
					// Year picker
					$(".ui-datepicker .ui-datepicker-yearmonth-parent").on('click', function (e) {
						activateYearSelector($(".ui-datepicker .jp-ui-year-selector"), inst, dp);
					});
				}
				
				if (inst.settings.showTime && !inst.settings.timeOnly) {			
					$(".jp-ui-datepicker-time").on('click', function (e) {
						activateFloatingTimepicker($(".ui-datepicker .jp-ui-floating-timepicker"), inst, input);
					});
					
					$(".jp-ui-timepicker-overlay").on('click', function (e) {
						deactivateFloatingTimepicker($(".ui-datepicker .jp-ui-floating-timepicker"));
					});
				}
				
				// Attach handlers to Clear and Done buttons
				$(".ui-datepicker .ui-datepicker-reset").on('click', function (e) {
					dp.oldSelectDate(input, "");
					inst.currentDay = 0;
					dp._updateDatepicker(inst);
				});
				
				$(".ui-datepicker .ui-datepicker-done").on('click', function (e) {
					var button = $(e.currentTarget).closest(".ui-datepicker").find($(".ui-datepicker-yearmonth"));
					
					if (button.length > 0 && button.is(".active")) {
						dp._updateDatepicker(inst);
						button.removeClass("active");
						return;
					}
					
					dp._hideDatepicker(undefined, true);
				});
			}
	
			dp._selectDate = function (id, dateStr) {
				var target = $(id);
				var inst = this._getInst(target[0]);
				
				if (inst.settings.showTime && !inst.settings.timeOnly) {
					var timeText = $(".jp-ui-datepicker-time").text();
					var splits = timeText.split(":");
					inst.currentHour = parseFloat(splits[0]);
					inst.currentMinute = parseFloat(splits[1]);
					
					if (timeText.includes("PM"))
						inst.currentHour += 12;
					else if (inst.currentHour == 12)
						inst.currentHour = 0;
				}
				
				var date = new Date(inst.currentYear, 
									inst.currentMonth,
									inst.currentDay,
									inst.currentHour,
									inst.currentMinute);
									
				var inputDateFormat = target.closest(".datetime, .date, .time").attr("format");
				var text = jimUtil.fromHTML(format(date, inputDateFormat));
				dp.oldSelectDate(id, text);
			}
	
			dp._setDateFromField = function(inst, noDefault) {
				var format = inst.input.closest(".datetime, .date, .time").attr("format");
				
				var timestamp = (parse(inst.input.val(), format, new Date())).getTime();
				if (!isNaN(timestamp)) {
					var date = new Date(timestamp);
					inst.currentHour = date.getHours();
					inst.currentMinute = date.getMinutes();
					
					if (!inst.timeOnly) {
						inst.selectedDay = date.getDate();
						inst.drawMonth = inst.selectedMonth = date.getMonth();
						inst.drawYear = inst.selectedYear = date.getFullYear();
						inst.currentDay = date.getDate();
						inst.currentMonth = date.getMonth();
						inst.currentYear = date.getFullYear();
					}
				} else {
					inst.currentHour = 0;
					inst.currentMinute = 0;
					dp.oldSetDateFromField(inst, noDefault);
				}
				
				inst.settings['dateFormat'] = format;
			}
			
			dp._checkOffset = function (inst, offset, isFixed) {
				var jimInput = $(inst.input).closest("div.firer.date, div.firer.datetime, div.firer.time");
				offset = jimInput.offset();
				
				var inputWidth = inst.input ? jimInput.outerWidth() : 0;
				var inputHeight = inst.input ? jimInput.outerHeight() : 0;
				offset.top += inputHeight + 7;
				
				if ($("body").is(".web"))
					return dp.oldCheckOffset(inst, offset, isFixed);
				
				var dpWidth = inst.dpDiv.outerWidth();
				var dpHeight = inst.dpDiv.outerHeight();
				var inputWidth = inst.input ? jimInput.outerWidth() : 0;
				var inputHeight = inst.input ? jimInput.outerHeight() : 0;
				var jimContainer = $("#jim-container");
				
				var cOffset = jimContainer.offset();
				var cWidth = jimContainer.outerWidth();
				var cHeight = jimContainer.outerHeight();
				
				var viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());
				var viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

				offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
				offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
				offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

				// now check if datepicker is showing outside window viewport - move to a better place if so.
				offset.left -= Math.min(offset.left, (offset.left + dpWidth > cWidth + cOffset.left) ?
				  Math.abs(offset.left + dpWidth + 5 - (cWidth + cOffset.left)) : 0);
				offset.top -= Math.min(offset.top, (offset.top + dpHeight > cHeight + cOffset.top) ?
				  Math.abs(offset.top + dpHeight + 5 - (cHeight + cOffset.top)) : 0);
				  
				offset.left = (offset.left < cOffset.left) ? cOffset.left + 5 : offset.left;
				offset.top = (offset.top < cOffset.top) ? cOffset.top + 5 : offset.top;
				return offset;
			}
			
			if ($("body").is(".web"))
				$("#simulation").bind('scroll', repositionDP);
			else
				$("#jim-body").bind('scroll', repositionDP);
			$(window).bind('resize', repositionDP);
		},
		"deactivate" : function() {
			if (dp.oldSetDateFromField != undefined)
				dp._setDateFromField = dp.oldSetDateFromField;
			if (dp.oldGenerate != undefined)
				dp._generateHTML = dp.oldGenerate;
			if (dp.oldAttachHandlers != undefined)
				dp._attachHandlers = dp.oldAttachHandlers;
			if (dp.oldSelectDate != undefined)
				dp._selectDate = dp.oldSelectDate;
			if (dp.oldCheckOffset != undefined)
				dp._checkOffset = dp.oldCheckOffset;
			
			dp.oldSetDateFromField = undefined;
			dp.oldGenerate = undefined;
			dp.oldAttachHandlers = undefined;
			dp.oldSelectDate = undefined;
			dp.oldCheckOffset = dp.oldCheckOffset;
			
			if ($("body").is(".web"))
				$("#simulation").unbind('scroll', repositionDP);
			else
				$("#jim-body").unbind('scroll', repositionDP);
			$(window).unbind('resize', repositionDP);
		}
	}
	
	jimDevice.dateControllers['default'] = dateController;
	
})(window);