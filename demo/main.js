$.templates({
    myTemplateName: "<li><a href='#'><label>test</label></a></li>"
});
var templates = {
    button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
    ul: '<ul class="multiselect-container dropdown-menu"></ul>',
    filter: '<div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div>',
    li: '<li><a href="#"><label>test</label></a></li>',
    divider: '<div class="divider"></div>',
    liGroup: '<li><label class="multiselect-group"></label></li>'
};
var
    createOptionValue = function (e) {
        return templates.li;
    },
    createOptions = function () {
        log.s('Create plugin');
        //209
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
$(document).ready(function () {
    //Populate with some data
    log.s('Create data');
    var output = [];
    for (var i = 0; i < 10000; i++) {
        //output.push('<option value="' + i + '"> Value #' + i + '</option>');
        output.push({name:'Value #' + i,value:i, type:"option"});
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

    setTimeout(function () { createOptions(); }, 1);

    $("#showDropdown").click(function () {
        log.s('Toggle visibility');     
        var intended =$cont.css('margin-top') == '0px' ? '-1000px' : '0px';
        $cont.css('margin-top', intended);
        while (intended != $cont.css('margin-top')) { }
        log.e('Toggle visibility');
        //  $ul[0].style.display = 'block'
        return false;
    });

});