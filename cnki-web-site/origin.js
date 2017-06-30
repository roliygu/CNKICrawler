function CreateCacheSpace(a, c) {
    var b = new CacheSpace(a, c);
    return b
}
function CacheSpace(a, b) {
    if (!isNaN(a)) {
        a = parseInt(a);
        if (a > 0) {
            a = a
        }
    } else {
        a = 20
    }
    this.size = a;
    this.list = new Array();
    this.length = 0;
    this.pointer = 0;
    this.type = b
}
CacheSpace.prototype = {
    find: function (a, c) {
        var b = this.length;
        var d = this.defaultFind;
        if (typeof c == "function") {
            d = c
        }
        while (b--) {
            if (d(this.list[b], a)) {
                return b
            }
        }
        return -1
    }, defaultFind: function (c, d) {
        return c == d
    }, enterSpace: function (a) {
        if (typeof a != "undefined") {
            if (this.type == 0) {
                if (this.pointer >= this.size) {
                    this.pointer = 0
                }
                this.list[this.pointer] = a;
                this.pointer++
            } else {
                if (this.pointer >= this.size) {
                    var b = this.list[0].time;
                    var d = 0;
                    for (var c = 1; c < this.size; c++) {
                        if (this.list[c].time < b) {
                            b = this.list[c].time;
                            d = c
                        }
                    }
                    this.list[d] = a
                } else {
                    this.list[this.pointer] = a;
                    this.pointer++
                }
            }
            if (this.length < this.size) {
                this.length++
            }
            return true
        }
        return false
    }, popSpace: function () {
        if (this.length > 0) {
            var a = this.list[this.pointer];
            this.list--;
            this.length--;
            return a
        }
        return null
    }, clearSpace: function () {
        this.length = 0;
        this.pointer = 0
    }, isEmpty: function () {
        if (this.length == 0) {
            return true
        } else {
            return false
        }
    }
};
CacheSpace.prototype.exfind = function (a) {
    return this.find(a, function (b) {
        return b.key == a
    })
};
CacheSpace.prototype.pushSpace = function (b, a) {
    if (b && a) {
        this.enterSpace({key: b, value: a, time: 1})
    }
};
CacheSpace.prototype.getExData = function (a) {
    var b = this.getEle(a);
    if (b) {
        b.time++;
        return b.value
    }
    return ""
};
CacheSpace.prototype.getEle = function (a) {
    var b = this.find(a, function (d, c) {
        if (d) {
            return d.key == c
        }
        return false
    });
    if (b >= 0 && b < this.length) {
        return this.list[b]
    }
    return null
};
$.ajaxWebServiceGlobalFalse = function (b, c, a) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: b,
        data: c,
        dataType: "json",
        global: false,
        success: a
    })
};
$.ajaxWebService = function (b, c, a) {
    $.ajax({type: "POST", contentType: "application/json", url: b, data: c, dataType: "json", success: a})
};
$.ajaxWebServiceFalse = function (b, c, a) {
    $.ajax({type: "POST", contentType: "application/json", url: b, data: c, dataType: "json", async: false, success: a})
};
$.fn.loadUserControl = function (b, a) {
    var c = this;
    if (a == "" || a == null) {
        a = location.pathname.replace("/", "")
    }
    a += "/RenderUserControl";
    $.ajaxWebService(a, "{control:'" + b + "'}", function (d) {
        c.html(d.d)
    })
};
jQuery.fn.pagination = function (b, a) {
    a = jQuery.extend({
        items_per_page: 10,
        num_display_entries: 10,
        current_page: 0,
        num_edge_entries: 0,
        link_to: "#",
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "...",
        prev_show_always: true,
        next_show_always: true,
        page_show_always: false,
        callback: function () {
            return false
        }
    }, a || {});
    return this.each(function () {
        function c() {
            return Math.ceil(b / a.items_per_page)
        }

        function d() {
            var l = Math.ceil(a.num_display_entries / 2);
            var m = c();
            var j = m - a.num_display_entries;
            var i = g > l ? Math.max(Math.min(g - l, j), 0) : 0;
            var k = g > l ? Math.min(g + l, m) : Math.min(a.num_display_entries, m);
            return [i, k]
        }

        function f(k, j) {
            g = k;
            h();
            var i = a.callback(k, e);
            if (!i) {
                if (j.stopPropagation) {
                    j.stopPropagation()
                } else {
                    j.cancelBubble = true
                }
            }
            return i
        }

        function h() {
            e.empty();
            var m = d();
            var o = c();
            if (o == 1 && !a.page_show_always) {
                return
            }
            var j = function (i) {
                return function (q) {
                    return f(i, q)
                }
            };
            var k = function (q, i) {
                q = q < 0 ? 0 : (q < o ? q : o - 1);
                i = jQuery.extend({text: q + 1, classes: ""}, i || {});
                if (q == g) {
                    var r = jQuery("<span class='current'>" + (i.text) + "</span>")
                } else {
                    var r = jQuery("<a>" + (i.text) + "</a>").bind("click", j(q)).attr("href", a.link_to.replace(/__id__/, q))
                }
                if (i.classes) {
                    r.addClass(i.classes)
                }
                e.append(r)
            };
            if (a.prev_text && (g > 0 || a.prev_show_always)) {
                k(g - 1, {text: a.prev_text, classes: "prev"})
            }
            if (m[0] > 0 && a.num_edge_entries > 0) {
                var p = Math.min(a.num_edge_entries, m[0]);
                for (var n = 0; n < p; n++) {
                    k(n)
                }
                if (a.num_edge_entries < m[0] && a.ellipse_text) {
                    jQuery("<span>" + a.ellipse_text + "</span>").appendTo(e)
                }
            }
            for (var n = m[0]; n < m[1]; n++) {
                k(n)
            }
            if (m[1] < o && a.num_edge_entries > 0) {
                if (o - a.num_edge_entries > m[1] && a.ellipse_text) {
                    jQuery("<span>" + a.ellipse_text + "</span>").appendTo(e)
                }
                var l = Math.max(o - a.num_edge_entries, m[1]);
                for (var n = l; n < o; n++) {
                    k(n)
                }
            }
            if (a.next_text && (g < o - 1 || a.next_show_always)) {
                k(g + 1, {text: a.next_text, classes: "next"})
            }
        }

        var g = a.current_page;
        b = (!b || b < 0) ? 1 : b;
        a.items_per_page = (!a.items_per_page || a.items_per_page < 0) ? 1 : a.items_per_page;
        var e = jQuery(this);
        this.selectPage = function (i) {
            f(i)
        };
        this.prevPage = function () {
            if (g > 0) {
                f(g - 1);
                return true
            } else {
                return false
            }
        };
        this.nextPage = function () {
            if (g < c() - 1) {
                f(g + 1);
                return true
            } else {
                return false
            }
        };
        h();
        a.callback(g, this)
    })
};
(function ($) {
    jQuery.fn.extend({
        showTip: function (settings) {
            $(this).each(function () {
                var options = jQuery.extend({
                    flagCss: "tip",
                    flagWidth: $(this).outerWidth(),
                    flagInfo: $(this).attr("title"),
                    isAnimate: false
                }, settings);
                if (!options.flagInfo) {
                    return
                }
                $(this).removeAttr("title");
                $(this).hover(function () {
                    options.flagWidth = (parseInt(options.flagWidth) < 100) ? 200 : parseInt(options.flagWidth);
                    var oTip = $("<div id='mytooptip' class='ui-slider-tooltip  ui-corner-all'></div>");
                    var oPointer = $("<div class='ui-tooltip-pointer-down'><div class='ui-tooltip-pointer-down-inner'></div></div>");
                    var oTipInfo = $("<div>" + options.flagInfo + "</div>").attr("class", options.flagCss).css("width", options.flagWidth + "px");
                    var oToolTip = $(oTip).append(oTipInfo).append(oPointer);
                    if (options.isAnimate) {
                        $(oToolTip).fadeIn("slow")
                    }
                    $(this).after(oToolTip);
                    var position = $(this).position();
                    var oTipTop = eval(position.top - $(oTip).outerHeight() - 8);
                    var oTipLeft = position.left - 22;
                    $(oToolTip).css("top", oTipTop + "px").css("left", oTipLeft + "px")
                }, function () {
                    $("#mytooptip").remove()
                })
            });
            return this
        }
    })
})(jQuery);
function GetSingleContent(ID, basePath, mark) {
    if (mark == "read" && !isLogin) {
        if (typeof loginState == "undefined" || loginState < 0) {
            window.open("/" + basePath + "/LoginDigital.aspx?contentId=" + encodeURIComponent(ID));
            return
        } else {
            if (loginState == 1) {
                window.open("/" + basePath + "/detail/detail.aspx?recid=" + encodeURIComponent(ID) + "&dbCode=CRDD");
                return
            }
        }
    }
    var sjson = "{'id': '" + escape(ID) + "'}";
    $.ajaxWebService("/" + basePath + "/Request/WebService.aspx/GetSingleContent", sjson, function (result) {
        if (result.d && result.d != "") {
            var restult = unescape(eval(result.d)[0].content);
            if (restult != "") {
                var loginState = $("#LoginState").attr("value");
                if (isLogin || loginState == 0) {
                    $("#" + ID + "_1").attr("style", "display:none")
                }
                $("#" + ID + "_2").attr("style", "display:none");
                $("#" + ID).attr("style", "display:block");
                $("#" + ID).html(unescape(eval(result.d)[0].content));
                SetFrameHeight()
            }
        }
    })
};
var resAsyn = {};
resAsyn.popId = "div_sel";
resAsyn.ifmId = "ifm_low";
resAsyn.popCss = "selBox";
resAsyn.ifmCss = "ifmBox";
resAsyn.url = "../request/resultAsync.aspx";
resAsyn.iptId1 = "sel_org";
resAsyn.iptId2 = "sel_area";
resAsyn.iptId3 = "sel_typ";
resAsyn.srcA = "../images/gb/01.gif";
resAsyn.srcR = "../images/gb/02.gif";
resAsyn.create = function () {
    var b = document.getElementById(resAsyn.ifmId);
    if (b == null || b == undefined) {
        b = document.createElement("iframe");
        b.id = resAsyn.ifmId;
        b.className = resAsyn.ifmCss;
        document.body.appendChild(b)
    }
    b.style.display = "inline";
    var a = document.getElementById(resAsyn.popId);
    if (a == null || a == undefined) {
        a = document.createElement("div");
        a.id = resAsyn.popId;
        a.className = resAsyn.popCss;
        document.body.appendChild(a);
        $(a).bind("click", function (c) {
            resAsyn.stopBubble(c)
        })
    }
    a.style.display = "inline";
    return a
};
resAsyn.pop = function (g, c, d, f) {
    var a = resAsyn.create();
    var b = {htp: "1", type: c, lvl: d};
    jQuery.ajax({
        type: "POST", url: resAsyn.url, data: b, cache: false, success: function (e) {
            a.innerHTML = e;
            resAsyn.imgHide();
            resAsyn.resetIfm()
        }
    });
    resAsyn.postion(g, a);
    resAsyn.stopBubble(f)
};
resAsyn.expd = function (a, f, g, d, h) {
    var c = $(a).children("img");
    var i = c.attr("src");
    if (i.length > resAsyn.srcA.length) {
        i = "../" + i.slice(0 - (resAsyn.srcA.length - 3))
    }
    var j = $(a).parents("tr").next(".listChild");
    resAsyn.resImg(a);
    if (i == resAsyn.srcA) {
        var k = parseInt(d) + 1;
        var b = {htp: "2", type: g, lvl: k, code: f};
        jQuery.ajax({
            type: "POST", url: resAsyn.url, data: b, cache: true, success: function (e) {
                j.children("td").html(e);
                resAsyn.imgHide();
                resAsyn.resetIfm()
            }
        });
        i = resAsyn.srcR;
        j.show();
        $(a).next().addClass("active")
    } else {
        if (i == resAsyn.srcR) {
            i = resAsyn.srcA;
            j.hide();
            resAsyn.resetIfm()
        }
    }
    c.attr("src", i);
    resAsyn.stopBubble(h)
};
resAsyn.postion = function (f, a) {
    var c = $("#" + resAsyn.popId);
    var d = $("#" + resAsyn.ifmId);
    var e = $(f).offset().left;
    var b = $(f).offset().top;
    c.css("left", 450);
    c.css("top", b + 10);
    d.css("left", 450);
    d.css("top", b + 10)
};
resAsyn.sel = function (d, a, b) {
    if (d && b) {
        var c = null;
        if (b == 1) {
            c = resAsyn.iptId1
        } else {
            if (b == 2) {
                c = resAsyn.iptId2
            } else {
                if (b == 3) {
                    c = resAsyn.iptId3
                }
            }
        }
        document.getElementById(c).value = d.innerHTML;
        document.getElementById("ipt_" + c).value = a + "?";
        resAsyn.hide()
    }
};
resAsyn.hide = function () {
    var a = document.getElementById(resAsyn.popId);
    if (a && a.style.display != "none") {
        a.style.display = "none"
    }
    var b = document.getElementById(resAsyn.ifmId);
    if (b && b.style.display != "none") {
        b.style.display = "none"
    }
};
resAsyn.imgHide = function () {
    $("#" + resAsyn.popId).find("img").each(function (b, a) {
        if ($(this).attr("src") == "" || $(this).attr("src") == undefined) {
            $(this).hide()
        }
    })
};
resAsyn.resImg = function (a) {
    $(a).parents("tr:eq(0)").find("img").each(function () {
        if ($(this).attr("src") == resAsyn.srcR) {
            $(this).attr("src", resAsyn.srcA)
        }
    });
    $(a).parents("tr:eq(0)").children("td").each(function () {
        $(this).find("a").removeClass("active")
    })
};
if (document.onclick) {
    var tmpFun = document.onclick;
    document.onclick = function () {
        if (typeof(tmpFun) == "function") {
            tmpFun()
        }
        resAsyn.hide()
    }
} else {
    document.onclick = resAsyn.hide
}
resAsyn.stopBubble = function (a) {
    if (a && a.stopPropagation) {
        a.stopPropagation()
    } else {
        window.event.cancelBubble = true
    }
};
resAsyn.resetIfm = function () {
    var a = $("#" + resAsyn.popId);
    var b = $("#" + resAsyn.ifmId);
    b.height(a.height() + 7);
    b.width(a.width() + 7)
};
resAsyn.clear = function (d, a, b) {
    if (d && b) {
        var c = null;
        if (b == 1) {
            c = resAsyn.iptId1
        } else {
            if (b == 2) {
                c = resAsyn.iptId2
            } else {
                if (b == 3) {
                    c = resAsyn.iptId3
                }
            }
        }
        document.getElementById(c).value = "";
        document.getElementById("ipt_" + c).value = "";
        resAsyn.hide()
    }
};
$.fn.autoWidth = function () {
    var o = $(this).find("ul").width();
    var l = parseInt($(this).find("ul").children().eq(0).css("margin-right"));
    var c = 0;
    var a = -1;
    $(this).find("ul").children().each(function () {
        a++;
        c = c + $(this).width() + l;
        if (c >= o) {
            return false
        }
    });
    var d = a;
    var n = Math.ceil($(this).find("ul").children().length / a);
    var g = this;
    var f = h(g, d, n, l);
    while (f > o) {
        d--;
        n = Math.ceil($(this).find("ul").children().length / d);
        f = h(g, d, n, l)
    }
    var e = new Array();
    for (a = 0; a <= d - 1; a++) {
        e[a] = 0
    }
    for (var b = 0; b <= d - 1; b++) {
        for (var m = 0; m <= n - 1; m++) {
            if ($(this).find("ul").children().eq(b + m * d).width() >= e[b]) {
                e[b] = $(this).find("ul").children().eq(b + m * d).width()
            }
        }
    }
    for (b = 0; b <= d - 1; b++) {
        for (m = 0; m <= n - 1; m++) {
            $(this).find("ul").children().eq(b + m * d).css("width", e[b])
        }
    }
    function h(t, s, x, v) {
        var r = new Array();
        for (var p = 0; p <= s - 1; p++) {
            r[p] = $(t).find("ul").children().eq(p).width()
        }
        var u = 0;
        for (var q = 0; q <= s - 1; q++) {
            for (var w = 0; w <= x - 1; w++) {
                if ($(t).find("ul").children().eq(q + w * s).width() >= r[q]) {
                    r[q] = $(t).find("ul").children().eq(q + w * s).width()
                }
            }
        }
        for (p = 0; p <= s - 1; p++) {
            u += r[p];
            u += v
        }
        return u
    }
};
var LanguageEncode = "GB";
var message = {
    mostInput: "您最多只能输入",
    keyNum: "个字",
    key: "个",
    searchTooLongError: "检索式超长,请减少检索条件再检",
    reSearch: "未检索到结果，请检查检索条件!",
    searchWaiting: "正在查询,请稍等...",
    noContainRelative: "下级不包含相关检索内容",
    inputSearchWord1: "请输入检索词！",
    unLimit: "不限",
    papers: "系列论文集",
    meetings: "系列会议",
    mostSelect: "最多只能选择",
    loading: "正在加载数据,请稍等....",
    dataError1: "开始日期大于或者等于结束日期,请重新输入!",
    dataError2: "开始日期输入有误,请重新输入!",
    dataError3: "结束日期输入有误,请重新输入!",
    dataError4: "日期输入有误,请重新输入!",
    selectOneDB1: "请至少选择一个数据库!",
    noMoreDB: "不能超过15个数据库!",
    singleDBSelect: "只选中一个库，将进入单库导航页面!",
    selectNavigate: "请选择导航!",
    rssMessage1: "RSS文件地址已经复制到剪贴板中，您可以直接打开RSS客户端阅读软件，右键粘贴，增加频道",
    rssMessage2: "被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'",
    inputTurnPage: "请输入跳转的页数",
    numOnly: "只能输入数字",
    dingzhiMessage1: "请选择需要定制的记录！",
    recordOne: "只能选择一条记录！",
    tougaoMessage: "请选择需要投稿的记录！",
    navigating: "正在导航,请稍等...",
    zhuanyeGuan: "一次最多定制20个专业馆,请重新选择",
    navigate: "导航",
    pageError1: "页面超时，请刷新后重新操作！",
    leaf: "页",
    selectItem: "请选择项目",
    noKeyWord1: "没有此主题词！",
    searchError1: "检索出错！",
    CNKeyWordNum: "中文主题词  模糊查询结果：共",
    prePage: "上一页",
    nextPage: "下一页",
    knowledgeMessage: "知识网络中心窗口未打开，请临时关闭您的上网助手等工具。",
    noKeyWord2: "很抱歉，没有找到相关的文献。",
    serverError: "很抱歉，服务器暂时不能提供服务，请稍后再试。",
    totalRecorde: "共有记录",
    tiao: "条",
    qizhong: "其中",
    dbSelect: "数据库切换：",
    oneNavigateSelect: "请您至少选择一个导航条件",
    twoKeyWord: "同句/同段检索需要输入两个检索词",
    inputSearchFormula: "请输入检索式名称",
    inputQiKanNum: "请输入正确的期刊数",
    inputParms: "请输入正确的参数",
    inputParmsError: "您输入的参数存在非法字符,请重新输入!",
    reInputSearchItem: "请重新配置检索项！",
    groupSelect: "您可以按如下文献分组排序方式选择文献：",
    moreGroup: "分组只对前4万条记录分组,排序只在800万条记录以内有效",
    inputDate: "点击输入日期",
    inputISSN: "输入期刊名称，ISSN,CN均可",
    inputSource: "输入来源名称",
    inputFun1: "输入基金名称",
    inputAuthor1: "输入作者姓名",
    inputAll: "输入作者单位，全称、简称、曾用名均可",
    inputSearchWord2: "输入检索词:",
    selectOneDB2: "请您至少选择一个数据库!",
    noSource: "此库没有文献来源",
    noKeyWord: "还没有检索词,请稍后再用。",
    oneKeyWord: "请先输入一个词!",
    yourNeedKeyWord: "请输入您所需的检索词",
    changing: "切换中，请耐心等待……",
    pleaseInput: "请输入",
    mustSelect: "最多只能选择",
    noCloseWin: "系统不能弹出新页面进一步选择，请关闭您的窗口拦截功能。",
    noNull: "不能为空!",
    search: "直接检索",
    fontType: "宋体",
    searchError2: "检索项中不能输入; ' \" < >  等字符!",
    searchError3: "检索项不允许输入：' ;  \"  <  > 等字符！",
    noInput: "不能输入",
    more: "更多",
    revert: "还原",
    loadingData: "正在加载数据，请稍候...",
    sunday: "日",
    one: "一",
    two: "二",
    three: "三",
    four: "四",
    five: "五",
    six: "六",
    Jan: "一月",
    Feb: "二月",
    Mar: "三月",
    Apr: "四月",
    May: "五月",
    Jun: "六月",
    Jul: "七月",
    Aug: "八月",
    Sep: "九月",
    Oct: "十月",
    Nov: "十一月",
    Dec: "十二月",
    searchingLoad: "正在检索，请稍候...",
    pre1949: "1949以前",
    selectSelect: "请勾选选择对象前的复选框!",
    lookTxt: "查看本文在",
    year: "年的",
    knowledgeResult1: "知网节保存结果",
    knowledgeResult2: "知网节下载功能不能正常工作，请您暂时关闭上网助手等拦截窗口的软件。",
    clickInput: "点击输入",
    inputAuthor2: "输入作者",
    allSubDB: "全部子库",
    allXueKe: "全部学科",
    allSource: "全部资源",
    allLayer: "全部研究层次",
    inputFun2: "输入基金",
    inputUnit1: "输入作者单位",
    inputUnit2: "输入主办单位名称",
    inputUnit3: "请输入学位授予单位名称",
    inputUnit4: "输入出版单位名称",
    inputUnit5: "输入单位",
    inputNaming1: "输入会议名称",
    inputNaming2: "输入年鉴名称",
    inputNaming3: "输入报纸名称",
    inputNaming4: "输入主编或作者",
    inputNaming5: "输入期刊名称",
    noInputWord1: "不能输入：' \" ; 等字符！",
    noInputWord2: "不能输入：'、\"; 等字符！",
    atless: "请选择至少一条记录!",
    noBack: "未找到返回点! 请重新选择。",
    txting: "【全文快照】",
    snapSearching: "全文快照搜索",
    selectTime: "请选择时间！",
    checkFile: "请检查配置文件是否存在！",
    inputPage: "请输入页码！",
    inputPageEmsg: "请输入正确的页码！",
    fiveSlect: "最多选择50项",
    noHistory: "没有检索历史",
    noNullaccount: "帐号不能为空!",
    noNullPW: "密码不能为空!",
    inputUserName: "请输入用户名称",
    searchError4: "检索错误或记录集失效，请重新检索！",
    dingzhiMessage2: "请选择要定制的项",
    loadinging: "正在加载...",
    inputSearchWord3: "输入检索词",
    saveSelectMsg: "没有选择任何字段！",
    txtingError: "很抱歉，本节点文献的全文中没有您要检索的内容。",
    postFormTip1: "输入缺期线索的详细内容太多,应在350字以内！",
    postFormTip2: "上传文件不能大于4M！",
    postFormTip3: "请上传原刊电子版，或者输入缺期线索的详细内容！",
    postFormTip4: "年、期不能为空！",
    postFormTip5: "提交失败！",
    postFormTip6: "已有此文件，请您改名重新上传！",
    postFormTip7: "不可上传此种格式的文件！",
    postFormTip8: "提交成功，谢谢您的参与！",
    PageTurnTip: "键盘的“← →”可以实现快速翻页"
};
var waitingTip = " ";
var ISIE = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera;
try {
    if (window.HTMLElement) {
        var outerHTMLFun1 = function (c) {
            var a = this.ownerDocument.createRange();
            a.setStartBefore(this);
            var b = a.createContextualFragment(c);
            this.parentNode.replaceChild(b, this);
            return c
        };
        var outerHTMLFun2 = function () {
            var d;
            var a = this.attributes;
            var b = "<" + this.tagName.toLowerCase();
            for (var c = 0; c < a.length; c++) {
                d = a[c];
                if (d.specified) {
                    b += " " + d.name + '="' + d.value + '"'
                }
            }
            if (!this.canHaveChildren) {
                return b + ">"
            }
            return b + ">" + this.innerHTML + "</" + this.tagName.toLowerCase() + ">"
        };
        var outerHTMLFun3 = function () {
            switch (this.tagName.toLowerCase()) {
                case"area":
                case"base":
                case"basefont":
                case"col":
                case"frame":
                case"hr":
                case"img":
                case"br":
                case"input":
                case"isindex":
                case"link":
                case"meta":
                case"param":
                    return false
            }
            return true
        };
        if (HTMLElement.prototype.__defineSetter__) {
            HTMLElement.prototype.__defineSetter__("outerHTML", outerHTMLFun1);
            HTMLElement.prototype.__defineGetter__("outerHTML", outerHTMLFun2);
            HTMLElement.prototype.__defineGetter__("canHaveChildren", outerHTMLFun3)
        } else {
            Object.defineProperty(HTMLElement, "outerHTML", outerHTMLFun1);
            Object.defineProperty(HTMLElement, "outerHTML", outerHTMLFun2);
            Object.defineProperty(HTMLElement, "canHaveChildren", outerHTMLFun3)
        }
    }
} catch (e) {
}
function getBasePath() {
    var f = window.document.location.href;
    var c = window.document.location.pathname;
    var d = f.indexOf(c);
    var a = f.substring(0, d);
    var b = c.substring(0, c.substr(1).indexOf("/") + 1);
    return (a + b)
}
String.prototype.format = function () {
    var a = arguments;
    return this.replace(/\{(\d+)\}/g, function (b, c) {
        return a[c]
    })
};
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "")
};
String.prototype.LTrim = function () {
    return this.replace(/(^\s*)/g, "")
};
String.prototype.RTrim = function () {
    return this.replace(/(\s*$)/g, "")
};
function OpenWindow(c, a, b) {
    if (c == undefined || c == null || c == "") {
        return
    }
    if (b == undefined || b == null || b == "") {
        if (a == undefined || a == null || a == "") {
            window.open(c)
        } else {
            window.open(c, a)
        }
    } else {
        try {
            window.open(c, a, b)
        } catch (d) {
            window.open(c, a)
        }
    }
}
function ge(a) {
    return document.getElementById(a)
}
function GetQueryStringByName(c, a) {
    if ("[object String]" == Object.prototype.toString.call(c) && "[object String]" == Object.prototype.toString.call(a)) {
        var b = c.match(new RegExp("[?&]" + a + "=([^&]+)", "i"));
        if (b == null || b.length < 1) {
            return ""
        }
        return b[1]
    }
    return ""
}
function SetQueryStringByName(f, a, b) {
    if ("[object String]" == Object.prototype.toString.call(f)) {
        var c = f.match(new RegExp("([?&]+)" + a + "=[^&]*", "i"));
        var d = f;
        if (c != null) {
            d = f.replace(c[0], c[1] + a + "=" + encodeURI(b))
        } else {
            d = f + "&" + a + "=" + b
        }
        return d
    }
    return ""
}
function getElementsByClassName(g, h, k, j) {
    h = h || "*";
    if (!j) {
        if (k) {
            k = document.getElementById(k)
        } else {
            k = k || document
        }
    }
    if (!k) {
        return false
    }
    var f = (h == "*" && k.all) ? k.all : k.getElementsByTagName(h);
    var d = new Array();
    g = g.replace(/\-/g, "\\-");
    var m = new RegExp("(^|\\s)" + g + "(\\s|$)");
    var b;
    for (var a = 0, c = f.length; a < c; a++) {
        b = f[a];
        if (m.test(b.className)) {
            d.push(b)
        }
    }
    return d
}
function SetDisplayValue(b, a) {
    var c = ge(b);
    if (c) {
        if (c.style) {
            c.style.display = a
        }
    }
}
function FillValue(c, a) {
    var b = ge(c);
    if (b) {
        b.value = a
    }
}
function getEmValue(b) {
    var a = ge(b);
    if (a) {
        return a.value
    }
    return ""
}
function GetInputValue(a) {
    return getEmValue(a)
}
function LoadScript(a, c) {
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.src = a;
    document.getElementsByTagName("head")[0].appendChild(b);
    if (b.readyState) {
        b.onreadystatechange = function () {
            if (b.readyState == "loaded" || b.readyState == "complete") {
                b.onreadystatechange = null;
                if (c) {
                    c()
                }
            }
        }
    } else {
        b.onload = function () {
            if (c) {
                c()
            }
        }
    }
}
function J(a) {
    return document.createElement(a)
}
function O(a, b, c) {
    if (ISIE) {
        if (b == "load") {
            a.onreadystatechange = function () {
                if (this.readyState == "loaded") {
                    c()
                }
            }
        } else {
            a.attachEvent("on" + b, (function (d) {
                return function () {
                    c.call(d)
                }
            })(a))
        }
    } else {
        a.addEventListener(b, c, false)
    }
}
function CoreDomainLoadJson() {
    this.C;
    this.J = J;
    this.O = O;
    this.Load = function (d, a, b) {
        var c = document.getElementById(b);
        if (c) {
            document.body.removeChild(c)
        }
        this.C = J("SCRIPT");
        this.C.type = "text/javascript";
        if (typeof b == "string" && b.length > 0) {
            this.C.id = b
        } else {
            this.C.id = "callScriptE"
        }
        this.C.src = d + "&td=" + (new Date()).getTime();
        this.C.charset = "utf-8";
        document.body.appendChild(this.C);
        O(this.C, "load", a)
    }
}
function GetLoginStatus(c) {
    var d = document.getElementById("divlogin");
    if (d != null && d != undefined && d != "undefined") {
        var b = "/kns/Request/login.aspx?";
        if (c) {
            b += c
        }
        var a = new CoreDomainLoadJson();
        a.Load(b, function () {
            if (typeof oJson != "undefined") {
                try {
                    var f = oJson.LoginUserHTML;
                    if (typeof f != "undefined" && f != "") {
                        d.innerHTML = f
                    }
                } catch (g) {
                }
            }
            GetUserCenter($("#hid_uid").val())
        }, "loginstatus_JS")
    }
}
function SubScription(h, b, a, d) {
    var g = getCookie("cnkiUserKey");
    var c = "../Request/SubScription.aspx";
    var f = ge("subScriptionForm");
    if (f) {
        document.body.removeChild(f)
    }
    f = document.createElement("form");
    f.id = "subScriptionForm";
    f.name = "subScriptionForm";
    f.method = "post";
    f.setAttribute("target", "_blank");
    f.action = c;
    AppendElement(f, GetIntpuElement("SubT", h));
    AppendElement(f, GetIntpuElement("SubC", b));
    AppendElement(f, GetIntpuElement("SubD", a));
    AppendElement(f, GetIntpuElement("cnkiuserkey", g));
    AppendElement(f, GetIntpuElement("SubP", d));
    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f)
}
function AppendElement(b, a) {
    if (b && a) {
        b.appendChild(a)
    }
}
function GetIntpuElement(a, c) {
    var b = document.createElement("input");
    b.setAttribute("name", a);
    b.setAttribute("value", c);
    return b
}
function AddFavorites(d, b) {
    var f = {};
    var g = navigator.userAgent.toLowerCase();
    var a;
    (a = g.match(/msie ([\d.]+)/)) ? f.ie = a[1] : (a = g.match(/firefox\/([\d.]+)/)) ? f.firefox = a[1] : (a = g.match(/chrome\/([\d.]+)/)) ? f.chrome = a[1] : (a = g.match(/opera.([\d.]+)/)) ? f.opera = a[1] : (a = g.match(/version\/([\d.]+).*safari/)) ? f.safari = a[1] : 0;
    var c = d;
    if (document.getElementsByName(d)[0]) {
        c = document.getElementsByName(d)[0].href
    }
    if (f.chrome) {
        window.open("http://www.google.com/bookmarks/mark?op=edit&bkmk=" + c + "&title=" + b, "谷歌书签");
        return
    }
    if (f.firefox) {
        window.sidebar.addPanel(b, c, "")
    }
    if (f.ie) {
        window.external.addFavorite(c, b)
    }
}
function SetFrameHeight() {
    function b(j) {
        var i = 300;
        if (j < i) {
            return i
        }
        return j
    }

    function c(i) {
        if ((i.contentWindow.document == document) || (i.contentWindow.document.frames.name == document.frames.name)) {
            i.style.height = b(document.body.scrollHeight) + "px"
        }
    }

    function f(i) {
        if (i.contentWindow.document == document) {
            if (document.body.offsetHeight == 0 && document.body.scrollHeight != 0) {
                i.style.height = b(document.body.scrollHeight) + "px"
            } else {
                i.style.height = b(document.body.offsetHeight) + "px"
            }
        }
    }

    function a(i) {
        if (document.all) {
            a = c
        } else {
            a = f
        }
        a(i)
    }

    if (parent) {
        var d = new Array();
        d = parent.document.getElementsByTagName("iframe");
        var h = d.length;
        for (var g = 0; g < h; g++) {
            a(d[g])
        }
    }
}
function getCookie(a, c) {
    if (window.localStorage || window.sessionStorage) {
        if (c == "2") {
            return window.sessionStorage.getItem(a)
        }
        return window.localStorage.getItem(a)
    }
    var b = a + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(b);
        if (offset != -1) {
            offset += b.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) {
                end = document.cookie.length
            }
            return unescape(document.cookie.substring(offset, end))
        }
    }
}
function GetWebUserIP() {
    var g = window.sessionStorage ? window.sessionStorage.getItem("curUserIP") : "";
    var f = function (h) {
        var d = ge("footerrightdiv");
        if (d) {
            if (d.innerHTML.indexOf("您当前IP") < 0) {
                d.innerHTML += "<br/>您当前IP：" + h
            }
        }
    };
    if (!g || g.length <= 0) {
        var c = new Date;
        var b = "/kns/Request/getuserip.ashx?t=" + c.getTime();
        var a = new CoreDomainLoadJson();
        a.Load(b, function () {
            if (typeof ipinfo != "undefined") {
                try {
                    if (ipinfo.ip && ipinfo.ip.length > 0) {
                        if (window.sessionStorage) {
                            window.sessionStorage.setItem("curUserIP", ipinfo.ip)
                        }
                        f(ipinfo.ip)
                    }
                } catch (d) {
                }
            }
        }, "getuserip_JS")
    } else {
        f(g)
    }
}
function IsWideScreen() {
    if (window.screen.width >= 1280) {
        return true
    } else {
        return false
    }
}
function getFocusElementId() {
    if (!document.activeElement) {
        document.activeElement = null;
        var b = document.getElementsByTagName("*");
        var c = b.length;
        for (var a = 0; a < c; a++) {
            b[a].onfocus = function () {
                document.activeElement = this;
                return this.id
            }
        }
    } else {
        return document.activeElement.id
    }
}
function OnclickForHideMoredo() {
    var b = $("#flagShowHide").val();
    var a = getFocusElementId();
    if (a != "moredo") {
        if (b != "true") {
            $("#dbother_div").hide()
        }
    }
}
function setflag(a) {
    $("#flagShowHide").val(a)
};
function _getXmlHttp() {
    /*@cc_on @*/
    /*@if (@_jscript_version >= 5)
     var progids=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]
     for (i in progids) {
     try { return new ActiveXObject(progids[i]) }
     catch (e) {}
     }
     @end @*/
    try {
        return new XMLHttpRequest()
    } catch (e2) {
        return null
    }
}
function CachedResponse(a) {
    this.readyState = ReadyState.Complete;
    this.status = HttpStatus.OK;
    this.responseText = a
}
ReadyState = {Uninitialized: 0, Loading: 1, Loaded: 2, Interactive: 3, Complete: 4};
HttpStatus = {OK: 200, NotFound: 404};
function Request_from_cache(c, b) {
    var a = this._cache[c];
    if (a != null) {
        var d = new CachedResponse(a);
        b(d);
        return true
    } else {
        return false
    }
}
function Request_cached_get(b, a) {
    if (!this.FromCache(b, a)) {
        var c = this;
        this.Get(b, function (d) {
            if ((d.readyState == ReadyState.Complete) && (d.status == HttpStatus.OK)) {
                c._cache[b] = d.responseText
            }
            a(d)
        }, "GET")
    }
}
function Request_get(c, b, a) {
    if (!this._get) {
        return
    }
    if (a == null) {
        a = "GET"
    }
    if (this._get.readyState != ReadyState.Uninitialized) {
        this._get.abort()
    }
    if (a && a == "POST") {
        var d = c.split("?");
        if (d) {
            this._get.open(a, d[0], true)
        } else {
            this._get.open(a, c, true)
        }
        this._get.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (b != null) {
            var e = this._get;
            this._get.onreadystatechange = function () {
                b(e)
            }
        }
        if (d) {
            this._get.send(d[1])
        } else {
            this._get.send(c)
        }
    } else {
        this._get.open(a, c, true);
        if (b != null) {
            var e = this._get;
            this._get.onreadystatechange = function () {
                b(e)
            }
        }
        this._get.send(null)
    }
}
function Request_get_no_cache(d, c, a) {
    var e = (-1 < d.indexOf("?")) ? "&" : "?";
    var b = d + e + "__=" + encodeURIComponent((new Date()).toString());
    return this.Get(b, c, a)
}
function Request() {
    this.Get = Request_get;
    this.GetNoCache = Request_get_no_cache;
    this.CachedGet = Request_cached_get;
    this.FromCache = Request_from_cache;
    this.Use = function () {
        return this._get != null
    };
    this.Cancel = function () {
        if (this._get) {
            this._get.abort()
        }
    };
    this._cache = new Object();
    this._get = _getXmlHttp();
    if (this._get == null) {
        return
    }
}
var waitDiv;
var waitElement;
var scrollX, scrollY = -1;
function MoveWaitElement(d) {
    var c, a;
    if (!waitElement) {
        CreateWaitElement()
    }
    if (window.pageYOffset && typeof(window.pageYOffset) == "number") {
        c = window.pageYOffset;
        a = window.pageXOffset
    } else {
        if (document.body && document.documentElement && document.documentElement.scrollTop) {
            c = document.documentElement.scrollTop;
            a = document.body.scrollLeft
        } else {
            if (document.body && typeof(document.body.scrollTop) == "number") {
                c = document.body.scrollTop;
                a = document.body.scrollLeft
            }
        }
    }
    if (scrollX != a || scrollY != c) {
        scrollX = a;
        scrollY = c;
        if (d == "center") {
            var b = document.body.clientWidth;
            waitElement.style.top = 280 + document.documentElement.scrollTop + "px";
            waitElement.style.left = (document.body.offsetWidth - 200) / 2 + "px"
        } else {
            waitElement.style.top = c + "px";
            waitElement.style.right = -a + "px"
        }
    }
}
function CreateWaitElement() {
    var a = document.getElementById("Ajax__Waiting");
    if (!a) {
        a = document.createElement("div");
        a.id = "Ajax__Waiting";
        a.style.position = "absolute";
        a.style.height = 16;
        a.style.width = 150;
        a.style.paddingLeft = "3px";
        a.style.paddingRight = "3px";
        a.style.fontSize = "10px";
        a.style.fontFamily = "Arial, Verdana, Tahoma";
        a.style.border = "#000000 1px solid";
        a.style.backgroundColor = "#000000";
        a.style.color = "#ffffff";
        a.innerHTML = "<img src=../images/" + LanguageEncode + "/loading.gif  width=16 height=16 border=0 align=absMiddle> " + message.searchingLoad;
        a.style.visibility = "hidden";
        document.body.insertBefore(a, document.body.firstChild)
    }
    waitElement = a
}
function MovewaitDiv(d) {
    var c, a;
    if (!waitDiv) {
        CreatewaitDiv()
    }
    if (document.all) {
        if (window.pageYOffset && typeof(window.pageYOffset) == "number") {
            c = window.pageYOffset;
            a = window.pageXOffset
        } else {
            if (document.body && document.documentElement && document.documentElement.scrollTop) {
                c = document.documentElement.scrollTop;
                a = document.body.scrollLeft
            } else {
                if (document.body && typeof(document.body.scrollTop) == "number") {
                    c = document.body.scrollTop;
                    a = document.body.scrollLeft
                }
            }
        }
    }
    if (scrollX != a || scrollY != c) {
        scrollX = a;
        scrollY = c;
        if (d == "center") {
            var b = document.body.clientWidth;
            waitDiv.style.top = 280 + document.documentElement.scrollTop + "px";
            waitDiv.style.left = (document.body.offsetWidth) / 2 - 8 + "px"
        } else {
            waitDiv.style.top = c + "px";
            waitDiv.style.right = -a + "px"
        }
    }
}
function CreatewaitDiv(a) {
    var b = document.getElementById("Search__Waiting");
    if (!b) {
        b = document.createElement("div");
        b.id = "Search__Waiting";
        b.style.position = "absolute";
        b.style.height = 20;
        b.style.width = 180;
        b.style.paddingLeft = "3px";
        b.style.paddingRight = "3px";
        b.style.fontSize = "12px";
        b.style.fontFamily = "Arial, Verdana, Tahoma";
        b.style.backgroundColor = "";
        b.style.color = "#ffffff";
        b.style.zIndex = 300;
        b.innerHTML = "<img src=../images/" + LanguageEncode + "/loading.gif  width=30 height=30 border=0 align=absMiddle><b> " + a + "</b>";
        b.style.display = "none";
        document.body.insertBefore(b, document.body.firstChild)
    }
    waitDiv = b
}
function HideWaitDiv() {
    if (waitDiv) {
        if (waitDiv.style.display == "") {
            waitDiv.style.display = "none"
        }
    }
    if (typeof ispost != "undefined") {
        if (ispost) {
            ispost = false
        }
    }
}
function ShowWaitDiv() {
    if (waitDiv) {
        waitDiv.style.display = "";
        MovewaitDiv("center")
    }
    setTimeout("HideWaitDiv()", 15000)
}
function CommonDeal(b, f, i, a, c, e) {
    CreatewaitDiv(c);
    if (waitDiv) {
        if (c != null && c != "") {
            var g = document.getElementById("divsearchtip");
            if (g) {
                g.innerHTML = c
            }
            ShowWaitDiv()
        }
    }
    var h = new Request();
    var d = f + "?action=" + b + i;
    h.GetNoCache(d, a, e)
}
function CommonDealNoDiv(b, f, h, a, c, e) {
    var g = new Request();
    var d = f + "?action=" + b + h;
    g.GetNoCache(d, a, e)
};
function SearchBar() {
    this.SelID = "txt_1_sel";
    this.TxtBoxID = "txt_1_value1";
    this.expertValueID = "expertvalue";
    this.operoValueID = "txt_1_special1";
    this.TipDivID = "SearchHisTip";
    this.FieldText = "";
    this.SearchParam = "";
    this.Key = "";
    this.Opero = "";
    this.FieldValue = "";
    this.TipItem = "";
    this.ConditionItem = "";
    this.SearchTipArray = new Array();
    this.ConditionArray = new Array();
    this.FieldArray = new Array()
}
SearchBar.prototype.SetSearchHisTip = function (a) {
    if (a != undefined) {
        this.SearchParam = a
    }
    this.SetVar();
    this.QueryClear();
    if (this.Key == "") {
        $("#" + this.TipDivID).html("")
    } else {
        this.QueryPush()
    }
    this.SetExpertValue();
    $("#" + this.TipDivID).html(this.GetHisTipByQuery())
};
SearchBar.prototype.SetReSearchHisTip = function (a) {
    if (a != undefined) {
        this.SearchParam = a
    }
    this.SetVar();
    if (this.Key == "") {
        return
    }
    this.QueryPush();
    this.SetExpertValue();
    $("#" + this.TipDivID).html(this.GetHisTipByQuery())
};
SearchBar.prototype.TipItemClick = function (a) {
    this.RestoreSearchHis(a, 1)
};
SearchBar.prototype.TipItemDel = function (a) {
    this.RestoreSearchHis(a)
};
SearchBar.prototype.GetHisTipByQuery = function () {
    if (this.SearchTipArray.length == 0) {
        return ""
    }
    var c = "";
    var a = "";
    var d = '<span class="searchbarTip"></span> ';
    var b = "";
    for (var e = 0; e < this.SearchTipArray.length; e++) {
        a = " <span class='tiphide' onclick=\"searchBarer.TipItemDel(" + e + ')"><a href="javascript:void(0);">x</a></span>';
        if (this.SearchTipArray.length - 1 == e) {
            c = this.SearchTipArray[e] + a
        } else {
            c = "<a href='javascript:void(0)' onclick='searchBarer.TipItemClick(" + e + ")'>" + this.SearchTipArray[e] + "</a>";
            c += d
        }
        b += c
    }
    return b
};
SearchBar.prototype.SetCurSearchBarByQuery = function () {
    if (this.SearchTipArray.length == 0) {
        this.ClearCurSearch();
        return
    }
    $("#" + this.SelID).val(this.FieldArray[this.FieldArray.length - 1]);
    $("#" + this.TxtBoxID).val(this.SearchTipArray[this.SearchTipArray.length - 1].split(":")[1]);
    this.SetVar()
};
SearchBar.prototype.RestoreSearchHis = function (a, b) {
    if (b != undefined) {
        this.QueryPop(a, 1)
    } else {
        this.QueryPop(a)
    }
    this.SetExpertValue();
    this.SetCurSearchBarByQuery();
    SubmitForm("", this.SearchParam);
    $("#" + this.TipDivID).html(this.GetHisTipByQuery())
};
SearchBar.prototype.ClearCurSearch = function () {
    $("#" + this.TxtBoxID).val("")
};
SearchBar.prototype.SetVar = function () {
    this.FieldText = $("#" + this.SelID).find("option:selected").text();
    this.Key = $.trim($("#" + this.TxtBoxID).val());
    this.FieldValue = $("#" + this.SelID).val();
    var d = this.FieldValue;
    this.Opero = "";
    if (this.FieldValue && this.FieldValue.indexOf("$") >= 0) {
        this.Opero = this.FieldValue.split("$")[1];
        d = this.FieldValue.split("$")[0];
        if (this.Opero.indexOf("|") >= 0) {
            var c = this.Opero;
            var b = c.split("|")[1];
            this.Opero = c.split("|")[0];
            switch (b) {
                case"?":
                    this.Key = this.Key + "?";
                    break;
                case"??":
                    this.Key = "?" + this.Key;
                    break;
                case"*":
                    this.Key = this.Key + "*";
                    break;
                case"**":
                    this.Key = "*" + this.Key;
                    break;
                default:
                    break
            }
        }
    } else {
        this.Opero = $.trim($("#" + this.operoValueID).val())
    }
    this.TipItem = this.Key;
    if (this.FieldText != "") {
        this.TipItem = this.FieldText + ":" + this.Key
    }
    if (d == undefined || d == "") {
        return
    }
    if (d.indexOf(",") >= 0) {
        var a = d.split(",");
        for (var e = 0; e < a.length; e++) {
            this.ConditionItem += a[e] + this.Opero + "'" + this.Key + "'";
            if (a.length - 1 != e) {
                this.ConditionItem += " and "
            }
        }
    } else {
        this.ConditionItem = d + this.Opero + "'" + this.Key + "'"
    }
};
SearchBar.prototype.QueryClear = function () {
    this.SearchTipArray.length = 0;
    this.ConditionArray.length = 0;
    this.FieldArray.length = 0
};
Array.prototype.contains = function (a) {
    for (var b = 0; b < this.length; b++) {
        if (this[b] == a) {
            return true
        }
    }
    return false
};
SearchBar.prototype.QueryPush = function () {
    if (this.SearchTipArray.contains(this.TipItem)) {
        return
    }
    this.SearchTipArray.push(this.TipItem);
    this.ConditionArray.push(this.ConditionItem);
    this.FieldArray.push(this.FieldValue)
};
SearchBar.prototype.QueryPop = function (a, b) {
    if (a != undefined) {
        if (b == 1) {
            this.SearchTipArray.splice(a + 1, this.SearchTipArray.length - 1 - a);
            this.ConditionArray.splice(a + 1, this.ConditionArray.length - 1 - a);
            this.FieldArray.splice(a + 1, this.FieldArray.length - 1 - a)
        } else {
            this.SearchTipArray.splice(a, 1);
            this.ConditionArray.splice(a, 1);
            this.FieldArray.splice(a, 1)
        }
    } else {
        this.SearchTipArray.pop();
        this.ConditionArray.pop();
        this.FieldArray.pop()
    }
};
SearchBar.prototype.SetExpertValue = function () {
    if (this.ConditionArray.length <= 1) {
        $("#" + this.expertValueID).val("");
        return
    }
    var a = this.ConditionArray.slice(0, this.ConditionArray.length - 1).join(" and ");
    $("#" + this.expertValueID).val(a)
};
var searchBarer = new SearchBar();
var displayTagCount = 11;
var isShowAllProductBTN = true;
function CheckDBTag(e, a, d, c, b) {
    if (b && e.className == "recur") {
        return
    }
    $("#isTagSearch").val("1");
    CheckOutTag(e, d, a)
}
function SetOutTag(a, f, d) {
    if (f) {
        var g = ge("dbTag");
        if (g) {
            g.style.display = "none";
            var c = g.getElementsByTagName("li");
            if (c.length > 0) {
                for (i = 0; i < c.length; i++) {
                    c[i].className = ""
                }
            }
            a.className = "recur";
            g.style.display = "";
            FillSearchSelect(f)
        }
    }
    if (document.getElementById("MoreLi")) {
        document.getElementById("MoreLi").className = "more"
    }
    var b = a.id.toLowerCase();
    if (a.id.toLowerCase() != "scdb") {
        SetDisplayValue("selectlable", "none");
        ClearDBCheck()
    } else {
        SetDisplayValue("selectlable", "")
    }
    var e = document.getElementById("literSelectBtn");
    var h = document.getElementById("literSelectFolder");
    if (e) {
        if ("|cidx|crpd|crdd|crfd|crmd|gxdb_section|chcf|orgd|fund".indexOf(b) > 0 && b != "gxdb") {
            e.style.display = "none";
            h.style.display = "none"
        } else {
            e.style.display = "block"
        }
    }
    FillValue("singleDB", a.id);
    FillValue("singleDBName", d);
    ChangeToAdvance(f)
}
function CheckOutTag(c, a, b) {
    SetOutTag(c, a, b);
    showorhideDBList();
    SetCurDBCheck(a);
    DoSearch()
}
function DoSearch() {
    var a = ge("txt_1_value1");
    if (a && a.value != "") {
        CollectDBList();
        recommender.getRecommendTip();
        SubmitForm("", "&ua=1.12");
        searchBarer.SetSearchHisTip("&ua=1.12")
    }
}
function FillSearchSelect(f) {
    var h = $("#txt_1_sel option:selected").text();
    var k = "";
    var c = ge("txt_1_sel");
    if (c) {
        if (typeof fieldJson != "undefined" && fieldJson) {
            var d = null;
            for (var a = 0; a < fieldJson.length; a++) {
                if (fieldJson[a].key == f) {
                    d = fieldJson[a];
                    break
                }
            }
            var g = function (m, j) {
                var l = ge(m);
                if (l) {
                    l.value = j
                }
            };
            if (d) {
                k = d.value[0].key;
                $(c).empty();
                var e = d.value.length;
                for (var b = 0; b < e; b++) {
                    addOptionToSelect(c, d.value[b].value, d.value[b].key, b)
                }
                SetOptionSelected(c, h);
                if (typeof d.xls != "undefined") {
                    g("txt_1_extension", "xls")
                } else {
                    g("txt_1_extension", "")
                }
            }
        }
    }
    SetSelect()
}
function SetOptionSelected(a, c) {
    var b = false;
    var e = document.getElementById("txt_1_sel");
    for (var d = 0; d < e.length; d++) {
        if (e[d].text == c) {
            a.options[d].setAttribute("selected", "true");
            b = true;
            break
        }
    }
    if (!b) {
        a.options[0].setAttribute("selected", "true")
    }
}
function CreateLiInnerHTML(a, b) {
    return '<a href="javascript:void(0);">' + a + "</a>"
}
function getCboxListFromcoreContent() {
    var a = ge("coreContent");
    if (!a) {
        return null
    }
    return a.getElementsByTagName("input")
}
function SetCurDBCheck(b) {
    if (!b) {
        b = "XXXX"
    }
    if (b.toUpperCase() == "SCDB") {
        var a = $("#db_codes").val();
        if (!a || a.length <= 0) {
            var c = new dbJsonFac();
            a = c.getDefaultSelDB()
        }
        selectCoreDB(a)
    } else {
        $("#coreContent input[type='checkbox']").each(function () {
            $(this).attr("checked", false)
        })
    }
    SetSelect()
}
function ClearDBCheck() {
    var a = getCboxListFromcoreContent();
    if (a && a.length > 0) {
        for (var b = 0; b < a.length; b++) {
            a[b].checked = false
        }
    }
}
function SelectChDB(c, a) {
    if (!c) {
        return
    }
    var b = getCboxListFromcoreContent();
    if (b && b.length > 0) {
        for (var d = 0; d < b.length; d++) {
            if (c.indexOf(b[d].id) >= 0 && c.length == b[d].id.length) {
                setSelectState(b[d], a)
            }
        }
    }
}
function setSelectState(b, a) {
    if (b) {
        b.checked = a
    }
}
var dbJson;
var curDB;
function getSelectText(a) {
    var b = ge(a);
    if (b) {
        return b.options[b.selectedIndex].text
    }
    return ""
}
var isRegulateNavi = false;
function SwichNaviTag(b, a) {
    if (b && !a) {
        a = GetTagNameFromDBJson(b)
    }
    SetMoreTag(ge(b), a, b);
    SetOutTag(ge(b), b, a);
    ChangeToAdvance(b)
}
function GetCurTagName() {
    var a = getElementsByClassName("recur", "li", "dbTag");
    if (a && a.length > 0) {
        var b = a[0].getElementsByTagName("a");
        if (b && b.length > 0) {
            return b.innerHTML
        }
    }
    return ""
}
function BasePath() {
    var a = "";
    if (ge("basePath")) {
        a = ge("basePath").value
    }
    return a
}
function ChangeToAdvance(b) {
    var a = ge("advacneId");
    if (a == undefined) {
        return
    }
    if (b == "CIDX") {
        a.style.display = "none"
    } else {
        a.style.display = ""
    }
    var c = BasePath();
    if (b == "SCDB") {
        a.href = c + "/brief/result.aspx?dbprefix=scdb"
    } else {
        a.href = c + "/brief/result.aspx?dbprefix=" + b
    }
}
function SetSelect() {
    var a = ge("txt_1_sel");
    if (a == undefined) {
        return
    }
    if (a.options.length > 0 && a.options[0].text == "") {
        if (ge("typeSelect")) {
            ge("typeSelect").style.display = "none"
        }
        a.style.display = "";
        a.style.display = "none";
        $("#txt_1_value1").addClass("txtLong")
    } else {
        if (ge("typeSelect")) {
            ge("typeSelect").style.display = ""
        }
        a.style.display = "";
        $("#txt_1_value1").removeClass("txtLong")
    }
}
function GetNewDBjson(c, f) {
    var d = dbJson.dbinfo;
    var b;
    var g = 0;
    var e = false;
    var h = 0;
    for (var a = 0; a < d.length; a++) {
        if (!e && (d[a].yk == "1")) {
            g++;
            if (g >= displayTagCount) {
                e = true
            }
            h = a
        }
        if (d[a].code == c && d[a].tagname == f && a > e) {
            b = d[h];
            d[h] = d[a];
            d[a] = b;
            break
        }
    }
    return dbJson
}
function CollectDBList() {
}
function CreateFloatNavi() {
    var d = $("#rehidenavlist");
    if (d.length < 1) {
        return
    }
    var c = "";
    var b = $("<ul class='refirstlayer'></ul>");
    for (var a = 0; a < json_category.length; a++) {
        if (json_category[a].code == "*") {
            c = "<p class='reallcol' ><a href='javascript:void(0);' onclick=\"clearCheckNavi('sdf');categoryClick('*','全部');\">" + json_category[a].name + "</a></p>";
            continue
        }
        b.append(WriteOneGradeHTML(json_category[a]))
    }
    d.append($(c)).append(b)
}
function WriteOneGradeHTML(f) {
    var b = "";
    var d = "";
    if (f && f.code && f.code.length > 0) {
        var c = f.code;
        var a = f.name;
        b += "<span class='refirstcol'><a href='" + getJSvoid() + "' onclick=\"categoryClick('" + c + "','" + a + "');return false;\">" + a + "</a></span>";
        b += "<ins></ins><div class='reclasshide' id='" + c + "layer'></div>";
        var e = $("#" + c + "layer");
        d = $("<li class=''></li>").append($(b)).hover(function () {
            if ($.trim(e.html()).length == 0) {
                CreateSecondChild(c)
            }
            $(this).addClass("current")
        }, function () {
            $(this).removeClass("current")
        })
    }
    return d
}
function CreateSecondChild(c) {
    if (c) {
        var e = $("#" + c + "layer");
        if ($.trim(e.html()).length > 0) {
            return
        }
        var f = null;
        for (var d = 0; d < json_category.length; d++) {
            if (json_category[d] && json_category[d].code == c) {
                f = json_category[d];
                break
            }
        }
        if (f.child && f.child.length > 0) {
            var a = f.child.length;
            for (var b = 0; b < a; b++) {
                $(e).append(WriteSecondGradeHTML(f.child[b]))
            }
        }
    }
}
function WriteSecondGradeHTML(e) {
    var b = "";
    if (e && e.code && e.code.length > 0) {
        b = "<dl class='resecondlayer'><dd><p class='resublist'><b class='blue' style='cursor:pointer;' onclick=\"categoryClick('" + e.code + "','" + e.name + "');return false;\">" + e.name + "</b>";
        var a = e.child;
        if (a && a.length > 0) {
            var d = "";
            for (var c = 0; c < a.length; c++) {
                if (a[c] && a[c].code && a[c].code.length > 0) {
                    d += "<span><a href='" + getJSvoid() + "'  onclick=\"categoryClick('" + a[c].code + "','" + a[c].name + "');return false;\">" + a[c].name + "</a></span>"
                }
            }
            b += d
        } else {
            b += "<span>&nbsp;</span>"
        }
        b += "</p></dd></dl>"
    }
    return $(b)
}
function getJSvoid() {
    return "javascript:void(0);"
}
var isFirst = false;
function categoryClick(b, a) {
    if (!b || !a) {
        return
    }
    if (ge("hiddenNavi")) {
        ge("hiddenNavi").innerHTML = SpecilNavi(b, a)
    }
    CollectDBList();
    searchBarer.SetSearchHisTip();
    if (isFirst) {
        SubmitForm("", "&ua=1.15");
        return
    } else {
        ClickNode(b, a, "&ua=1.15")
    }
    SetNaviLocation(b, a)
}
function SetNaviLocation(code, name, iss) {
    var tmpObj = ge("checkcatalog");
    var tipName = "";
    if (code != "*") {
        var tmpJsonstr = searchClassByCode(code);
        if (!tmpJsonstr || tmpJsonstr.length <= 0) {
            tmpJsonstr = "[{'code':'" + code + "','name':'" + name + "'}]"
        }
        var tempJson = eval("(" + tmpJsonstr + ")");
        var tempStr = "";
        var naviS = '<span class="searchbarTip"></span> ';
        if (tempJson && tempJson.length > 0) {
            for (var j = 0; j < tempJson.length; j++) {
                if (j == tempJson.length - 1) {
                    tempStr += tempJson[j].name
                } else {
                    tempStr += "<a href='javascript:void(0);' onclick=\"categoryClick('" + tempJson[j].code + "','" + tempJson[j].name + "')\">" + tempJson[j].name + "</a>" + naviS
                }
            }
            if (tempJson.length > 1) {
                tempStr += "<span class='tiphide' onclick=\"categoryClick('" + tempJson[tempJson.length - 2].code + "','" + tempJson[tempJson.length - 2].name + "')\"><a href='javascript:void(0);' >x</a></span>"
            } else {
                tempStr += "<span class='tiphide' onclick=\"clearCheckNavi(); SubmitForm('', searchBarer.SearchParam);\"><a href='javascript:void(0);' >x</a></span>"
            }
        }
        tipName = tempStr
    }
    if (tmpObj) {
        tmpObj.innerHTML = tipName
    }
    tmpObj = ge("rehidenavlist");
    if (tmpObj) {
        try {
            tmpObj.style.display = "none"
        } catch (e) {
        }
    }
    if (iss) {
        SubmitForm("", "&ua=1.15")
    }
    return
}
function clearCheckNavi(b) {
    var a = ge("checkcatalog");
    if (b != "*") {
        a.innerHTML = "";
        if (ge("hiddenNavi")) {
            ge("hiddenNavi").innerHTML = SpecilNavi("*", "")
        }
    }
    a = ge("rehidenavlist");
    if (a) {
        try {
            a.style.display = "none"
        } catch (c) {
        }
    }
}
function SpecilNavi(c, a) {
    var b = " <input type='checkbox' id='selectbox' value='" + c + "' name='selectbox' checked='true' />";
    b += "<input type='checkbox' id='selectbox' value='' name='' />";
    b += "<input type='hidden' id='selecteboxname' name='selecteboxname' value='" + a + "' />";
    if ($("#catalogName").length > 0) {
        $("catalogName").val("ZJCLS")
    } else {
        b += "<input type='hidden' id='catalogName' name='catalogName' value='ZJCLS' />"
    }
    return b
}
function DefaultClickNavi(b, a) {
    if (b == "undefined") {
        b = ""
    }
    if (a == "undefined") {
        a = ""
    }
    if (!b) {
        return
    }
    FillValue("selectbox", b);
    FillValue("selecteboxname", a);
    SetNaviLocation(b, a, true)
}
function searchClassByCode(c) {
    var a = "";
    if (!c) {
        return a
    }
    if (json_category) {
        a = "[";
        var b = function (f, e) {
            for (var g = 0; g < e.length; g++) {
                if (!e) {
                    return ""
                }
                if (c.indexOf(e[g].code) == 0) {
                    if (c == e[g].code) {
                        return "{'code':'" + e[g].code + "','name':'" + e[g].name + "'},"
                    }
                    return "{'code':'" + e[g].code + "','name':'" + e[g].name + "'}," + b(f, e[g].child)
                }
            }
        };
        var d = b(c, json_category);
        if (d && d.length > 0) {
            d = d.substring(0, d.length - 1)
        }
        a += d;
        a += "]"
    }
    return a
}
function uniencode(d) {
    d = escape(d.toString()).replace(/\+/g, "%2B");
    var b = d.match(/(%([0-9A-F]{2}))/gi);
    if (b) {
        for (var c = 0; c < b.length; c++) {
            var a = b[c].substring(1, 3);
            if (parseInt(a, 16) >= 128) {
                d = d.replace(b[c], "%u00" + a)
            }
        }
    }
    d = d.replace("%25", "%u0025");
    return d
}
function OpenWin(a, b) {
    var c = window.open(b);
    if (c != null) {
        c.focus()
    }
}
function DBSwich(d, g, b) {
    if (d && d != "") {
        d = d.toUpperCase();
        var a = document.getElementById(d);
        if (a) {
            a.onclick()
        } else {
            dblistclick(ge(d), "", d);
            var a = document.getElementById(d);
            if (a) {
                a.onclick()
            }
        }
    }
    var e = function (l, j) {
        var k = function (q) {
            var o = document.getElementById("txt_1_sel");
            if (o) {
                try {
                    var n = o.options;
                    var m = n.length;
                    m--;
                    while (m >= 0) {
                        if (n[m].value == q) {
                            return q
                        } else {
                            if (n[m].text == q) {
                                return n[m].value
                            }
                        }
                        m--
                    }
                } catch (p) {
                }
            }
            return ""
        };
        var c = function (n) {
            if (n) {
                var m = document.getElementById("txt_1_sel");
                if (m) {
                    m.value = n
                }
            }
        };
        if (j && j != "") {
            j = decodeURIComponent(j);
            FillValue("txt_1_value1", j);
            var h = function () {
                var f = document.getElementById("btnSearch");
                if (f) {
                    f.onclick()
                }
            };
            if (l && l != "") {
                l = decodeURIComponent(l);
                c(k(l))
            }
            h()
        }
    };
    e(g, b)
}
function handlerRedirect() {
    var e = window.location.search;
    var d = GetQueryStringByName(e, "dbprefix");
    if (!d || d == "") {
        d = GetQueryStringByName(e, "code")
    }
    var b = GetQueryStringByName(e, "f");
    var a = GetQueryStringByName(e, "kw");
    DBSwich(d, b, a)
}
var isIE6 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0");
function ShowAllChannel(g, e, b, c, f) {
    var a = ge(e);
    var d = a.innerHTML.Trim();
    if (d == "") {
        a.innerHTML = "<div style='left:0px; top:0px; color: #ffffff; position: relative; z-index: 300; width:30px; height:30px; margin:40px auto;' ><img border='0' align='absMiddle' src='/kns/images/GB/loading.gif' width='30' height='30'><b> </b></div>"
    }
    a.style.display = "block"
}
function SetIframe(c, a) {
    if (!isIE6) {
        return
    }
    if (a == undefined || typeof a != "string") {
        a = "ie6iframe"
    }
    var b = document.getElementById(a);
    var d = document.getElementById(c);
    if (!d || !b) {
        return
    }
    if (d.style.display == "none") {
        b.style.display = "none"
    } else {
        b.style.display = "";
        if (d.clientHeight) {
            b.height = d.clientHeight + "px"
        }
    }
}
function initDBselect() {
    initCoreList();
    recoverDBSelect()
}
function initCoreList() {
    var a = new dbJsonFac();
    drawDBList(a.getDBarray());
    selectCoreDB(a.getDefaultSelDB());
    showorhideDBList()
}
function recoverDBSelect() {
    var a = /[\u4e00-\u9fa5]/gi;
    var d = $("#db_opt").val();
    if (d && d != "" && !a.test(d)) {
        d += ",";
        var c = 0;
        var b = 0;
        $("#coreContent input[type='checkbox']").each(function () {
            if (d.indexOf($(this).val() + ",") >= 0) {
                $(this).attr("checked", true);
                c++
            } else {
                $(this).attr("checked", false)
            }
            b++
        });
        if (c != b) {
            $("#allselectdblistbtn em").html("({0})".format(c.toString()))
        }
    }
}
function showorhideDBList() {
    var a = false;
    if ($("#singleDB").length <= 0) {
        a = $("#dbPrefix").val() == "SCDB" ? true : false
    } else {
        a = $("#singleDB").val() == "SCDB" ? true : false
    }
    setDBlistEvet(a)
}
function setDBlistEvet(a) {
    $("#allselectdblistbtn em").html("");
    if (!a) {
        $("#allselectdblistbtn").hide();
        $("#coreContent").hide();
        $("#coreContent").unbind("mouseover")
    } else {
        $("#allselectdblistbtn").show();
        if (!$("#allselectdblistbtn").data("events") || !$("#allselectdblistbtn").data("events")["click"]) {
            $("#allselectdblistbtn").bind("click", function () {
                if ($("#coreContent").css("display") == "none") {
                    $("#coreContent").show();
                    $("#coreContent").unbind("mouseleave");
                    $("#coreContent").bind("mouseleave", function () {
                        $(this).hide();
                        $("#txt_1_value1").focus();
                        return false
                    })
                } else {
                    $("#coreContent").hide()
                }
                setDBListIframe();
                return false
            })
        }
    }
}
function dbJsonFac() {
    this.DBArray = new Array();
    this.Defaultseldb = "";
    this.Constructor()
}
dbJsonFac.prototype.Constructor = function () {
    if (!dbJson) {
        this.CreateDBJson()
    }
    if (dbJson) {
        if (dbJson.dbinfo) {
            this.DBArray = dbJson.dbinfo
        }
        if (dbJson.defaultseldb) {
            this.Defaultseldb = dbJson.defaultseldb
        }
    }
};
dbJsonFac.prototype.CreateDBJson = function () {
    var coreJsonObj = ge("coreJson");
    if (coreJsonObj) {
        dbJson = eval("(" + coreJsonObj.value + ")")
    }
};
dbJsonFac.prototype.getDBarray = function () {
    return this.DBArray
};
dbJsonFac.prototype.getDefaultSelDB = function () {
    return this.Defaultseldb
};
var coreDBListCount = -1;
function drawDBList(a) {
    if ($("#coreContent").length <= 0) {
        return
    }
    var b = "input[id^=txt_],input[id^=buttom_],input[id^=au_],input[id^=base],input[id^=magazine_]";
    $(b).live("focus", function () {
        $("#coreContent").css("display", "none")
    });
    $("#coreContent input[type='checkbox']").bind("click", function () {
        var d = $("#coreContent input[type='checkbox']:checked").get().length;
        $("#allselectdblistbtn em").html("({0})".format(d.toString()))
    });
    $("#allSelectBtn").bind("click", function () {
        $("#coreContent input[type='checkbox']").each(function () {
            $(this).attr("checked", true)
        });
        $("#allselectdblistbtn em").html("({0})".format($("#coreContent input[type='checkbox']").length))
    });
    $("#clearSelectBtn").bind("click", function () {
        $("#coreContent input[type='checkbox']").each(function () {
            $(this).attr("checked", false)
        });
        $("#allselectdblistbtn em").html("(0)")
    })
}
function selectCoreDB(d) {
    if (d && d.length > 0) {
        var a = d + ",";
        var c = 0;
        var b = 0;
        $("#coreContent input[type='checkbox']").each(function () {
            if (a.indexOf($(this).val() + ",") >= 0) {
                $(this).attr("checked", true);
                c++
            } else {
                $(this).attr("checked", false)
            }
            b++
        });
        if (c != b) {
            $("#allselectdblistbtn em").html("({0})".format(c.toString()))
        }
    }
}
function collectSelectDB() {
    var a = true;
    var c = $("#singleDB").val();
    if (c == undefined) {
        c = $("#dbPrefix").val()
    }
    var b = false;
    var e = window.location.href;
    if (e.indexOf("/brief/index_result.aspx") > -1) {
        if (c == "ZYZK" || c == "CFED" || c == "WWJD" || c == "WWDB") {
            b = true
        }
    }
    if (c == "SCDB" || b) {
        var d = $("#coreContent input[type='checkbox']:checked").map(function () {
            return $(this).val()
        }).get().join(",");
        if (!d || d == "") {
            d = "SCDB";
            a = false
        }
        $("#db_opt").val(d)
    } else {
        $("#db_opt").val(c)
    }
    return a
}
function createCoreDBTitle() {
    $("#headDBSwitchDiv").after("<div class='recorebox'><div class='recoresearDiv recoresearDivExtra'><a id='allselectdblistbtn' name='allselectdblistbtn' href='javascript:void(0);' class='recoresear' style='display:block;' >跨库选择<em></em></a><div class='recoredb recoredbExtra' id='coreContent'></div><!--[if lte IE 6]><iframe id='ie6CoreDBListiframe' class='iframeIE6' scrolling='no' frameborder='0' style='display:none;position:absolute;top:22px;right:0px;z-index:3;width:582px;height:68px;overflow-x:hidden;' ></iframe><![endif]--></div></div>")
}
function setDBListIframe() {
    SetIframe("coreContent", "ie6CoreDBListiframe")
}
function expertCoreSearchInit() {
    var b = $("#singleDB").val() ? $("#singleDB").val() : $("#dbPrefix").val();
    var a = b == "SCDB" ? true : false;
    if (a) {
        if ($("#coreContent").length <= 0) {
            createCoreDBTitle()
        }
        var d = new dbJsonFac();
        if (a) {
            var c = function (e) {
                if (e) {
                    $("#allselectdblistbtn").removeClass();
                    $("#allselectdblistbtn").addClass("recoresear recoresearCur")
                } else {
                    $("#allselectdblistbtn").removeClass();
                    $("#allselectdblistbtn").addClass("recoresear")
                }
            };
            if (!$("#allselectdblistbtn").data("events") || !$("#allselectdblistbtn").data("events")["click"]) {
                $("#allselectdblistbtn").bind("click", function () {
                    if ($("#coreContent").css("display") == "none") {
                        c(true);
                        $("#coreContent").show();
                        $("#coreContent").unbind("mouseleave");
                        setDBListIframe();
                        $("#coreContent").bind("mouseleave", function () {
                            c(false);
                            $(this).hide();
                            $("#txt_1_value1").focus();
                            setDBListIframe();
                            return false
                        })
                    } else {
                        c(false);
                        $("#coreContent").hide();
                        setDBListIframe()
                    }
                    return false
                })
            }
        }
    }
}
function GetTagNameFromDBJson(a) {
    if (a && typeof dbJson != "undefined") {
        var c = dbJson.dbinfo;
        var b = 0;
        while (b < c.length) {
            if (c[b].code == a) {
                if (c[b].tagname) {
                    return c[b].tagname
                }
                return c[b].name
            }
            b++
        }
    }
    return ""
}
var IsLoadedDBInfo = false;
var IsLoadedFieldInfo = false;
var intMark;
function loadPageJsonInfo(b) {
    addWideScreenDB();
    initDBselect();
    loadDBInfo();
    loadDBFieldInfo();
    var a = 0;
    intMark = window.setInterval(function () {
        if (a > 20) {
            window.clearInterval(intMark)
        }
        if (IsLoadedDBInfo && IsLoadedFieldInfo) {
            if (typeof b == "function") {
                b()
            }
            handlerRedirect();
            window.clearInterval(intMark)
        }
        a++
    }, 50);
    loadYiKuangProductList()
}
function defaultLoadPageJsonInfo(a) {
    defaultLoadPageJson([addWideScreenDB, initDBselect, fillField = function () {
        var b = GetInputValue("singleDB");
        if (b != "SCDB") {
            FillSearchSelect(b)
        }
    }], a)
}
function resultLoadPageJsonInfo(a) {
    resultAddWideScreenDB();
    initDBselect()
}
function defaultLoadPageJson(e, a, d) {
    if (Object.prototype.toString.call(e) == "[object Array]") {
        var c = 0, b = e.length;
        while (c < b) {
            if (typeof e[c] == "function") {
                e[c]()
            }
            c++
        }
    }
    loadDBFieldInfo(a);
    if (d != false) {
        loadYiKuangProductList()
    }
}
function loadDBInfo() {
    asynUrlLoad("dblist", function () {
        if (typeof attachDBJson != "undefined") {
            try {
                dbJson = attachDBJson;
                IsLoadedDBInfo = true
            } catch (a) {
            }
        }
    }, "dbJsonScript")
}
function loadDBFieldInfo(a) {
    asynUrlLoad("ykf", function () {
        if (typeof attachFieldJson != "undefined") {
            try {
                fieldJson = attachFieldJson;
                IsLoadedFieldInfo = true;
                if (typeof a == "function") {
                    a()
                }
            } catch (b) {
            }
        }
    }, "fieldScript")
}
function asynUrlLoad(a, b) {
    asynLoad("/kns/request/GetHeadDBJson.ashx?action=" + a, b)
}
function loadYiKuangProductList() {
    asynLoad("/kns/request/GetHeadParam.ashx?action=ls", function () {
        if (typeof dblistJson != "undefined") {
            try {
                var a = unescape(dblistJson.value);
                var b = ge("dbother_div");
                if (b) {
                    b.innerHTML = b.innerHTML + a
                }
                ge("rehidemore").innerHTML = ""
            } catch (c) {
            }
        }
    }, "dblistJsonScript")
}
function asynLoad(b, d, c) {
    if (b) {
        var a = new CoreDomainLoadJson();
        a.Load(b, d, c)
    }
}
function dblistclick(d, a, b) {
    if (!b) {
        return
    }
    if (!a) {
        a = GetTagNameFromDBJson(b)
    }
    SetMoreTag(d, a, b);
    CheckDBTag(ge(b), a, b, false);
    try {
        document.getElementById("dbother_div").style.display = "none"
    } catch (c) {
    }
}
function SetMoreTag(a, b, e) {
    if (a && a.className == "recur") {
        return
    }
    var d = document.getElementById("dbTag").getElementsByTagName("li");
    for (var g = 0; g < d.length; g++) {
        if (d[g].id == e) {
            return
        }
    }
    var j = d.length;
    var h = j - 2;
    if (h < 0) {
        h = 0
    }
    if (isRemoveDBTag(b, j)) {
        RemoveDBTag(d, [h]);
        h--
    }
    var c = 0;
    if (isReStoreDBTag(b, d)) {
        c = reStoreDBTag(d, e);
        h += c
    }
    if (c == 2) {
        d = document.getElementById("dbTag").getElementsByTagName("li");
        RemoveDBTag(d, [d.length - 2]);
        return
    }
    var f = d[h];
    f.innerHTML = CreateLiInnerHTML(b, e);
    f.onclick = function () {
        CheckDBTag(this, b, e, true);
        return false
    };
    f.id = e
}
function isRemoveDBTag(a, c) {
    var b = isLong(a);
    var d = displayTagCount;
    d += IsWideScreen() ? 1 : 0;
    if (d + 1 == c && b) {
        return true
    }
    return false
}
function isReStoreDBTag(b, e) {
    var c = e.length;
    if (c - 2 > 0) {
        var d = $(e[c - 2]).find("a").html();
        var f = isLong(d);
        var a = isLong(b);
        return f && !a
    }
    return false
}
function reStoreDBTag(g, d) {
    var k = getDBInfoArray();
    if (!k || k.length <= 0) {
        return
    }
    var a = 0, e = k.length, f = 0;
    var h = g.length;
    var c = h - 2;
    var j = 0, b = 0;
    if (c < 0) {
        return
    }
    while (a < e) {
        if (k[a].yk == "1") {
            if (f == c) {
                j = a
            }
            if (f == c + 1) {
                b = a;
                break
            }
            f++
        }
        a++
    }
    var l = "";
    if (j > 0 && j <= e) {
        if (d == k[j].code) {
            l = "recur"
        }
    }
    $(g[c]).before(getDBLi(k[j].code, k[j].tagname, l));
    if (l == "recur" && b > 0 && b <= e) {
        $(g[c + 1]).before(getDBLi(k[b].code, k[b].tagname), "");
        return 2
    }
    return 1
}
function getDBLi(d, a, e, b) {
    if (d && a) {
        if (!e) {
            e = ""
        }
        if (b == 1) {
            return '<li id="{0}" class=\'{2}\'><a href="{3}/brief/result.aspx?dbprefix={0}">{1}</a></li>'.format(d, a, e, BasePath())
        }
        return "<li id=\"{0}\" class='{2}' onclick=\"CheckDBTag(this,'{1}','{0}',true);return false;\"><a href=\"javascript:void(0);\">{1}</a></li>".format(d, a, e)
    }
    return ""
}
function RemoveDBTag(c, a) {
    if (c) {
        var b = c.length;
        for (var d = 0; d < a.length; d++) {
            if (a[d] < b) {
                $(c[a[d]]).remove()
            }
        }
    }
}
function isLong(b) {
    if (b) {
        var a = strlen(b);
        if (a > 12) {
            return true
        }
    }
    return false
}
function strlen(b) {
    var a = 0;
    for (var c = 0; c < b.length; c++) {
        if (b.charAt(c).match(/[\u0391-\uFFE5]/)) {
            a += 2
        } else {
            a++
        }
    }
    return a
}
function setNaviDBSwitch() {
    if ($("#resultDBSwitchIsEmpty").val() == "0") {
        $("#rDBSwitchDiv").hide()
    }
}
function getDBInfoArray() {
    var a;
    if (!dbJson) {
        var b = new dbJsonFac();
        a = b.getDBarray()
    } else {
        a = dbJson.dbinfo
    }
    return a
}
function resultAddWideScreenDB() {
    if (IsWideScreen()) {
        var f = $(".recur").attr("id");
        var h = getDBInfoArray();
        if (!h || h.length <= 0) {
            return
        }
        var j = {L: 1, M: 2, R: 3};
        cnki_WideScreenDB.initInfo();
        var g = j.L;
        if (cnki_WideScreenDB.miDBInfo.code == f) {
            g = j.M
        } else {
            var e = displayTagCount;
            var a = 0, b = h.length;
            var c = a;
            if (e < b) {
                while (a < b) {
                    if (h[a].yk == "1") {
                        if (c < e) {
                            if (h[a].code == f) {
                                g = j.L;
                                break
                            }
                            c++
                        } else {
                            g = j.R;
                            break
                        }
                    }
                    a++
                }
            }
        }
        var d = null;
        if (g == j.M || g == j.R) {
            d = cnki_WideScreenDB.leDBInfo;
            $(".recur").before(getDBLi(d.code, d.tagname, "", 1))
        } else {
            $("#DbotherLi").before(getDBLi(cnki_WideScreenDB.miDBInfo.code, cnki_WideScreenDB.miDBInfo.tagname, "", 1))
        }
    }
}
function addWideScreenDB() {
    if (IsWideScreen()) {
        cnki_WideScreenDB.initInfo();
        if (cnki_WideScreenDB.miDBInfo) {
            $("#DbotherLi").before(getDBLi(cnki_WideScreenDB.miDBInfo.code, cnki_WideScreenDB.miDBInfo.tagname))
        }
    }
}
var cnki_WideScreenDB = {
    dbInfoArray: [], isError: false, ykLen: 11, insertDelFun: function () {
    }, miDBInfo: null, leDBInfo: null, riDBInfo: null, initInfo: function () {
        dbInfoArray = getDBInfoArray();
        if (!dbInfoArray || dbInfoArray.length <= 0) {
            return
        }
        var c = displayTagCount;
        var b = 0, a = dbInfoArray.length;
        var d = b;
        if (c < a) {
            while (b < a) {
                if (dbInfoArray[b].yk == "1") {
                    if (d < c) {
                        d++
                    } else {
                        break
                    }
                }
                b++
            }
        }
        if (d == c) {
            if (b - 1 >= 0) {
                this.leDBInfo = dbInfoArray[b - 1]
            }
            this.miDBInfo = dbInfoArray[b];
            if (b + 1 < a) {
                this.riDBInfo = dbInfoArray[b + 1]
            }
        }
    }
};
var RelatedWords = ["QW", "FT", "SU", "TI", "KY", "AB", "RF", "XF"];
function ykSelChangeEvent(d) {
    var b = function (e) {
        var f = RelatedWords.length;
        while (f--) {
            if (e == RelatedWords[f]) {
                return true
            }
        }
        return false
    };
    var c = function (e) {
        if (e) {
            $("#CKB_extension").val("TYC")
        } else {
            $("#CKB_extension").val("")
        }
    };
    if (d) {
        var a = d.value;
        if (a.indexOf("$") > 0) {
            a = a.substring(0, a.indexOf("$"));
            if (a && a.length > 0) {
                if (b(a)) {
                    c(true);
                    return
                }
            }
        }
    }
    c(false)
};
function RecommendTip() {
}
RecommendTip.prototype.recommandSearch = function () {
    var a = $("#txt_1_value1").val();
    $("#txt_1_value1").val("");
    $("#expertvalue").val($("#recommandcondition").val());
    SubmitForm("", "&ua=1.17");
    $("#txt_1_value1").val(a);
    $("#recommandconLink").css({background: "#FF6600", color: "#fff"})
};
RecommendTip.prototype.getRecommendTip = function (e) {
    $("#recommandconLink").removeAttr("style");
    $("#expertvalue").val("");
    if (e == "" || e == null) {
        e = ge("txt_1_value1").value
    }
    if (e == "") {
        this.setTipsNone();
        return
    }
    var c = "/kns/Request/GetAptitude_searchHandler.ashx";
    var g = ge("txt_1_sel");
    var h = g.options.length;
    var d = "";
    var j = null;
    var f = ge("singleDB").value;
    if ("CRFD|CRPD|CRDD|CRMD|IMAGE|CRLD|CIDX".indexOf(f.toUpperCase()) > 0) {
        this.setTipsNone();
        return
    }
    var b = "";
    for (var a = 0; a < h; a++) {
        b += g[a].value + ","
    }
    for (var a = 0; a < h; a++) {
        if (g[a].selected == true) {
            j = g[a].text;
            break
        }
    }
    CommonDealNoDiv("Recommend_tip", c, "&kw=" + encodeURIComponent(e) + "&dbcode=" + f + "&selectedField=" + encodeURIComponent(j) + "&valueFiled=" + encodeURIComponent(b), this.ShowRecommendTip, "")
};
RecommendTip.prototype.ShowRecommendTip = function (a) {
    if (a.readyState != ReadyState.Complete) {
        return
    }
    if (a.status == HttpStatus.OK) {
        $("#RecommendTip").html(a.responseText)
    }
};
RecommendTip.prototype.setTipsNone = function () {
    $("#RecommendTip").html("")
};
RecommendTip.prototype.getrecommendtips = function (a) {
    var b = "";
    if (a == null || a == "" || a.length == 0) {
        return ""
    }
    for (i = 0; i < a.length; i++) {
        b += a[i].split(":")[1] + " "
    }
    return b
};
function HistoryOperat() {
    this.IshaveNewSeeCookie = 0;
    this.IshaveNewDownCookie = 0
}
HistoryOperat.prototype.IsSupHTML5 = (function () {
    return window.localStorage ? true : false
});
HistoryOperat.prototype.newsetCookie = function (b, e) {
    if (e == "输入检索词") {
        return
    }
    var d = 7;
    var a = new Date();
    a.setTime(a.getTime() + d * 24 * 60 * 60 * 1000);
    var c = "";
    if (this.newgetCookie(b) != null) {
        c = this.newgetCookie(b)
    }
    if (c != null && c != "" && c != "<#>") {
        if (!this.IsIndexOfTheValue(c, $.trim(e))) {
            if (this.IsSupHTML5()) {
                localStorage.setItem(b, e + "<#>" + c)
            } else {
                document.cookie = b + "=" + escape(e + "<#>" + c) + ";expires=" + a.toGMTString() + ";path=/"
            }
        }
    } else {
        if (this.IsSupHTML5()) {
            localStorage.setItem(b, e + "<#>")
        } else {
            document.cookie = b + "=" + escape(e + "<#>") + ";expires=" + a.toGMTString() + ";path=/"
        }
    }
    this.setCookieNew15(b)
};
HistoryOperat.prototype.setCookieNew15 = function (b) {
    var f = 7;
    var a = new Date();
    a.setTime(a.getTime() + f * 24 * 60 * 60 * 1000);
    var d = "";
    var e = this.newgetCookie(b);
    var c = e.split("<#>");
    if (c.length > 15) {
        for (i = 0; i <= 15; i++) {
            d += c[i] + "<#>"
        }
        if (this.IsSupHTML5()) {
            localStorage.setItem(b, d)
        } else {
            document.cookie = b + "=" + escape(d) + ";expires=" + a.toGMTString() + ";path=/"
        }
    }
};
HistoryOperat.prototype.IsIndexOfTheValue = function (d, a) {
    var e = false;
    var f = "";
    var c = d.split("<#>");
    for (var b = 0; b < c.length; b++) {
        if (c[b].toString() == a) {
            e = true
        }
    }
    return e
};
HistoryOperat.prototype.newgetCookie = function (a) {
    var d = "";
    if (this.IsSupHTML5()) {
        d = localStorage.getItem(a)
    } else {
        var b, c = new RegExp("(^| )" + a + "=([^;]*)(;|$)");
        if (b = document.cookie.match(c)) {
            d = unescape(b[2])
        }
    }
    if (d == null) {
        d = ""
    }
    return d
};
HistoryOperat.prototype.newdelCookie = function (b, c) {
    if (this.IsSupHTML5()) {
        localStorage.removeItem(b)
    } else {
        var a = new Date();
        a.setTime(a.getTime() - 1);
        var d = getCookie(b);
        if (d != null) {
            document.cookie = b + "=| ;expires=" + a.toGMTString() + ";path=/"
        }
    }
    $("#" + c).html("");
    if (b.indexOf("UserInputs") > -1) {
        $("#history_js").hide();
        $("#newsearchhis").hide();
        this.hisresult_ForInputs()
    } else {
        if (b == "UserSees") {
            $("#history_ll").hide();
            $("#newsearchhis1").hide()
        } else {
            if (b == "UserDownLoads") {
                $("#history_xz").hide();
                $("#newsearchhis2").hide()
            }
        }
    }
};
HistoryOperat.prototype.hisresult_SeeAndDown = function () {
    var b;
    var c = this.newgetCookie("UserSees");
    var d = this.newgetCookie("UserDownLoads");
    if (this.IsSupHTML5()) {
        this.getHisResultByLocStog("UserSees", c, "listSpan1", "newsearchhis1", "history_ll");
        this.getHisResultByLocStog("UserDownLoads", d, "listSpan2", "newsearchhis2", "history_xz")
    } else {
        var a = "&UserSees=" + escape(c) + "&UserDownLoads=" + escape(d);
        $.getJSON("../request/GetUserHistory.ashx", a, function (e) {
            if (e) {
                if (e.UserSees && e.UserSees.indexOf("clearspan") > -1) {
                    $("#newsearchhis1").html(unescape(e.UserSees));
                    $("#history_ll").show();
                    $("#newsearchhis1").show()
                }
                if (e.UserDownLoads && e.UserDownLoads.indexOf("clearspan") > -1) {
                    $("#newsearchhis2").html(unescape(e.UserDownLoads));
                    SetDisplayValue("history_xz", "");
                    SetDisplayValue("newsearchhis2", "")
                }
            }
        })
    }
};
HistoryOperat.prototype.hisresult_ForSeeAndDown = function (b, e) {
    var a = "&" + b + "=" + this.newgetCookie(b);
    var c = e;
    var d = function (g) {
        if (g.readyState != ReadyState.Complete) {
            return
        }
        if (g.status == HttpStatus.OK) {
            if (g.responseText != "" && g.responseText.indexOf("clearspan") > -1) {
                if (g.responseText.indexOf("UserSees") > -1) {
                    $("#newsearchhis1").html(g.responseText);
                    $("#history_ll").show();
                    $("#newsearchhis1").show();
                    if (c) {
                        $("#cookichistory1").show();
                        var f = $("#s_jiantoull").attr("src");
                        var h = f.replace("s_jiantou01", "s_jiantou");
                        $("#s_jiantoull").attr("src", h)
                    }
                } else {
                    if (ge("newsearchhis2") != null) {
                        ge("newsearchhis2").innerHTML = g.responseText;
                        SetDisplayValue("history_xz", "");
                        SetDisplayValue("newsearchhis2", "");
                        if (c) {
                            $("#cookichistory2").show();
                            var f = $("#s_jiantoudown").attr("src");
                            var h = f.replace("s_jiantou01", "s_jiantou");
                            $("#s_jiantoudown").attr("src", h)
                        }
                    }
                }
            }
        }
    };
    if (b == "UserSees") {
        CommonDealNoDiv(b + "&", "../request/GetUserSeesHandler.ashx", a, d, null, "GET")
    } else {
        if (b == "UserDownLoads") {
            CommonDealNoDiv(b + "&", "../request/GetUserDownLoadsHandler.ashx", a, d, null, "GET")
        }
    }
};
HistoryOperat.prototype.hisresult_ForInputs = function () {
    CommonDealNoDiv("UserInputs&", "../request/GetUserInputsHandler.ashx", null, null, null, "GET")
};
HistoryOperat.prototype.hisresult_new = function (e, o, d, p) {
    var q;
    var r;
    if (e && e.indexOf("UserInputs") > -1) {
        r = this.newgetCookie(e)
    }
    var m = 0;
    if (r != null && r.length > 1) {
        q = "<ul class='listSpan'>";
        var g = "";
        var c = "";
        var h = r.split("<#>");
        var j = 0;
        for (var a = 0, b = h.length - 1; a < b; a++) {
            if (!h[a]) {
                continue
            }
            var k = "";
            if (e == "UserInputsN") {
                k = "<li><a onclick=\"InSearchSimilar('" + h[a] + "','his')\"  href='javascript:void(0)'>" + h[a] + "</a></li>"
            } else {
                k = "<li><a onclick=\"SearchSimilar('" + h[a] + "','his')\"  href='javascript:void(0)'>" + h[a] + "</a></li>"
            }
            if (j < 5) {
                q += k
            } else {
                if (j < 15) {
                    g += k
                }
            }
            j++
        }
        q += "</ul>";
        if (g != "") {
            q += "<ul class='listSpan' id='" + o + "' style='display:none'>" + g + "</ul>"
        }
        if (j > 0) {
            var n = "<a onclick=\"historyoperater.newdelCookie('" + e + "','" + d + "');\"  href='javascript:void(0)'>清空</a>";
            var f = "<a href='../brief/history.aspx' target='_blank'>检索痕迹</a>";
            if (e == "UserInputs") {
                q += '<p class="clearspan">' + f + "&nbsp;&nbsp;&nbsp;&nbsp;" + n + "</p>"
            } else {
                q += '<p class="clearspan">' + n + "</p>"
            }
        }
        if (ge(d) != null) {
            ge(d).innerHTML = q;
            SetDisplayValue(p, "");
            SetDisplayValue(d, "")
        }
    }
};
HistoryOperat.prototype.getHisResultByLocStog = function (o, g, m, c, n) {
    var d;
    if (g != null && g.length > 1) {
        d = "<ul class='listSpan'>";
        var e = "";
        var b = g.split("<#>");
        var f = 0;
        var p;
        for (var a = 0, j = b.length - 1; a < j; a++) {
            if (!b[a]) {
                continue
            }
            p = b[a].split("<!>");
            if (p.length != 3) {
                continue
            }
            if (!p[2] || !p[1]) {
                continue
            }
            var h = "<li><a target='_blank' href='" + p[2] + "'>" + p[1] + "</a></li>";
            if (f < 5) {
                d += h
            } else {
                if (f < 15) {
                    e += h
                }
            }
            f++
        }
        d += "</ul>";
        if (e != "") {
            d += "<ul class='listSpan' id='" + m + "' style='display:none'>" + e + "</ul>"
        }
        if (f > 0) {
            var k = "<a onclick=\"historyoperater.newdelCookie('" + o + "','" + c + "');\"  href='javascript:void(0)'>清空</a>";
            d += '<p class="clearspan">' + k + "</p>"
        }
        if (ge(c) != null) {
            ge(c).innerHTML = d;
            SetDisplayValue(n, "");
            SetDisplayValue(c, "")
        }
    }
};
HistoryOperat.prototype.getCookieParams = function (c) {
    var e = "";
    if (c && c.length > 0) {
        var b = "";
        var f = "";
        var a = "";
        var d = decodeURI(c);
        b = this.getValueFromQuery(d, "dbcode");
        f = this.getValueFromQuery(d, "dbname");
        a = this.getValueFromQuery(d, "filename");
        if (a == "") {
            a = this.getValueFromQuery(d, "file")
        }
        e = a + "!" + b + "!" + f
    }
    return e
};
HistoryOperat.prototype.getValueFromQuery = function (c, b) {
    var a = "";
    if (Object.prototype.toString.call(c) == "[object String]" && c.length > 0 && Object.prototype.toString.call(b) == "[object String]" && b.length > 0) {
        var d = new RegExp("[?&]" + b + "=([^&]+)", "ig");
        if (d.test(c)) {
            a = RegExp.$1
        }
    }
    return a
};
HistoryOperat.prototype.getCookieParams_Sees = function (c) {
    if (!c || !c.href) {
        return ""
    }
    var b = this.getCookieParams(c.href);
    if (this.IsSupHTML5()) {
        var a = (c.innerText && c.innerText != undefined) ? c.innerText : c.text;
        b = b + "<!>" + a + "<!>" + c.href
    }
    return b
};
HistoryOperat.prototype.getCookieParams_DownsL = function (g) {
    var e = "";
    var d;
    if (window.attachEvent) {
        d = g.parentNode.parentNode.parentNode
    } else {
        d = g.parentNode
    }
    var c = getElementsByClassName("fz14", "a", d, true)[0];
    if (c) {
        e = this.getCookieParams(c.href);
        if (this.IsSupHTML5()) {
            var f = (c.innerText && c.innerText != undefined) ? c.innerText : c.text;
            e = e + "<!>" + f + "<!>" + c.href
        }
    }
    return e
};
HistoryOperat.prototype.getCookieParams_DownsD = function (h) {
    var e = "";
    var d = h.parentNode.parentNode.parentNode.parentNode;
    var g = getElementsByClassName("GridTitleDiv", "div", d, true)[0];
    if (typeof g == "undefined") {
        return
    }
    var c = $(g).children().find("a");
    if (c) {
        for (var f = 0; f < c.length; f++) {
            var a = c[f].href;
            a = a.toLowerCase();
            if (a.indexOf("filename") > 0 || a.indexOf("file") > 0) {
                e = this.getCookieParams(a);
                continue
            }
        }
        if (this.IsSupHTML5()) {
            e = e + "<!>" + c.text() + "<!>" + c.attr("href")
        }
    }
    return e
};
HistoryOperat.prototype.IsContinsTheValue = function (b, d) {
    var a = this.newgetCookie(b);
    var c = false;
    if (a) {
        if (a.indexOf(d) > -1) {
            c = true
        }
    }
    return c
};
HistoryOperat.prototype.IsIndexOfTheValueForDown = function (f, e) {
    var g = this.newgetCookie(f);
    var d = false;
    var j = "";
    if (g != null) {
        for (var a = 0; a < g.length; a++) {
            if (g[a] != "|") {
                j += g[a]
            } else {
                var c = /\<script .*\<\/script\>/ig;
                var b = /\<font .*\<\/font\>/ig;
                var h = e.replace(c, "");
                h = h.replace(b, "");
                if (j.indexOf(h) > -1) {
                    d = true;
                    return d
                }
                j = ""
            }
        }
    }
    return d
};
function J(a) {
    return document.createElement(a)
}
function O(a, b, c) {
    if (ISIE) {
        if (b == "load") {
            a.onreadystatechange = function () {
                if (this.readyState == "loaded") {
                    c()
                }
            }
        } else {
            a.attachEvent("on" + b, (function (d) {
                return function () {
                    c.call(d)
                }
            })(a))
        }
    } else {
        a.addEventListener(b, c, false)
    }
}
var C;
function RequestJsonObject(b, a) {
    if (C) {
        document.body.removeChild(C)
    }
    C = J("SCRIPT");
    C.id = "callScriptE";
    C.src = b + "&td=" + (new Date()).getTime();
    C.charset = "utf-8";
    document.body.appendChild(C);
    O(C, "load", a)
}
function RecResource() {
}
RecResource.prototype.SubType = {CRFD: 1, IMG: 2, CLKL: 3, SCSD: 4, SCPD: 5, WWJD: 6, SCDB: 7};
RecResource.prototype.TempletType = {DIV: 1, TAB: 2};
RecResource.prototype.Templet = {DIV: "", TAB: "", OTH: ""};
String.prototype.format = function () {
    var a = arguments;
    return this.replace(/\{(\d+)\}/g, function (b, c) {
        return a[c]
    })
};
RecResource.prototype.GetCRFDInfoDiv = function (d, c, b) {
    var e = "http://gongjushu.cnki.net/refbook/{0}.html";
    var f = e.replace("{0}", d.FN);
    var h = "";
    if (c) {
        h = "<dd class='more'><a onclick=\"MoreInfoSearch('CRFD','" + b + "');\" href='javascript:void(0);'>更多>></a></dd>"
    }
    var j = GetFlagTI(d.TI);
    var a = GetFlagTI(d.PH);
    var g = "<div id='crfdinfodiv' class='infobox'><a href='" + f + "' target='blank' class='filtimg' onclick=WriteLog('3.10')><img src='http://epub.cnki.net" + a + "'/></a><dl><dt class='filthd'><a href='" + f + "' target='blank' onclick=WriteLog('3.10')>" + j + "</a></dt><dd class='filtbd1'>" + d.PU + "</dd><dd class='filtbd1'>" + d.AU + h + "</dl></div>";
    return g
};
RecResource.prototype.GetIMGInfoDiv = function (c, b, e) {
    var d = "";
    if (b) {
        d = "<dd class='more'><a onclick=\"MoreInfoSearch('IMG','" + e + "');\" href='javascript:void(0);' >更多>></a></dd>"
    }
    var g = GetFlagTI(c.TI);
    var a = "http://image.cnki.net/detail/" + c.FN + ".html";
    var f = "<div id='imginfodiv' class='infobox'><a href='" + a + "' target='blank' class='filtimg' onclick=WriteLog('3.20')><img width='102px' src='" + c.YDZ + "'/></a><dl><dt class='filthd'><a href='" + c.MDZ + "'  target='blank' onclick=WriteLog('3.20')>" + g + "</a></dt><dd class='filtbd1'>" + c.KY + "</dd>" + d + "</dl></div>";
    return f
};
RecResource.prototype.GetCLKLInfoDiv = function (h, c, b) {
    var e = "http://law1.cnki.net/law/detail/detail.aspx?DbCode=CLKLT&dbname=&filename={0}";
    var a = e.format(h.FN);
    var g = "";
    if (c) {
        g = "<dd class='more'><a onclick=\"MoreInfoSearch('CLKL','" + b + "');\" href='javascript:void(0);'>更多>></a></dd>"
    }
    var d = GetFlagTI(h.TI);
    var f = "<div id='clklinfodiv' class='infobox'><dl><dt class='filthd'><a href='" + a + "' target='blank' onclick=WriteLog('3.30')>" + d + "</a></dt><dd class='filtbd1'>" + h.JB + "</dd><dd class='filtbd1'>" + h.SXX + "</dd><dd class='filtbd1'>" + h.PD + "</dd>" + g + "</dl></div>";
    return f
};
RecResource.prototype.GetSCSDInfoDiv = function (a, c, b) {
    var e = "/kns/detail/detail.aspx?dbcode=SCHF&dbname={1}&filename={0}";
    var g = e.replace("{0}", a.FN);
    g = g.replace("{1}", a.FN.substring(0, 4));
    var h = "";
    if (c) {
        h = "<dd class='more'><a onclick=\"MoreInfoSearch('SCSD','" + b + "');\" href='javascript:void(0);' >更多>></a></dd>"
    }
    var d = GetFlagTI(a.TI);
    var f = "<div id='scsdinfodiv' class='infobox'><dl><dt class='filthd'><a href='" + g + "' target='blank'  onclick=WriteLog('3.40')>" + d + "</a></dt><dd class='filtbd1'>" + a.BZH + "</dd><dd class='filtbd1'>" + a.AF + "</dd>" + h + "</dl></div>";
    return f
};
RecResource.prototype.GetSCPDInfoDiv = function (a, c, b) {
    var g = "/KNS/detail/detail.aspx?dbcode=scpd&dbname={0}&filename={1}";
    var j = g.replace("{0}", a.BM);
    j = j.replace("{1}", a.FN);
    var e = a.LY || "";
    var h = "";
    if (c) {
        h = "<dd class='more'><a onclick=\"MoreInfoSearch('SCPD','" + b + "');\" href='javascript:void(0);' >更多>></a></dd>"
    }
    var d = GetFlagTI(a.TI);
    var f = "<div id='scpdinfodiv' class='infobox'><dl><dt class='filthd'><a href='" + j + "' target='blank'  onclick=WriteLog('3.60')>" + d + "</a></dt><dd class='filtbd1'>" + e + "</dd>" + h + "</dl></div>";
    return f
};
RecResource.prototype.GetCAPJInfoDiv = function (f, d, c) {
    var b = "/KNS/detail/detail.aspx?dbcode=cjfq&dbname={0}&filename={1}";
    var a = b.replace("{0}", f.BM);
    a = a.replace("{1}", f.FN);
    var h = "";
    if (d) {
        h = "<dd class='more'><a onclick=\"MoreInfoSearch('CJFQ','" + c + "');\" href='javascript:void(0);' >更多>></a></dd>"
    }
    var j = GetFlagTI(f.TI);
    var e = GetFlagTI(f.AU);
    var g = "<div id='capjinfodiv' class='infobox'><dl><dt class='filthd'><a href='" + a + "' target='blank'  onclick=WriteLog('3.70')>" + j + "</a></dt><dd class='filtbd1'>" + e + "</dd>" + h + "</dl></div>";
    return g
};
RecResource.prototype.GetWWJDInfoDivH = function (m, d, c) {
    var g = "http://scholar.cnki.net/detail/detail.aspx?tablename={0}&filename={1}";
    var a = g.replace("{0}", m.BM);
    a = a.replace("{1}", m.FN);
    var h = GetFlagTI(m.TI);
    var j = m.LY || "";
    var e = m.PD || "";
    var b = m.AU || "";
    var f = m.JN || "";
    var b = m.YE || "";
    var l = m.QI == null ? "" : "(" + m.QI + ")";
    var k = "<dl><dt class='filthd'><a href='" + a + "' target='blank' class='filtimg' onclick=WriteLog('3.50')>" + h + "</a></dt><dd class='filtbd'><span class='a'>" + f + "</span><span class='b'>" + e + "</span><span class='c'>" + j + "</span></dd></dl>";
    return k
};
RecResource.prototype.GetWWJDInfoTable = function (l, j, f) {
    var g = "/kns/detail/detail.aspx?dbcode={2}&dbname={0}&filename={1}";
    var a = g.replace("{0}", l.BM);
    a = a.replace("{1}", l.FN);
    a = a.replace("{2}", l.BM.substring(0, 4));
    var h = GetFlagTI(l.TI);
    var d = GetFlagTI(l.LY);
    var e = GetFlagTI(l.PD);
    var b = l.AU == null ? "" : l.AU;
    b = GetFlagAU(b);
    var k = GetFlagTI(l.JN);
    var m = f == true ? "class='odd'" : "";
    var c = "<tr " + m + "><td class='filthd' width='60%'><a href='" + a + "' target='blank' onclick=WriteLog('3.50')>" + h + "</a></td><td  width='15%' class='rewwjd_au'>" + b + "</td><td  width='15%' class='rewwjd_jn'>" + k + "</td><td>" + e + "</td></tr>";
    return c
};
RecResource.prototype.GetSCDBInfoTable = function (h, e, f) {
    var m = "/kns/detail/detail.aspx?dbcode={2}&dbname={0}&filename={1}";
    var d = m.replace("{0}", h.BM);
    d = d.replace("{1}", h.FN);
    d = d.replace("{2}", h.BM.substring(0, 4));
    var j = GetFlagTI(h.TI);
    var b = GetFlagTI(h.LY);
    var l = GetFlagTI(h.PD);
    var c = GetFlagTI(h.AU);
    var g = GetFlagTI(h.JN);
    var a = f == true ? "class='odd'" : "";
    var k = "<tr " + a + "><td class='filthdc' width='52%'><a href='" + d + "' target='blank' onclick=WriteLog('3.70')>" + j + "</a></td><td  width='15%' class='rescdb_au'>" + c + "</td><td  width='20%' class='rescdb_jn'>" + g + "</td><td  width='8%'>" + l + "</td><td>" + b + "</td></tr>";
    return k
};
RecResource.prototype.GetResourceInfo = function (a) {
    if (a == "") {
        return
    }
    this.RecURL = $("#crrsPath").val() + "/RelItems.ashx?keyword=";
    var b = this.RecURL + encodeURI(a);
    RequestJsonObject(b, function () {
        if (typeof json_result == "undefined") {
            return ""
        }
        var k = "";
        var l = "";
        var f = "";
        var m = "";
        var j = "";
        if (typeof json_result.CRFD != "undefined") {
            var d = json_result.CRFD;
            var g = d[0];
            if (g != null && g != "") {
                k = RecResource.prototype.GetCRFDInfoDiv(g, showmore)
            }
        }
        if (typeof json_result.IMG != "undefined") {
            var d = json_result.IMG;
            var e = d[0];
            if (e != null && e != "") {
                l = RecResource.prototype.GetIMGInfoDiv(e, showmore)
            }
        }
        if (typeof json_result.CLKL != "undefined") {
            var d = json_result.CLKL;
            var n = d[0];
            if (n != null && n != "") {
                f = RecResource.prototype.GetCLKLInfoDiv(n, showmore)
            }
        }
        if (typeof json_result.SCSD != "undefined") {
            var d = json_result.SCSD;
            var o = d[0];
            if (o != null && o != "") {
                m = RecResource.prototype.GetSCSDInfoDiv(o, showmore)
            }
        }
        if (typeof json_result.SCPD != "undefined") {
            var d = json_result.SCPD;
            var c = d[0];
            if (c != null && c != "") {
                j = RecResource.prototype.GetSCPDInfoDiv(c, showmore)
            }
        }
        var h = k + l + f + m + j;
        return h
    })
};
RecResource.prototype.GetResourceInfoToID = function (b, c, f, e) {
    var a = RecResource.prototype.GetResourceInfo(b);
    RemoveRecDiv();
    if (a != "") {
        var d = "<div id='recInfoTitle' class='wx_jsframe_jiao wx_jsframe_jiaoBlank'><strong>相关资源</strong></div><div>" + a + "</div>";
        if (f == 0) {
            $("#" + c).before(d)
        } else {
            if (f == 1) {
                $("#" + c).after(d)
            } else {
                $("#" + c).html(d)
            }
        }
    }
};
RecResource.prototype.GetResourceInfoToIDH = function (a, h, b, c) {
    if (a == "") {
        return
    }
    var f = $("#crrsPath").val() + "/RelItems.ashx?keyword=";
    var g = f + encodeURI(a);
    RemoveRecDiv();
    var e;
    if (self == top) {
        e = space3.getExData(a)
    } else {
        e = parent.space3.getExData(a)
    }
    if (e) {
        d(e)
    } else {
        RequestJsonObject(g, function () {
            if (typeof json_result == "undefined") {
                return ""
            }
            var s = "";
            var t = "";
            var m = "";
            var v = "";
            var r = "";
            var n = "";
            if (typeof json_result.CRFD != "undefined") {
                var k = json_result.CRFD;
                var o = k[0];
                if (o != null && o != "") {
                    s = RecResource.prototype.GetCRFDInfoDiv(o, c, a)
                }
            }
            if (typeof json_result.IMG != "undefined") {
                var k = json_result.IMG;
                var l = k[0];
                if (l != null && l != "") {
                    t = RecResource.prototype.GetIMGInfoDiv(l, c, a)
                }
            }
            if (typeof json_result.CLKL != "undefined") {
                var k = json_result.CLKL;
                var w = k[0];
                if (w != null && w != "") {
                    m = RecResource.prototype.GetCLKLInfoDiv(w, c, a)
                }
            }
            if (typeof json_result.SCSD != "undefined") {
                var k = json_result.SCSD;
                var x = k[0];
                if (x != null && l != "") {
                    v = RecResource.prototype.GetSCSDInfoDiv(x, c, a)
                }
            }
            if (typeof json_result.SCPD != "undefined") {
                var k = json_result.SCPD;
                var j = k[0];
                if (j != null && j != "") {
                    r = RecResource.prototype.GetSCPDInfoDiv(j, c, a)
                }
            }
            if (typeof json_result.CAPJ != "undefined") {
                var k = json_result.CAPJ;
                var q = k[0];
                if (q != null && q != "") {
                    n = RecResource.prototype.GetCAPJInfoDiv(q, c, a)
                }
            }
            var p = s + t + m + v + r + n;
            if (p != "") {
                var u = "<div id='recInfoTitle' class='wx_jsframe_jiao wx_jsframe_jiaoBlank'><strong>相关资源</strong></div><div>" + p + "</div>";
                if (self == top) {
                    space3.pushSpace(a, u)
                } else {
                    parent.space3.pushSpace(a, u)
                }
                d(u)
            }
        })
    }
    function d(j) {
        if (b == 0) {
            $("#" + h).before(j)
        } else {
            if (b == 1) {
                $("#" + h).after(j)
            } else {
                $("#" + h).html(j)
            }
        }
    }
};
if (self == top) {
    if (!this.space3) {
        this.space3 = CreateCacheSpace(20, 0)
    }
}
RecResource.prototype.GetRecWWJD2ID = function (a, b, c, f) {
    if (a == "") {
        return
    }
    var g = $("#crrsPath").val() + "/RelItems.ashx?keyword=";
    var k = g + encodeURI(a);
    var e = "wwdb;wwjd;wwbd;sjes;ssjd;sjwd;stjd;sjwk;spqd;sjem;sjpd;sjcm;sipd;sjdu;sjup;scud;sjdg;sbed;sjgt;sjig;sjox;sjam;sjhp;sjhr;sjih;sjrs;sjsd;sard;sbad;scad;shjd;sjim;sapd;sesd;sijd;sjbc;sjce;sjco;sjdi;sjdj;sjdp;sjhd;sjif;sjiv;sjjs;sjms;sjre;sjsr;sjsu;sjsy;sjwa;sjwp;sswd;sjad;sjea;sjet;smud;sjtt;sjfs;sjng;ssbd;sbcd;sbce;sbdg;sbin;sbwp;sibd;stbd;sbws;sjbd;sbes;sbig;smbd;shad";
    var l = parent.$("#singleDB").val().toLocaleLowerCase();
    if (!l) {
        return
    }
    var h = e.indexOf(l) > -1 ? "SCDB" : "WWJD";
    k = k + "&productcode=" + h;
    parent.$("#wwjdinfodiv").remove();
    parent.$("#scdbinfodiv").remove();
    var j;
    if (self == top) {
        j = space3.getExData(a + h)
    } else {
        j = parent.space3.getExData(a + h)
    }
    if (j) {
        d(j)
    } else {
        RequestJsonObject(k, function () {
            if (typeof json_result == "undefined") {
                return ""
            }
            var v = "";
            var r = "";
            if (typeof json_result.WWJD != "undefined") {
                var x = "<div id='wwjdinfodiv' style='word-break: break-all; display:none;' class='infoboxHor'>";
                var z = "</div>";
                var w = "";
                var q = "";
                var p = false;
                if (c) {
                    w = "<a class='more' onclick=\"MoreInfoSearch('WWDB','" + a + "');\"  href='javascript:void(0);' >在外文文献中检索<span>" + a + "</span><em style='font-family:宋体;font-style:normal;'>&gt;&gt;</em></a>"
                }
                var n = json_result.WWJD;
                for (i = 0; i < n.length; i++) {
                    var y = n[i];
                    if (y != null && y != "") {
                        if (i % 2 == 0) {
                            p = false
                        } else {
                            p = true
                        }
                        q += RecResource.prototype.GetWWJDInfoTable(y, c, p)
                    }
                }
                if (q != "") {
                    v = x + "<table class='infoboxHor'>" + q + "<tr><td colspan='5'>" + w + "</td></tr></table>" + z
                }
            }
            if (typeof json_result.SCDB != "undefined") {
                var m = "<div id='scdbinfodiv' style='word-break: break-all; display:none;' class='infoboxHor'>";
                var s = "</div>";
                var w = "";
                var o = "";
                var p = false;
                if (c) {
                    w = "<a class='more' onclick=\"MoreInfoSearch('SCDB','" + a + "');\" href='javascript:void(0);' >在中文文献中检索<span>" + a + "</span><em style='font-family:宋体;font-style:normal;'>>></em></a>"
                }
                var n = json_result.SCDB;
                for (i = 0; i < n.length; i++) {
                    var t = n[i];
                    if (t != null && t != "") {
                        if (i % 2 == 0) {
                            p = false
                        } else {
                            p = true
                        }
                        o += RecResource.prototype.GetSCDBInfoTable(t, c, p)
                    }
                }
                if (o != "") {
                    r = m + "<table class='infoboxHor'>" + o + "<tr><td colspan='5'>" + w + "</td></tr></table>" + s
                }
            }
            var u = v + r;
            if (u != "") {
                if (self == top) {
                    space3.pushSpace(a + h, u)
                } else {
                    parent.space3.pushSpace(a + h, u)
                }
                d(u)
            }
        })
    }
    function d(m) {
        if (b == 0) {
            parent.$("#" + f).before(m)
        } else {
            if (b == 1) {
                parent.$("#" + f).after(m)
            } else {
                parent.$("#" + f).html(m)
            }
        }
        InsertRecResource()
    }
};
function InsertRecResource() {
    var a = parent.$("#singleDB").val();
    if (a.length == 0) {
        a = "SCDB"
    }
    var b = "WWDB;WWJD;WWBD;SJES;SSJD;SJWD;STJD;SJWK;SPQD;SJEM;SJPD;SJCM;SIPD;SJDU;SJUP;SCUD;SJDG;SBED;SJGT;SJIG;SJOX;SJAM;SJHP;SJHR;SJIH;SJRS;SJSD;SARD;SBAD;SCAD;SHJD;SJIM;SAPD;SESD;SIJD;SJBC;SJCE;SJCO;SJDI;SJDJ;SJDP;SJHD;SJIF;SJIV;SJJS;SJMS;SJRE;SJSR;SJSU;SJSY;SJWA;SJWP;SSWD;SJAD;SJEA;SJET;SMUD;SJTT;SJFS;SJNG;SSBD;SBCD;SBCE;SBDG;SBIN;SBWP;SIBD;STBD;SBWS;SJBD;SBES;SBIG;SMBD;SHAD";
    if (document.URL.toLocaleLowerCase().indexOf("turnpage") < 0) {
        if (parent.$("#wwjdinfodiv").html() != null && b.indexOf(a) < 0) {
            $(".GridTableContent").parent("td").parent("tr").after("<tr id='testTR'><td>" + parent.$("#wwjdinfodiv").html() + "</td></tr>")
        }
        if (parent.$("#scdbinfodiv").html() != null && b.indexOf(a) >= 0) {
            $(".GridTableContent").parent("td").parent("tr").after("<tr id='testTR'><td>" + parent.$("#scdbinfodiv").html() + "<script>setScdbAuAndJn();</script></td></tr>")
        }
    }
}
function MoreInfoSearch(d, e) {
    var c = "../RedirectPage.aspx?action=indexpage&code={0}&kw={1}&korder=0";
    var b = d;
    if (b == "CRFD") {
        b = "CRPD"
    }
    if (b == "IMG") {
        b = "IMAGE"
    }
    if (b == "CLKL") {
        b = "CLKD"
    }
    if (b == "SCSD") {
        b = "CISD"
    }
    if (b == "SCPD") {
        b = "SCOD"
    }
    var a = encodeURI(e);
    c = c.replace("{0}", b).replace("{1}", a);
    if (a != "") {
        window.open(c)
    }
}
function WriteLog(a) {
    CommonDealNoDiv("CRRS&", "../request/SearchHandler.ashx", "ua=" + a, null, null)
}
function RemoveRecDiv() {
    $("#recInfoTitle").remove();
    $("#crfdinfodiv").remove();
    $("#imginfodiv").remove();
    $("#scsdinfodiv").remove();
    $("#scpdinfodiv").remove();
    $("#clklinfodiv").remove();
    $("#capjinfodiv").remove()
}
function GetFlagTI(a) {
    if (a == "" || a == "null" || a == null) {
        return ""
    } else {
        a = a.replace(/\$@\#/g, '<font class="Mark">');
        a = a.replace(/\#@\$/g, "</font>");
        if (a.length > 180) {
            a = a.substring(0, 180) + "..."
        }
        return a
    }
}
function GetFlagAU(a) {
    if (a == "" || a == "null" || a == null) {
        return ""
    } else {
        a = a.replace(/\;;/g, "; ");
        if (a.length > 60) {
            a = a.substring(0, 60) + "..."
        }
        return a
    }
};
var searchBarer = typeof SearchBar == "function" ? new SearchBar() : {};
var recommender = typeof RecommendTip == "function" ? new RecommendTip() : {};
var historyoperater = typeof HistoryOperat == "function" ? new HistoryOperat() : {};
var recResource = typeof RecResource == "function" ? new RecResource() : {};
var yxyzValue = "";
var PageStates = {
    searchInfo: {
        content: new Array(), add: function (c, a) {
            if (typeof c == "string" && c != "" && typeof a == "string" && a != "") {
                var b = this.find(c);
                if (b < 0) {
                    this.content.push(this.getJson(c, a))
                } else {
                    this.content[b] = this.getJson(c, a)
                }
                $("#selectCount").html($("#selectCount").html() + "_OK");
                return true
            }
            return false
        }, getJson: function (k, v) {
            return eval("({'k':'" + k + "','v':'" + v + "'})")
        }, remove: function (b) {
            var a = this.find(b);
            if (a >= 0) {
                this.content = this.content.slice(0, a).concat(this.content.slice(++a))
            }
        }, clear: function () {
            this.content = new Array()
        }, find: function (b) {
            var a = this.content.length;
            while (a--) {
                if (this.content[a] && this.content[a].k == b) {
                    return a
                }
            }
            return -1
        }, get: function (b) {
            var a = this.find(b);
            if (a >= 0) {
                return this.content[a]["v"]
            }
            return ""
        }
    }
};
PageStates.SearchKey = "";
PageStates.OporationType = 1;
PageStates.CurOrderBy = "";
PageStates.CurRSCount = 0;
PageStates.SetOporationType = function (a) {
    switch (a) {
        case"检索":
            PageStates.OporationType = 1;
            break;
        case"翻页":
            PageStates.OporationType = 2;
            break;
        case"分组":
            PageStates.OporationType = 3;
            break;
        case"排序":
            PageStates.OporationType = 4;
            break;
        case"切换显示":
            PageStates.OporationType = 5;
            break
    }
};
var isresult = false;
var isresult2 = false;
var ispost = false;
function LoadUC(a, c, g, f) {
    var e = new Request();
    var b = GetQueryStringByName(location.search, "dbPrefix");
    if (b == "") {
        b = getEmValue("dbPrefix")
    }
    if (b != "") {
        b = "&dbPrefix=" + b
    }
    b += "&rel=" + encodeURIComponent(location);
    var d = f + "/request/getucHandler.ashx?action=getuc&uc=" + encodeURIComponent(c) + b;
    e.GetNoCache(d, function (h) {
        if (h.readyState != ReadyState.Complete) {
            return
        }
        if (h.status == HttpStatus.OK && h.responseText != "") {
            $("#" + a).html(h.responseText);
            if (g && typeof(g) == "function") {
                g()
            }
        }
    })
}
function InitHistory() {
    historyoperater.hisresult_new("UserInputs", "cookichistory", "newsearchhis", "history_js");
    historyoperater.hisresult_SeeAndDown()
}
function trim(a) {
    var b = new RegExp("(" + message.inputSearchWord3 + ")|(^s*)|(s*$)", "g");
    return a.replace(b, "")
}
function gtv(a) {
    return trim(getEmValue(a))
}
function SetDisplayModel(b) {
    var a = GetQueryStringByName(b, "dbprefix");
    var c = GetDisplayModelCookie(a);
    if (c != "") {
        b = SetQueryStringByName(b, "DisplayMode", c)
    }
    return b
}
function SetDisplayModelCookie(b) {
    var c = 30;
    var a = new Date();
    a.setTime(a.getTime() + c * 24 * 60 * 60 * 1000);
    document.cookie = "KNS_DisplayModel=" + escape(b) + ";expires=" + a.toGMTString() + ";path=/"
}
function GetDisplayModelCookie(b) {
    try {
        if (!b) {
            return ""
        }
        var a = getValueFromCookie("KNS_DisplayModel");
        if (a != "") {
            var c = a.split("@");
            if (b.toLowerCase() == c[1].toLowerCase()) {
                return c[0]
            }
        }
    } catch (d) {
        return ""
    }
    return ""
}
function GetSubmitPath() {
    return getEmValue("submitpath")
}
function verPublishDate(a) {
    if (a) {
        a = a.toUpperCase();
        if (a == "CPFD" || a == "CIPD" || a == "IPFD") {
            return checkPublishDate("confertime")
        } else {
            if (a == "SCPD") {
                return checkPublishDate("date_gkr")
            }
        }
    }
    return true
}
function checkElExpert() {
    var a = ge("expertValue");
    if (a && a.value.length > 500) {
        alert(message.mostInput + "500" + message.keyNum);
        a.focus();
        return false
    }
    return true
}
function handleFundCode(a) {
    if (a) {
        if (/hidFundCode=[^&]+/.test(a)) {
            a = a.replace(/&?base_value1=[^&]*/, "");
            a = a.replace(/&?basevalue=[^&]*/, "")
        }
    }
    return a
}
function handleMagezineCode(a) {
    if (a) {
        if (/hidMagezineCode=[^&]+/.test(a)) {
            a = a.replace(/&?magazine_value1=[^&]*/, "")
        }
    }
    return a
}
function IndexSearchOnclick(a) {
    if (!oneBoxCheck()) {
        return false
    }
    recommender.getRecommendTip();
    recAddToPage();
    searchOnclick(a)
}
function oneBoxCheck(a) {
    var b = GetInputValue("txt_1_value1");
    if (typeof b == "string") {
        b = b.Trim();
        if (b == "") {
            if (typeof a == "function") {
                a()
            } else {
                alert("请输入检索词！")
            }
            return false
        }
        return true
    }
    return false
}
function delCollectCoreDB() {
    if (typeof collectSelectDB == "function") {
        if (!collectSelectDB()) {
            alert(message.selectOneDB2);
            return false
        }
    }
    return true
}
function expertCoreSearch(a) {
    SingleSearchOnclick(a)
}
function cnkiIndexSearchOnclick(a) {
    searchOnclick(a)
}
function searchOnclick(a) {
    CollectDBList();
    setTimeout(function () {
        SubmitForm("", a);
        searchBarer.SetSearchHisTip()
    }, 1000)
}
function SingleSearchOnclick(a) {
    SubmitForm("", a)
}
function SubmitForm(q, p) {
    if (("undefined" != typeof(Visualization)) && "undefined" != typeof(Visualization.pop) && "undefined" != typeof(Visualization.pop.clearCache)) {
        Visualization.pop.clearCache()
    }
    if (!delCollectCoreDB()) {
        return
    }
    var f = GetQueryStringByName(p, "ua");
    var d = GetQueryStringByName(p, "resultSearch");
    var o = GetQueryStringByName(p, "formDefaultResult");
    FillValue("ua", f);
    var l = ge("LeftGroupContent");
    if (l) {
        l.innerHTML = ""
    }
    isresult = false;
    var u = "";
    var m = getEmValue("basePath");
    if (m == "") {
        m = ".."
    }
    var x = GetSubmitPath();
    if (!x || x.length <= 0) {
        x = m + "/request/SearchHandler.ashx"
    }
    var s = ["publishdate", "date_gkr", "implementdate"];
    for (var n = 0; n < s.length; n++) {
        if (!checkPublishDate(s[n])) {
            return
        }
    }
    var y = ge("action");
    if ((q == null || q == "") && y != null) {
        q = y.value
    }
    var h = getEmValue("curdbcode");
    if (!verPublishDate(h)) {
        return
    }
    var w;
    if ($("#txt_1_value1").val()) {
        $("#recommandconLink").removeAttr("style");
        w = $("#txt_1_value1").val();
        var j = new RegExp("[\\|/]", "g");
        w = w.replace(j, " ");
        if (ge("cookichistoryN")) {
            historyoperater.newsetCookie("UserInputsN", w)
        } else {
            historyoperater.newsetCookie("UserInputs", w)
        }
    }
    u = p + SearchParam() + "&his=0";
    var v = getEmValue("singleDB");
    if (v != "") {
        u = ReplaceUrlParmValue(u, '/(DbPrefix=)([^&"]*)/gi', "DbPrefix=" + v);
        if (h != "") {
            u += "&parentdb=" + h
        }
        SetSubTheme(v);
        SetCharContentVisible(v)
    } else {
        SetSubTheme(h);
        SetCharContentVisible(h)
    }
    u = handleFundCode(u);
    u = handleMagezineCode(u);
    var r = NaviParam();
    var c = ge("issue_1_value1_2");
    if (c && !c.disabled) {
        if (!isNumber(c)) {
            return
        }
    }
    var e = "";
    var z = ge("sen");
    if (z != null && z.style.display != "none") {
        if (ge("sen_1_value1")) {
            if ((gtv("sen_1_value1") != "" && gtv("sen_1_value2") == "") || (gtv("sen_1_value2") != "" && gtv("sen_1_value1") == "")) {
                alert(message.twoKeyWord);
                return
            }
        }
        if (ge("sen_2_value1")) {
            if ((gtv("sen_2_value1") != "" && gtv("sen_2_value2") == "") || (gtv("sen_2_value2") != "" && gtv("sen_2_value1") == "")) {
                alert(message.twoKeyWord);
                return
            }
        }
        if (ge("sen_1_value1") && ge("sen_2_value1")) {
            if ((gtv("sen_1_value2") == "" && gtv("sen_1_value1") == "") && (gtv("sen_2_value2") == "" && gtv("sen_2_value1") == "")) {
                alert(message.twoKeyWord);
                return
            }
        }
        e = "&issen=1"
    }
    u = r + u + e;
    if (!checkElExpert()) {
        return
    }
    u = u.replace("undefined", "");
    if (!SiftSpicWord(u)) {
        return
    }
    if (q == "scdbsearch") {
        var b = document.getElementsByName("chbDBList");
        var t = "";
        for (var g = 0; g < b.length; g++) {
            if (b[g].checked == true) {
                t += b[g].value + ","
            }
        }
        if (t != "") {
            t = t.substr(0, t.length - 1)
        }
        document.forms.searchForm.submit();
        return
    }
    if (window.screen.width >= 1280) {
        if (v == "CIDX") {
            $("#iframeResult").width(1200);
            $("#searchrelevent").width(1200);
            $("#relevantExpertDiv").width(1200)
        } else {
            $("#iframeResult").width(974)
        }
    }
    var a = ge("divresult");
    if (a) {
        a.style.display = ""
    }
    if (zhiShuJumpSet(v)) {
        return
    }
    historyoperater.hisresult_new("UserInputs", "cookichistory", "newsearchhis", "history_js");
    CommonDeal(q, x, u, searchresult, waitingTip, "GET");
    if (o == "formDefaultResult") {
        LoadGroup(u)
    }
    if ($("#defaultResultGroup").val() == "defaultResultGroup") {
        if (d != "1") {
            if ($("#isTagSearch").val() == "1") {
                $("#isTagSearch").val("0");
                LoadGroup(u)
            } else {
                if (f == 1.11 && $("#isTagSearch").val() == "0") {
                    $("#group").html("")
                }
            }
        }
    } else {
        if ($("#resultGroup").val() == "resultGroup") {
            if ($("#isShowGroup").val() == "0" || $("#webGroup").html().trim() == "") {
                $("#isShowGroup").val("1");
                LoadGroup(u)
            } else {
                $("#group").html("")
            }
        } else {
            $("#group").html("")
        }
    }
    if (typeof extraParam != undefined && typeof extraParam != "undefined" && e) {
        if (!(extraParam.indexOf(e) >= 0)) {
            extraParam += e
        }
    }
    leftGroupCallBackFun = function () {
        WebGroupCall(function () {
            $("#webGroup span input[id^='Tag']").val("");
            arrGroupResult = new Array();
            arrGroupShowData0 = new Array();
            ExGroupExpand()
        });
        WriteLeftGroup(u)
    };
    hideGroupFun = function () {
    };
    backToTopFun = function () {
        ge("HeaderDiv").scrollIntoView()
    };
    ispost = true;
    SetSearchResultPage(v);
    HideRecommendInfo()
}
function HideRecommendInfo() {
    $("#recommendTitle").hide();
    $("#recommendContent").hide()
}
function LoadGroup(a) {
    isWebGroupOK = false;
    ClearWebGrouop();
    SetDisplayValue("resultFilter", "");
    SetDisplayValue("webGroup", "");
    CommonDealNoDiv("webGroup&", "../request/GetWebGroupHandler.ashx", a, groupresult, waitingTip)
}
var briefGroupFun;
var leftGroupCallBackFun;
var hideGroupFun;
var backToTopFun;
function groupresult(a) {
    if (a.readyState != ReadyState.Complete) {
        return
    }
    if (a.status == HttpStatus.OK) {
        if (a.responseText == "") {
            SetDisplayValue("webGroup", "none");
            var c = ge("CustomizeSearch");
            if (c && c.style.display != "none") {
                var d = ge("resultFilter");
                if (d) {
                    d.style.height = "22px"
                }
            }
            return
        } else {
            var d = ge("resultFilter");
            if (d) {
                d.style.height = ""
            }
        }
        try {
            fillInnerHTML("webGroup", a.responseText);
            if (a.responseText) {
                var e = getJavaScript(a.responseText);
                evalJavaScript(e)
            }
            return
        } catch (b) {
        }
    }
}
function ReplaceUrlParmValue(url, regExp, replaceValue) {
    var ReturnUrl = url;
    regobj = eval(regExp);
    var r = ReturnUrl.match(regobj);
    if (r != null) {
        ReturnUrl = ReturnUrl.replace(r, replaceValue)
    }
    return ReturnUrl
}
function isNumber(a) {
    if (!/\d*/.test(a.value)) {
        alert(message.inputQiKanNum);
        a.focus();
        return false
    }
    return true
}
function IsIndexOrSingle() {
    var c = "";
    var d = window.location.href;
    var b = "";
    if (d.indexOf("?") > 0) {
        b = window.location.search
    }
    var a = d.replace(b, "");
    a = a.toLowerCase();
    if (a.indexOf("/brief/default_result.aspx") > -1) {
        c = "INDEX"
    } else {
        if (a.indexOf("/brief/result.aspx") > -1) {
            c = "SINGLE"
        }
    }
    return c
}
function SearchSimilar(a, d) {
    var c = "";
    if (IsIndexOrSingle() == "INDEX") {
        FillValue("txt_1_value1", decodeURIComponent(a));
        if (d == "his") {
            c = "&ua=1.13"
        }
        if (d == "sim") {
            c = "&ua=1.14"
        }
        IndexSearchOnclick(c)
    } else {
        var b = "txt_1_value1";
        if (ge("txt_1_value1")) {
            FillValue("txt_1_value1", decodeURIComponent(a))
        } else {
            if (ge("expertvalue")) {
                FillValue("expertvalue", decodeURIComponent("SU='" + a) + "'")
            } else {
                if (ge("au_1_value1")) {
                    FillValue("au_1_value1", decodeURIComponent(a))
                } else {
                    if (ge("base_value1")) {
                        FillValue("base_value1", decodeURIComponent(a))
                    } else {
                        if (ge("sen_1_value1")) {
                            FillValue("sen_1_value1", decodeURIComponent(a));
                            FillValue("sen_1_value2", decodeURIComponent(a))
                        } else {
                            if (ge("magazine_value1")) {
                                FillValue("magazine_value1", decodeURIComponent(a))
                            }
                        }
                    }
                }
            }
        }
        if (d == "his") {
            c = "&ua=1.23"
        }
        if (d == "sim") {
            c = "&ua=1.24"
        }
        SingleSearchOnclick(c)
    }
    scroll(0, 0)
}
function InSearchSimilar(a, b) {
    FillValue("txt_1_value1", decodeURIComponent(a));
    if (b == "sim") {
        ua_p = "&ua=1.14"
    }
    CollectDBList();
    SubmitForm();
    scroll(0, 0)
}
function SubmitResult(c, d) {
    if (!delCollectCoreDB()) {
        return
    }
    isresult = true;
    var a = "";
    var g = "../request/searchHandler.ashx";
    if (!checkPublishDate("publishdate")) {
        return
    }
    var e = getEmValue("curdbcode");
    if (!verPublishDate(e)) {
        return
    }
    var f = NaviParam();
    a = f + SearchParam() + d + "&research=on";
    a = a.replace("undefined", "");
    a = handleFundCode(a);
    a = handleMagezineCode(a);
    if (!checkElExpert()) {
        return
    }
    var b = ge("sen");
    if (b != null && b.style.display != "none") {
        a += "&issen=1"
    }
    a = a.replace("undefined", "");
    if (!SiftSpicWord(a)) {
        return
    }
    CommonDeal(c, g, a, searchresult, waitingTip, "GET");
    contractGroup()
}
function contractGroup() {
    var a = getElementsByClassName("GroupButtonOn", "a", ge("webGroup"), true);
    if (a && a.length > 0) {
        a[0].className = ""
    }
    SetDisplayValue("group", "none")
}
function SaveQuery() {
    var c = ge("qryname");
    if (c == null) {
        return
    }
    if (c.value.length == 0) {
        alert(message.inputSearchFormula);
        c.focus();
        return
    }
    var a = "";
    var b = "../request/search.aspx";
    a = SearchParam() + "&qryname=" + escape(c.value);
    CommonDeal("save", b, a, saveresult, waitingTip)
}
function fillInnerHTML(c, a) {
    var b = ge(c);
    if (b) {
        b.innerHTML = a
    }
}
function isBaiKeClass(a) {
    return (a == "CRDD" || a == "CRPD" || a == "CRMD")
}
function searchresult(g) {
    if (g.readyState != ReadyState.Complete) {
        return
    }
    if (g.status == HttpStatus.OK && g.responseText != "") {
        var t = g.responseText;
        var s = /dbPrefix/i;
        if (!s.test(t)) {
            alert(message.reSearch);
            return
        }
        var f = "";
        var g = t.match(new RegExp("[?&]dbPrefix=([^&]+)", "i"));
        if (g != null && g.length > 1) {
            f = g[1]
        }
        if (typeof leftGroupCallBackFun == "function" && !isBaiKeClass(f)) {
            leftGroupCallBackFun()
        }
        SetDisplayValue("divresult", "");
        var p = new Date;
        var m = getEmValue("txt_1_value1");
        var j = "pagename=" + t + "&t=" + p.getTime() + "&keyValue=" + encodeURIComponent(m) + "&S=1";
        SubmitBrief("brief.aspx", j);
        try {
            arrGroupResult = new Array();
            FillValue("qryname", "");
            HideDiv("divqry")
        } catch (l) {
        }
        if (!isresult2) {
            var b = GetFristSearchWord();
            if (b != "") {
                SetDisplayValue("divSRE", "");
                j += "&" + b;
                var h = getEmValue("dbPrefix");
                h = h.toUpperCase();
                if (h == "SCDB" && ge("db_value") != null) {
                    j += "&db_value=" + encodeURIComponent(ge("db_value").value)
                }
                try {
                    var o = ge("txt_1_sel");
                    var n = o.options.length;
                    var a = "";
                    var k = null;
                    var c = ge("singleDB").value;
                    if ("CRFD|CRPD|CRDD|CRMD|IMAGE|CRLD|CIDX".indexOf(c.toUpperCase()) > 0) {
                        this.setTipsNone();
                        return
                    }
                    var r = "";
                    for (var q = 0; q < n; q++) {
                        r += o[q].value + ","
                    }
                    for (var q = 0; q < n; q++) {
                        if (o[q].selected == true) {
                            k = o[q].text;
                            break
                        }
                    }
                    CommonDealNoDiv("relevant&", "../request/NewGetRelavantHandler.ashx", j + "&dbcode=" + c + "&selectedField=" + encodeURIComponent(k) + "&valueFiled=" + encodeURIComponent(r), NewRelevantresult, waitingTip)
                } catch (l) {
                }
                try {
                } catch (l) {
                }
            } else {
                SetDisplayValue("divSRE", "none");
                fillInnerHTML("searchrelevent", "");
                fillInnerHTML("relevantExpertDiv", "")
            }
        }
        return
    }
}
function NewRelevantresult(c) {
    if (c.readyState != ReadyState.Complete) {
        return
    }
    var d = "";
    var b = "";
    if (c.status == HttpStatus.OK && c.responseText != "") {
        var a = JSON.parse(c.responseText);
        if (a) {
            d = a.keyWordJson;
            RenderReleventHtml(d);
            if (typeof sugpath != "undefined" && sugpath) {
                GetSugWords(sugpath)
            }
            b = a.expertJson;
            if (b == "") {
                SetDisplayValue("relevantExpertDiv", "none");
                return
            }
            RenderRelevantExpertHTML(b)
        }
    }
}
function ShowHistory(a) {
    a += "&t=" + new Date().getTime();
    isresult = true;
    CommonDeal("his2&", "../request/otherHandler.ashx", a, hisresult, waitingTip)
}
function hisresult(a) {
    if (a.readyState != ReadyState.Complete) {
        return
    }
    if (a.status == HttpStatus.OK && a.responseText != "") {
        try {
            if (isresult == false) {
                fillInnerHTML("searchhis1", a.responseText);
                fillInnerHTML("searchhis2", "")
            } else {
                fillInnerHTML("searchhis2", a.responseText)
            }
            return
        } catch (b) {
        }
    }
}
function saveresult(a) {
    if (a.readyState != ReadyState.Complete) {
        return
    }
    if (a.status == HttpStatus.OK && a.responseText != "") {
        if (a.responseText.indexOf("用户尚未登录") != -1) {
            window.open("../LoginDigital.aspx")
        } else {
            alert(a.responseText)
        }
        return
    }
}
function SubmitBrief(c, b) {
    var a = c + "?" + b;
    a = SetDisplayModel(a);
    setIframeSrc(GetResultFrame(), a)
}
function setIframeSrc(a, b) {
    if (a) {
        a.src = b
    }
}
function SubmitHis(c, b, a) {
    var e = getEmValue("txt_1_value1");
    var d = "brief.aspx?" + c + "=" + b + "&keyValue=" + encodeURIComponent(e) + "&S=1";
    if (a != null) {
        d += a
    }
    setIframeSrc(GetResultFrame(), d)
}
function NaviParam() {
    var o = "";
    try {
        var j = document.forms[0];
        var l = j.selectbox;
        if (l == null || l.length == 0) {
            var c = ge("navicode");
            if (c == null) {
                return ""
            }
            if (c.value.length == 0) {
                var d = document.getElementsByTagName("input");
                var g = d.length;
                for (var a = 0; a < g; a++) {
                    if (d[a].type == "checkbox" && d[a].id == "selectbox") {
                        o += d[a].value + ","
                    }
                }
                if (o.length > 0) {
                    return o.substring(0, o.length - 1)
                }
            }
            return c.value
        }
        var p = "";
        if (l.length == null) {
            return ""
        } else {
            var b = false;
            for (a = 0; a < l.length; a++) {
                if (l[a].checked == true) {
                    p += l[a].value + ",";
                    b = true
                }
            }
            if (!b) {
                var c = ge("navicode");
                if (c == null) {
                    return ""
                }
                o = "&NaviCode=" + c.value;
                return o
            }
        }
        var n = p.substring(p.length - 1, p.length);
        if (n == ",") {
            p = p.substring(0, p.length - 1)
        }
        var k = ge("AllFirstFloorNaviCode");
        if (k) {
            if (p == k.value) {
                p = "*"
            }
        }
        o = "&NaviCode=" + encodeURIComponent(p);
        var m = ge("catalogName");
        if (m != null && m != "undefined") {
            o += "&catalogName=" + m.value
        }
    } catch (h) {
    }
    return o
}
var bFirstSearched = false;
function SetSearchResultPage(a) {
    try {
        SetDisplayValue("history", "none");
        ChangeImgSrc("history", "s_jiantou1", "../images/" + LanguageEncode + "/s_jiantou01.gif", "../images/" + LanguageEncode + "/s_jiantou.gif");
        if (ge("isHiddenBookBtn") && ge("isHiddenBookBtn").value.toLowerCase() == "false") {
            if (a == "CRFD") {
                SetDisplayValue("CustomizeSearch", "none")
            }
            if (a == "IMAGE") {
                SetDisplayValue("CustomizeSearch", "none")
            } else {
                SetDisplayValue("group", "");
                SetDisplayValue("resultFilter", "");
                SetDisplayValue("CustomizeSearch", "")
            }
        }
    } catch (b) {
    }
}
function SubmitCustomizeSearch(b) {
    var a;
    var d = window.frames.iframeResult.ge("SqlValue");
    if (d) {
        a = d.value;
        var c = b;
        c += "&SearchUrl=" + window.location.href;
        ge("param").value = a;
        document.forms.CustomizeForm.action = c;
        document.forms.CustomizeForm.target = "CustomizeSearchExp_Page";
        document.forms.CustomizeForm.submit()
    }
}
function GetCustomizeSearch_New(d) {
    if (ge("param")) {
        var b;
        var c;
        var g = ge("Text1");
        var h = window.frames.iframeResult.ge("SqlValue");
        if (g && h) {
            b = g.value;
            var j = doValidate(b);
            if (!j) {
                return false
            }
            c = h.value;
            var a = d;
            var e = a.toLowerCase().indexOf("code");
            if (e < 0) {
                a += "&Code=" + escape(b)
            } else {
                a = a.substring(0, e - 1);
                a += "&Code=" + escape(trim(b))
            }
            a += "&SearchUrl=" + window.location.href;
            ge("param").value = c;
            document.forms[0].action = a;
            document.forms[0].target = "_blank";
            document.forms[0].submit()
        }
    } else {
        var f = ge("aLinkCustomize");
        if (f) {
            GetCustomizeSearch(f)
        }
    }
}
function GetCustomizeSearch(e) {
    var b;
    var c;
    var f = ge("Text1");
    var g = window.frames.iframeResult.ge("SqlValue");
    if (f && g) {
        b = f.value;
        var h = doValidate(b);
        if (!h) {
            return false
        }
        c = g.value;
        var a = e.href;
        var d = a.toLowerCase().indexOf("code");
        if (d < 0) {
            a += "&Code=" + b + "&param=" + c
        } else {
            a = a.substring(0, d - 1);
            a += "&Code=" + b + "&param=" + c
        }
        a += "&SearchUrl=" + window.location.href;
        e.href = a
    }
}
function similarresult(a) {
    if (a.readyState != ReadyState.Complete) {
        return
    }
    if (a.status == HttpStatus.OK && a.responseText != "") {
        try {
            if (ge("searchsimilar")) {
                ge("searchsimilar").innerHTML = a.responseText
            }
            SetDisplayValue("similarword", "");
            ChangeImgSrc("similarword", "s_jiantou3", "../images/" + LanguageEncode + "/s_jiantou01.gif", "../images/" + LanguageEncode + "/s_jiantou.gif");
            return
        } catch (b) {
        }
    }
}
function relevantresult(a) {
    var b = "";
    if (a.readyState != ReadyState.Complete) {
        return
    }
    if (a.status == HttpStatus.OK && a.responseText != "") {
        try {
            var c = a.responseText;
            b = c
        } catch (d) {
        }
    }
    RenderReleventHtml(b);
    if (typeof sugpath != "undefined" && sugpath) {
        GetSugWords(sugpath)
    }
}
function RenderReleventHtml(c) {
    if (c == "") {
        SetDisplayValue("searchrelevent", "none");
        return
    }
    var a = '<div class="wx_otherls_frame"><div class="word_tit">相关搜索：</div><div id="relevanttbl1" class="word_con" style="display:">{0}</div><div class="clear"></div></div>';
    var e = "";
    var b = "<p><a onclick=\"SearchSimilar('{0}','sim')\" href=\"javascript:void(0)\" title='{0}'>{0}</a></p>";
    var d = c.split("|");
    for (i = 0; i < d.length; i++) {
        if (i < 15) {
            e += b.format(d[i])
        }
    }
    a = a.format(e);
    if (ge("searchrelevent")) {
        ge("searchrelevent").innerHTML = a
    }
    SetDisplayValue("searchrelevent", "")
}
function RenderRelevantInfoHTML(a, e, d, c) {
    var b = '<div id=\'{0}\' style=\'word-break: break-all;\'><div class="wx_otherls_frame"><div class="word_tit">{1}：</div><div id="{2}" class="word_con" style="display:block">{3}</div><div class="clear"></div></div></div>';
    return b.format(a, e, d, c)
}
function RequestRelevantExpert(a) {
    var b = "";
    CommonDealNoDiv("expert&", "../request/GetRelevantExpertHandler.ashx", a, function (d) {
        if (d.readyState != ReadyState.Complete) {
            return
        }
        if (d.status == HttpStatus.OK) {
            if (d.responseText == "") {
                SetDisplayValue("relevantExpertDiv", "none");
                return
            }
            evalJavaScript("var expertInfoJson = " + d.responseText);
            var c = window.setInterval(function () {
                if (expertInfoJson) {
                    RenderRelevantExpertHTML(expertInfoJson);
                    window.clearInterval(c)
                }
            }, 10)
        }
    }, waitingTip)
}
function RenderRelevantExpertHTML(b) {
    if (b && b.data && b.data.length > 0 && typeof b.link == "string") {
        var a = RenderRelevantInfoHTML("relevantExpertDiv", "知名专家", "expertContainer", (function () {
            var c = b.data.length;
            var d = "";
            for (var e = 0; e < c; e++) {
                d += "<p><a target='_blank' href=\"{0}\" title='{1}'>{1}</a></p>".format(unescape(b.link).format(b.code, encodeURI(b.data[e].n), b.data[e].c), b.data[e].n)
            }
            return d
        })());
        document.getElementById("relevantExpertDiv").innerHTML = a
    }
}
function GetSugWords(f) {
    var c = $("#relevanttbl1").find("a").length;
    var d = $("#relevanttbl1").html();
    var b = "";
    var e = GetFristSearchWord();
    var a = e.substring(e.indexOf("&spvalue=") + 9, e.length);
    var g = f + "/sug/su.ashx?action=getsmarttips&kw=" + a;
    var h = "<p><a onclick=\"SearchSimilar('{0}','sim')\" href=\"javascript:void(0)\">{0}</a></p>";
    cnki_sug.request(f, "", decodeURIComponent(a), function () {
        if (typeof oJson != "undefined") {
            var j = "";
            if (Object.prototype.toString.call(oJson) == "[object Array]") {
                j = oJson.join(";")
            } else {
                if (typeof oJson.sug != "undefined") {
                    j = oJson.sug
                }
            }
            if (j != null && j != "") {
                j = j.replace("||", "");
                var m = j.split(";");
                var l = 0;
                var k = "";
                for (i = 0; i < m.length; i++) {
                    if (c + l < 14) {
                        if (d) {
                            k = m[i].replace(/\#([\\\d|,]*?)\#$/i, "");
                            if (d.indexOf(k) < 0) {
                                b += h.format(k);
                                l = l + 1
                            }
                        }
                    }
                }
                $("#relevanttbl1").append(b)
            }
        }
    }, "GetSugWords_JS")
}
function Setisresult2() {
    isresult2 = true
}
function doValidate(a) {
    var b = /^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,20}$/;
    if (a == null || a == "") {
        alert(message.inputParms);
        return false
    }
    if (!b.test(a)) {
        alert(message.inputParmsError);
        return false
    }
    return true
}
function SetSelectJingQueOrMoHu(a, b) {
    var d = ge(a);
    if (d) {
        for (var c = 0; c < d.length; c++) {
            if (d[c].value == b) {
                d[c].selected = true
            } else {
                d[c].selected = false
            }
        }
    }
}
function SetDisabled(a) {
    var b = ge(a);
    if (b) {
        b.disabled = "disabled"
    }
}
function ClearDisabled(a) {
    var b = ge(a);
    if (b) {
        b.disabled = ""
    }
}
function ShowSimilarWords(a, b, e) {
    for (i = 1; i <= a; i++) {
        var d = e + i;
        var c = ge(d);
        if (c) {
            if (i == b) {
                c.style.display = ""
            } else {
                c.style.display = "none"
            }
        }
    }
}
function SetChValue(a, b) {
    var c = document.getElementById(a);
    if (c) {
        if (c.checked == true) {
            c.value = b
        } else {
            c.value = ""
        }
    }
}
function recAddToPage() {
    if (ge("txt_1_value1").value != "") {
        if (window.location.href.toLowerCase().indexOf("default_result.aspx") > 0) {
            recResource.GetResourceInfoToIDH(ge("txt_1_value1").value, "LeftGroupContent", 1, true)
        }
    }
}
function SubmitKey() {
    if (ge("txt_1_value1") != null) {
        var c = ge("txt_1_value1").value;
        var b = new RegExp("[\\|/]", "g");
        c = c.replace(b, " ")
    }
    var a = ge("btnSearch");
    if (a && ispost == false) {
        a.click()
    }
}
function checkCEExtension(b) {
    var a = "";
    if (b.checked == true) {
        a = "xls"
    }
    for (i = 1; 10 > i; i++) {
        FillValue("txt_" + i + "_extension", a)
    }
}
function checkCEExtensionR(b) {
    SetCEExtension(b);
    var a = "";
    if (b.checked == true) {
        a = b.value
    }
    FillValue("CKB_extension", a);
    FillValue("txt_1_extension", a)
}
function SetCEExtension(a) {
    if (a.checked == true) {
        if (a.id == "txt_extensionCKB") {
            ge("txt_extensionCKB_R").checked = false
        } else {
            ge("txt_extensionCKB").checked = false
        }
    }
}
function clearAllMarks(a) {
    if (!a) {
        a = document.forms[0]
    }
    if (a) {
        var b = a.elements;
        for (i = 0; i < b.length; i++) {
            if (b[i].type == "checkbox" && b[i].name == "FileNameS") {
                b[i].checked = false
            }
        }
    }
    setCookie("FileNameS", "cnki:")
}
function selectall() {
    var e = document.forms[0];
    var g = e.selectbox;
    clearall();
    var c = ge("AllFirstFloorNaviCode");
    var b = "";
    for (var d = 0; d < g.length; d++) {
        if (g[d].className == "navi_firstfloor") {
            g[d].checked = true;
            if (c) {
                b += g[d].value + ","
            }
        }
    }
    if (b.length > 0) {
        var a = b.substring(b.length - 1, b.length);
        if (a == ",") {
            b = b.substring(0, b.length - 1)
        }
        c.value = b
    }
}
function clearall() {
    var b = document.forms[0];
    var c = b.selectbox;
    for (var a = 0; a < c.length; a++) {
        c[a].checked = false
    }
}
function GetResultFrame() {
    return ge("iframeResult")
}
var iframeids = ["iframeResult"];
var iframehide = "no";
function dyniframesize(b) {
    var a = new Array();
    for (i = 0; i < iframeids.length; i++) {
        if (document.getElementById) {
            a[a.length] = ge(iframeids[i]);
            if (a[i] && !window.opera) {
                a[i].style.display = "block";
                a[i].height = b
            }
        }
        if ((document.all || document.getElementById) && iframehide == "no") {
            var c = document.all ? document.all[iframeids[i]] : ge(iframeids[i]);
            if (c) {
                c.style.display = "block"
            }
        }
    }
}
function getJavaScript(d) {
    var c, b;
    b = [];
    var a = /<script[^>]*>(?:.|[\r\n])*?<\/script>/gim;
    while ((c = a.exec(d))) {
        c[0] = c[0].replace(/<script[^>]*>/gim, "");
        c[0] = c[0].replace(/<\/script>/gim, "");
        b.push(c[0])
    }
    return b
}
function evalJavaScript(a) {
    if (typeof a != "string") {
        a = a.join("\n")
    }
    if (a) {
        (window.execScript) ? window.execScript(a) : window.setTimeout(a, 0)
    }
    return true
}
function addOptionToSelect(e, c, b, f) {
    var a = window.navigator.userAgent;
    if (a.indexOf("MSIE") > 0) {
        var d = document.createElement("option");
        d.value = c;
        d.innerText = b;
        e.insertBefore(d, e.options[f])
    } else {
        e.insertBefore(new Option(b, c), e.options[f])
    }
}
function SelectDateResult(b, a, e, d) {
    if (b.readyState != ReadyState.Complete) {
        return
    }
    if (b.status == HttpStatus.OK && b.responseText != "") {
        returnStr = b.responseText;
        var f = ge(a);
        var c = new Date().getFullYear();
        if (returnStr == "1") {
            if (d) {
                addOptionToSelect(f, c + 1, c + 1, e)
            } else {
                f.options.add(new Option(c + 1, c + 1))
            }
        }
    }
}
function CheckDataLastYear(h, e, g, f) {
    var a = ge(h);
    if (!a) {
        return
    }
    var d = new Date();
    var b = d.getFullYear();
    if (d.getMonth() >= 10) {
        var c = "&dbcode=" + g + "&curyear=" + b;
        CommonDealNoDiv("getdate", "../request/otherHandler.ashx", c, function (j) {
            SelectDateResult(j, h, f, e)
        }, "")
    }
}
function DateSelectAdd(a, b, d) {
    try {
        ge(a).options.add(new Option(b, d))
    } catch (c) {
    }
}
function DateSelectInsert(a, c, d, b) {
    addOptionToSelect(ge(a), d, c, b);
    SelectedOption(a, 0)
}
function SelectedOption(c, d) {
    if (c && c.length > 0 && (typeof d == "number")) {
        var b = ge(c);
        if (b) {
            var a = b.options.length;
            if (d < a && d > -1) {
                SetOptionFalse(c);
                b.options[d].setAttribute("selected", "true")
            }
        }
    }
}
function SetOptionFalse(a) {
    $("#" + a + " option").each(function () {
        $(this).attr("selected", false)
    })
}
function FillDateSelect(b, a, c, d) {
    var f = ge(b), e;
    if (c == 0) {
        c = new Date().getFullYear()
    }
    e = c - a;
    if (d) {
        while (c >= a) {
            f.options.add(new Option(c, c));
            c--
        }
    } else {
        while (a <= c) {
            f.options.add(new Option(a, a));
            a++
        }
    }
}
function GetDBList(b) {
    if (!b) {
        return
    }
    var e = document.getElementsByName("chbDBList");
    var f = "";
    var a = 0;
    if (e && e.length > 0) {
        for (var d = 0; d < e.length; d++) {
            if (e[d].checked == true) {
                f += e[d].value + ",";
                a++
            }
        }
        f = f.substring(0, f.length - 1)
    } else {
        var c = ge("db_value");
        if (c) {
            f = c.value;
            e = f.split(",");
            a = e.length
        }
    }
    if (f.toLowerCase() == "cpfd," || f.toLocaleLowerCase() == "中国重要会议论文全文数据库") {
        alert(message.noSource);
        b.href = "Javascript:void ReturnVoid();";
        return
    }
    if (a > 7) {
        b.href = "Javascript:OpenWindow('../popup/Magazine_SelectSCDB.aspx?NameCtlID=magazine_value1&CodeCtlID=hidMagezineCode&DBNameLists=" + escape(f) + "','win_Magazine_Select','width=950,height=600,scrollbars=1')"
    } else {
        b.href = "Javascript:OpenWindow('../popup/Magazine_SelectSCDB.aspx?NameCtlID=magazine_value1&CodeCtlID=hidMagezineCode&DBNameLists=" + escape(f) + "','win_Magazine_Select','width=750,height=600,scrollbars=1')"
    }
}
function ReturnVoid() {
    return false
}
function AllmediaBoxClick() {
    if ($("#AllmediaBox").is(":checked")) {
        $("input[id^='mediaBox']").attr("checked", "true")
    } else {
        $("input[id^='mediaBox']").removeAttr("checked")
    }
    $("#hdnUSPSubDB").val("")
}
function everyOneClick(e, d, f) {
    var a = 16;
    if (d && isNumber(d) && d > 0) {
        a = d
    }
    if ($("input[id^='mediaBox']:checked").length == a) {
        $("#AllmediaBox").attr("checked", "true");
        $("#hdnUSPSubDB").val("")
    } else {
        $("#AllmediaBox").removeAttr("checked");
        var c = "+";
        if (e && typeof e == "string") {
            c = e
        }
        var b = $("input[id^='mediaBox']:checked").map(function () {
            return $(this).val()
        }).get().join(c);
        if (b.length > 0 && f) {
            b = "( " + b + ")"
        }
        $("#hdnUSPSubDB").val(b)
    }
}
function sourceAllC() {
    AllmediaBoxClick();
    FillValue("@joursource", "")
}
function sourceClick() {
    everyOneClick(" or ", 5, true);
    FillValue("@joursource", $("#hdnUSPSubDB").val())
}
function DYSelectOnchange(c, b, a) {
    setHiddentValue(c, b);
    FillDYToSelect(c.value, a)
}
function CYFDDYselectHandler(a) {
    if (!a || a > 2) {
        return
    }
    if (a < 3) {
        var e = new Option("请选择城市", "");
        var c = ge("city");
        ClearSelect(c);
        c.options.add(e)
    }
    if (a < 2) {
        var d = ge("privince");
        var g = new Option("请选择省份", "");
        ClearSelect(d);
        d.options.add(g)
    }
    var f = new Option("请选择县", "");
    var b = ge("country");
    ClearSelect(b);
    b.options.add(f)
}
function setHiddentValue(b, a) {
    if (b) {
        FillValue(a, b.options[b.selectedIndex].text)
    }
}
function FillDYToSelect(b, a) {
    if (ge("privince")) {
        CommonDealNoDiv("dyfill", "../request/otherHandler.ashx", "&code=" + b + "&groud=" + a, DyReusult, "", "GET")
    }
}
function DyReusult(h) {
    if (h.readyState != ReadyState.Complete) {
        return
    }
    if (h.status == HttpStatus.OK && h.responseText != "") {
        var e = h.responseText;
        var c = e.split("|");
        var b;
        var d = null;
        var g;
        var f;
        var a = 1;
        if (c.length == 1) {
            b = ge("country");
            g = c[0].split(",");
            f = "";
            a = 3
        } else {
            if (c.length == 2) {
                g = c[0].split(",");
                f = c[1].split(",");
                if (f[0].length == 2) {
                    b = ge("privince");
                    a = 1
                } else {
                    b = ge("city");
                    a = 2
                }
            }
        }
        CYFDDYselectHandler(a);
        if (b) {
            if (d) {
                b.options.add(d)
            }
            PLFillSelect(b, f, g)
        }
    }
}
function PLFillSelect(a, b, d) {
    if (a && d) {
        if (b && b.length == d.length) {
            for (var c = 0; c < b.length; c++) {
                FillSelect(a, b[c], d[c])
            }
        } else {
            if (d.length > 0) {
                for (var c = 0; c < d.length; c++) {
                    FillSelect(a, "", d[c])
                }
            }
        }
    }
}
function FillSelect(a, b, c) {
    if (a) {
        a.options.add(new Option(c, b))
    }
}
function ClearSelect(a, b, c) {
    if (a) {
        if (!b || !c || (b == 0 && c == a.options.length)) {
            a.options.length = 0
        } else {
            if (!c) {
                c = a.options.length
            }
            if (!b) {
                b = 0
            }
            for (var d = b; d < c; d++) {
                a.options.remove(d)
            }
        }
    }
}
function SearchBarSubmitResult(b, c) {
    if (!oneBoxCheck()) {
        return
    }
    searchBarer.SetReSearchHisTip(c);
    c = c + "&resultSearch=1";
    SubmitForm(b, c);
    var a = searchBarer.SearchTipArray;
    var d = recommender.getrecommendtips(a);
    recommender.getRecommendTip(d)
}
function RejustAllDateType() {
    var b = $("select[id$='_from'],input[id$='_from']");
    if (b && b.length > 0) {
        for (i = 0; i < b.length; i++) {
            var a = b[i];
            var g = $("#" + a.id.toString().replace("from", "to"))[0];
            var d = (a.value == null || a.value == "" || a.value == "undefined");
            var c = (a.value == null || a.value == "" || a.value == "undefined");
            if (!d && !c) {
                try {
                    var k = Date.parse(a.value.replace(/-/g, "/"));
                    var j = Date.parse(g.value.replace(/-/g, "/"));
                    if (k > j) {
                        var f = a.value;
                        a.value = g.value;
                        g.value = f
                    }
                } catch (h) {
                }
            }
        }
    }
    return true
}
function searchSelValue1(c, d) {
    var a = c.options.length;
    for (var b = 0; b < a; b++) {
        if (d == c.options[b].text) {
            c.options[b].selected = true;
            alert(d);
            break
        }
    }
}
function searchSelValue(f, d) {
    var a = "作者";
    var c = "单位";
    var g = "分类号";
    if (f) {
        var b = f.options.length;
        for (var e = 0; e < b; e++) {
            if (d == "au") {
                if (f.options[e].value && f.options[e].value.indexOf(a) >= 0) {
                    return f.options[e].value
                }
            } else {
                if (d == "in") {
                    if (f.options[e].value && f.options[e].value.indexOf(c) >= 0) {
                        return f.options[e].value
                    }
                } else {
                    if (d == "zt") {
                        if (f.options[e].value && f.options[e].value.indexOf(g) >= 0) {
                            return f.options[e].value
                        }
                    }
                }
            }
        }
    }
    return ""
}
function getVarSelValue(b, c) {
    var a = "";
    switch (b) {
        case"机构名":
            a = searchSelValue(c, "in");
            break;
        case"人名":
            a = searchSelValue(c, "au");
            break;
        default:
            break
    }
    return a
}
function WriteLeftGroup(b) {
    var c = "../group/doGroupLeft.aspx";
    if ($("#LeftGroupContent").length) {
        $("#LeftGroupContent").html("<input type='hidden' id='leftGroupParam' value='" + b + "'/>")
    }
    var a = "44";
    CommonDealNoDiv(a + "&gt=0", c, b, AcceptResult, "");
    CommonDealNoDiv(a + "&gt=1", c, b, AcceptResult, "")
}
function AcceptResult(a) {
    if (a.readyState != ReadyState.Complete) {
        return
    }
    if (a.status == HttpStatus.OK && a.responseText != "") {
        if ($("#LeftGroupContent").length > 0) {
            $("#LeftGroupContent").append(a.responseText);
            $("#LeftGroupContent").show()
        }
    }
}
function ShowGroupData(f, c) {
    CloseGroup();
    var g = GetResultFrame();
    if (g) {
        var d = getEmValue("txt_1_value1");
        var h = getEmValue("leftGroupParam");
        h = "brief.aspx?" + h + "&keyValue=" + encodeURIComponent(d) + "&S=1";
        var a = c;
        if (!f && c) {
            h = SetQueryStringByName(h, "Param", "");
            h = SetQueryStringByName(h, "ctl", a)
        } else {
            f = decodeURI(f);
            c = decodeURI(c);
            var e = f + "='" + c + "'";
            if (c.indexOf("+") >= 0) {
                var b = c.replace(/\+/gi, "'+'");
                e = f + "='" + b + "'"
            }
            h = SetQueryStringByName(h, "Param", encodeURIComponent(e))
        }
        h = SetDisplayModel(h);
        g.src = h
    }
    ShowWaitDiv()
}
function ClearValue(a) {
    var b = document.getElementById(a);
    if (b) {
        b.value = ""
    }
}
function ClearValues(c) {
    var d = c.split(",");
    var b = d.length;
    for (var e = 0; e < b; e++) {
        ClearValue(d[e])
    }
}
function ShowOtherSearch() {
    $("#searchmenu li").show();
    $("#MoreSearch").html("<a href='javascript:HideOtherSearch();'>&lt;&lt;</a>")
}
function HideOtherSearch() {
    $("#searchmenu li").hide();
    $("#searchmenu li").each(function (a) {
        if (a > 3) {
            return false
        }
        $(this).show()
    });
    $("#MoreSearch").show();
    $("#MoreSearch").html("<a href='javascript:ShowOtherSearch();'>&gt;&gt;</a>")
}
function ChengeOtherSearch(a) {
    $("#" + getLastListID()).hide();
    $("#" + a).show();
    ShowMoreOtherSearch()
}
function ShowMoreOtherSearch() {
    $("#more_list").remove();
    $("#MoreSearch").append(getMoreList())
}
function HideModeList() {
    $("#more_list").hide()
}
function ShowModeList() {
    $("#more_list").show()
}
function getMoreList() {
    var a = "<div id='more_list' style='display:none;'>";
    $("#searchmenu li").each(function () {
        if (this.style.display == "none") {
            var b = "<a id='" + $(this).attr("id") + "a' onclick=\"ChengeOtherSearch('" + $(this).attr("id") + "');" + $(this).find("a").attr("href").replace("javascript:", "") + "\" href='#'>" + $(this).text() + "</a>";
            a += b
        }
    });
    a += "</div>";
    return a
}
function getLastListID() {
    var a = "";
    $("#searchmenu li").each(function () {
        var b = $(this).attr("id");
        if (this.style.display != "none" && b != "MoreSearch" && b != "index_link") {
            a = b
        }
    });
    return a
}
function JugeHideGroup() {
    var b = null;
    var a = null;
    if (ge("CustomizeSearch")) {
        b = ge("CustomizeSearch").style.display
    }
    if (ge("webGroup")) {
        a = ge("webGroup").style.display
    }
    if (b == "none" && a == "none") {
        SetDisplayValue("resultFilter", "none")
    }
}
function setPartOfDisplay(a) {
    if (a == "none" || a == "block") {
        SetDisplayValue("divSRE", a);
        SetDisplayValue("resultFilter", a);
        SetDisplayValue("LeftGroupContent", a);
        SetDisplayValue("CustomizeSearch", a);
        SetDisplayValue("newsh_right_histroy", a);
        SetDisplayValue("searchrelevent", a);
        SetDisplayValue("relevantExpertDiv", a);
        if (a == "none") {
            setiframeResultWidth("995px")
        } else {
            setiframeResultWidth("774px")
        }
    }
}
function setiframeResultWidth(b) {
    var a = ge("iframeResult");
    if (a && b && b != "") {
        a.width = b
    }
}
function zhiShuJumpSet(b) {
    if (b == "CIDX") {
        var a = ge("txt_1_value1");
        if (a) {
            var c = getEmValue("selectbox");
            param = "sval=" + encodeURIComponent(a.value) + "&xkcode=" + c
        }
        setPartOfDisplay("none");
        SetDisplayValue("result_tit", "none");
        SubmitBrief("../CnkiIndex/CnkiIndexResult.aspx", param);
        return true
    } else {
        setPartOfDisplay("block")
    }
    return false
}
function setPList() {
    var a = ge("iframeResult");
    if (a) {
        setPartOfDisplay("none");
        a.src = getBasePath() + "/popup/pList.aspx";
        if (window.screen.width >= 1280) {
            $("#iframeResult").width(1200)
        } else {
            $("#iframeResult").width(995)
        }
    }
}
function SubmitSubTab(b, d) {
    var a = "&dbPrefix=" + b;
    a += "&tab=" + escape(d) + "&t=" + Math.random().toString();
    try {
        CommonDealNoDiv("getsubtab", _BasePath + "/request/otherSearch.aspx", a, SubTabResult, "")
    } catch (c) {
    }
}
function SubTabResult(result) {
    if (result.readyState != ReadyState.Complete) {
        return
    }
    if (result.status == HttpStatus.OK && result.responseText != "") {
        if (waitDiv) {
            waitDiv.style.display = "none"
        }
        var SubTab_div = document.getElementById("SubTab_div");
        if (SubmitSubTab) {
            $("#SubTab_div").html(result.responseText);
            try {
                var sriptValue = getEmValue("ExcScriptValue");
                if (sriptValue && sriptValue != "") {
                    eval(sriptValue)
                }
            } catch (e) {
            }
        }
    }
}
function SubDBSelectAll(b, a) {
    if ($("#" + b + "All").is(":checked")) {
        $("input[id^='" + b + "']").attr("checked", "true")
    } else {
        $("input[id^='" + b + "']").removeAttr("checked")
    }
    $("#hdnUSPSubDB").val("")
}
function GetUSPSubDB(b, c) {
    if ($("input[id^='" + b + "']:checked").length == 16) {
        $("#" + b + "All").attr("checked", "true");
        $("#hdnUSPSubDB").val("")
    } else {
        $("#" + b + "All").removeAttr("checked");
        var a = $("input[id^='" + b + "']:checked").map(function () {
            return $(this).val()
        }).get().join("+");
        $("#hdnUSPSubDB").val(a)
    }
}
function toTop() {
    $(document).ready(function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() >= 360) {
                $("#backtop").removeClass("hiddenV")
            } else {
                $("#backtop").addClass("hiddenV")
            }
        })
    })
}
function SetNaviTitle(b) {
    var a = b.toUpperCase();
    var c = "导航";
    if (a == "CJFD" || a == "CJFQ") {
        c = "期刊导航"
    } else {
        if (a == "CMFD") {
            c = "硕士学位授予单位导航"
        } else {
            if (a == "CDFD") {
                c = "博士学位授予单位导航"
            } else {
                if (a == "CCND") {
                    c = "报纸导航"
                } else {
                    if (a == "CPFD") {
                        c = "会议论文集导航"
                    } else {
                        if (a == "CYFD") {
                            c = "年鉴导航"
                        } else {
                            if (a == "CRFD") {
                                c = "工具书导航"
                            }
                        }
                    }
                }
            }
        }
    }
    document.title = c + " -中国知网";
    SetCharContentVisible(a);
    SetNaviField(a)
}
function SetSubTheme(b) {
    var a;
    if (ge("subTheme")) {
        a = ge("subTheme");
        a.style.display = "";
        if (b != "" && b != null) {
            if (b == "CRPD" || b == "CRDD" || b == "CRMD" || b == "CRFD" || b == "CHCF" || b == "CRLD" || b == "IMAGE") {
                a.style.display = "none"
            }
        }
    }
}
function SetCharContentVisible(b) {
    var a = ge("charContent");
    if (a) {
        if (b == "CCND") {
            a.style.display = "none"
        }
    }
}
function SetNaviField(c) {
    var b = c.toUpperCase();
    var d = "";
    if (b == "CPFD") {
        d = "NAVI178"
    }
    if (b == "CYFD") {
        d = "168专题代码"
    }
    var a = ge("NaviField");
    if (a) {
        a.value = d
    }
}
function SubthemeDefault() {
    if (ge("iframeResult")) {
        var d = "";
        var f = ge("iframeResult").src;
        var c = GetQueryStringByName(f, "dbPrefix");
        var a = GetQueryStringByName(f, "pagename");
        var b = getIFrameWindow("iframeResult");
        var e = null;
        if (document.getElementById("iframeResult").contentDocument) {
            e = ge("iframeResult").contentDocument.getElementById("SqlValue").value
        } else {
            e = b.document.getElementById("SqlValue").value
        }
        var d = e;
        SubScription("3", d, c, a)
    }
}
function getIFrameWindow(a) {
    var b = null;
    if (document.getElementById(a).contentDocument) {
        b = document.getElementById(a).contentWindow
    } else {
        b = document.frames[a]
    }
    return b
}
function MutiValueHandleHBRD(d, g, a) {
    var f = "";
    var e = document.getElementById(d).value;
    var b = document.getElementById(g).value;
    if (e.length == 0 && b.length == 0) {
        document.getElementById(a).value = "";
        return
    }
    if (e.length == 0) {
        e = document.getElementById(d).options[1].value
    }
    if (b.length == 0) {
        b = document.getElementById(g).options[1].value
    }
    for (var c = parseInt(e); c <= parseInt(b); c++) {
        f += "+" + c
    }
    if (f.length > 0) {
        f = "年=" + f.substring(1)
    }
    document.getElementById(a).value = f
}
function ExGroupExpand() {
    var a = getEmValue("expandGroupN");
    if (a && a != "") {
        if (typeof AutoInit == "function") {
            AutoInit(a)
        }
    }
}
function ClearWebGrouop() {
    var b = ge("webGroup");
    if (b) {
        b.style.display = "none";
        b.innerHTML = ""
    }
    var a = ge("group");
    if (a) {
        a.style.display = "none";
        a.innerHTML = ""
    }
}
function WebGroupOnLoaded() {
    return (typeof isWebGroupOK != "undefined" && isWebGroupOK == true)
}
var ControlGroupTimer;
var forGroupCount = 0;
function WebGroupCall(a) {
    callFun = a;
    Run = function () {
        if (WebGroupOnLoaded() == true && typeof callFun == "function") {
            a()
        } else {
            forGroupCount = 0;
            window.clearInterval(ControlGroupTimer);
            ControlGroupTimer = window.setInterval(CallBackFun, 20)
        }
    };
    CallBackFun = function () {
        if (typeof callFun == "function") {
            forGroupCount++;
            if (forGroupCount >= 200) {
                window.clearInterval(ControlGroupTimer)
            }
            if (WebGroupOnLoaded() == false) {
                return
            }
            callFun();
            window.clearInterval(ControlGroupTimer)
        }
    };
    Run()
}
function SearchSourse(c) {
    var b = c;
    var a = getEmValue("txt_1_value1");
    if (typeof a == "string" && a.length > 0) {
        b += encodeURIComponent("result.aspx?db_opt=scdb&txt_1_value1=" + encodeURIComponent(a))
    }
    window.open(b, "TotalNavi")
}
function AllCheckOrClearDB(a) {
    var b = document.getElementsByName("chbDBList");
    for (var c = 0; c < b.length; c++) {
        if (b[c] && b[c].disabled) {
            b[c].checked = false;
            continue
        }
        if (a) {
            b[c].checked = false
        } else {
            b[c].checked = true
        }
    }
}
function SetIndexLink() {
    $("#index_link").remove();
    var a = "SCDB";
    var b = GetQueryStringByName(window.location.search, "dbprefix");
    if (b != "") {
        a = b
    }
    var c = "/kns/index.html?code=" + a;
    if (a.toLowerCase() != "zyzk") {
        $("#searchmenu ul").append("<li id='index_link'><a href='" + c + "' target='_self'>一框式检索</a></li>")
    }
}
function autoTurnSearch(f) {
    var d = "";
    var g = "";
    var c = "";
    var b = "";
    var a = "";
    var e = GetQueryStringByName(window.location.href, "korder");
    b = decodeURI(GetQueryStringByName(window.location.href, "sel"));
    if (f == 0) {
        d = GetQueryStringByName(window.location.href, "code").toUpperCase();
        g = decodeURIComponent(GetQueryStringByName(window.location.href, "kw"));
        a = GetQueryStringByName(window.location.href, "xkcode");
        if (b != "1") {
            $("#iframeResult").src = ""
        }
    } else {
        if (f == 1) {
            d = GetQueryStringByName(window.location.href, "dbprefix").toUpperCase();
            g = decodeURI(GetQueryStringByName(window.location.href, "kw"));
            c = decodeURI(GetQueryStringByName(window.location.href, "other"));
            if (b != "1") {
                return
            }
        } else {
            if (f == 2) {
                d = GetQueryStringByName(window.location.href, "dbcode").toUpperCase();
                g = decodeURI(GetQueryStringByName(window.location.href, "q"));
                if (b != "1") {
                    return
                }
            }
        }
    }
    if (d != "") {
        setParamsValue(d, g, e, c, a)
    } else {
        return
    }
}
function setOptionValue(b, a, c) {
    if (c != "special") {
        $("#singleDB").val(b);
        if (a != "") {
            var d = $("#txt_1_sel");
            if (d.children()[a]) {
                d.children()[a].selected = true
            }
        }
    }
}
function setParamsValue(iCode, iKw, iKorder, iOther, iXkcode) {
    setOptionValue(iCode, iKorder, iOther);
    window.onload = function () {
        if (iOther != "special") {
            $("#txt_1_value1").val(iKw);
            if (iXkcode != "") {
                categoryClick(iXkcode, iXkcode)
            } else {
                $("#btnSearch").click()
            }
        } else {
            $("#searchmenu a").each(function () {
                if ($(this).attr("href").indexOf("special") > 0) {
                    eval($(this).attr("href"))
                }
            });
            var searchSpecial = window.setInterval(function () {
                if ($("#expertvalue").val() != "undefined") {
                    $("#expertvalue").val(iKw);
                    window.clearInterval(searchSpecial);
                    $("#btnSearch").click()
                }
            }, 1000)
        }
    }
}
$(document).ready(function () {
    if (IsWideScreen()) {
        $("body").addClass("rootw");
        var c = $("#iframeResult").attr("src");
        var b = null;
        if (c) {
            b = c.split("/")[c.split("/").length - 1]
        }
        var a = getEmValue("singleDB");
        if (a == "CIDX") {
            $("#iframeResult").width(1200);
            $("#searchrelevent").width(1200);
            $("#relevantExpertDiv").width(1200)
        } else {
            $("#iframeResult").width(974)
        }
        if (b == "pList.aspx") {
            $("#iframeResult").width(1200);
            $("#searchrelevent").width(1200);
            $("#relevantExpertDiv").width(1200)
        }
    }
});
function showchecklist() {
    $("#zyzklist").show();
    $("#iframeResult").hide();
    $("#allselectbtn").hide();
    $("#LeftGroupContent").hide();
    $("#resultFilter").hide()
}
function checkSelect() {
    $("#divresult").before("<a id='allselectbtn' name='allselectdblistbtn' href='javascript:void(0);' class='cBlue' style='display:none;' onclick='showchecklist();'>重新选库</a>")
}
function library(a) {
    if (a) {
        this.eventObject = a
    } else {
        this.eventObject = document.getElementById("iframeResult").contentWindow
    }
}
library.prototype.saveAs = function (a) {
    if (typeof this.eventObject.saveAs == "function") {
        this.eventObject.saveAs(a)
    }
};
library.prototype.exportArtical = function (a) {
    if (typeof this.eventObject.exportArtical == "function") {
        this.eventObject.exportArtical(a)
    }
};
library.prototype.anisys = function (a) {
    if (typeof this.eventObject.anisysartical == "function") {
        this.eventObject.anisysartical(a)
    }
};
library.prototype.ClearAll = function (a) {
    if (typeof this.eventObject.ClearAll == "function" && this.eventObject.ClearAll(a)) {
        this.FillSelectCount("0", "selectCountNew");
        return true
    }
    return false
};
library.prototype.zeroSelectTip = function () {
    if (typeof this.eventObject.zeroSelectTip == "function") {
        return this.eventObject.zeroSelectTip()
    }
    return false
};
library.prototype.FillSelectCount = function (a, c) {
    c = c || "selectCount";
    if (typeof a == "number" || typeof a == "string") {
        var b = ge(c);
        if (b) {
            b.innerHTML = a
        }
    }
};
var cnki_sug = {
    sug_server: "", sug_url_path: "", getURL: function (a, d, c) {
        if (Object.prototype.toString.call(a) != "[object String]") {
            getURL = function () {
                return ""
            };
            return getURL()
        }
        var b = this.gUrlType(a);
        if (b == this.URLType.APP) {
            this.sug_url_path = this.getAppUrlPath(a);
            getURL = this.getAppUrl
        } else {
            this.sug_url_path = this.getSugUrlPath(a);
            getURL = this.getSugUrl
        }
        return getURL(a, d, c)
    }, getSugUrl: function (a, c, b) {
        return cnki_sug.sug_url_path + cnki_sug.getSugParam(c, b)
    }, getAppUrl: function (a, c, b) {
        return cnki_sug.sug_url_path + cnki_sug.getAppParam(c, b)
    }, getSugUrlPath: function (a) {
        return a + "/sug/su.ashx"
    }, getAppUrlPath: function (a) {
        return a + "/Parts/Suggest/GetForJquery"
    }, getSugParam: function (b, a) {
        return "?action=getsmarttips&kw=" + encodeURI(a) + (b ? "&t=" + encodeURI(b) : "") + "&p=" + Math.random()
    }, getAppParam: function (b, a) {
        return "?source=kns&item=" + encodeURI(b) + "&text=" + encodeURI(a) + "&jsonvar=oJson&displaySeparator=true&p=" + Math.random()
    }, gUrlType: function (a) {
        if (Object.prototype.toString.call(a) == "[object String]") {
            var b = /app\.cnki\.net/ig;
            if (b.test(a)) {
                return this.URLType.APP
            }
        }
        return this.URLType.SUG
    }, URLType: {APP: 0, SUG: 1}, request: function (b, g, d, h, e) {
        var a = this.getURL(b, g, d);
        if (a == "") {
            return
        }
        var c = new CoreDomainLoadJson();
        c.Load(a, h, e)
    }
};
function setCatalog(a) {
    if (a) {
        if ($(a).text() == "展开全部数据库>>") {
            $(a).parents("ul").find("li.expand").each(function () {
                $(this).show()
            });
            $(a).text("返回<<")
        } else {
            $(a).parents("ul").find("li.expand").each(function () {
                $(this).hide()
            });
            $(a).text("展开全部数据库>>")
        }
    }
    SetFrameHeight()
};
function ClickNode(c, d, b) {
    try {
        var h = document.forms[0];
        var a = h.selectbox;
        for (i = 0; i < a.length; i++) {
            if (a[i].value == c) {
                a[i].checked = true
            } else {
                a[i].checked = false
            }
        }
        if (d == "学科代码" && document.getElementById("spanXUEKE") != null) {
            var h = document.forms[0];
            var a = h.selectbox;
            for (i = 0; i < a.length; i++) {
                if (a[i].value == c) {
                    if (c.length == 2) {
                        str = a[i].name
                    } else {
                        str = a[i].name;
                        var k = c.length;
                        pCode = c.substring(0, k - 2);
                        for (j = 0; j < a.length; j++) {
                            if (a[j].value == pCode) {
                                str = a[j].name + " > " + str
                            }
                        }
                    }
                }
            }
            document.getElementById("spanXUEKE").innerHTML = str
        }
        if (!b) {
            b = "&ua=1.25"
        }
        SubmitForm("", b)
    } catch (g) {
    }
}
var waitElementnavi;
var request = new Request();
function ChangeSelect(c) {
    if (document.getElementById(c + "select") != null) {
        var g = document.forms[0];
        var b = g.selectbox;
        for (var d = 0; d < b.length; d++) {
            if (b[d].value == c) {
                document.getElementById(c + "select").value = b[d].checked
            }
        }
        CheckUp(c, "")
    } else {
        var e = '<input type=hidden id="' + c + 'select">';
        document.getElementById("selectdiv").innerHTML += e;
        ChangeSelect(c)
    }
}
function CheckUp(f, d) {
    var h = 0;
    if (document.getElementById(d + "child") != null) {
        if (document.getElementById(f + "child") != null) {
            if (document.getElementById(f + "child").innerHTML == "") {
            } else {
                var c = document.getElementById(f + "child");
                var g = c.getElementsByTagName("INPUT");
                var k = document.getElementById(d + "child");
                var l = k.getElementsByTagName("INPUT");
                h = l.length;
                var e = g.length;
                for (var b = 0; b < h; b = b + 1) {
                    if (l[b].value == f) {
                        if (l[b].checked) {
                            for (var a = 0; a < e; a++) {
                                g[a].checked = false
                            }
                        }
                    }
                }
            }
        }
    }
    if (document.getElementById(f) != null) {
        if (document.getElementById(f + "child") != null) {
            if (document.getElementById(f + "child").innerHTML == "") {
            } else {
                var c = document.getElementById(f);
                var g = c.getElementsByTagName("INPUT")[0];
                var k = document.getElementById(f + "child");
                var l = k.getElementsByTagName("INPUT");
                if (typeof g != "undefined") {
                    if (g.checked) {
                        h = l.length;
                        for (var a = 0; a < h; a++) {
                            l[a].checked = false
                        }
                    }
                }
            }
        }
    }
}
function CheckUpDown(b, a) {
    CheckUp(b, a);
    CheckDown(b, a)
}
function CheckDown(g, a) {
    if (document.getElementById(g + "parent") != null) {
        var d = document.getElementById(g + "parent").value;
        var e = document.forms[0];
        var b = e.selectbox;
        for (var c = 0; c < b.length; c++) {
            if (b[c].value == d) {
                b[c].checked = false
            }
        }
        CheckDown(d, "")
    }
}
function plusclick(a, d, b) {
    if (document.getElementById(a + "child").innerHTML == "") {
        document.getElementById(a + "child").style.display = "";
        document.getElementById(a + "child").innerHTML = message.searchWaiting;
        var f = "";
        try {
            f = document.getElementById("catalogName").value
        } catch (e) {
        }
        var c = new Request();
        c.GetNoCache("../request/NaviGroup.aspx?code=" + encodeURIComponent(a) + "&tpinavigroup=" + b + "&catalogName=" + f, function (g) {
            if (g.readyState != ReadyState.Complete) {
                return
            }
            var k = g.responseText.split("|");
            if (k != "" && k != null) {
                var l = "";
                if (k.length == 1 && k[0] == "timeout") {
                    document.getElementById(a + "child").innerHTML = "";
                    document.getElementById(a + "child").style.display = "none";
                    alert(message.pageError1);
                    return
                }
                for (var h = 0; h < k.length; h++) {
                    if (k[h].split("$").length != 2) {
                        continue
                    }
                    l += k[h].split("$")[0]
                }
                document.getElementById(a + "child").innerHTML = l;
                if (l != "") {
                    document.getElementById(a + "child").style.display = ""
                }
                for (var h = 0; h < k.length; h++) {
                    if (k[h].split("$").length != 2) {
                        continue
                    }
                    if (document.getElementById(k[h].split("$")[1] + "child") != null) {
                        document.getElementById(k[h].split("$")[1] + "child").style.display = "none"
                    }
                }
                document.getElementById(a + "first").style.display = "none";
                document.getElementById(a + "second").style.display = ""
            }
            if (k == "") {
                document.getElementById(a + "child").innerHTML = "";
                document.getElementById(a + "child").style.display = "none";
                alert(message.noContainRelative)
            }
        })
    } else {
        document.getElementById(a + "child").style.display = "";
        document.getElementById(a + "first").style.display = "none";
        document.getElementById(a + "second").style.display = ""
    }
}
function reduceclick(a) {
    if (document.getElementById(a + "child")) {
        if (document.getElementById(a + "child").innerHTML != "") {
            document.getElementById(a + "child").style.display = "none"
        }
    }
    if (document.getElementById(a + "first")) {
        document.getElementById(a + "first").style.display = ""
    }
    if (document.getElementById(a + "second")) {
        document.getElementById(a + "second").style.display = "none"
    }
}
function reduceload(a) {
    if (document.getElementById(a + "second")) {
        document.getElementById(a + "second").style.display = "none"
    }
}
function nodeclick(b, c) {
    clearall();
    var d = document.forms[0].selectbox;
    for (var a = 0; a < d.length; a++) {
        if (d[a].value == b) {
            d[a].checked = true
        }
    }
    SubmitForm("navi", "&NaviCode=" + b)
}
function showmore(c, a, b) {
    if (document.getElementById(c + "child")) {
        document.getElementById(c + "child").innerHTML = "";
        plusclick(c, "", b)
    }
}
function checkRightZJ(a, b) {
    if (!a || a == "") {
        return
    }
    if (a.toUpperCase() == "ALL") {
        return selectall()
    }
    clearall();
    if (a.toUpperCase() == "NOZJ") {
        return
    }
    a = a.toUpperCase();
    var c = a.replace(/[,;]/g, "");
    for (i = 0; i < c.length; i++) {
        selectBoxOK(c.charAt(i))
    }
}
var ControlNaviGroupTimer;
var forCount = 0;
function checkRightZT(e, h) {
    if (!e || e == "") {
        return
    }
    if (e.toUpperCase() == "ALL") {
        return
    }
    var d = e.split(/[,;]/g);
    var b = false;
    var c = "";
    var a = "";
    for (f = 0; f < d.length; f++) {
        if (d && d.length > 0) {
            b = selectBoxOK(d[f]);
            if (!b) {
                if (a.indexOf(d[f].charAt(0)) < 0) {
                    a += d[f].charAt(0);
                    c += d[f] + ";"
                }
            }
        }
    }
    if (c.length > 0) {
        c = c.substring(0, c.length - 1)
    }
    if (a != "") {
        var g = c.split(/[,;]/g);
        for (var f = 0; f < a.length; f++) {
            showmore(a.charAt(f), g[f], h)
        }
        forCount = 0;
        window.clearInterval(ControlNaviGroupTimer);
        ControlNaviGroupTimer = window.setInterval("selectZT_Direct('" + e + "')", 500)
    }
}
function selectZT_Direct(a) {
    forCount++;
    if (forCount >= 20) {
        window.clearInterval(ControlNaviGroupTimer)
    }
    if (!a || a == "") {
        return
    }
    var c = true;
    var b = a.split(/[,;]/g);
    for (i = 0; i < b.length; i++) {
        if (b && b.length > 0) {
            c = selectBoxOK(b[i])
        }
        if (!c) {
            break
        }
    }
    if (c) {
        window.clearInterval(ControlNaviGroupTimer)
    }
}
function selectBoxOK(c) {
    var e = document.forms[0];
    var b = e.selectbox;
    for (var d = 0; d < b.length; d++) {
        if (b[d].value == c) {
            b[d].checked = "true";
            return true
        }
    }
    return false
}
function ajaxRequest(c, e, d, f) {
    var a = "";
    if (!d || d.length == 0) {
        return
    }
    if (!c) {
        c = ""
    }
    if (!e) {
        e = ""
    } else {
        if (e.indexOf("&") > 0) {
            e = "&" + e
        }
    }
    a = d + "?action=" + c + e;
    var b = new Request();
    b.GetNoCache(a, f)
}
function UserRightOfXueKe() {
    var a = getBasePath() + "/request/RightValid.ashx";
    var c = GetQueryStringByName(window.location.href, "dbprefix");
    if (c && c.length >= 4) {
        var b = "&dbprefix=" + c;
        ajaxRequest("right", b, a, userRightResult)
    }
}
function userRightResult(b) {
    if (b.readyState != ReadyState.Complete) {
        return
    }
    if (b.status == HttpStatus.OK && b.responseText != "") {
        var a = b.responesText;
        if (typeof a == "string") {
            var f = a.split("|");
            if (f.length == 2) {
                var e = f[0];
                var c = f[1];
                var d = "";
                if (c && c.length > 0) {
                    checkRightZJ(c, d)
                }
                if (e && e.length > 0) {
                    checkRightZT(e, d)
                }
            }
        }
    }
}
var IntervalCount = 0;
function NaviDirectSearch(c, b, a, d) {
    if (c == 1) {
        ClickNode(b, a)
    } else {
        LoopWaitCall(b, a, d, c - 1)
    }
}
function LoopWaitCall(c, g, a, d) {
    var h;
    var b = 6;
    var e = 0;
    var f = GetParentCode(c);
    var k = function () {
        HandlerShowMore(c, a);
        e++;
        h = window.setInterval(function () {
            b++;
            if (b > 20) {
                window.clearInterval(h)
            }
            var l = GetParentCode(c);
            if (f.length < l.length) {
                f = l;
                window.clearInterval(h);
                if (e < d) {
                    b = 0;
                    k()
                }
            } else {
                if (document.getElementById(c + "parent") != null) {
                    window.clearInterval(h);
                    ClickNode(c, g)
                }
            }
        }, 500)
    };
    k()
}
function HandlerShowMore(b, c) {
    var a = GetParentCode(b);
    plusclick(a, "", c)
}
function GetParentCode(b) {
    var c = b.toString().length;
    var d = null;
    c--;
    var a = b.toString();
    while (c > 0) {
        a = b.toString().substr(0, c);
        d = document.getElementById(a);
        if (d == null) {
            d = document.getElementById(a + "parent")
        }
        if (d != null) {
            break
        }
        c--
    }
    return a
};
function KeywordVal(a) {
    if (!a) {
        return false
    }
    a = a.replace(/(^\s*)|(\s*$)/g, "");
    if (a.replace(/\s+/g, "") == "") {
        return false
    }
    var c = [];
    switch (LanguageEncode) {
        case"GB":
            c = new Array("点击输入", "中文名", "全部子库", "全部学科", "全部资源", "全部研究层次", "输入基金", "输入检索词", "输入作者单位", "输入主办单位名称", "请输入学位授予单位名称", "输入出版单位名称", "输入会议名称", "年鉴名称", "报纸名称", "输入作者姓名", "输入主编或作者", "输入单位", "期刊名称", "辑刊名称", "请输入", "输入来源名称", "输入网络出版投稿人名称", "输入辑刊名称", "请选择省份", "请选择城市", "请选择县", "全称");
            break;
        case"BG":
            c = new Array("點擊輸入", "中文名", "全部子库", "全部学科", "全部资源", "全部研究层次", "全部子庫", "全部學科", "全部資源", "全部研究層次", "輸入基金", "輸入檢索詞", "輸入做者單蒞", "輸入主辦單位名稱", "請輸入學位授予單位名稱", "輸入出版單位名稱", "輸入會議名稱", "年鑒名稱", "報紙名稱", "輸入作者姓名", "輸入主編或作者", "輸入單位", "期刊名稱", "輯刊名稱", "請輸入", "輸入來源名稱", "輸入網絡出版投稿人名稱", "輸入輯刊名稱", "請選擇省份", "請選擇城市", "請選擇縣", "全稱");
            break;
        case"EN":
            c = new Array("Click to input", "Chinese name", "全部子库", "全部学科", "全部资源", "全部研究层次", "Input fund", "Input terms", "Input author affiliation", "Input sponsor", "Input degree grantor", "Input publisher", "Input conference name", "Yearbook title", "Newspaper title", "Input author's name", "Input chief editor or author", "Input institution", "Journal title", "Input", "Please input", "Input source name", "Input contributor", "Full title")
    }
    for (var b = 0; b < c.length; b++) {
        if (a.indexOf(c[b]) >= 0) {
            return false
        }
    }
    return true
}
function SignVal(f, c, d) {
    if (c == "sign") {
        d = (d) ? d : ((window.event) ? window.event : "");
        var a = d.keyCode ? d.keyCode : d.which;
        if ((a == 39 && document.all) || a == 34 || a == 59) {
            alert(message.searchError3);
            if (d.keyCode) {
                d.keyCode = 0
            }
        }
    } else {
        if (c == "value") {
            if (window.clipboardData) {
                var b = clipboardData.getData("text");
                if (b.indexOf("'") != -1 || b.indexOf('"') != -1 || b.indexOf(";") != -1 || b.indexOf("\\") != -1 || b.indexOf("/") != -1) {
                    alert(message.noInputWord2);
                    return false
                }
            }
        } else {
            if (c == "input") {
                var b = f.value;
                if (b.indexOf("'") != -1 || b.indexOf('"') != -1 || b.indexOf(";") != -1 || b.indexOf("<") != -1 || b.indexOf(">") != -1 || b.indexOf("\\") != -1 || b.indexOf("/") != -1) {
                    return false
                }
            }
        }
    }
    setPlaceholder(f);
    return true
}
function SignVal1(a) {
    setPlaceholder(a)
}
function setPlaceholder(b) {
    var a = $(b).parent();
    if (a.attr("class") != "hidePlaceholder" && a.attr("class") != "showPlaceholder") {
        return
    }
    if ($(b).val() != "") {
        a.attr("class", "hidePlaceholder")
    } else {
        a.attr("class", "showPlaceholder")
    }
}
function KeyPress(d, b) {
    var c = d.value;
    b = (b) ? b : ((window.event) ? window.event : "");
    var a = b.keyCode ? b.keyCode : b.which;
    if ((a < 48 || a > 57) && a != 46) {
        if (b.keyCode) {
            event.keyCode = 0
        }
    } else {
        if (a == 46) {
            if (c.indexOf(".") != -1 || c.length == 0) {
                if (b.keyCode) {
                    event.keyCode = 0
                }
            }
        }
    }
}
function KeyPressIssue(d, b) {
    var c = d.value;
    b = (b) ? b : ((window.event) ? window.event : "");
    var a = b.keyCode ? b.keyCode : b.which;
    if ((a < 48 || a > 57) && a != 46) {
        if ((a > 64 && a < 91) || (a > 96 && a < 123)) {
        } else {
            if (b.keyCode) {
                event.keyCode = 0
            }
        }
    } else {
        if (a == 46) {
            if (c.indexOf(".") != -1 || c.length == 0) {
                if (b.keyCode) {
                    event.keyCode = 0
                }
            }
        }
    }
}
function SiftSpicWord(a) {
    re = /\&expertvalue[\w\W]*?\&/g;
    re1 = /\&@[\w\W]*?\&/g;
    var b = a.replace(re, "&");
    b = b.replace(re1, "&");
    if (b.indexOf("'") != -1 || b.indexOf("%3b") != -1 || b.indexOf("%3c") != -1 || b.indexOf("%3e") != -1 || b.indexOf("%27") != -1 || b.indexOf("%22") != -1 || b.indexOf("%3C") != -1 || b.indexOf("%3E") != -1 || b.indexOf("%3B") != -1) {
        alert(message.searchError3);
        return false
    } else {
        return true
    }
}
function SifSpicAddWord(a) {
    if (a != null && a.length > 0) {
        re = /\+/g;
        a = a.replace(re, "%2b")
    }
    return a
}
function ChangeYearDate(b, d) {
    var e = document.getElementById(b);
    var a = document.getElementById(d);
    if (e && a) {
        if (e.options[e.selectedIndex].value != "" && a.options[a.selectedIndex].value != "") {
            if (e.options[e.selectedIndex].value > a.options[a.selectedIndex].value) {
                var c = e.options.length - e.selectedIndex;
                e.selectedIndex = e.options.length - a.selectedIndex;
                a.selectedIndex = c
            }
        }
    }
}
function ChangeYearDate1(b, d) {
    var e = document.getElementById(b);
    var a = document.getElementById(d);
    if (e && a) {
        if (e.options[e.selectedIndex].value != "" && a.options[a.selectedIndex].value != "") {
            if (e.options[e.selectedIndex].value > a.options[a.selectedIndex].value) {
                var c = e.options.length - e.selectedIndex;
                e.selectedIndex = (e.options.length - a.selectedIndex) - 1;
                a.selectedIndex = c - 1
            }
        }
    }
}
function FormVal(f) {
    var e = new Array();
    var a = f.elements;
    for (var b = 0; b < a.length; b++) {
        if (a[b].type == "text" && a[b].id != "moreunitname") {
            if (!SignVal(a[b], "input")) {
                alert(message.searchError3);
                a[b].focus();
                return false
            }
        }
        var c = a[b].validator;
        if (!c) {
            continue
        }
        var d = new RegExp(c);
        if (d.test(a[b].value) == false) {
            alert(a[b].errorInfo);
            a[b].focus();
            return false
        }
    }
    return true
}
function VaIssue(a) {
};
function addToCookie(b, a) {
    company = "cnki";
    cookie = new String(getCookie("RecordID"));
    if ((cookie.length > 0) && ((cookie.substring(0, cookie.indexOf(":")) == company))) {
        if (cookie.length - 1 == cookie.indexOf(":")) {
            setCookie("RecordID", cookie + b, a)
        } else {
            setCookie("RecordID", cookie + "," + b, a)
        }
    } else {
        setCookie("RecordID", company + ":" + b, a)
    }
}
function setCookie(a, c, b) {
    if (window.localStorage) {
        if (c && c != "") {
            if (b == 2 || b == "2") {
                sessionStorage.setItem(a, c)
            } else {
                localStorage.setItem(a, c)
            }
        }
    } else {
        document.cookie = a + "=" + escape(c) + ";path=/"
    }
}
function getValueFromCookie(d) {
    var e = d + "=";
    var h = false;
    var g = 0;
    var c = 0;
    var b = document.cookie;
    var f = "";
    var a = 0;
    while (a < b.length) {
        g = a;
        c = g + e.length;
        if (b.substring(g, c) == e) {
            h = true;
            break
        }
        a++
    }
    if (h == true) {
        g = c;
        c = b.indexOf(";", g);
        if (c < g) {
            c = b.length
        }
        f = unescape(b.substring(g, c))
    }
    if (f.indexOf("cnki:") == 0) {
        f = f.substring(5, f.length)
    }
    return f
};
var swichSearchMode = -1;
function HideDiv(a) {
    SetDisplayValue(a, "none")
}
function ShowDiv(a) {
    SetDisplayValue(a, "block")
}
function ChangeDiv(b) {
    var a = ge(b);
    if (a == null) {
        return
    }
    a.style.display = a.style.display == "none" ? "" : "none"
}
function HideGroupDiv(c) {
    var a = ge(c);
    if (a == null) {
        return
    }
    if (a.length == null) {
        return
    } else {
        for (i = 0; i < a.length; i++) {
            if (!a[i]) {
                continue
            }
            var b = a[i].id;
            if (b.indexOf(c + groupIndex) != -1) {
                a[i].style.display = ""
            } else {
                a[i].style.display = "none"
            }
        }
    }
}
function ChangeImgSrc(f, c, e, b) {
    var a = ge(f);
    if (a == null) {
        return
    }
    var d = ge(c);
    if (d) {
        if (a.style.display == "none") {
            d.src = e
        } else {
            d.src = b
        }
        d.parentNode.blur()
    }
}
function ChangeCSS(c, b, d) {
    var a = $(c).attr("class");
    if (a == b) {
        $(c).attr("class", d)
    } else {
        $(c).attr("class", b)
    }
}
function ChangeImg(h, d, j, c, b) {
    var f;
    var g = parseInt(h);
    for (var a = 1; a <= g; a++) {
        f = j + a;
        var e = "url(" + b + ")";
        ge(f).style.background = e
    }
    f = j + d;
    var e = "url(" + c + ")";
    ge(f).style.background = e;
    return
}
function ChangeSrc(e) {
    var b = 0;
    var g = ge(e);
    if (g) {
        b = g.length
    }
    if (b == null) {
        g.style.display = g.style.display == "none" ? "" : "none"
    } else {
        for (var f = 0; f < b; f++) {
            g[f].style.display = g[f].style.display == "none" ? "" : "none"
        }
    }
    var c = "spanimg";
    var d = ge(c);
    if (d && d.src.indexOf("02.gif") != -1) {
        d.src = "../images/" + LanguageEncode + "/anniu_shensuo01.gif"
    } else {
        d.src = "../images/" + LanguageEncode + "/anniu_shensuo02.gif"
    }
    var a = (d.parentElement != null) ? d.parentElement : d.parentNode;
    a.blur()
}
function getCookie(a) {
    var c;
    c = "";
    var b = a + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(b);
        if (offset != -1) {
            offset += b.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) {
                end = document.cookie.length
            }
            c = document.cookie.substring(offset, end);
            c = unescape(c);
            return c
        }
    }
    return c
}
function GetTop10KeyWord(f, a) {
    if (ge(f) == null) {
        f = a
    }
    var e;
    var d = getCookie("CurTop10KeyWord");
    e = new String(d);
    if (e == "") {
        alert(message.noKeyWord);
        return
    }
    var b = "keyWordTop10ID=" + escape(f) + ";path=/";
    document.cookie = "keyWordTop10ID=" + escape(f) + ";path=/";
    var c = window.open("../popup/GetTop10KeyWord.aspx", "newGetTop10KeyWord", "modal=1,dialog=1,left=250,top=150,width=360,height=253,toolbar=0,location=no,directories=no,status=no,menubar=0,scrollbars=yes, resizable=0");
    c.focus()
}
function GetRelationWord(b, f) {
    var j = ge(b).value;
    if (j == null || j == "" || !KeywordVal(j)) {
        alert(message.oneKeyWord);
        return
    }
    var e;
    if (f.indexOf("$") == 0) {
        var d = f.substring(1, f.length);
        var a = ge(d);
        if (a != null) {
            e = a.value
        }
        if (e.indexOf(",") > 0) {
            e = e.split(",")[0]
        } else {
            if (e.indexOf("-") > 0) {
                e = e.split("-")[0]
            }
        }
    } else {
        e = f
    }
    var c = "";
    var n = ge("SearchFieldRelationDirectory").value;
    var k = n.split(",");
    for (var l = 0; l < k.length; l++) {
        var g = k[l];
        if (g.indexOf("/") > -1) {
            g = g.substring(0, g.indexOf("/"))
        }
        var m = k[l];
        if (g == e) {
            if (m == e) {
                c = ""
            } else {
                if (m == e + "/[]") {
                    c = "default"
                } else {
                    c = m.substring(e.length + 2, m.length - 1)
                }
            }
            break
        }
    }
    var h = window.open("../popup/GetRelationWord.aspx?ID=" + b + "&Value=" + escape(j) + "&sDictionary=" + escape(c), "GetRelationWord", "left=250,top=150,width=360,height=323,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no");
    h.focus()
}
function checkSubmit() {
    if (!checkPublishDate()) {
        return false
    }
    if (!checkSelectDbBox()) {
        return false
    }
    return true
}
function ChangeDateOpt(a, l, d, b) {
    var c = new Date();
    var h = c.getFullYear();
    var e = c.getMonth();
    e = e + 1;
    var f = c.getDate();
    var g = ge(b);
    var j = ge(d);
    var k = ge(l);
    g.value = h + "-" + CalendarDblNum(e) + "-" + CalendarDblNum(f);
    if (a.options[a.selectedIndex].value == "") {
        g.value = "";
        j.value = "";
        return
    }
    if (a.options[a.selectedIndex].value == "day") {
        if (f != 1) {
            f = f - 1
        } else {
            if (e != 1) {
                e = e - 1;
                f = GetMonthDay(e - 1)
            } else {
                h = h - 1;
                e = 12;
                f = 31
            }
        }
    } else {
        if (a.options[a.selectedIndex].value == "week") {
            if (f > 7) {
                f = f - 7
            } else {
                if (e != 1) {
                    e = e - 1;
                    dd2 = GetMonthDay(e - 1);
                    f = dd2 + f - 7
                } else {
                    h = h - 1;
                    e = 12;
                    f = 31 + f - 7
                }
            }
        } else {
            if (a.options[a.selectedIndex].value == "month") {
                if (e != 1) {
                    e = e - 1
                } else {
                    h = h - 1;
                    e = 12
                }
            } else {
                if (a.options[a.selectedIndex].value == "halfyear") {
                    if (e > 6) {
                        e = e - 6
                    } else {
                        h = h - 1;
                        e = 12 + e - 6
                    }
                } else {
                    if (a.options[a.selectedIndex].value == "year") {
                        h = h - 1
                    } else {
                        if (a.options[a.selectedIndex].value == "nearyear") {
                            e = 1;
                            f = 1;
                            h = h
                        } else {
                            if (a.options[a.selectedIndex].value == "preyear") {
                                g.value = (h - 1) + "-12-31";
                                e = 1;
                                f = 1;
                                h = h - 1
                            } else {
                                if (a.options[a.selectedIndex].value == "date") {
                                    k.style.display = "";
                                    return
                                } else {
                                    if (IsYearStr(a.options[a.selectedIndex].value)) {
                                        g.value = a.options[a.selectedIndex].value + "-12-31";
                                        e = 1;
                                        f = 1;
                                        h = a.options[a.selectedIndex].value
                                    } else {
                                        j.value = "";
                                        g.value = "";
                                        return
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    j.value = h + "-" + CalendarDblNum(e) + "-" + CalendarDblNum(f)
}
function IsYearStr(a) {
    if (a && a.length == 4) {
        if ("1970" <= a && a <= (new Date().getFullYear())) {
            return true
        }
    }
    return false
}
function RenewDateOpt(e, g, c) {
    if (ge(e) && ge(c)) {
        var j = ge(e).value.replace(/(^\s*)|(\s*$)/g, "").replace(/(\/)|(\.)/g, "-");
        var k = ge(c).value.replace(/(^\s*)|(\s*$)/g, "").replace(/(\/)|(\.)/g, "-");
        if (isDate(j) && isDate(k)) {
            var h = new Array(3);
            h = j.toString().split("-");
            if (h.length == 3) {
                if (h[1].substring(0, 1) == "0") {
                    h[1] = parseInt(h[1].substring(1))
                }
                if (h[2].substring(0, 1) == "0") {
                    h[2] = parseInt(h[2].substring(1))
                }
                h = ChangeNum(h)
            } else {
                if (ge(g)) {
                    ge(g).selectedIndex = 0
                }
                return
            }
            var m = new Array(3);
            m = k.toString().split("-");
            if (m.length == 3) {
                if (m[1].substring(0, 1) == "0") {
                    m[1] = parseInt(m[1].substring(1))
                }
                if (m[2].substring(0, 1) == "0") {
                    m[2] = parseInt(m[2].substring(1))
                }
                m = ChangeNum(m)
            } else {
                if (ge(g)) {
                    ge(g).selectedIndex = 0
                }
                return
            }
        } else {
            if (ge(g)) {
                ge(g).selectedIndex = 0
            }
            return
        }
    } else {
        return
    }
    if (h.length == 3 && m.length == 3) {
        var d = new Date();
        var a = d.getFullYear();
        var b = d.getMonth();
        b = b + 1;
        var f = d.getDate();
        if (ge(g)) {
            var l = ge(g);
            var n = new Array(3);
            n = [0, 0, 0];
            if (h[0] == a && h[1] == b && h[2] == f) {
                l.selectedIndex = 0
            }
            if (m[0] == a && m[1] == b && m[2] == f) {
                n = DateDispersion(m, h)
            } else {
                l.selectedIndex = 0;
                return
            }
            if (n[0] == 1 && n[1] == 0 && n[2] == 0) {
                l.selectedIndex = 4
            } else {
                if (n[0] == 0 && n[1] == 6 && n[2] == 0) {
                    l.selectedIndex = 3
                } else {
                    if (n[0] == 0 && n[1] == 1 && n[2] == 0) {
                        l.selectedIndex = 2
                    } else {
                        if (n[0] == 0 && n[1] == 0 && n[2] == 7) {
                            l.selectedIndex = 1
                        } else {
                            l.selectedIndex = 0
                        }
                    }
                }
            }
        }
    }
}
function DateDispersion(a, c) {
    var b = new Array(3);
    b = [0, 0, 0];
    if (a[2] < c[2]) {
        a[1] = a[1] - 1;
        a[2] = parseInt(a[2]) + GetMonthDay(a[1] + 1);
        if (a[1] == 2) {
            if (((a[0] % 4 == 0) && (a[0] % 100 != 0)) || (a[0] % 400)) {
                a[2] = a[2] + 1
            }
        }
        if (a[2] < c[2]) {
            a[1] = c[1] - 1;
            a[2] = parseInt(a[2]) + GetMonthDay(a[1] + 1);
            if (a[1] == 2) {
                if (((a[0] % 4 == 0) && (a[0] % 100 != 0)) || (a[0] % 400)) {
                    a[2] = a[2] + 1
                }
            }
        }
    }
    if (a[1] < c[1]) {
        a[0] = a[0] - 1;
        a[1] = a[1] + 12
    }
    b[2] = a[2] - c[2];
    b[1] = a[1] - c[1];
    b[0] = a[0] - c[0];
    return b
}
function ChangeNum(a) {
    for (i = 0; i < a.length; i++) {
        a[i] = parseInt(a[i])
    }
    return a
}
function CalendarDblNum(a) {
    if (a < 10) {
        return "0" + a
    } else {
        return a
    }
}
function GetMonthDay(c) {
    var a = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var b = a[c];
    return b
}
function checkPublishDate(e) {
    obj1 = ge(e + "_from");
    obj2 = ge(e + "_to");
    if (obj1 == null || obj2 == null) {
        return true
    }
    if (!KeywordVal(obj1.value)) {
        obj1.value = ""
    }
    if (!KeywordVal(obj2.value)) {
        obj2.value = ""
    }
    var b = obj1.value.replace(/(^\s*)|(\s*$)/g, "");
    b = b.replace(/(\/)|(\.)/g, "-");
    if (b != "" && !isDate(b)) {
        alert(message.dataError2);
        obj1.focus();
        return false
    }
    var f = obj2.value.replace(/(^\s*)|(\s*$)/g, "");
    f = f.replace(/(\/)|(\.)/g, "-");
    if (f != "" && !isDate(f)) {
        alert(message.dataError3);
        obj2.focus();
        return false
    }
    if (b != "" && f != "" && !compareDate(b, f)) {
        var c = b;
        b = f;
        f = c;
        c = obj1.value;
        obj1.value = obj2.value;
        obj2.value = c
    }
    if (b.length == 0 && f.length > 0) {
        var d = new Array(3);
        d = f.toString().split("-");
        if (d.length == 1) {
            obj1.value = "";
            obj2.value = f + "-12-31"
        } else {
            obj1.value = ""
        }
    } else {
        if (b.length > 0 && f.length == 0) {
            var d = new Array(3);
            d = b.toString().split("-");
            if (d.length == 1) {
                obj1.value = b + "-01-01"
            } else {
                obj2.value = ""
            }
        } else {
            var d = new Array(3);
            d = b.toString().split("-");
            var a = new Array(3);
            a = f.toString().split("-");
            if (d.length == 1 && d[0] != "") {
                obj1.value = b + "-01-01"
            }
            if (a.length == 1 && a[0] != "") {
                obj2.value = f + "-12-31"
            }
        }
    }
    if (b != "" && f != "" && !compareDate(b, f)) {
        alert(message.dataError1);
        obj1.focus();
        return false
    }
    return true
}
function isDateString(a) {
    var d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var f = new Array(3);
    var c, b, e;
    if (arguments.length != 1) {
        return false
    }
    f = a.toString().split("-");
    if (f.length != 3) {
        return false
    }
    if (f[1].length > 2 || f[2].length > 2) {
        return false
    }
    c = parseFloat(f[0]);
    b = parseFloat(f[1]);
    e = parseFloat(f[2]);
    if (c < 1900 || c > 2100) {
        return false
    }
    if (((c % 4 == 0) && (c % 100 != 0)) || (c % 400 == 0)) {
        d[1] = 29
    }
    if (b < 1 || b > 12) {
        return false
    }
    if (e < 1 || e > d[b - 1]) {
        return false
    }
    return true
}
function isDate(c) {
    if (arguments.length != 1) {
        return false
    }
    var e = new Array(3);
    e = c.toString().split("-");
    if (e.length == 1) {
        return IsYear(e[0])
    } else {
        if (e.length == 2 && IsYear(e[0]) && IsMonth(e[1])) {
            return true
        }
    }
    var a = c.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (a == null) {
        return false
    }
    var b = new Date(a[1], a[3] - 1, a[4]);
    return (b.getFullYear() == a[1] && (b.getMonth() + 1) == a[3] && b.getDate() == a[4])
}
function IsYear(a) {
    if (a.length != 4) {
        return false
    }
    var b = parseFloat(a);
    if (isNaN(b)) {
        return false
    }
    if (b < 1900 || b > 2100) {
        return false
    }
    return true
}
function IsMonth(a) {
    if (a == "" || a.length > 2) {
        return false
    }
    var b = parseFloat(a);
    if (b < 1 || b > 12) {
        return false
    }
    return true
}
function compareDate(c, f) {
    var a = c.split("-");
    var b = f.split("-");
    var d = a.length > b.length ? b.length : a.length;
    for (var e = 0; e < a.length; e++) {
        if (e == 0) {
            if (a[e] - b[e] > 0) {
                return false
            }
        } else {
            if (e == 1) {
                if (a[0] == b[0] && a[e] - b[e] > 0) {
                    return false
                }
            } else {
                if (e == 2) {
                    if (a[0] == b[0] && a[1] == b[1] && a[e] - b[e] > 0) {
                        return false
                    }
                }
            }
        }
    }
    return true
}
function AddRowEx(divid, divindex, divcount) {
    try {
        if (!ge(divindex) || !ge(divcount) || ge(divindex).value == ge(divcount).value) {
            return
        }
        var curID = parseInt($("#" + divindex).val());
        var copyID = curID + 1;
        var curTrID = divid + "_" + curID.toString();
        var copyTrID = divid + "_" + copyID.toString();
        var copyHtml = "";
        if ($("#" + copyTrID).html() != null) {
            $("#" + copyTrID).show()
        } else {
            var cloneObj = $("#" + curTrID).clone();
            if (curID == 1) {
                if (cloneObj.find("td:first") != null) {
                    cloneObj.find("td:first").remove()
                }
                if (cloneObj.find("span:first") != null) {
                    cloneObj.find("span:first").remove()
                }
                var logicalTd = $("#hidden_logical_" + divid).html();
                if (logicalTd != "") {
                    var reg = /{key}/g;
                    logicalTd = logicalTd.replace(reg, copyTrID);
                    cloneObj = cloneObj.prepend(logicalTd)
                }
            }
            copyHtml = $("<div></div>").append(cloneObj).html();
            var reg1 = eval("/" + curTrID + "/g");
            copyHtml = copyHtml.replace(reg1, divid + "_" + copyID.toString());
            if (copyHtml != "") {
                $("#" + curTrID).after(copyHtml)
            }
        }
        var objvalue = ge(copyTrID + "_value1");
        if (objvalue != null) {
            objvalue.value = ""
        }
        objvalue = ge(copyTrID + "_value2");
        if (objvalue != null) {
            objvalue.value = ""
        }
        ge(divindex).value = copyID.toString();
        var obj = ge(copyTrID + "_sel");
        if (!obj) {
            obj = ge(copyTrID + "_sel1")
        }
        if (obj) {
            obj.options[copyID - 1].selected = true;
            obj.onchange()
        }
    } catch (e) {
    }
}
function AddRow(h, c, b) {
    try {
        if (ge(c).value == ge(b).value) {
            return
        }
        if (!ge(c) || !ge(b) || ge(c).value == ge(b).value) {
            return
        } else {
            var g = parseInt(ge(c).value);
            g++;
            var f = h + "_" + g;
            SetDisplayValue(f, "");
            ge(c).value = g;
            var a = ge("txt_" + g + "_sel");
            if (a) {
                a.options[g - 1].selected = true;
                a.onchange()
            }
        }
    } catch (d) {
        return
    }
}
function DeleteRow(h, c, b) {
    try {
        if (ge(c).value == "1") {
            return
        } else {
            var g = parseInt(ge(c).value);
            var f = h + "_" + g;
            var a = ge(f + "_value1");
            if (a != null) {
                a.value = ""
            }
            a = ge(f + "_value2");
            if (a != null) {
                a.value = ""
            }
            SetDisplayValue(f, "none");
            f;
            g--;
            ge(c).value = g
        }
    } catch (d) {
        return
    }
}
function AddRowSaveID(h, c, b, f) {
    try {
        if (ge(c).value == ge(b).value) {
            return
        } else {
            var g = parseInt(ge(c).value);
            g++;
            var a = h + "_" + g;
            ge(a).style.display = "";
            ge(c).value = g;
            if (ge(f)) {
                if (ge(f).value.indexOf(a + ",") < 0) {
                    ge(f).value += a + ","
                }
            }
        }
    } catch (d) {
        return
    }
}
function DeleteRowSaveID(d, a, h, b) {
    try {
        if (ge(a).value == "1") {
            return
        } else {
            var j = parseInt(ge(a).value);
            var g = d + "_" + j;
            var c = ge(g + "_value1");
            if (c != null) {
                c.value = ""
            }
            c = ge(g + "_value2");
            if (c != null) {
                c.value = ""
            }
            SetDisplayValue(g, "none");
            j--;
            ge(a).value = j;
            if (ge(b)) {
                ge(b).value = ge(b).value.replace(g + ",", "")
            }
        }
    } catch (f) {
        return
    }
}
function SetInput(b, c, f) {
    if (b != undefined && b != null) {
        var a = b.split(f);
        for (var d = 0; d < a.length; d++) {
            var e = a[d].split(c);
            if (document.all(e[0]) != null && e[1] != null) {
            }
            document.all(e[0]).value = e[1]
        }
    }
}
var spcilChar = ["'", '"', "\\"];
function handlerSpcilReplace(a) {
    return a
}
function SetParam(n, d) {
    var h = GetCurIDs();
    if (h != "") {
        n = h
    }
    var b = n.split(d);
    if (b == null) {
        return ""
    }
    var l = "";
    var k = "";
    for (var a = 0; a < b.length; a++) {
        if (b[a] != "" && b[a].indexOf("||") != -1) {
            l += SetSearchWord(b[a].substring(0, b[a].length - 2))
        } else {
            var f = ge(b[a]);
            if (f == null) {
                continue
            }
            try {
                if (f.type == "checkbox" || f.type == "radiobox") {
                    var g = document.getElementsByName(b[a]);
                    for (var m = 0; m < g.length; m++) {
                        if (g[m].checked == true) {
                            l += "&" + b[a] + "=" + SifSpicAddWord(encodeURIComponent(handlerSpcilReplace(g[m].value.Trim())))
                        }
                    }
                } else {
                    if (f.value != "" && f.value != "undefined") {
                        if (KeywordVal(f.value)) {
                            k = f.value.replace(/\n/g, "");
                            k = k.replace(/\r/g, "");
                            k = k.Trim();
                            k = handlerSpcilReplace(k);
                            if (b[a] == "expertvalue" || (b[a] != null && b[a].indexOf("@") >= 0)) {
                                l += "&" + b[a] + "=" + SifSpicAddWord(encodeURIComponent(k))
                            } else {
                                l += "&" + b[a] + "=" + SifSpicAddWord(encodeURIComponent(k))
                            }
                        }
                    }
                }
            } catch (c) {
            }
        }
    }
    return l
}
function GetCurIDs() {
    var b = ge("singleDB");
    var f = "";
    if (b) {
        var a = b.value;
        var f = "";
        try {
            if (typeof attachLists != "undefined") {
                if (attachLists && attachLists.length > 0) {
                    for (var c = 0; c < attachLists.length; c++) {
                        if (attachLists[c].code == a) {
                            f = attachLists[c].value;
                            break
                        }
                    }
                }
            }
        } catch (d) {
        }
    }
    return f
}
function SetSearchWord(b) {
    var g = "sel,sel1,sel2,value1,value2,logical,freq1,freq2,relation,special1,special2,special3,extension";
    var d = ge(b + "_value1");
    var j = ge(b + "_value2");
    if (d == null || (d.value == "" && (j == null || j.value == ""))) {
        return ""
    }
    a_postfix = g.split(",");
    var l = "";
    var k = "";
    for (var a = 0; a < a_postfix.length; a++) {
        var f = b + "_" + a_postfix[a];
        try {
            var h = ge(f);
            if (h == null) {
                continue
            }
            if (h.type == "checkbox") {
                if (h.checked == true) {
                    l += "&" + f + "=" + SifSpicAddWord(encodeURIComponent(handlerSpcilReplace(h.value.Trim())))
                }
            } else {
                if (h.value != "" && h.value != "undefined") {
                    if (KeywordVal(h.value)) {
                        k = h.value.replace(/\n/g, "");
                        k = k.replace(/\r/g, "");
                        k = handlerSpcilReplace(k);
                        l += "&" + f + "=" + SifSpicAddWord(encodeURIComponent(k.Trim()))
                    }
                }
            }
        } catch (c) {
        }
    }
    return l
}
function TextLimit(b) {
    var a = ge(b).value;
    if (a.length > 500) {
        alert(message.mostInput + "500" + message.keyNum);
        ge(b).value = a.substring(0, 500);
        ge(b).focus()
    }
}
function disableWordTimes(g) {
    if (!document.getElementById) {
        return
    }
    var a = "#" + g.id.substr(0, 6) + "special1";
    if ($("#" + g.id).find("option:selected").text() == "中图分类号") {
        $(a).attr("disabled", "disabled");
        $(a).find("option[text='模糊']").attr("selected", true)
    } else {
        $(a).attr("disabled", "")
    }
    var c = ge("fieldnowordfrequency");
    if (c) {
        var d = c.value;
        var f;
        f = d.split(",")
    }
    var b = g.id.substr(0, 6) + "freq";
    var h = ge(b + "1");
    var e = ge(b + "2");
    if (h && e) {
        h.disabled = false;
        e.disabled = false;
        if (f) {
            for (var k = 0; k < f.length; k++) {
                if (g.options[g.selectedIndex].value == f[k]) {
                    h.disabled = true;
                    e.disabled = true;
                    h.selectedIndex = 0;
                    e.selectedIndex = 0;
                    DeleteXls(h);
                    DeleteXls(e)
                }
            }
        }
    }
}
function pageLoadDisableWordTimes() {
    if (!document.getElementById) {
        return
    }
    var c = ge("fieldnowordfrequency");
    if (c) {
        var d = c.value;
        var f;
        f = d.split(",")
    }
    for (var a = 1; a <= 15; a++) {
        var g = "txt_" + a + "_sel";
        var h = "txt_" + a + "_freq1";
        var l = "txt_" + a + "_freq2";
        var n = ge(g);
        if (n && n.tagName.toLowerCase() != "select") {
            var m = document.getElementsByName(g);
            for (var a = 0; a < m.length; a++) {
                if (m[a].tagName.toLowerCase() == "select") {
                    n = m[a];
                    break
                }
            }
        }
        var k = ge(h);
        var e = ge(l);
        if (n && k && e) {
            for (var b = 0; b < f.length; b++) {
                if (n.options[n.selectedIndex].value == f[b]) {
                    k.disabled = true;
                    e.disabled = true;
                    break
                }
            }
        }
    }
}
function GetFristSearchWord() {
    var a = "txt_";
    var d = "_sel";
    var f = "_value1";
    var e = "_value2";
    var c = "";
    for (i = 1; i < 8; i++) {
        cid = a + i + f;
        var b = ge(cid);
        if (b != null && b.value != message.inputSearchWord3 && b.value != "") {
            c = b.value;
            cid = a + i + d;
            b = ge(cid);
            if (b) {
                return "spfield=" + encodeURIComponent(b.value) + "&spvalue=" + encodeURIComponent(c)
            }
        } else {
            cid = a + i + e;
            var b = ge(cid);
            if (b != null && b.value != message.inputSearchWord3 && b.value != "") {
                c = b.value;
                cid = a + i + d;
                b = ge(cid);
                if (b) {
                    return "spfield=" + encodeURIComponent(b.value) + "&spvalue=" + encodeURIComponent(c)
                }
            }
        }
    }
    return ""
}
function SubmitTab(e, m, h, j, c) {
    var l = ge("searchmenu").getElementsByTagName("Li");
    var f = l.length;
    var k = getSearchTabActiveID();
    if (("1_" + c) == k) {
        return
    }
    for (var a = 0; a < f; a++) {
        l[a].className = ""
    }
    var b = ge("1_" + c);
    b.className = "active";
    var d = "&dbCatalog=" + escape(e) + "&dbPrefix=" + m;
    d += "&tab=" + h + "&zone=" + j;
    if (c) {
        if (typeof(c) == "number") {
            swichSearchMode = c
        }
        if (h.toLowerCase() == "normol") {
            swichSearchMode = -1
        }
    }
    try {
        CommonDeal("gettab", "../request/GettabHandler.ashx", d, tabresult, "");
        if (h == "normol" && ge("GroupViewTitle")) {
            ge("GroupViewTitle").innerHTML = '<span class="red01">3.' + message.groupSelect + "</span><font>(" + message.moreGroup + ")</font>"
        } else {
            if (ge("GroupViewTitle")) {
                ge("GroupViewTitle").innerHTML = '<span class="red01">' + message.groupSelect + "</span><font>(" + message.moreGroup + ")</font>"
            }
        }
        var n = document.getElementsByName("ddSubmit");
        if (n) {
            for (var a = 0; a < n.length; a++) {
                if (n[a]) {
                    n[a].style.display = "none"
                }
            }
        }
    } catch (g) {
    }
}
var SubmitFlg = 0;
function SubmitTabNoDiv(e, m, j, k, b) {
    SubmitFlg = 1;
    var l = ge("searchmenu").getElementsByTagName("Li");
    var f = l.length;
    for (var a = 0; a < f; a++) {
        l[a].className = ""
    }
    ge("1_" + b).className = "active";
    var c = "&dbCatalog=" + escape(e) + "&dbPrefix=" + m;
    c += "&tab=" + j + "&zone=" + k;
    if (b) {
        if (typeof(b) == "number") {
            swichSearchMode = b
        }
        if (j.toLowerCase() == "normol") {
            swichSearchMode = -1
        }
    }
    try {
        CommonDealNoDiv("gettab", "../request/GettabHandler.ashx", c, tabresult, "");
        var g = ge("GroupViewTitle");
        if (g) {
            var d = '<span class="red01">';
            if (j == "normol") {
                d = d + "3."
            }
            g.innerHTML = d + message.groupSelect + "</span><font>(" + message.moreGroup + ")</font>"
        }
        var n = document.getElementsByName("ddSubmit");
        if (n) {
            for (var a = 0; a < n.length; a++) {
                if (n[a]) {
                    n[a].style.display = "none"
                }
            }
        }
    } catch (h) {
    }
}
function getSearchTabActiveID() {
    try {
        return getElementsByClassName("active", "li", "searchmenu")[0].id
    } catch (a) {
        return ""
    }
}
function getCurMoreBtnState() {
    var b = ge("MoreSearch");
    if (b) {
        try {
            if (b.style.display == "none") {
                return false
            }
        } catch (a) {
        }
    }
    return true
}
function tabresult(g) {
    if (g.readyState != ReadyState.Complete) {
        return
    }
    if (g.status == HttpStatus.OK && g.responseText != "") {
        if (waitDiv) {
            waitDiv.style.display = "none"
        }
        if (ge("searchdiv") != null) {
            try {
                var f = getSearchTabActiveID();
                var e = getCurMoreBtnState();
                var c = "";
                if (ge("searchmenu")) {
                    c = ge("searchmenu").innerHTML
                }
                ge("searchdiv").innerHTML = g.responseText;
                if (swichSearchMode && swichSearchMode > 0 || !e) {
                    ShowSearchTab(c, f, e)
                }
                SetIndexLink();
                var b = ge("curdbcode");
                if (b && b.value == "SCDB" && SubmitFlg == 1) {
                    try {
                        SetInput();
                        setDivRow()
                    } catch (h) {
                    }
                } else {
                    if (b && b.value == "SCDB") {
                        try {
                            SetInputByID("db_value")
                        } catch (h) {
                        }
                    }
                }
                if (b.value == "CYFD") {
                    FillDYToSelect("", "1")
                }
                if (b) {
                    var a = getJavaScript(g.responseText);
                    evalJavaScript(a)
                }
                SetDisplayValue("history", "none");
                ChangeImgSrc("history", "s_jiantou1", "../images/" + LanguageEncode + "/s_jiantou01.gif", "../images/" + LanguageEncode + "/s_jiantou.gif");
                SetDisplayValue("GetSearch", "none");
                pageLoadDisableWordTimes();
                if (b && b.value == "SCDB" && SubmitFlg == 1) {
                    SubmitFlg = 0;
                    SubmitForm("", "")
                }
                return
            } catch (d) {
            }
        }
    }
}
function setDivRow() {
    var a;
    if (ge("hidDivIDS")) {
        a = ge("hidDivIDS").value.split(",")
    } else {
        return
    }
    for (var b = 0; b < a.length; b++) {
        SetDisplayValue(a[b], "")
    }
}
function ShowSearchTab(d, b, f) {
    try {
        var c = ge("searchmenu");
        c.innerHTML = d;
        var h = ge("searchmenu").getElementsByTagName("LI");
        if (h && h.length > 0) {
            try {
                for (var a = 0; a < h.length; a++) {
                    if (!h[a]) {
                        continue
                    }
                    if (h[a].className == "active") {
                        h[a].className = ""
                    }
                    if (!f) {
                        h[a].style.display = ""
                    }
                }
            } catch (g) {
            }
        }
        ge(b).className = "active";
        SetDisplayValue("MoreSearch", f ? "" : "none");
        HideDiv("divqryNew")
    } catch (g) {
    }
}
function ShowTab(a, b, f) {
    try {
        for (var d = 1; d <= f; d++) {
            var g = ge(a + "_" + d);
            if (g == null) {
                continue
            }
            if (d == b) {
                g.className = "active"
            } else {
                g.className = ""
            }
            g = null
        }
        HideDiv("divqryNew");
        HideDiv("CustomizeSearch")
    } catch (c) {
    }
}
function DeleteXls(c) {
    for (var d = 1; d < 10; d++) {
        for (var e = 1; e < 3; e++) {
            if (ge("txt_" + d.toString() + "_freq" + e.toString()) != null) {
                if (ge("txt_" + d.toString() + "_freq" + e.toString()).value != "") {
                    if (ge("txt_extensionCKB") != null) {
                        ge("txt_extensionCKB").checked = false;
                        ge("txt_extensionCKB").disabled = true;
                        for (var b = 1; b < 10; b++) {
                            if (ge("txt_" + b.toString() + "_extension")) {
                                ge("txt_" + b.toString() + "_extension").value = ""
                            }
                        }
                        return
                    }
                }
            }
        }
    }
    if (c.value != "") {
        if (ge("txt_extensionCKB") != null) {
            ge("txt_extensionCKB").checked = false;
            ge("txt_extensionCKB").disabled = true
        }
        for (var a = 1; a < 10; a++) {
            if (ge("txt_" + a.toString() + "_extension")) {
                ge("txt_" + a.toString() + "_extension").value = ""
            }
        }
    } else {
        if (ge("txt_extensionCKB") != null) {
            ge("txt_extensionCKB").disabled = false
        }
    }
}
function DeleteFreq(a) {
    if (a.checked) {
        for (var b = 1; b < 10; b++) {
            for (var c = 1; c < 3; c++) {
                if (ge("txt_" + b.toString() + "_freq" + c.toString()) != null) {
                    ge("txt_" + b.toString() + "_freq" + c.toString()).value = "";
                    ge("txt_" + b.toString() + "_freq" + c.toString()).disabled = true
                }
            }
            if (ge("txt_" + b.toString() + "_extension")) {
                ge("txt_" + b.toString() + "_extension").value = "xls"
            }
        }
        ge("txt_extensionCKB").disabled = false
    } else {
        for (var b = 1; b < 10; b++) {
            for (var c = 1; c < 3; c++) {
                if (ge("txt_" + b.toString() + "_freq" + c.toString()) != null) {
                    ge("txt_" + b.toString() + "_freq" + c.toString()).disabled = false
                }
            }
        }
    }
    pageLoadDisableWordTimes()
}
function ChangeYearOrTime(d, c, a) {
    if (d) {
        var b = false;
        if (c == "publishdate" || c == "confertime") {
            b = true
        }
        objYearFrom = ge(c + "_from");
        objYearTo = ge(c + "_to");
        objUpdateTime = ge(a + "_opt");
        objIssue = ge("issue_1_value1_2");
        objIssueHidden = ge("issue_1_value1");
        objUpdateFrom = ge(a + "_from");
        objUpdateTo = ge(a + "_to");
        if (d.id.indexOf("issue") >= 0) {
            if (d.value != "" || d.value != message.pleaseInput) {
                d.style.color = "";
                if (objYearFrom && objYearTo) {
                    objYearFrom.style.color = "";
                    objYearTo.style.color = ""
                }
                if (objUpdateTime && objUpdateFrom && objUpdateTo) {
                    objUpdateTime.style.color = "#666666";
                    objUpdateTime.value = "";
                    objUpdateFrom.value = "";
                    objUpdateTo.value = ""
                }
            }
        } else {
            if (d.id.indexOf("year") >= 0 || d.id.indexOf("confertime") >= 0 || d.id.indexOf("publishdate") >= 0) {
                if (objYearFrom && objYearTo && objUpdateTime) {
                    if (objYearFrom.value != "" || objYearTo != "" || (objIssue.value != "" && objIssue.value != message.pleaseInput)) {
                        objYearFrom.style.color = "";
                        objYearTo.style.color = "";
                        objUpdateTime.style.color = "#666666";
                        objUpdateTime.value = "";
                        if (objUpdateFrom && objUpdateTo) {
                            objUpdateFrom.value = "";
                            objUpdateTo.value = ""
                        }
                    }
                }
            } else {
                if (d.id.indexOf("updatedateN") >= 0) {
                    if (d.value != "") {
                        d.style.color = "";
                        if (objYearFrom && objYearTo) {
                            if (b) {
                                objYearFrom.value = message.inputDate;
                                objYearTo.value = message.inputDate
                            } else {
                                objYearFrom.value = "";
                                objYearTo.value = ""
                            }
                            objYearFrom.style.color = "#666666";
                            objYearTo.style.color = "#666666";
                            if (objIssue) {
                                objIssue.value = message.pleaseInput;
                                objIssue.style.color = "#666666"
                            }
                            if (objIssueHidden) {
                                objIssueHidden.value = ""
                            }
                        }
                    }
                }
            }
        }
    }
}
function GetFixRelationWord(c, a, j) {
    if (!c) {
        return
    }
    c = c.toLowerCase();
    var b;
    var h;
    var g = "";
    switch (c) {
        case"minshi":
            if (LanguageEncode == "EN") {
                h = "../popup/minshizeren_en.htm"
            } else {
                h = "../popup/minshizeren.htm"
            }
            break;
        case"xingshi":
            if (LanguageEncode == "EN") {
                h = "../popup/xingshizeren_en.htm"
            } else {
                h = "../popup/xingshizeren.htm"
            }
            break;
        case"xingzheng":
            if (LanguageEncode == "EN") {
                h = "../popup/xingzhengxingwei_en.htm"
            } else {
                h = "../popup/xingzhengxingwei.htm"
            }
            break;
        case"diyu":
            h = "../popup/DIYU.htm?id=" + a;
            if (j) {
                h += "&codeId=" + j
            }
            isDiYu = true;
            break
    }
    if (h == null || h == "") {
        return
    }
    b = window.showModalDialog(h, window, g);
    if (b == null) {
        return
    }
    var f = b.split(",");
    var d = document.getElementById(a);
    var e = document.getElementById(j);
    if (f != null && f.length == 2) {
        if (d) {
            d.value = f[0]
        }
        if (e) {
            e.value = f[1]
        }
        return
    }
    if (d) {
        d.value = b
    }
}
function ClearInputValue(b, a) {
    var c = document.getElementById(b);
    if (c) {
        c.value = ""
    }
    c = document.getElementById(a);
    if (c) {
        c.value = ""
    }
}
function RadioCheck(f, b) {
    var c = document.getElementsByName("RangRI");
    for (var d = 0; d < c.length; d++) {
        try {
            c[d].checked = false
        } catch (e) {
        }
    }
    $(f).children("input:first").attr("checked", true);
    $(f).parents("table").find("td").each(function () {
        $(this).attr("class", "")
    });
    $(f).attr("class", "cRed");
    var a = document.getElementById("hidSearchRange");
    if (a) {
        a.value = b
    }
}
function checkJourType(b) {
    var a = document.getElementById("@joursource");
    if (a) {
        a.value = b.value
    }
}
function changeIssue(a) {
    var b = document.getElementById(a.id.substr(0, a.id.length - 1) + "2");
    var c = document.getElementById(a.id.substr(0, a.id.length - 2));
    if (b) {
        if (a.tagName == "SELECT") {
            b.disabled = (a.value.length > 0) ? true : false;
            b.style.backgroundColor = (a.value.length > 0) ? "#eeeeee" : "";
            b.value = (a.value.length > 0) ? "" : a.value;
            c.value = (a.value.length > 0) ? a.value : ""
        } else {
            c.value = a.value
        }
    }
};
var oCalendarChs = new PopupCalendar("oCalendarChs");
if (typeof(LanguageEncode) != undefined) {
    switch (LanguageEncode.toLowerCase()) {
        case"en":
            oCalendarChs.weekDaySting = new Array("Sun", "Mon", "Tues", "Wed", "Thurs", "Fir", "Sat");
            oCalendarChs.monthSting = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
            oCalendarChs.oBtnTodayTitle = "Today";
            oCalendarChs.oBtnCancelTitle = "Cancel";
            break;
        default:
            oCalendarChs.weekDaySting = new Array("日", "一", "二", "三", "四", "五", "六");
            oCalendarChs.monthSting = new Array("一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月");
            oCalendarChs.oBtnTodayTitle = "今天";
            oCalendarChs.oBtnCancelTitle = "取消";
            break
    }
} else {
    oCalendarChs.weekDaySting = new Array("日", "一", "二", "三", "四", "五", "六");
    oCalendarChs.monthSting = new Array("一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月");
    oCalendarChs.oBtnTodayTitle = "今天";
    oCalendarChs.oBtnCancelTitle = "取消"
}
oCalendarChs.Init();
document.onclick = DocumentClick;
var IS_IE = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 && document.all);
function PopupCalendar(a) {
    this.instanceName = a;
    this.separator = "-";
    this.oBtnTodayTitle = "Today";
    this.oBtnCancelTitle = "Cancel";
    this.weekDaySting = new Array("S", "M", "T", "W", "T", "F", "S");
    this.monthSting = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    this.Width = 200;
    this.currDate = new Date();
    this.today = new Date();
    this.startYear = 1979;
    this.endYear = new Date().getFullYear();
    this.normalfontColor = "#666666";
    this.selectedfontColor = "red";
    this.divBorderCss = "1px solid #BCD0DE";
    this.titleTableBgColor = "#98B8CD";
    this.tableBorderColor = "#CCCCCC";
    this.Init = CalendarInit;
    this.Fill = CalendarFill;
    this.Refresh = CalendarRefresh;
    this.Restore = CalendarRestore;
    this.oTaget = null;
    this.oPreviousCell = null;
    this.sDIVID = a + "_Div";
    this.sTABLEID = a + "_Table";
    this.sMONTHID = a + "_Month";
    this.sYEARID = a + "_Year";
    this.sDAYTDID = a + "_DayTD";
    this.sTODAYBTNID = a + "_TODAYBTN";
    this.sCANCELID = a + "_Cancel";
    this.bgIframeID = a + "_Iframe"
}
function CalendarInit() {
    var f, b;
    f = this.currDate.getMonth();
    b = this.currDate.getFullYear();
    var e = "<div id='" + this.sDIVID + "' style='display:none;Z-INDEX: 999;position:absolute;width:" + this.Width + "px;border:" + this.divBorderCss + ";padding:2px;background-color:#FFFFFF'>";
    e += "<div align='center'>";
    htmloMonth = "<select id='" + this.sMONTHID + "' onchange=CalendarMonthChange(" + this.instanceName + ") style='width:50%'>";
    for (i = 0; i < 12; i++) {
        htmloMonth += "<option value='" + i + "'>" + this.monthSting[i] + "</option>"
    }
    htmloMonth += "</select>";
    htmloYear = "<select id='" + this.sYEARID + "' onchange=CalendarYearChange(" + this.instanceName + ") style='width:50%'>";
    for (i = this.startYear; i <= this.endYear; i++) {
        htmloYear += "<option value='" + i + "'>" + i + "</option>"
    }
    htmloYear += "</select></div>";
    htmloDayTable = "<table id='" + this.sTABLEID + "' width='100%' border=0 cellpadding=0 cellspacing=1 bgcolor='" + this.tableBorderColor + "'>";
    htmloDayTable += "<tbody bgcolor='#ffffff'style='font-size:13px'>";
    for (i = 0; i <= 6; i++) {
        if (i == 0) {
            htmloDayTable += "<tr bgcolor='" + this.titleTableBgColor + "'>"
        } else {
            htmloDayTable += "<tr>"
        }
        for (j = 0; j < 7; j++) {
            if (i == 0) {
                htmloDayTable += "<td height='20' align='center' valign='middle' style='cursor: pointer'>";
                htmloDayTable += this.weekDaySting[j] + "</td>"
            } else {
                var a = this.sDAYTDID + i + j;
                htmloDayTable += "<td id=" + a + " height='20' align='center' valign='middle' style='cursor: pointer'";
                htmloDayTable += " onmouseover=CalendarCellsMsOver(" + this.instanceName + ")";
                htmloDayTable += " onmouseout=CalendarCellsMsOut(" + this.instanceName + ")";
                htmloDayTable += " onclick=CalendarCellsClick(this," + this.instanceName + ")>";
                htmloDayTable += "&nbsp;</td>"
            }
        }
        htmloDayTable += "</tr>"
    }
    htmloDayTable += "</tbody></table>";
    htmloButton = "<div align='center' style='padding:3px'>";
    if (b == this.endYear) {
        htmloButton += "<input type='button' id='" + this.sTODAYBTNID + "' style='width:40%;border:1px solid #BCD0DE;background-color:#eeeeee;cursor: pointer;height:22px;font-size:12px'";
        htmloButton += " onclick=CalendarTodayClick(" + this.instanceName + ") value='" + this.oBtnTodayTitle + "'>&nbsp;"
    } else {
        this.currDate = new Date(this.endYear, 0, 1)
    }
    htmloButton += "<input type='button' id='" + this.sCANCELID + "' style='width:40%;border:1px solid #BCD0DE;background-color:#eeeeee;cursor: pointer;height:22px;font-size:12px'";
    htmloButton += " onclick=CalendarCancel(" + this.instanceName + ") value='" + this.oBtnCancelTitle + "'>";
    htmloButton += "</div>";
    e = e + htmloMonth + htmloYear + htmloDayTable + htmloButton + "</div>";
    e += "<iframe id=" + this.bgIframeID + " scrolling='no' frameborder='0' style='position:absolute; top:0px; left:0px; Z-INDEX: 998; display:none;filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);'></iframe>";
    var d = "all_" + this.sDIVID;
    var c = document.getElementById(d);
    if (c) {
        c.innerHTML = "";
        c.innerHTML = e
    } else {
        e = "<div id='" + d + "' style='zoom:1'>" + e + "</div>";
        document.write(e)
    }
    this.Fill()
}
function CalendarFill() {
    var c, l, k, a, g, n, o, m, f, d, b, e, h;
    c = this.currDate.getMonth();
    l = this.currDate.getFullYear();
    k = (new Date(l, c, 1)).getDay();
    a = this.currDate.getDate();
    m = 1;
    g = document.getElementById(this.sTABLEID);
    n = g.rows[1];
    o = CalendarGetMaxDay(l, c);
    e = document.getElementById(this.sMONTHID);
    e.selectedIndex = c;
    h = document.getElementById(this.sYEARID);
    for (i = 0; i < h.length; i++) {
        if (parseInt(h.options[i].value) == l) {
            h.selectedIndex = i
        }
    }
    for (d = 1; d <= 6; d++) {
        if (m > o) {
            break
        }
        n = g.rows[d];
        b = 0;
        if (d == 1) {
            b = k
        }
        for (; b < n.cells.length; b++) {
            if (m == a) {
                n.cells[b].innerHTML = "<font color='" + this.selectedfontColor + "'><i><b>" + m + "</b></i></font>";
                this.oPreviousCell = n.cells[b]
            } else {
                n.cells[b].innerHTML = m;
                n.cells[b].style.color = this.normalfontColor
            }
            CalendarCellSetCss(0, n.cells[b]);
            m++;
            if (m > o) {
                break
            }
        }
    }
}
function CalendarRestore() {
    var b, c, a;
    a = document.getElementById(this.sTABLEID);
    for (b = 1; b < a.rows.length; b++) {
        for (c = 0; c < a.rows[b].cells.length; c++) {
            CalendarCellSetCss(0, a.rows[b].cells[c]);
            a.rows[b].cells[c].innerHTML = "&nbsp;"
        }
    }
}
function CalendarRefresh(a) {
    this.currDate = a;
    this.Restore();
    this.Fill()
}
function CalendarCellsMsOver(a) {
    var b = GetEventSrcElement();
    CalendarCellSetCss(0, a.oPreviousCell);
    if (b) {
        CalendarCellSetCss(1, b);
        a.oPreviousCell = b
    }
}
function CalendarCellsMsOut(a) {
    var b = GetEventSrcElement();
    CalendarCellSetCss(0, b)
}
function CalendarYearChange(a) {
    var d, e, b, c;
    d = a.currDate.getDate();
    e = a.currDate.getMonth();
    b = document.getElementById(a.sYEARID).value;
    c = new Date(b, e, d);
    a.Refresh(c)
}
function CalendarMonthChange(a) {
    var d, e, b, c;
    d = a.currDate.getDate();
    e = document.getElementById(a.sMONTHID).value;
    b = a.currDate.getFullYear();
    c = new Date(b, e, d);
    a.Refresh(c)
}
function CalendarCellsClick(e, a) {
    var f, g, b, d;
    b = a.currDate.getFullYear();
    g = a.currDate.getMonth();
    f = a.currDate.getDate();
    var c = e.innerText || e.textContent;
    if (c.length > 0 && c != " " && c.charCodeAt(0) != 32 && c.charCodeAt(0) != 160) {
        f = parseInt(c);
        if (f != a.currDate.getDate()) {
            d = new Date(b, g, f);
            a.Refresh(d)
        }
    }
    sDateString = b + a.separator + CalendarDblNum(g + 1) + a.separator + CalendarDblNum(f);
    if (a.oTaget.tagName.toLowerCase() == "input") {
        a.oTaget.value = sDateString;
        if (document.getElementById("publishdate_from") && document.getElementById("date_opt") && document.getElementById("publishdate_to")) {
            RenewDateOpt("publishdate_from", "date_opt", "publishdate_to")
        }
    }
    CalendarCancel(a);
    return sDateString
}
function CalendarTodayClick(a) {
    a.Refresh(new Date());
    sYear = a.currDate.getFullYear();
    sMonth = a.currDate.getMonth();
    sDay = a.currDate.getDate();
    sDateString = sYear + a.separator + CalendarDblNum(sMonth + 1) + a.separator + CalendarDblNum(sDay);
    if (a.oTaget.tagName.toLowerCase() == "input") {
        a.oTaget.value = sDateString;
        if (document.getElementById("publishdate_from") && document.getElementById("date_opt") && document.getElementById("publishdate_to")) {
            RenewDateOpt("publishdate_from", "date_opt", "publishdate_to")
        }
    }
    CalendarCancel(a)
}
var ActiveInstance;
function getDateString(b, a) {
    if (b && a) {
        var c = document.getElementById(a.sDIVID);
        var d = document.getElementById(a.bgIframeID);
        a.oTaget = b;
        ActiveInstance = a;
        d.style.pixelLeft = c.style.pixelLeft = GetX(b);
        d.style.pixelTop = c.style.pixelTop = GetY(b) + b.offsetHeight;
        d.style.left = c.style.left = c.style.pixelLeft + "px";
        d.style.top = c.style.top = c.style.pixelTop + "px";
        try {
            d.style.display = c.style.display = (c.style.display == "none") ? "" : "none";
            d.style.visibility = c.style.visibility = (c.style.visibility == "hide") ? "visible" : "hide"
        } catch (e) {
        }
        d.width = c.scrollWidth;
        d.height = c.scrollHeight
    }
}
function GetX(b) {
    var a = b.offsetLeft;
    while (b = b.offsetParent) {
        a += b.offsetLeft
    }
    return a
}
function GetY(b) {
    var a = b.offsetTop;
    while (b = b.offsetParent) {
        a += b.offsetTop
    }
    return a
}
function CalendarCellSetCss(a, b) {
    if (a) {
        b.style.border = "1px solid #5589AA";
        b.style.backgroundColor = "#BCD0DE"
    } else {
        b.style.border = "1px solid #FFFFFF";
        b.style.backgroundColor = "#FFFFFF"
    }
}
$(document).bind("click", function () {
    var a = document.getElementById(oCalendarChs.sDIVID);
    var b = document.getElementById(oCalendarChs.bgIframeID);
    b.style.display = a.style.display = "none";
    if (b.style.visibility) {
        b.style.visibility = a.style.visibility = "hide"
    }
});
$("body").delegate("#all_oCalendarChs_Div", "click", function (a) {
    a.stopPropagation()
});
$("body").delegate("input[id$='_from'],input[id$='_to']", "click", function (a) {
    a.stopPropagation()
});
function CalendarGetMaxDay(b, c) {
    var f, d, g, e, a;
    f = c + 1;
    if (f > 11) {
        d = b + 1;
        f = 0
    } else {
        d = b
    }
    g = new Date(b, c, 1);
    e = new Date(d, f, 1);
    a = (e - g) / (24 * 60 * 60 * 1000);
    return a
}
function CalendargetPos(a, b) {
    var c = 0;
    while (a != null) {
        c += a["offset" + b];
        a = a.offsetParent
    }
    return c
}
function CalendarDblNum(a) {
    if (a < 10) {
        return "0" + a
    } else {
        return a
    }
}
function CalendarCancel(a) {
    if (!a) {
        return
    }
    var b = document.getElementById(a.sDIVID);
    var c = document.getElementById(a.bgIframeID);
    try {
        b.style.display = "none";
        c.style.display = "none";
        b.style.visibility = "hide";
        c.style.visibility = "hide"
    } catch (d) {
    }
}
function DocumentClick() {
    if (ActiveInstance) {
        var b = GetEventSrcElement();
        var a = document.getElementById(ActiveInstance.sDIVID);
        if (oCalendarChs.oTaget != b && !Contains(a, b)) {
            CalendarCancel(oCalendarChs)
        }
    }
}
function GetEventSrcElement() {
    if (window.event) {
        return window.event.srcElement
    } else {
        var a = GetEventSrcElement.caller;
        while (a != null) {
            var b = null;
            if (typeof a.arguments != "undefined" && a.arguments.length > 0) {
                b = a.arguments[0];
                if (b != null && b.target != null) {
                    return b.target
                }
            }
            a = a.caller
        }
        return null
    }
}
function Contains(b, a) {
    if (b != null && a != null) {
        if (typeof b.contains != "undefined") {
            return b.contains(a)
        } else {
            while (a != null) {
                a = a.parentNode;
                if (a == b) {
                    return true
                }
            }
            return false
        }
    } else {
        return false
    }
}
function AddElementEvent(d, a, c) {
    if (a != null && d != null) {
        var b = document.getElementById(d);
        if (b) {
            if (window.attachEvent) {
                if (a.substr(0, 2).toLowerCase() != "on") {
                    a = "on" + a
                }
                if (typeof b[a] != "function") {
                    b.attachEvent(a, c)
                }
            }
            if (window.addEventListener) {
                if (a.substr(0, 2).toLowerCase() == "on") {
                    a = a.substr(2)
                }
                b.addEventListener(a, c, false)
            }
        }
    }
};
var JSON;
if (!JSON) {
    JSON = {}
}
(function () {
    function f(n) {
        return n < 10 ? "0" + n : n
    }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case"string":
                return quote(value);
            case"number":
                return isFinite(value) ? String(value) : "null";
            case"boolean":
            case"null":
                return String(value);
            case"object":
                if (!value) {
                    return "null"
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }

    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {"": value})
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({"": j}, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
(function (b) {
    b.fn.colorTip = function (d) {
        var e = {content: "", color: "blue", timeout: 0};
        var f = ["red", "green", "blue", "white", "yellow", "black"];
        d = b.extend(e, d);
        return this.each(function () {
            var j = b(this);
            j.unbind();
            var g = new c();
            var h = new a(d.content);
            j.find("span").remove();
            j.append(h.generate()).addClass("colorTipContainer");
            var k = false;
            for (var m = 0; m < f.length; m++) {
                if (j.hasClass(f[m])) {
                    k = true;
                    break
                }
            }
            if (!k) {
                j.addClass(d.color)
            }
            var l, n;
            j.hover(function () {
                clearTimeout(n);
                l = setTimeout(function () {
                    h.show();
                    g.clear()
                }, 200)
            }, function () {
                clearTimeout(l);
                n = setTimeout(function () {
                    g.set(function () {
                        h.hide()
                    }, d.timeout)
                }, 200)
            })
        })
    };
    function c() {
    }

    c.prototype = {
        set: function (e, d) {
            this.timer = setTimeout(e, d)
        }, clear: function () {
            clearTimeout(this.timer)
        }
    };
    function a(d) {
        this.content = d;
        this.shown = false
    }

    a.prototype = {
        generate: function () {
            return this.tip || (this.tip = b('<span class="colorTip">' + this.content + '<span class="pointyTipShadow"></span><span class="pointyTip"></span></span>'))
        }, show: function () {
            if (this.shown) {
                return
            }
            this.tip.css("margin-left", -this.tip.outerWidth() / 2).fadeIn("fast");
            this.shown = true
        }, hide: function () {
            this.tip.fadeOut();
            this.shown = false
        }
    }
})(jQuery);
