# jquery bangla datepicker
Extended plugin from jquery datepicker for bangla or fully localization for any language.
To use this plugin you required jquery.min.js and jquery-ui.css and the datepicker design will same as jquery datepicker. We actually user the same design from jquery-ui.css

Structure:

- js
  - jquery.min.js
  - jquery_bangla_datepicker.js
- css
  - jquery-ui.css
- localize
  - local_en.js
  - local_bn.js
index.html  

Localize: where you can write your localize file.

How to use:
<pre> 
$(function () {
  $.bdatepicker.setDefaults(bn);
  $('#date1').bdatepicker();
});
</pre>    

Settings:
<pre>
  drawMonth: 0,
  drawYear: 0,
  selectedDay: 0,
  selectedMonth: 0,
  changeYear: false,
  changeMonth: false,
  startYear: 1960,
  endYear: 2015,
  minYear: new Date().getFullYear(),
  staticView: false
</pre>


    

 
 
