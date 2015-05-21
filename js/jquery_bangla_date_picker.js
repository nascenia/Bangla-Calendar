(function ($) {
    function Bdatepicker() { // The Plugin
        this.local = [];
        this.local[""] = {
            closeText: "Done", // Display text for close link
            prevText: "Prev", // Display text for previous month link
            nextText: "Next", // Display text for next month link
            currentText: "Today", // Display text for current month link
            monthNames: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"], // Names of months for drop-down and formatting
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Column headings for days starting at Sunday
            weekHeader: "Wk", // Column header for week of the year
            dateFormat: "mm/dd/yy", // See format options on parseDate
            firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
            isRTL: false, // True if right-to-left language, false if left-to-right
            showMonthAfterYear: false, // True if the year select precedes month, false for month then year
            yearSuffix: "", // Additional text to append to the year in the month headers
            numbers: {
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9
            }
        };
        this._bmainDivId = 'ui-bdatepicker-div';
        this._bdpDiv = "<div id='" + this._bmainDivId + "'class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>";
        this.nextSelector = "#ui-bdatepicker-div .ui-datepicker-next";
        this.prevSelector = "#ui-bdatepicker-div .ui-datepicker-prev";
        this.monthSelection = '#changeMonth';
        this.yearSelection = '#changeYear';
        this._settings = {
            drawMonth: 0,
            drawYear: 0,
            selectedDay: 0,
            selectedMonth: 0,
            selector: '#ui-bdatepicker-div table.ui-datepicker-calendar tbody td a',
            changeYear: false,
            changeMonth: false,
            startYear: 1960,
            endYear: new Date().getFullYear() - 18,
            minYear: new Date().getFullYear() - 18,
            staticView: false
        };
        $.extend(this._settings, this.local[""]);
        this.local.en = $.extend(true, {}, this.local[""]);
        this.local["en-US"] = $.extend(true, {}, this.local.en);
    }

    $.extend(Bdatepicker.prototype, {
        setDefaults: function (settings) {
            $.extend(this._settings, settings);
        },
        _set_initial_date: function (target, inst) {
            var date = new Date();
            if ($(target).val() != '') {
                date_n = $(target).val().split('/');
                date = new Date(date_n[2], (parseInt(date_n[1]) - 1), date_n[0]);
                inst.settings.drawYear = date.getFullYear();
            }
            else if ($.bdatepicker._settings.minYear) {
                inst.settings.drawYear = $.bdatepicker._settings.minYear;
            }
            inst.settings.drawMonth = date.getMonth();
            inst.settings.selectedDay = date.getDate();
            inst.settings.selectedMonth = date.getMonth();
        },
        _get: function (inst, name) {
            return inst.settings[name] !== undefined ?
                inst.settings[name] : this._settings[name];
        },
        _showBdatepicker: function (input, inst) {
//console.log('show');
            this._set_initial_date(input, inst);
            var date_picker = $("#" + this._bmainDivId);
            var calender_body = this._generateHeader(inst) + this._generateData(inst);
            date_picker.html(calender_body);
            var position = $(input).offset();
            position.top += $(input).outerHeight();
            if (inst.settings.staticView) {
                date_picker.css({display: 'block', 'margin-top': -10, "z-index": 1200});
            }
            else {
                date_picker.css({
                    display: 'block',
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    "z-index": 1200
                });
            }
            this._bindActions(input, inst);
        },
        _hideDatePicker: function () {
            var date_picker = $("#" + this._bmainDivId);
            date_picker.css({display: 'none', position: 'absolute', top: 0, left: -100});
        },
        _bindActions: function (target, inst) {
            $(document).mouseup(function (e) {
                var container = $("#" + $.bdatepicker._bmainDivId);
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    if (!inst.settings.staticView) {
                        $.bdatepicker._hideDatePicker();
                    }
                }
            });

            $(document).off('mouseenter mouseleave', this._settings.selector + ',' + this.nextSelector + ',' + this.prevSelector).on('mouseenter mouseleave', this._settings.selector + ',' + this.nextSelector + ',' + this.prevSelector, function (e) {
                if (e.type == 'mouseenter') {
                    $(this).addClass('ui-state-hover');
                }
                else {
                    $(this).removeClass('ui-state-hover');
                }
            });

            $(document).off("click", this._settings.selector).on("click", this._settings.selector, function () {
                var element = $(this).parents('td');
                var day = element.attr('data-day');
                var month = element.attr('data-month');
                var year = element.attr('data-year');
                var formatted_date = day + "/" + (parseInt(month) + 1) + "/" + year;
                $(target).val(formatted_date);
                $($.bdatepicker._settings.selector).removeClass('ui-state-active');
                $(this).addClass('ui-state-active');
                if (!$.bdatepicker._settings.staticView) {
                    $.bdatepicker._hideDatePicker();
                }
            });

            $(document).off("click", this.nextSelector + "," + this.prevSelector).on("click", this.nextSelector + "," + this.prevSelector, function () {
                if ($(this).attr('data-handler') == 'next') {
                    inst.settings.drawMonth += 1;
                }
                else {
                    inst.settings.drawMonth -= 1;
                }
                if (inst.settings.drawMonth >= 12) {
                    inst.settings.drawYear += 1;
                    inst.settings.drawMonth = 0;
                }
                else if (inst.settings.drawMonth < 0) {
                    inst.settings.drawYear -= 1;
                    inst.settings.drawMonth = 11;
                }
                hideArrow(inst)
                var title = $.bdatepicker._getTitle(inst);
                $(this).parent().find('.ui-datepicker-title').html(title);
                var new_data = $.bdatepicker._generateDate(inst);
                $("#ui-bdatepicker-div table.ui-datepicker-calendar tbody").html(new_data);
                //$('select').customDropDown();
            });
            $(document).off('change', this.yearSelection + ',' + this.monthSelection).on('change', this.yearSelection + ',' + this.monthSelection, function () {
                var changeYear = $.bdatepicker._get(inst, 'changeYear');
                var changeMonth = $.bdatepicker._get(inst, 'changeMonth');
                if (changeYear) {
                    inst.settings.drawYear = parseInt($($.bdatepicker.yearSelection).val());
                }
                if (changeMonth) {
                    inst.settings.drawMonth = parseInt($($.bdatepicker.monthSelection).val());
                }
                var new_data = $.bdatepicker._generateDate(inst);
                $("#ui-bdatepicker-div table.ui-datepicker-calendar tbody").html(new_data);
            });
        },
        _generateHeader: function (inst) {
            var prevText = this._get(inst, 'prevText');
            var nextText = this._get(inst, 'nextText');
            title = "<div class='ui-datepicker-title'>" + this._getTitle(inst) + "</div>";
            html = "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all'>";
            html += "<a title=" + prevText + " data-handler='prev' class='ui-datepicker-prev ui-corner-all'><span class='ui-icon ui-icon-circle-triangle-w'>" + prevText + "</span></a>";
            html += "<a title=" + nextText + " data-handler='next' class='ui-datepicker-next ui-corner-all'><span class='ui-icon ui-icon-circle-triangle-e'>" + nextText + "</span></a>";
            html += title;
            return html + '</div>';
        },
        _getTitle: function (inst) {
            var yearName = "";
            var monthName = "";
            var changeYear = this._get(inst, 'changeYear');
            var changeMonth = this._get(inst, 'changeMonth');
            var monthNames = this._get(inst, 'monthNames');
            if (changeYear) {
                yearName = "<span class='ui-datepicker-year'>" + this._generateYearForChange(inst) + "</span>";
            }
            else {
                yearName = "<span class='ui-datepicker-year'>" + this._translateNumber(inst, inst.settings.drawYear) + "</span>";
            }
            if (changeMonth) {
                monthName = "<span class='ui-datepicker-month'>" + this._generateMonthForChange(inst) + " </span>";
            }
            else {
                monthName = "<span class='ui-datepicker-month'>" + monthNames[inst.settings.drawMonth] + " </span>";
            }
            return monthName + yearName;
        },
        _generateYearForChange: function (inst) {
            var startYear = this._get(inst, 'startYear');
            var endYear = this._get(inst, 'endYear');
            var selectYear = inst.settings.drawYear;
            var yearSelect = "<select class='ui-datepicker-year' id='changeYear'>";
            for (var year = endYear; year >= startYear; year--) {
                yearSelect += "<option " + (selectYear == year ? 'selected' : '') + " value='" + year + "'>" + this._translateNumber(inst, year) + "</option>";
            }
            return yearSelect + "</select>";
        },
        _generateMonthForChange: function (inst) {
            var monthNames = this._get(inst, 'monthNames');
            var selectMonth = inst.settings.drawMonth;
            var monthSelect = "<select class='ui-datepicker-month' id='changeMonth'>";
            for (var month = 0; month <= 11; month++) {
                monthSelect += "<option " + (selectMonth == month ? 'selected' : '') + " value='" + month + "'>" + monthNames[month] + "</option>";
            }
            return monthSelect + "</select>";
        },
        _generateData: function (inst) {
            var firstDay = this._settings.firstDay;
            var thead = "";
            var calender = "<table class='ui-datepicker-calendar'><thead>" + "<tr>";
            for (var dow = 0; dow < 7; dow++) { // days of the week
                var day = (dow + firstDay) % 7;
                thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
                    "<span title='" + this._settings.dayNames[day] + "'>" + this._settings.dayNamesMin[day] + "</span></th>";
            }
            calender += thead + "</tr></thead>";
            tbody = this._generateDate(inst);
            calender += tbody + "</tbody>";
            return calender + "</table>"
        },
        _generateDate: function (inst) {
            var tbody = "";
            var today = this._getCurrentDay();
            var days_in_month = this._daysInMonth(inst.settings.drawMonth + 1, inst.settings.drawYear);
            var first_day = this._getFirstDayInMonth(inst.settings.drawMonth, inst.settings.drawYear);
            var leadDays = (first_day - this._settings.firstDay + 7) % 7;
            var numRows = Math.ceil((leadDays + days_in_month) / 7); // calculate the number of rows to generate
            var printDate = this._daylightSavingAdjust(new Date(inst.settings.drawYear, inst.settings.drawMonth, 1 - leadDays));
            hideArrow(inst)
            for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                tbody += "<tr>";
                for (var dow = 0; dow < 7; dow++) { // create date picker days
                    var unselectable = (printDate.getMonth() !== inst.settings.drawMonth);
                    tbody += "<td class='" + ((dow + this._settings.firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "")
                        + "' data-handler='selectDay' data-year='" + printDate.getFullYear() + "' data-month='" + printDate.getMonth() + "' data-day='" + printDate.getDate() + "'>";
                    if (!unselectable) {
                        tbody += "<a class='ui-state-default " + ((inst.settings.selectedDay === printDate.getDate() && inst.settings.selectedMonth === printDate.getMonth()) ? ' ui-state-active ' : '') +
                            (today === printDate.getDate() ? 'ui-state-highlight' : '') + "' href='javascript:void(0);'>" + this._translateNumber(inst, printDate.getDate()) + "</a>";
                    }
                    tbody += "</td>";
                    printDate.setDate(printDate.getDate() + 1);
                    printDate = this._daylightSavingAdjust(printDate);
                }
                tbody += "</tr>";
            }
            return tbody;
        },
        _getCurrentDay: function () {
            var date = new Date();
            return date.getDate();
        },
        _daysInMonth: function (month, year) {
            return new Date(year, month, 0).getDate();
        },
        _getFirstDayInMonth: function (month, year) {
            var firstDay = new Date(year, month, 1);
            return firstDay.getDay();
        },
        _daylightSavingAdjust: function (date) {
            if (!date) {
                return null;
            }
            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
            return date;
        },
        _translateNumber: function (inst, text) {
            var numbers = this._get(inst, 'numbers');
            var new_num = "";
            text = "" + text;
            for (var i = 0; i < text.length; i++) {
                new_num += numbers[text[i]];
            }
            return new_num;
        },
        _attachBdatepicker: function (target, options) {
            var inst = {settings: ''};
            inst.settings = $.extend({}, options || {});
            if (inst.settings.staticView) {
                $.bdatepicker._showBdatepicker(target, inst);
            }
            else {
                $(target).click(function () {
                    $.bdatepicker._showBdatepicker(target, inst);
                });
            }
        }
    });
    $.fn.bdatepicker = function (options) {
        /* Append datepicker main container to body if not exist. */
        options = options || {}
        if ($("#" + $.bdatepicker._bmainDivId).length === 0) {
            if (options.staticView) {
                $(this).after($.bdatepicker._bdpDiv);
            }
            else {
                $("body").append($.bdatepicker._bdpDiv);
            }
        }
        return this.each(function () {
            $.bdatepicker._attachBdatepicker(this, options);
        });
    }
    var hideArrow = function (inst) {
        if (inst.settings.drawYear >= $.bdatepicker._settings.minYear && inst.settings.drawMonth == 11) {
            $($.bdatepicker.nextSelector).addClass('hidden');
        }
        else {
            $($.bdatepicker.nextSelector).removeClass('hidden');
        }
        if (inst.settings.drawYear <= $.bdatepicker._settings.startYear && inst.settings.drawMonth == 0) {
            $($.bdatepicker.prevSelector).addClass('hidden');
        }
        else {
            $($.bdatepicker.prevSelector).removeClass('hidden');
        }
    }
    $.bdatepicker = new Bdatepicker(); // singleton instance
    $.bdatepicker.uuid = new Date().getTime();
})(jQuery);