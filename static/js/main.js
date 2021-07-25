var articleWrap = '.head-index .content';

function initHeadIndex() {
    console.log("init");
    $(document).headIndex({
        hasDynamicEffect: $('#switch_center').hasClass("tree"),
        articleWrapSelector: articleWrap,
        indexBoxSelector: '.index-box',
        offset: 20,
    });
}

function switchIndex() {
    $(document).headIndex("clean");
    initHeadIndex()
}

function initImgZoom() {
    var img = $('article img');

    img.wrap("<div class=\"imgZoom\"></div>");

    var initZoom = 1;

    function deactivate() {
        $(this).css('transform', 'scale(' + 1 + ')');
        $(this).removeClass("active")
    }

    img.on('click', function (e) {
        if ($(this).hasClass("active")) {
            deactivate.call(this);
        } else {
            $(this).addClass("active")
        }
    });

    img.on("mouseout", function (e) {
        deactivate.call(this);
    })

    img.on('mousewheel', function (e) {

        if (!$(this).hasClass("active")) return;
        e.preventDefault();

        var wheelData = e.originalEvent.wheelDelta / 120;

        if (wheelData > 0) {
            initZoom < 5 ? initZoom += 0.50 : null;
        } else {
            initZoom > 1 ? initZoom -= 0.50 : null;
        }
        $(this).css('transform', 'scale(' + initZoom + ')')
    });

    $('.imgZoom').on('mousemove', function (e) {
        var $this = $(this)
        var $img = $this.find('img');
        if (!$img.hasClass("active")) return;
        $img.css({
            'transform-origin': ((e.pageX - $this.offset().left) / $img.width()) * 100 + '% '
                + ((e.pageY - $this.offset().top) / $img.height()) * 100 + '%'
        });
    });
}

function initMarkdown() {
    var $content = $('article')

    // format blockquote
    var $bq = $content.find('blockquote');
    $bq.find("i[w],i[y]").closest("blockquote").addClass('colored warning');
    $bq.find("i[r]").closest("blockquote").addClass('colored red');
    $bq.find("i[g]").closest("blockquote").addClass('colored green');
    $bq.find("i[b]").closest("blockquote").addClass('colored black');

    $bq.find("i[s]").closest("blockquote").addClass('s');
    $bq.find("i[f]").closest("blockquote").addClass('f');

    initImgZoom();
}


function switchCenter() {
    var $body = $('body')
    $body.toggleClass("center");
    $.cookie('data-center', $body.hasClass("center") ? 'center' : null, {expires: 180, path: '/'})
}

function updateFont(next = false) {
    var font = $.cookie('data-font')
    font = parseInt(font);
    if (isNaN(font)) font = 1;

    if (next) font += 1;
    if (font > 4) font = 0

    $('body').removeClass("font-0 font-1 font-2 font-3 font-4").addClass("font-" + font)

    $.cookie('data-font', font, {expires: 180, path: '/'})
}

function initHeadIndexStatus() {
    console.log($.cookie("data-index"));
    console.log(typeof $.cookie("data-index"));
    var cIndex = $.cookie("data-index");
    if ($(articleWrap).find(":header").length === 0) {
        $('#switch_head-index').hide()
    } else if ('false' === cIndex || undefined === cIndex) {
        //do nothing
    } else {
        $('.float-box').show();
        initHeadIndex();
    }
}

$(function () {
    // 初始化配置
    initMarkdown();
    updateFont();
    initHeadIndexStatus();

    // 事件
    var $swHeadIndex = $('#switch_head-index'),
        $swFont = $('#switch_font'),
        $swCenter = $('#switch_center');

    $swHeadIndex.on('click', function (e) {
        e.preventDefault();
        // 点击即为切换
        $('.float-box').toggle();
        var isHidden = $('.float-box').is(':hidden');

        // 显示：则需要先初始化
        if (!isHidden && $(document).data('headIndex') === undefined) {
            initHeadIndex()
        }
        // 保存状态 每个页面保存每个页面的状态
        $.cookie("data-index", !isHidden, {expires: 180})
    });

    // 居中切换
    $swCenter.on('click', function (e) {
        e.preventDefault();
        switchCenter();
    })

    // 字体切换
    $swFont.on('click', function (e) {
        e.preventDefault();
        updateFont(true)
    })
})