// 可以把isDebug设成true,然后可以看到一些debug信息

// 点集文献页面中人名或者机构名执行的函数
function TurnPageToKnet(d, a, c) {
    // 页面能拿到 d = 'au', a = '朱军', ''
    if (d == null || d == "") {
        d = "kw"
    }
    a = encodeURIComponent(a);
    var b = "/kcms/detail/knetsearch.aspx?sfield={0}&skey={1}&code={2}";
    b = b.format(d, a, c);
    window.open(b, "kcmstarget" + d)
}

// 点集筛选条件,触发展示数据的函数
// ShowData("0332fe66-84ab-4b01-a16e-59363ba070cc","2017","发表年度","%e5%b9%b4")
// ShowData("64b7985d-60cc-4041-9ce2-265b0db157ec","基础与应用基础研究(自科)","研究层次")
function ShowData(ctl, keys, source, orderField) {
    debugger;
    var obj = GroupCommad.g(ctl);
    if (obj == null) {
        window.alert(showdataTip + "!");
        return;
    }

    if (isDebug) {
        alert(obj.value);
    }
    var param = obj.value;
    var dest = wordFenZu + '：' + source + ' ' + wordSHI + ' ' + keys;
    dest = encodeURIComponent(dest);
    var action = 5;
    if (GroupConfig.getIsUseBriefPage()) {
        eval("gridtargetframe = " + gridtargetframeStr); //add by du
    }
    if (isDebug) {
        alert(gridtargetframeStr + "=" + gridtargetpage + "?action=" + action + "&dbPrefix=" + groupDbPrefix + "&Param=" + param + extraParam);
    }
    var dMode;
    if (GroupConfig.getIsUseBriefPage()) {
        dMode = gridtargetframe.match(/DisplayMode\s*?\=[^&\s]*&*/ig);
    }
    else {
        try {
            var doc = GroupCommad.g("Page_next");
            if (doc != null) {
                doc = doc.getAttribute("onclick").toString();
            } else {
                doc = GroupCommad.g("Page_prev").getAttribute("onclick").toString();
            }
            dMode = doc.match(new RegExp(/DisplayMode\s*?\=[^&\s]*&*/ig));
        }
        catch (e) {
        }
    }
    dMode = (dMode == null) ? '' : '&' + dMode;
    setCookie('groupsql', param);
    //modify by du
    var url1 = gridtargetpage + "?ctl=" + ctl + "&dest=" + dest + "&action=" + action + "&dbPrefix=" + groupDbPrefix + "&PageName=" + groupPageName + "&Param=" + param + "&SortType=" + orderField + "&ShowHistory=1" + dMode + extraParam;
    var url2 = gridtargetpage + "?ctl=" + ctl + "&dest=" + dest + "&action=" + action + "&dbPrefix=" + groupDbPrefix + "&PageName=" + groupPageName + "&Param=" + param + dMode + extraParam;
    //end
    if (GroupCommad.g('_LastSelect') != null) {
        var lastSelect = GroupCommad.gVal('_LastSelect');
        GroupCommad.sVal('_LastSelect', SetHengXiangGroupItemClickMart(lastSelect));
    }
    try {
        if (!(orderField == null || orderField == '' || orderField == 'undefined'))
            GroupCommad.HandlerOrPage(gridtargetpage, url1.split("?")[1]);
        else
            GroupCommad.HandlerOrPage(gridtargetpage, url2.split("?")[1]);
        if (GroupConfig.getIsUseBriefPage() && ShowWaitDiv) {
            ShowWaitDiv();
        }
    }
    catch (e) {
    }
}
