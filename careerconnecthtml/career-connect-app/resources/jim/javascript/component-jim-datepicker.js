(function (window, undefined) {
	
	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	var dragStart;
	var input;
	var onDateChange;
	var onClick;
	var hasMonths, hasDays;
	var monthsVisual = months;
	
	function fillDate(dp, currentDate) {
		var currentMonth, currentDay, currentYear, html = "";
		if (!currentDate)
			currentDate = new Date();
		
		currentMonth = currentDate.getMonth();
		currentDay = currentDate.getDate();
		currentYear = currentDate.getFullYear();
		
		//months
		for(var i = currentMonth - 10; i <= currentMonth + 10; i++) {
			var val = i;
			val = (val + 12) % 12;
			if (val === 12) val=0;
			html += "<div class='months month" + val + "'>" + monthsVisual[val] + "</div>";
		}
		dp.find(".da_months").html(html);
		
		//days
		html = "";
		for(var i=currentDay-10;i<=currentDay+10;i++) {
			var val = i;
			val = (val + 31) % 31;
			if(val===0) val=31;
			html += "<div class='days day" + val + "'>" + val + "</div>"; 
		}
		dp.find(".da_days").html(html);
		
		//years
		html = "";
		for(var i = currentYear - 10; i <= currentYear + 10; i++) {
			var val = i;
			html += "<div class='years year" + val + "'>" + val + "</div>"; 
		}
		dp.find(".da_years").html(html);
	}
	
	/** DAYS **/
	function bindDays(dp) {
		dp.find(" .da_days").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var dElem = dp.find("#da_options .da_days");
				var dElemBig = dp.find("#da_options_big .da_days");
				var topPos = parseFloat(dElem.attr("baseTop"));
				var topPosBig = parseFloat(dElemBig.attr("baseTop"));
				
				var cellHeight = parseFloat(dElem.children().first().css("height"));
				var cellHeightBig = parseFloat(dElemBig.children().first().css("height"));

				var ddTop = parseInt(dElem.css('top'));
				if((ddTop+topPos)> (cellHeight / 2)) {
					var offset = -topPos-ddTop-(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					dElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					dElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultDADays(despl, dp);
						dElem.css('top', -topPos + 'px');
						dElemBig.css('top', -topPosBig + 'px');
						autoCorrectDate(dp);
					});
				}
				else if((ddTop+topPos)<-(cellHeight / 2)) {
					var offset = -topPos-ddTop+(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					dElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					dElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultDADays(despl, dp);
						dElem.css('top', -topPos + 'px');
						dElemBig.css('top', -topPosBig + 'px');
						autoCorrectDate(dp);
					});
				}
				else {
					dElemBig.animate({'top' : -topPosBig + 'px', queue : false });
					dElem.animate({'top': -topPos + 'px', queue : false }, function() {
					});
				}
			}
		});
		
		dp.find(" .da_days").on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		dp.find(" .da_days").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;

				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				var topPos = parseFloat(dp.find("#da_options .da_days").attr("baseTop"));
				var topPosBig = parseFloat(dp.find("#da_options_big .da_days").attr("baseTop"));
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#da_options .da_days").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#da_options .da_days").trigger('mouseup');
				}
				else {
					var diff = Math.abs(topPosBig - topPos);
					if(jQuery("#da_options").attr('id') === jQuery(event.target).parent().attr('id'))
						jQuery("#da_options_big .da_days").css("top", parseInt(jQuery("#da_options .da_days").css('top'))-diff +"px");
					else jQuery("#da_options .da_days").css("top", parseInt(jQuery("#da_options_big .da_days").css('top'))+diff +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function autoCorrectDate(dp) {
		var disabled = dp.find("#da_options .da_days :nth-child(11)").hasClass("disabled");
		
		if(disabled) {
			moveDigits(dp.find("#da_options .da_days :nth-child(11)"), dp);
		}
		else setDateValue(dp);
	}

	function moveDigits(disabledSelected, dp) {
		var day = parseInt(disabledSelected.text());
		var disabledDays = 1;
		for(var i=11;i<=12;i++) {
			if(dp.find("#da_options .da_days :nth-child(" + (dp.find("#da_options .da_days").children().length-i) +")").hasClass("disabled"))
				disabledDays++;
		}
		
		var dElem = dp.find("#da_options .da_days");
		var dElemBig = dp.find("#da_options_big .da_days");
		var topPos = parseFloat(dElem.attr("baseTop"));
		var topPosBig = parseFloat(dElemBig.attr("baseTop"));
		
		var cellHeight = parseFloat(dElem.children().first().css("height"));
		var cellHeightBig = parseFloat(dElemBig.children().first().css("height"));
		
		dElem.animate({'top' : -topPosBig + (cellHeightBig * disabledDays)+'px', queue : false });
		dElemBig.animate({'top' : -topPos + (cellHeight * disabledDays)+'px', queue : false }, function() {
			restoreDefaultDADays(-disabledDays, dp);
			setDateValue(dp);
		});
	}

	function restoreDefaultDADays(offset, dp) {
		var firstDay = parseInt(jQuery("#da_options .da_days :first-child").text(), 10),
		newStartDay = firstDay+offset;
		
		resetDADays(dp.find("#da_options .da_days").children(), firstDay, newStartDay);
		resetDADays(dp.find("#da_options_big .da_days").children(), firstDay, newStartDay);

		var topPos = parseFloat(dp.find("#da_options .da_days").attr("baseTop"));
		var topPosBig = parseFloat(dp.find("#da_options_big .da_days").attr("baseTop"));	
		dp.find("#da_options .da_days").css('top', -topPos + 'px');
		dp.find("#da_options_big .da_days").css('top', -topPosBig + 'px');

	}
	
	function resetDADays(currentDayList, firstDay, newStartDay) {
		for(var i=0; i<currentDayList.length; i++) {
			var item = jQuery(currentDayList[i]);
			var value = (newStartDay + i);
			value = (value+31)%31;
			if(value==0) value=31;
			var oldValue = (firstDay + i)
			oldValue = (oldValue+31)%31;
			if(oldValue==0) oldValue=31;
			
			
			item.removeClass("day" + oldValue);
			item.removeClass("disabled");
			item.addClass("day" + value);
			item.text(value);
		}
	}
	
	/** MONTHS **/
	function bindMonths(dp) {
		dp.find(".da_months").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var mElem = dp.find("#da_options .da_months");
				var mElemBig = dp.find("#da_options_big .da_months");
				var topPos = parseFloat(mElem.attr("baseTop"));
				var topPosBig = parseFloat(mElemBig.attr("baseTop"));
				
				var cellHeight = parseFloat(mElem.children().first().css("height"));
				var cellHeightBig = parseFloat(mElemBig.children().first().css("height"));
				
				var ddTop = parseInt(mElem.css('top'));
				if((ddTop+topPos)>(cellHeight / 2)) {
					var offset = -topPos-ddTop-(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					mElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					mElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultDAMonths(despl, dp);
						mElem.css('top', -topPos + 'px');
						mElemBig.css('top', -topPosBig + 'px');
						setDateValue(dp);
					});
				}
				else if((ddTop+topPos)<-(cellHeight / 2)) {
					var offset = -topPos-ddTop+(cellHeight / 2);
					var despl = parseInt(offset/cellHeight);
					mElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					mElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultDAMonths(despl, dp);
						mElem.css('top', -topPos + 'px');
						mElemBig.css('top', -topPosBig + 'px');
						setDateValue(dp);
					});
				}
				else {
					mElemBig.animate({'top' : -topPosBig + 'px', queue : false });
					mElem.animate({'top': -topPos + 'px', queue : false }, function() {});
				}
			}
		});

		dp.find(".da_months").on('dragstart', function(event, data) {
			dragStart = true;		
		});
		
		dp.find(".da_months").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				var topPos = parseFloat(dp.find("#da_options .da_months").attr("baseTop"));
				var topPosBig = parseFloat(dp.find("#da_options_big .da_months").attr("baseTop"));
				
				if(posY < offset.top) {
					event.preventDefault();
					dp.find("#da_options .da_months").trigger('mouseup');
				}
				else if(posY > offset.top + (dd_height / zoom)) {
					event.preventDefault();
					dp.find("#da_options .da_months").trigger('mouseup');
				}
				else {
					var diff = Math.abs(topPosBig - topPos);
					if(dp.find("#da_options").attr('id') === jQuery(event.target).parent().attr('id'))
						dp.find("#da_options_big .da_months").css("top", parseInt(dp.find("#da_options .da_months").css('top')) - diff + "px");
					else dp.find("#da_options .da_months").css("top", parseInt(dp.find("#da_options_big .da_months").css('top')) + diff + "px");
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDAMonths(offset, dp) {
		var firstMonth = dp.find("#da_options .da_months :first-child").text(),
		newStartMonth = jQuery.inArray(firstMonth, monthsVisual)+offset,
		oldStartMonth = jQuery.inArray(firstMonth, monthsVisual);
		
		resetDAMonths(dp.find("#da_options .da_months").children(), newStartMonth, oldStartMonth);
		resetDAMonths(dp.find("#da_options_big .da_months").children(), newStartMonth, oldStartMonth);

		var topPos = -parseFloat(dp.find("#da_options .da_months").attr("baseTop"));
		var topPosBig = -parseFloat(dp.find("#da_options_big .da_months").attr("baseTop"));
		dp.find("#da_options .da_months").css('top', -topPos + 'px');
		dp.find("#da_options_big .da_months").css('top', -topPosBig + 'px');
	}
	
	function resetDAMonths(currentMonthList, newStartMonth, oldStartMonth) {
		for(var i=0; i<currentMonthList.length; i++) {
			var item = jQuery(currentMonthList[i]);
			var value = (newStartMonth + i);
			value = (value+12)%12;
			if(value==12) value=0;
			var oldValue = (oldStartMonth + i)
			oldValue = (oldValue+12)%12;
			if(oldValue==12) oldValue=0;
			
			item.removeClass("month" + oldValue);
			item.addClass("month" + value);
			item.text(monthsVisual[value]);
		}
	}
	
	function getCurrentDate(dp) {
		var month = hasMonths ? dp.find("#da_options .da_months :nth-child(11)").text() : "January";
		var year = parseInt(dp.find("#da_options .da_years :nth-child(11)").text());
		var date = new Date(Date.parse(month + " 1, " + year));
		return date;
	}

	/** YEARS **/
	function bindYears(dp) {
		dp.find(" .da_years").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var yElem = dp.find("#da_options .da_years");
				var yElemBig = dp.find("#da_options_big .da_years");
				var topPos = parseFloat(yElem.attr("baseTop"));
				var topPosBig = parseFloat(yElemBig.attr("baseTop"));
				
				var cellHeight = parseFloat(yElem.children().first().css("height"));
				var cellHeightBig = parseFloat(yElemBig.children().first().css("height"));
				var ddTop = parseInt(yElem.css('top'));
				
				if((ddTop+topPos)>(cellHeight/2)) {
					var offset = -topPos-ddTop-(cellHeight/2);
					var despl = parseInt(offset/cellHeight);
					yElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					yElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultDAYears(despl, dp);
						yElem.css('top', -topPos + 'px');
						yElemBig.css('top', -topPosBig + 'px');
						setDateValue(dp);
					});
				}
				else if((ddTop+topPos)<-(cellHeight/2)) {
					var offset = -topPos-ddTop+(cellHeight/2);
					var despl = parseInt(offset/cellHeight);
					yElemBig.animate({'top' : -topPosBig-(despl*cellHeightBig) + 'px', queue : false });
					yElem.animate({'top' : -topPos-(despl*cellHeight) + 'px', queue : false }, function() {
						restoreDefaultDAYears(despl, dp);
						yElem.css('top', -topPos + 'px');
						yElemBig.css('top', -topPosBig + 'px');
						setDateValue(dp);
					});
				}
				else {
					yElemBig.animate({'top' : -topPosBig + 'px', queue : false });
					yElem.animate({'top': -topPos + 'px', queue : false }, function() {});
					
					if (onClick)
						onClick($(event.srcElement));
				}
			} else if (onClick)
				onClick($(event.srcElement));
		});
		
		dp.find(" .da_years").on('dragstart', function(event, data) {
			dragStart = true;		
		});
		
		dp.find(" .da_years").on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery(event.target).parent().parent().offset(),
				dd_height = parseInt(jQuery(event.target).parent().parent().css('height')),
				zoom = jimDevice.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				var topPos = parseFloat(dp.find("#da_options .da_years").attr("baseTop"));
				var topPosBig = parseFloat(dp.find("#da_options_big .da_years").attr("baseTop"));				
				
				if(posY<offset.top) {
					event.preventDefault();
					dp.find("#da_options .da_years").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					dp.find("#da_options .da_years").trigger('mouseup');
				}
				else {
					var diff = Math.abs(topPosBig - topPos);
					if(dp.find("#da_options").attr('id') === jQuery(event.target).parent().attr('id'))
						dp.find("#da_options_big .da_years").css("top", parseInt(dp.find("#da_options .da_years").css('top'))-diff +"px");
					else dp.find("#da_options .da_years").css("top", parseInt(dp.find("#da_options_big .da_years").css('top'))+diff +"px");
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDAYears(offset, dp) {
		var firstYear = parseInt(dp.find("#da_options .da_years :first-child").text()),
		newStartYear = firstYear+offset;
		
		resetDAYears(dp.find("#da_options .da_years").children(), firstYear, newStartYear);
		resetDAYears(dp.find("#da_options_big .da_years").children(), firstYear, newStartYear);
		var topPos = -parseFloat(dp.find("#da_options .da_years").attr("baseTop"));
		var topPosBig = -parseFloat(dp.find("#da_options_big .da_years").attr("baseTop"));
		dp.find("#da_options .da_years").css('top', -topPos + 'px');
		dp.find("#da_options_big .da_years").css('top', -topPosBig + 'px');
	}
	
	function resetDAYears(currentYearList, firstYear, newStartYear) {
		for(var i=0; i<currentYearList.length; i++) {
			var item = jQuery(currentYearList[i]);
			var value = (newStartYear + i);
			var oldValue = (firstYear + i)
			
			item.removeClass("year" + oldValue);
			item.addClass("year" + value);
			item.text(value);
		}
	}
	
	function setDateValue(dp) {
		var month = hasMonths ? dp.find("#da_options .da_months :nth-child(11)").text() : "January";
		var year = parseInt(dp.find("#da_options .da_years :nth-child(11)").text());
		var day = hasDays ? dp.find("#da_options .da_days :nth-child(11)").text() : "1";
		var date = new Date(Date.parse(month + " " + day + ", " + year));
			
		if (input) {
			var inputDateFormat = "MM/yyyy";
			
			try {
				input.find("input").val(jimUtil.fromHTML(format(date, inputDateFormat)));
				input.trigger("parsedate");
			} catch (error) {}
		}
		
		if (onDateChange)
			onDateChange(date);
	}
	
	function bindHandlers(dp) {
		dp.find("#da_options > * , #da_options_big > *").each(function (index) {$(this).attr("baseTop", -1 * parseFloat($(this).css("top")));});
		
		dp.find('.da_months').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		dp.find('.da_days').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		dp.find('.da_years').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		
		if (hasMonths)
			bindMonths(dp);
		if (hasDays)
			bindDays(dp);
		bindYears(dp);
		
	}
	
	function correctDragDateWithZoom(evt, ui) {
        // zoom fix
    	var zoom = jimDevice.getZoom();
    	ui.position.top = -210 + (ui.position.top+210) * zoom;
    }
	
	var datepicker = {
		"getDatepickerHTML" : function (args) {
			var html = "<div id=\'jp-ui-scroll-datepicker\'>" +
							"<div>" +
								"<div id=\"da_options\">" +
									"<div class=\"da_months\"></div>" +
									"<div class=\"da_days\"></div>" +
									"<div class=\"da_years\"></div>" +
								"</div>" +
								"<div id=\"da_options_big\">" +
									"<div class=\"da_months\"></div>" +
									"<div class=\"da_days\"></div>" +
									"<div class=\"da_years\"></div>" +
								"</div>" +
								"<div class=\"da_mask\"></div>" +
							"</div>" +
						"</div>";
			return html;
		},
		/*
		 currentInput: jQuery element of the <input>
		 onDateChange: function to be called on drag end, receives date
		 onClick: function to be called on click, reveices jquery item
		 currentDate: date to start at
		 hasMonths: boolean. Show/hide the months picker
		 hasDays: boolean. Show/hide the day picker
		 monthsName: Array of 12 strings, for the months visualization
		*/
		"fillDatepicker" : function (dp, args) {//currentInput, newOnDateChange, newOnClick, currentDate, currentHasMonths, currentHasDays) {
			input = args['currentInput'];
			onDateChange = args['onDateChange'];
			onClick = args['onClick'];
			monthsVisual = months;
			
			if (args['hasMonths'] == undefined || args['hasMonths'] == null)
				hasMonths = true;
			else hasMonths = args['hasMonths'];
			
			if (args['hasDays'] == undefined || args['hasDays'] == null)
				hasDays = false;
			else hasDays = args['hasDays'];
			
			if (args['monthsName'])
				monthsVisual = args['monthsName'];
			
			fillDate(dp, args['currentDate']);
			bindHandlers(dp);
		},
		"getDateValue" : function (dp) {
			var month = hasMonths ? dp.find("#da_options .da_months :nth-child(11)").text() : "January";
			var year = parseInt(dp.find("#da_options .da_years :nth-child(11)").text());
			var day = hasDays ? dp.find("#da_options .da_days :nth-child(11)").text() : "1";
			return new Date(Date.parse(month + " " + day + ", " + year));
		}
	};
	window.datepicker = datepicker;

})(window);