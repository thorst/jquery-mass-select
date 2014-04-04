$.templates({
    myTemplateName: "<li><a href='#'><input type='checkbox' value='{{:value}}' /> {{:name}}</a></li>"
});
var templates = {
    button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
    ul: '<ul class="multiselect-container dropdown-menu"></ul>',
    filter: '<div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div>',
    li: '<li META><a href="#">CONTENTS</a></li>',
    divider: '<div class="divider"></div>',
    liGroup: '<li><label class="multiselect-group"></label></li>'
};
var
    createOptionValue = function (e) {
        // return '<li><a href="#"><input type="checkbox" value="'+e.value+'" /> '+e.name+'</a></li>';
        return templates.li
            .replace("CONTENTS", "<input type='checkbox' value='" + e.value + "' /> " + e.name)
            .replace("META", " value='" + e.value + "' text='" + e.name + "' class='v'")
        ;
    },
    createOptions = function () {
        log.s('Create plugin');
        //349
        var lis = [];
        $.each($select,function (index, element) {
                lis.push(createOptionValue(element));
        });
        $ul.append(lis.join(""));
        //211
        //var x = $.render.myTemplateName($select);
        //$ul.append(x);
     
        log.e('Create plugin');
    }
;
if (!window.console) console = {};
if (!window.console.time) { console.time = function () { }; console.timeEnd = function () { }; }
var log = {
    i: [],
    s: function (title) {
        console.time(title);
        log.i[title] = new Date().getTime();
    },
    e: function (title) {
        var end = new Date().getTime();
        console.timeEnd(title);
        var time = end - log.i[title];
        $("#log").append(title + ': ' + time + "ms\r");
        delete log.i[title];
    }
};

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
$(document).ready(function () {
    //Populate with some data
    log.s('Create data');
    var output = [];
    for (var i = 0; i < 1000; i++) {
        //output.push('<option value="' + i + '"> Value #' + i + '</option>');
        output.push({name:'Value #' + i,value:i, type:"option", isoption: true, ischecked:false});
    };
    log.e('Create data');
    //log.s('Render data');
    //$('#multiselect').html(output.join(''));
    //log.e('Render data');

    //Build dropdownoptions
    //$select = $("#multiselect");
    $select = output;
    $ul = $("#multiselect-ul");
    $cont = $("#multiselect-container");

    setTimeout(function () { createOptions();  }, 1);

    $("#showDropdown").click(function () {
        //add class is apparently faster 
        //http://stackoverflow.com/questions/9246242/which-is-faster-modifying-css-property-or-adding-class-in-jquery

        log.s('Toggle visibility');     
        var intended =$cont.css('margin-top') == '0px' ? '-1000px' : '0px';
        $cont.css('margin-top', intended);
        while (intended != $cont.css('margin-top')) { }
        log.e('Toggle visibility');
        //  $ul[0].style.display = 'block'
        return false;
    });

    $("#selectAll").change(function () {
        // 7 - 15ms
        var state = this.checked;
        log.s('Toggle all');
        //$ul.find("li a input").prop('checked', state);
        $ul.find("input").prop('checked', state);
        //$("input", $ul).prop('checked', state);
       
        log.e('Toggle all');
    });

    /*
     * using debounce can save on processing
     * but determining the direction can save on the
     * selector and thus loops
     */
    $SerchTerm = "";
    $("#searchText").on("keyup", function () {
        var that = this;
        delay(function () {
            var direc = "";
            if (that.value.length > $SerchTerm.length) {
                direc = ".v";
            } else if (that.value.length < $SerchTerm.length) {
                direc = ":not(.v)";
            } else {
                //determine the direction
                //for (var i = 0; i < that.value.length; i++) {
                //    console.log(that.value.slice(i, i + 1));
                //}
                direc = "";
            }
            $SerchTerm = that.value;

            //validate there is acutally data searching
            if (typeof $SerchTerm === "undefined" || $SerchTerm == "") {
                log.s('Search');
                $ul.find("li").addClass("v");
                log.e('Search');
                return;
            }

            console.log(direc);

            //32 for 1,000
            //446 for 10,000 native
            //385 for 10,000 jquery, individually adding classes
            //log.s('Search');
            //$ul.find("li" + direc).each(function (i, e) {
            //    var $this = $(this);
            //    var value = this.getAttribute("value");
            //   // var value = $this.attr("value");
            //    if (value.indexOf($SerchTerm) == -1) {
            //        $this.addClass("donotshow");
            //        //this.className = this.className + " donotshow";
            //    } else {
            //        $this.removeClass("donotshow");
            //        //this.className = this.className.replace(" donotshow","");
            //    }
            //});
            //log.e('Search');

            ////346 for 10,000 d1
            ////328 d2
            ////359 each
            //116 in chrome
            //best so far
            //reverse it sub 100
           // var tohide = [], toshow=[];
           // log.s('Search');
           // $ul.find("li" + direc).each(function (i, e) {
           //     var $this = $(this);
           //     var value = this.getAttribute("value");
       
           //     if (value.indexOf($SerchTerm) == -1) {
          
           //         tohide.push($this);
           //         return;
           //     }

           //     if (!$this.hasClass("v")) {
           //         toshow.push($this);
           //     }
           // });
           // //var d = $($.map(tohide, function(el){return $.makeArray(el)}));
           // var d = $($.map(tohide, function(el){return el.get();}));
           //d.removeClass("v");
           // // d.css('margin-top', '-1000px');

           // var d2 = $($.map(toshow, function (el) { return el.get(); }));
           // d2.addClass("v");
           //// d2.css('margin-top', '0px');

           // //$.each(tohide, function (i,e) {
           // //    e.addClass("donotshow");
           // //});
           // log.e('Search');


            //insanely slow
            //var tohide = [], toshow = [];
            //log.s('Search');
            //$.each($select, function (i,e) {
             
            //   // var $this = $(this);
            //  //  var value = this.getAttribute("value");
            // //   console.log(e.value);
            //    if (e.value.toString().indexOf($SerchTerm) == -1 && !e.ischecked) {

            //        tohide.push("li:eq("+i+")");
            //        return;
            //    } else {
            //        return;
            //    }

            //    if (e.ischecked) {
            //        toshow.push("li:eq(" + i + ")");
            //    }
            //});
            //console.log(tohide);
            ////var d = $($.map(tohide, function(el){return $.makeArray(el)}));
            ////var d = $($.map(tohide, function (el) { return el.get(); }));
            //var d = $(tohide.join(","), $ul);
            //console.log(d.length);
            //d.addClass("donotshow");

            //473
            //log.s('Search');
            //$ul.find("li" + direc).map(function (index, value) {
            //    $(value).toggle($(value).text().toLowerCase().indexOf($SerchTerm) >= 0);
            //});
            //log.e('Search');

            //342
            //var lis = $ul.find("li" + direc);
            //var list = $.makeArray($select.map(function (k, v) {
            //    return k.value.toString().toLowerCase();
            //}));
            //log.s('Search');
            //lis.each(function (index, value) {
            //    $(value).toggle(list[index].indexOf($SerchTerm) >= 0);
            //});
            //log.e('Search');

            //369 initially
            //var lis = $ul.find("li" + direc);
            //var list = $.makeArray($select.map(function (k, v) {
            //    return k.value.toString().toLowerCase();
            //}));
            //var tohide = [];
            //log.s('Search');
            //lis.each(function (index, value) {
            //    if (list[index].indexOf($SerchTerm) < 0) tohide.push($(value));
            //});
            //var d = $($.map(tohide, function(el){return el.get();}));
            //d.addClass("donotshow");
            //log.e('Search');

            //434
            //performs as expected down and up though
            //var tohide = [], toshow = [];
            //log.s('Search');
            //$ul.find("li" + direc).each(function (i, e) {
            //    var $this = $(this);
            //    var value = this.getAttribute("value");
             
            //    if ($this.filter("[value*='" + $SerchTerm + "']").length > 0) {

            //        if ($this.hasClass("donotshow")) {
            //            toshow.push($this);
            //        }
            //        return;
            //    }

            //    tohide.push($this);
                
            //});
            ////var d = $($.map(tohide, function(el){return $.makeArray(el)}));
            //var d = $($.map(tohide, function (el) { return el.get(); }));
            //d.addClass("donotshow");

            //var d2 = $($.map(toshow, function (el) { return el.get(); }));
            //d2.removeClass("donotshow");
            ////$.each(tohide, function (i,e) {
            ////    e.addClass("donotshow");
            ////});
            //log.e('Search');





            //pure jquery
            //308
            //log.s('Search');
            ////^= starts with
            ////*= contains
            //$ul.find("li:not(.donotshow):not([value*='" + $SerchTerm + "'])").addClass("donotshow");
            //log.e('Search');

            //This fully works and is about 355ms
            //pure jquery
            //log.s('Search');
            ////^= starts with
            ////*= contains
            //$ul.find("li.v:not([value*='" + $SerchTerm + "'])").removeClass("v");
            //$ul.find("li:not(.v)[value*='" + $SerchTerm + "']").addClass("v");
            //log.e('Search');


            //This fully works and is about 337ms
            //pure jquery
            log.s('Search');
            //^= starts with
            //*= contains
            if (direc == ".v") {
                $ul.find("li.v:not([value*='" + $SerchTerm + "'])").removeClass("v");

            } else if (direc == ":not(.v)") {
                $ul.find("li:not(.v)[value*='" + $SerchTerm + "']").addClass("v");
                
            } else {
                $ul.find("li.v:not([value*='" + $SerchTerm + "'])").removeClass("v");
                $ul.find("li:not(.v)[value*='" + $SerchTerm + "']").addClass("v");
            }
            log.e('Search');

            

            //pure jquery
            //353
            //log.s('Search');
            //////^= starts with
            //////*= contains
            //$ul.find("li.donotshow[value*='" + $SerchTerm + "']").removeClass("donotshow");
            //$ul.find("li:not(.donotshow):not([value*='" + $SerchTerm + "'])").addClass("donotshow");
            //log.e('Search');



            //pure jquery
            //628
            //log.s('Search');
            ////^= starts with
            ////*= contains
            //$ul.find("li").addClass("donotshow");
            //$ul.find("li[value*='" + $SerchTerm + "']").removeClass("donotshow");
            //log.e('Search');
        }, 200);
    });
    $("#getVals").click(function () {
        log.s('getVals');
        var vals = [];
        var x = $ul.find("input:checked").each(function (idx, e) { vals.push(e.value); });
        log.e('getVals');
        console.log(vals);
    });
});