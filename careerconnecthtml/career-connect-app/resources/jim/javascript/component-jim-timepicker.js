(function (window, undefined) {
	
	var dragStart;
	var periods = ['AM', 'PM'];
	var input;
	var onTimeChange;
	
	function fillTime(tp, hours, minutes) {
		var currentHour, currentMinute, currentPeriod, html = "";
		var currentDate = new Date();
		currentHour = (hours != null || hours != undefined) ? hours : currentDate.getHours();
		currentMinutes = (minutes != null || minutes != undefined) ? minutes : currentDate.getMinutes();
		currentPeriod = (currentHour < 12) ? periods[0] : periods[1];

		//hours
		var html = "";
		for (var i = currentHour - 10; i <= currentHour + 10; i++) {
			var val = i;
			val = (val + 12) % 12;
			if (val === 0) val = 12;
			html += "<div class='hours hour" + val + "'>" + val + "</div>"; 
		}
		tp.find(".ti_hours").html(html);
		
		//minutes
		html = "";
		for(var i = currentMinutes - 10; i <= currentMinutes + 10; i++) {
			var val = i;
			val = (val + 60) % 60;
			if (val === 0) val = 0;
			if (val.toString().length === 1) val = "0" + val;
			html += "<div class='minutes minute" + val + "'>" + val + "</div>";
		}
		tp.find(".ti_minutes").html(html);
		
		//period
		html = "";
		$.each(periods, function(key, index) {
			html += "<div class='periods'>" + this + "</div>";
		});
		tp.find(".ti_periods").html(html);
		tp.find(".ti_periods").addClass(currentPeriod.toLocaleLowerCase());
	}
	
	function correctDragDateWithZoom(evt, ui) {
        // zoom fix
    	var zoom = jimDevice.getZoom();
    	ui.position.top = -210 + (ui.position.top+210) * zoom;
    }
	
	/** HOURS **/
	function bindTimeHours(tp) {
		tp.find(".ti_hours").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var hElem = tp.find("#ti_options .ti_hours");
				var hElemBig = tp.find("#ti_options_big .ti_hours");
				
				var topPos = parseFloat(hElem.attr("baseTop"));
				var topPosBig = parseFloat(hElemBig.attr("baseTop"));
				
				var cellHeight = parseFloat(hElem.children().first().css("height"));
				var cellHeightBig = parseFloat(hElemBig.children().first().css("height"));
				
				var ddTop = parseInt(tp.find("#ti_options .ti_hours").css('top'));
				if((ddTop+topPos)> (cellHeight / 2)) {
					var offset = -topPos-ddTop-(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					hElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					hElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultTIHours(despl, tp);
						hElem.css('top', -topPos + 'px');
						hElemBig.css('top', -topPosBig + 'px');
						setNewValue(tp);
					});
				}
				else if((ddTop+topPos)<-(cellHeight / 2)) {
					var offset = -topPos-ddTop+(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					hElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					hElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultTIHours(despl, tp);
						hElem.css('top', -topPos + 'px');
						hElemBig.css('top', -topPosBig + 'px');
						setNewValue(tp);
					});
				}
				else {
					hElemBig.animate({'top' : -topPosBig + 'px', queue : false });
					hElem.animate({'top': -topPos + 'px', queue : false }, function() {
					});
				}
			}
		});

		tp.find(".ti_hours").on('dragstart', function(event, data) {
			dragStart = true;		
		});
		
		tp.find(".ti_hours").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				var topPos = -parseFloat(tp.find("#ti_options .ti_hours").attr("baseTop"));
				var topPosBig = -parseFloat(tp.find("#ti_options_big .ti_hours").attr("baseTop"));
				
				if(posY<offset.top) {
					event.preventDefault();
					tp.find("#ti_options .ti_hours").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					tp.find("#ti_options .ti_hours").trigger('mouseup');
				}
				else {
					var diff = Math.abs(topPosBig - topPos);
					if(tp.find("#ti_options").attr('id') === jQuery(event.target).parent().attr('id'))
						tp.find("#ti_options_big .ti_hours").css("top", parseInt(tp.find("#ti_options .ti_hours").css('top')) - diff +"px");
					else tp.find("#ti_options .ti_hours").css("top", parseInt(tp.find("#ti_options_big .ti_hours").css('top')) + diff +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}
	
	function restoreDefaultTIHours(offset, tp) {
		var firstHour = parseInt(tp.find("#ti_options .ti_hours :first-child").text(), 10),
		newStartHour = firstHour+offset;
		
		resetTIHours(tp.find("#ti_options .ti_hours").children(), firstHour, newStartHour);
		resetTIHours(tp.find("#ti_options_big .ti_hours").children(), firstHour, newStartHour);
		
		var topPos = parseFloat(tp.find("#ti_options .ti_hours").attr("baseTop"));
		var topPosBig = parseFloat(tp.find("#ti_options_big .ti_hours").attr("baseTop"));
		tp.find("#ti_options .ti_hours").css('top', -topPos + 'px');
		tp.find("#ti_options_big .ti_hours").css('top', -topPosBig + 'px');
	}
	
	function resetTIHours(currentHourList, firstHour, newStartHour) {
		for(var i=0; i<currentHourList.length; i++) {
			var item = jQuery(currentHourList[i]);
			var value = (newStartHour + i + 12)%12;
			if(value===0) value=12;
			var oldValue = (firstHour + i + 12)%12;
			if(oldValue===0) oldValue=12;
			
			item.removeClass("hour" + oldValue);
			item.addClass("hour" + value);
			item.text(value);
		}
	}
	
	/** MINUTES **/
	function bindTimeMinutes(tp) {
		tp.find(".ti_minutes").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var mElem = tp.find("#ti_options .ti_minutes");
				var mElemBig = tp.find("#ti_options_big .ti_minutes");
				var topPos = parseFloat(mElem.attr("baseTop"));
				var topPosBig = parseFloat(mElemBig.attr("baseTop"));
				
				var cellHeight = parseFloat(mElem.children().first().css("height"));
				var cellHeightBig = parseFloat(mElemBig.children().first().css("height"));

				var ddTop = parseInt(jQuery("#ti_options .ti_minutes").css('top'));
				if((ddTop + topPos) > (cellHeight / 2)) {
					var offset = -topPos-ddTop-(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					mElemBig.animate({'top' : -topPosBig - (despl * cellHeightBig) + 'px', queue : false });
					mElem.animate({'top' : -topPos - (despl * cellHeight) + 'px', queue : false }, function() {
						restoreDefaultTIMinutes(despl, tp);
						mElem.css('top', -topPos + 'px');
						mElemBig.css('top', -topPosBig + 'px');
						setNewValue(tp);
					});
				}
				else if((ddTop+topPos)<-(cellHeight / 2)) {
					var offset = -topPos-ddTop+(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					mElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					tp.find("#ti_options .ti_minutes").animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultTIMinutes(despl, tp);
						mElem.css('top', -topPos + 'px');
						mElemBig.css('top', -topPosBig + 'px');
						setNewValue(tp);
					});
				}
				else {
					mElemBig.animate({'top' : -topPosBig + 'px', queue : false });
					mElem.animate({'top': -topPos + 'px', queue : false }, function() {
					});
				}
			}
		});

		tp.find(".ti_minutes").on('dragstart', function(event, data) {
			dragStart = true;		
		});
		
		tp.find(".ti_minutes").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				var topPos = -parseFloat(tp.find("#ti_options .ti_minutes").attr("baseTop"));
				var topPosBig = -parseFloat(tp.find("#ti_options_big .ti_minutes").attr("baseTop"));
				
				if(posY<offset.top) {
					event.preventDefault();
					tp.find("#ti_options .ti_minutes").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					tp.find("#ti_options .ti_minutes").trigger('mouseup');
				}
				else {
					var diff = Math.abs(topPosBig - topPos);
					if(tp.find("#ti_options").attr('id') === jQuery(event.target).parent().attr('id'))
						tp.find("#ti_options_big .ti_minutes").css("top", parseInt(tp.find("#ti_options .ti_minutes").css('top'))-diff +"px");
					else tp.find("#ti_options .ti_minutes").css("top", parseInt(tp.find("#ti_options_big .ti_minutes").css('top'))+diff +"px");
				}
				
			}
			else event.preventDefault();
		});
	}

	function restoreDefaultTIMinutes(offset, tp) {
		var firstMinute = parseInt(tp.find("#ti_options .ti_minutes :first-child").text(), 10),
		newStartMinute = firstMinute+offset;
		
		resetTIMinutes(tp.find("#ti_options .ti_minutes").children(), firstMinute, newStartMinute);
		resetTIMinutes(tp.find("#ti_options_big .ti_minutes").children(), firstMinute, newStartMinute);

		var topPos = parseFloat(tp.find("#ti_options .ti_minutes").attr("baseTop"));
		var topPosBig = parseFloat(tp.find("#ti_options_big .ti_minutes").attr("baseTop"));
		tp.find("#ti_options .ti_minutes").css('top', -topPos + 'px');
		tp.find("#ti_options_big .ti_minutes").css('top', -topPosBig + 'px');
	}
	
	function resetTIMinutes(currentMinuteList, firstMinute, newStartMinute) {
		for(var i=0; i<currentMinuteList.length; i++) {
			var item = jQuery(currentMinuteList[i]);
			var value = (newStartMinute + i + 60)%60;
			if(value.toString().length===1) value = "0"+value;
			var oldValue = (firstMinute + i + 60)%60;
			if(oldValue.toString().length===1) oldValue = "0"+oldValue;
			
			item.removeClass("minute" + oldValue);
			item.addClass("minute" + value);
			item.text(value);
		}
	}
	
	/** PERIODS **/
	function bindTimePeriods(tp) {
		tp.find(".ti_periods").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var pElem = tp.find("#ti_options .ti_periods");
				var pElemBig = tp.find("#ti_options_big .ti_periods");
				var topPos = -parseFloat(pElem.attr("baseTop"));
				var topPosBig = -parseFloat(pElemBig.attr("baseTop"));
				
				var cellHeight = parseFloat(pElem.children().first().css("height"));
				var cellHeightBig = parseFloat(pElemBig.children().first().css("height"));
				
				var ddTop = parseInt(jQuery("#ti_options .ti_periods").css('top'));
				if((topPos-ddTop) > (cellHeight / 2)) {
					pElemBig.animate({'top' : topPosBig - cellHeightBig + 'px', queue : false });
					pElem.animate({'top' : topPos - cellHeight + 'px', queue : false }, function() {
						tp.find(".ti_periods").removeClass("am pm").addClass("pm");
						pElem.css('top', "");
						setNewValue(tp);
					});
				}
				else if((topPos-ddTop) < -(cellHeight / 2)) {
					pElemBig.animate({'top' : topPosBig + 'px', queue : false });
					pElem.animate({'top' : topPos + 'px', queue : false}, function() {
						tp.find(".ti_periods").removeClass("am pm").addClass("am");
						pElem.css('top', "");
						setNewValue(tp);
					});
				}
				else {
					pElemBig.animate({'top' : topPosBig + 'px', queue : false });
					pElem.animate({'top': topPos + 'px', queue : false}, function() {
						tp.find(".ti_periods").removeClass("am pm").addClass("am");
						pElem.css('top', "");
					});
				}
			}
		});

		tp.find(".ti_periods").on('dragstart', function(event, data) {
			dragStart = true;		
		});
		
		tp.find(".ti_periods").on('drag', function(event, data) {
			if(dragStart) {				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				var topPos = -parseFloat(tp.find("#ti_options .ti_periods").attr("baseTop"));
				var topPosBig = -parseFloat(tp.find("#ti_options_big .ti_periods").attr("baseTop"));
				
				if(posY < offset.top) {
					event.preventDefault();
					tp.find("#ti_options .ti_periods").trigger('mouseup');
				}
				else if(posY > offset.top + (dd_height / zoom)) {
					event.preventDefault();
					tp.find("#ti_options .ti_periods").trigger('mouseup');
				}
				else {
					var diff = Math.abs(topPosBig - topPos);
					if(jQuery("#ti_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#ti_options_big .ti_periods").css("top", parseInt(jQuery("#ti_options .ti_periods").css('top')) - diff +"px");
					else jQuery("#ti_options .ti_periods").css("top", parseInt(jQuery("#ti_options_big .ti_periods").css('top')) + diff +"px");
				}
			}
			else event.preventDefault();
			
		});
	}
	
	function bindHandlers(tp) {
		tp.find("#ti_options > * , #ti_options_big > *").each(function (index) {$(this).attr("baseTop", -1 * parseFloat($(this).css("top")));});
		tp.find("#ti_options > .ti_periods, #ti_options_big > .ti_periods").each(function (index) {
			var oldTop = $(this).css("top");
			var classes = $(this).attr("class");
			
			$(this).removeClass("am").removeClass("pm");
			$(this).css("top", "");

			$(this).attr("baseTop", -1 * parseFloat($(this).css("top")));
			
			$(this).css("top", oldTop);
			$(this).attr("class", classes);
		});
		
		tp.find('.ti_hours').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		tp.find('.ti_minutes').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		tp.find('.ti_periods').draggable({ axis: "y" });
		
		bindTimeHours(tp);
		bindTimeMinutes(tp);
		bindTimePeriods(tp);
		bindArrows(tp);
	}
	
	function nextValue(tp, steps, elem) {
		var topPos = parseFloat(elem.attr("baseTop"));
		var cellHeight = parseFloat(elem.children().first().css("height"));
	
		var despl = steps;
		elem.animate({'top' : -topPos - (despl * cellHeight) + 'px', queue : false }, function() {
			if (elem.is(".ti_minutes"))
				restoreDefaultTIMinutes(despl, tp);
			else if (elem.is(".ti_hours"))
				restoreDefaultTIHours(despl, tp);
			
			elem.css('top', -topPos + 'px');
			setNewValue(tp);
		});
	}
	
	function setPM(tp) {
		var elem = tp.find("#ti_options .ti_periods");
		
		if (!elem.is(".pm")) {
			var topPos = parseFloat(elem.attr("baseTop"));
			var cellHeight = parseFloat(elem.children().first().css("height"));
			
			elem.animate({'top' : topPos - cellHeight + 'px', queue : false }, function() {
				elem.removeClass("am pm").addClass("pm");
				elem.css('top', "");
				setNewValue(tp);
			});
		}
	}
	
	function setAM(tp) {
		var elem = tp.find("#ti_options .ti_periods");
		
		if (!elem.is(".am")) {
			var topPos = parseFloat(elem.attr("baseTop"));
			
			elem.animate({'top' : topPos + 'px', queue : false}, function() {
				elem.removeClass("am pm").addClass("am");
				elem.css('top', "");
				setNewValue(tp);
			});
		}
	}
	
	function bindArrows(tp) {
		$(".ti_arrow_button.up_hours").on("click", function () { nextValue(tp, 1, tp.find("#ti_options .ti_hours")); });
		$(".ti_arrow_button.up_minutes").on("click", function () { nextValue(tp, 1, tp.find("#ti_options .ti_minutes")); });
		$(".ti_arrow_button.up_period").on("click", function () { setPM(tp) });
		$(".ti_arrow_button.down_hours").on("click", function () { nextValue(tp, -1, tp.find("#ti_options .ti_hours")); });
		$(".ti_arrow_button.down_minutes").on("click", function () { nextValue(tp, -1, tp.find("#ti_options .ti_minutes")); });
		$(".ti_arrow_button.down_period").on("click", function () { setAM(tp) });
	}
	
	function setNewValue(tp) {
		var hour = parseInt(tp.find("#ti_options .ti_hours :nth-child(11)").text(), 10),
		minute = parseInt(tp.find("#ti_options .ti_minutes :nth-child(11)").text(), 10),
		period = tp.find("#ti_options .ti_periods").is(".am") ? periods[0] : periods[1];
		hour = (period===periods[0] && hour===12) ? 0 : hour;
		hour = (period===periods[1] && hour<12) ? hour+12 : hour;
		if(minute.toString().length===1) minute = "0" + minute;
				
		var date = new Date();
		date.setHours(hour);
		date.setMinutes(minute);
		var inputDateFormat = "HH:mm";
		
		if (input != undefined) {		
			try {
				input.val(jimUtil.fromHTML(format(date, inputDateFormat)));
				input.closest(".date,.time,.datetime").trigger("parsedate");
			} catch (error) {}
		}
		
		if (onTimeChange != undefined) {
			onTimeChange(date);
		}
	}
	
	var timepicker = {
		"getTimepickerHTML" : function (hours, minutes) {
			var html = "";
			html = 	"<div id=\'jp-ui-scroll-timepicker\'>" + 
						"<div>" +
							"<div id=\"ti_options\">" +
								"<div class=\"ti_hours\"></div>" +
								"<div class=\"ti_minutes\"></div>" +
								"<div class=\"ti_periods\"></div>" +
							"</div>" +
							"<div id=\"ti_options_big\">" +
								"<div class=\"ti_hours\"></div>" +
								"<div class=\"ti_minutes\"></div>" +
								"<div class=\"ti_periods\"></div>" +
							"</div>" +
							"<div class=\"ti_arrows\">" +
								"<div class=\"ti_arrow_button up_hours\"><div class=\"ti_arrow\"></div></div>" + 
								"<div class=\"ti_arrow_button up_minutes\"><div class=\"ti_arrow\"></div></div>" +
								"<div class=\"ti_arrow_button up_period\"><div class=\"ti_arrow\"></div></div>" +
								"<div class=\"ti_arrow_button down_hours\"><div class=\"ti_arrow\"></div></div>" + 
								"<div class=\"ti_arrow_button down_minutes\"><div class=\"ti_arrow\"></div></div>" +
								"<div class=\"ti_arrow_button down_period\"><div class=\"ti_arrow\"></div></div>" +
							"</div>" +
						"</div>" +
					"</div>";
			
			return html;
		},
		"fillTimepicker" : function(timepicker, currentInput, currentOnTimeChange, currentHours, currentMinutes) {
			input = currentInput;
			onTimeChange = currentOnTimeChange;
			fillTime(timepicker, currentHours, currentMinutes);
			bindHandlers(timepicker);
		}, "getTimeValue" : function(timepicker) {
			var hour = parseInt(timepicker.find("#ti_options .ti_hours :nth-child(11)").text(), 10),
			minute = parseInt(timepicker.find("#ti_options .ti_minutes :nth-child(11)").text(), 10),
			period = timepicker.find("#ti_options .ti_periods").hasClass('am') ? periods[0] : periods[1];
			hour = (period===periods[0] && hour===12) ? 0 : hour;
			hour = (period===periods[1] && hour<12) ? hour+12 : hour;
			if(minute.toString().length===1) minute = "0" + minute;
				
			var date = new Date();
			date.setHours(hour);
			date.setMinutes(minute);
		
			try {
				return date;
			} catch (error) {}
		}
	};
	
	window.timepicker = timepicker;

})(window);