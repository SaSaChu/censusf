$(document).ready(function () {
    $.datepicker.setDefaults({ defaultDate: "20211226" });
    $(".month-picker").monthpicker();
    $(".date-picker").datepicker();
    $("[class*=vs_initialForm]").vs_initialForm();
    $.vs_setSelectDefaultValue();
    SetStatusBar();
    $("#btnBack")
        .button()
        .on("click", function (event) {
            $.vs_toHref({
                targetFrame: window.self,
                pageURL: $("#currentUrl").val(),
            });
        });
    $(".btnPage").on("click", activePage);
    $("#btnDspError")
        .button()
        .on("click", function () {
            $("form:first").vs_doSubmit({
                actionPage: "../utility/DspError.jsp",
                targetWin: "_new",
                postMethod: "post",
            });
            $("#trErr").addClass("hidden");
        });
    $("#btnTemp")
        .button()
        .on("click", function () {
            if ($("#spanProc1").hasClass("processbar1")) {
                $("#spanProc1")
                    .removeClass("processbar1")
                    .addClass("processbar2");
            }
            doConfirm(this, "T");
        });
    $("#btnConfirm")
        .button()
        .on("click", function () {
            if ($("#spanProc1").hasClass("processbar1")) {
                $("#spanProc1")
                    .removeClass("processbar1")
                    .addClass("processbar2");
            }
            doConfirm(this, "S");
        });

    $("#btnPrintRec")
        .button()
        .on("click", function () {
            if (
                confirm(
                    "列印回覆聯後，即完成填報作業，將無法再修改資料，\n\n日後若需要修改資料，請電洽行政院主計總處。\n\n按「確定」繼續列印，按「取消」停止列印。"
                )
            ) {
                $("form:first").vs_doSubmit({
                    actionPage: PrintRecPage,
                    targetWin: "_blank",
                    postMethod: "post",
                });
            }
        });

    $("#btnPrintRec").vs_initialForm({ D: 1 });

    $("#btnPrint")
        .button()
        .on("click", function () {
            SetDownloadEncryptCode($(this).prop("id"));
        })
        .vs_initialForm({ D: 1 });
    GetSelectValues();
    Proc_MultiTable();
    Proc_iniFormSet();
    Proc_SetValue();
    Proc_ErrorCheckBind();
    $("#B071,#B072,#B073,#B0745").on("change", AddressChange);
    $(".vs_FullAddress").vs_FullAddress();
    $(".vs_CNS11643").vs_CNS11643();
    $(".vs_BusinessCode").vs_BusinessCode();
    $(".AddTableRow").button();
    $(".ImportMutilRow").button().on("click", ImportMutilRow);
    $(".QuesUploadFile").button().on("click", QuesUploadFile);
    $(".QuesDownloadFile").button().on("click", QuesDownloadFile);
    $(".QuesDeleteFile").button().on("click", QuesDeleteFile);
    $("#btnPageU1").trigger("click");

    $("#StatusBarUnder").height($("#StatusBar").height());
    AutoCountBind();
    AutoTabSet(GetAutoTabSetting());
    if (isViewMode) {
        $(":input:not(#btnBack,#btnCloseLastMonth, .btnPage)").vs_initialForm({
            D: 1,
        });
    }

    LastLoad();
});
function CheckOk() {
    $("#trErr").addClass("hidden");

    alert(
        "此問卷資料已初步審核通過，本問卷傳送成功，感謝您的填報。\n審核人員將進一步檢視您的填報資料，若有疑問，將與您聯繫確認"
    );

    AfterCheckOk();
}
function AfterCheckOk() {
    $("#spanProc1").removeClass("processbar1").addClass("processbar2");
    $("#spanProc2").removeClass("processbar1").addClass("processbar2");
    $("#spanProc3").removeClass("processbar1").addClass("processbar2");
    $("#spanSatus").text("已填報完成");

    $("#btnPrintRec").vs_initialForm({ D: 0 });

    $("#btnTemp").vs_initialForm({ D: 1 });
    $("#btnPrint").vs_initialForm({ D: 0 });
}

function AfterPrint() {
    if ($("#spanProc4").hasClass("processbar1")) {
        $("#spanProc4").removeClass("processbar1").addClass("processbar2");
    }
    $(":input:not(#btnBack,.btnPage,#btnPrintRec,#btnPrint)").vs_initialForm({
        D: 1,
    });
}

function LastLoad() {
    INI_ENABLE_FLD();
    $(".vs_BusinessCode").on("blur", BusinessCodeBlur);
    $(".vs_BusinessCode:first").trigger("blur");

    $("[name=_340000]:checked").trigger("click");

    formObjectAddon();
}

function doConfirm(pBtn, pMod) {
    if (
        (pMod == "T" || pMod == "T1") &&
        $("#spanProc3").hasClass("processbar2")
    ) {
        return;
    }
    if (pMod == "S") {
        if (!AutoCountConfirm()) return;
    }
    $("#mod").val(pMod);
    $(pBtn).vs_initialForm({ D: 1 });
    $("#spanProc3").removeClass("processbar2").addClass("processbar1");
    $("#spanSatus").text("未填報完成");
    $("#btnTemp").vs_initialForm({ D: 0 });
    $("#btnPrintRec").vs_initialForm({ D: 1 });
    if (!isAlwaysPrint) {
        $("#btnPrint").vs_initialForm({ D: 1 });
    }
    if (doCheck()) {
        doSave();
    }
    $(pBtn).delay(1500, function () {
        $(this).vs_initialForm({ D: 0 });
    });
}

function doCheck() {
    if ($.active > 0) {
        alert("背景資料正在處理,請稍後");
        return false;
    }
    $("[class*=vs_formValidate]").vs_formValidate();
    if ($.vs_showDivAlert({ resetZindex: true, order: "desc" }) > 0) {
        //重設z-index回傳alertDiv總數量
        $("div.divAlert:first")
            .vs_findDivAlertParent()
            .vs_scroll_Focus({ showDivAlert: true });
        return false;
    }
    return true;
}

function doSave() {
    var pPage = "";
    if (isViewMode) {
        return false;
    }
    if (isEditMode) {
        pPage = modActionPage;
    }
    $("input[type=checkbox]:disabled,input[type=radio]:disabled")
        .addClass("TempDisabledElement")
        .attr("disabled", false);
    var AddFormFld = ",";
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].type.match(/^(checkbox|radio)$/)) {
            if (!document.forms[0].elements[i].disabled) {
                if (
                    AddFormFld.indexOf(
                        "," + document.forms[0].elements[i].name + ","
                    ) == -1
                ) {
                    AddFormFld += document.forms[0].elements[i].name + ",";
                }
            }
        }
    }
    $("#AddFormFld").val(AddFormFld);
    clearEnter();
    if ($("#mod").val() != "T1") {
        $.vs_dialogStart({ dialogMassage: "執行中" });
    }
    $("form:first").vs_doSubmit({
        actionPage: pPage,
        targetWin: "hideFrame",
        postMethod: "post",
    });
    $(".TempDisabledElement")
        .attr("disabled", true)
        .removeClass("TempDisabledElement");
}

function Proc_SetValue() {
    SetValue("_000000", "4");
    SetValue("_030101", "1");
    SetValue("_030300", "1");
    SetValue("_030301", "1");
    SetValue("_030400", "1");
    SetValue("_130200", "1");
    SetValue("_310100", "0201");
    SetValue("_310200", "001");
    SetValue("_310300", "0038");
    SetValue("_320000", "A000038");
    SetValue("_340000", "8");
    SetValue("B06", "\u694A\uFF2F\u965E");
    SetValue("B061", "cho");
    SetValue("B063", "cho");
    SetValue("B067", "1");
    SetValue("B071", "\u82B1\u84EE\u7E23");
    SetValue("B072", "\u7389\u91CC\u93AE");
    SetValue("B073", "\u4E09\u6C11\u91CC");
    SetValue("B074", "\u4E09\u6C11");
    SetValue("B079", "\uFF12");
    SetValue("B07E", "\u4E8C");
    SetValue("B07F", "\uFF15");
    SetValue(
        "B07Z",
        "\u82B1\u84EE\u7E23\u7389\u91CC\u93AE\u4E09\u6C11\u91CC\u4E09\u6C11\uFF12\u865F\u4E8C\u6A13\u4E4B\uFF15"
    );
    SetValue(
        "B07Z_BR",
        "\u82B1\u84EE\u7E23\u7389\u91CC\u93AE\u4E09\u6C11\u91CC\u4E09\u6C11\uFF12\u865F\u4E8C\u6A13\u4E4B\uFF15"
    );
    SetValue("GENDER", "1");
    SetValue("SURVEY_TYPE", "A");
    SetValue("UNIT", "\uFF2F\uFF2F\u4F01\u696D\u793E");
    $(".vs_NeedFormatString")
        .each(function () {
            this.value = FormatString(this.value, this.decmalLength);
        })
        .removeClass("vs_NeedFormatString");
}

function Proc_ErrorCheckBind() {
    $("#_350000").on("keyup", function (event) {
        var n1 = $(this).val().replace(/[^\d]/, "");
        $(this).val($(this).val().replace(/[^\d]/g, ""));
    });
    $("#_360000").on("keyup", function (event) {
        var n1 = $(this).val().replace(/[^\d]/, "");
        $(this).val($(this).val().replace(/[^\d]/g, ""));
    });
}

function Proc_MultiTable() {}
//	108/09/25 ## 修改加上下載密碼輸入提示.
function SetDownloadEncryptCodeOK() {
    var obj = $("#" + $("#_EncryptCode").prop("ClickId"));
    obj.vs_initialForm({ D: 1 });
    $("form:first").vs_doSubmit({
        actionPage: PrintPage,
        targetWin: "_self",
        postMethod: "post",
    });
    obj.delay(3000, function () {
        obj.vs_initialForm({ D: 0 });
    });
}
//	108/09/25 ## 修改 End.
function GetAutoTabSetting() {
    var s = "";
    return s;
}

function init() {
    var FillType = $("#SurveyFillType").val();
    //alert(FillType);
    if (FillType == "0") {
        var _340000 = "" + $("input[id='_340000']:checked").val();
        var Code31 = "" + $("#_030101").val();
        var Code33 = "" + $("#_030301").val();
        var _030210 = "" + $("#_030210").val();
        //alert(_030210);

        $(".btn_ex").button();
        $("button.btn_det")
            .button({
                icons: { primary: "ui-icon-help" },
                label: "檢視",
                text: false,
            })
            .on("click", function (event) {
                //OpenIll("Q31");
                //OpenQues("ics_Q",'1');
                return false;
            });

        if (
            $("#currentUrl").val() != "" &&
            $("#currentUrl").val().indexOf("ENT8010p") == -1
        ) {
            //後端
            if (_340000 == "1" || _340000 == "8") {
                $("#_360000").prop("readOnly", true);
                $("input[id^='_060100']").prop("disabled", false);
                $("#btnPageU2,#btnPageD2").vs_initialForm({ D: 0 });
            } else if (_340000 == "2" || _340000 == "3") {
                $("#btnPageU2,#btnPageD2").vs_initialForm({ D: 1 });
            } else {
                $("#btnPageU2,#btnPageD2").vs_initialForm({ D: 1 });
                $("#_360000").prop("readOnly", true);
                Myfunction021();
            }
            Myfunction020(); //Q5、Q6、Q8、Q9
            BusinessCodeBlur();
        } else {
            //前端
            if (_340000 == "1" || _340000 == "8") {
                $("#_360000").prop("readOnly", true);
                $("input[id^='_060100']").prop("disabled", false);
                $(
                    "#btnPageU2,#btnPageU3,#btnPageU4,#btnPageD2,#btnPageD3,#btnPageD4"
                ).vs_initialForm({ D: 0 });
            } else if (_340000 == "2" || _340000 == "3") {
                if (_340000 == "2") {
                    $("#_360000").prop("readOnly", false);
                } else {
                    $("#_360000").prop("readOnly", true);
                }
                $(
                    "#btnPageU2,#btnPageU3,#btnPageU4,#btnPageD2,#btnPageD3,#btnPageD4"
                ).vs_initialForm({ D: 1 });
                Myfunction021();
            } else {
                $(
                    "#btnPageU2,#btnPageU3,#btnPageU4,#btnPageD2,#btnPageD3,#btnPageD4"
                ).vs_initialForm({ D: 1 });
                Myfunction021();
            }
            //alert(Code31);
            Myfunction020(); //Q5、Q6、Q8、Q9
            Myfunction03();
        }

        //前端問項三連動問十~十三
        if (Code31 == "1") {
            $(".ShowM11").removeClass("hidden");
        } else if (Code31 == "2") {
            $(".ShowM12").removeClass("hidden");
        } else if (Code31 == "3") {
            $(".ShowM13").removeClass("hidden");
        } else if (Code31 == "4") {
            $(".ShowM14").removeClass("hidden");
        } else if (Code31 == "5") {
            $(".ShowM15").removeClass("hidden");
        } else if (Code31 == "6") {
            $(".ShowM16").removeClass("hidden");
        }

        if (Code33 == "1") {
            $(".ShowM31").removeClass("hidden");
        } else if (Code33 == "2") {
            $(".ShowM32").removeClass("hidden");
        } else if (Code33 == "3") {
            $(".ShowM33").removeClass("hidden");
        } else if (Code33 == "4") {
            $(".ShowM34").removeClass("hidden");
        } else if (Code33 == "5") {
            $(".ShowM35").removeClass("hidden");
        } else if (Code33 == "6") {
            $(".ShowM36").removeClass("hidden");
        }
        Myfunction13();
        formObjectAddon();
    } else if (FillType == "1" || FillType == "A") {
        Myfunction1_09(); //Q9
        Myfunction1_15(); //附記
        /*if(Code1>='0811'&&Code1<='3400'){	
if(FillType=='A'){
}else{
}			
}else{		
}*/
        formObjectAddon();
    } else if (FillType == "3" || FillType == "C") {
        Myfunction1_09(); //Q9
        Myfunction1_15(); //附記
        /*if((Code1>='4510'&&Code1<='4699')||(Code1>='4711'&&Code1<='4879')||(Code2>='4510'&&Code2<='4699')||(Code2>='4711'&&Code2<='4879')){
}else{	
}
if((Code1>='4510'&&Code1<='4699')||(Code1>='4711'&&Code1<='4879')){	
}else{	
}*/
        formObjectAddon();
    } else {
        Myfunction1_09(); //Q9
        Myfunction1_15(); //附記
        formObjectAddon();
    }
    formObjectAddon();
}
//業別代號連動問項不清除問項10、11、12、13
function BusinessCodeBlur() {
    //if(isViewMode || isDeleteMode){
    //	return;
    //}
    var Code1, Code2;
    var FillType = $("#SurveyFillType").val();
    Code1 = $("#_360100").val();
    Code2 = $("#_360200").val();
    Code31 = $("#_030101").val();
    Code33 = $("#_030301").val();
    var _100001 = "" + $("#_100001").val();
    var _100800 = "" + $("#_100800").val();
    var _110200 = "" + $("#_110200").val();

    if (FillType == "0") {
        if (
            (Code1 >= "0811" && Code1 <= "3400") ||
            (Code2 >= "0811" && Code2 <= "3400")
        ) {
            $("#_360300,#_360301,#_360302,#_360303,#_360304").prop(
                "disabled",
                false
            );
        } else {
            $("#_360301,#_360302,#_360303,#_360304")
                .prop("disabled", true)
                .prop("checked", false);
            $("#_360300").prop("disabled", true).val("");
        }
        if ((Code31 != "" || Code33 != "") && Code1 == "" && Code2 == "") {
            Myfunction03();
        } else {
            if (
                (Code1 >= "4510" && Code1 <= "4879") ||
                (Code2 >= "4510" && Code2 <= "4879")
            ) {
                $("input[id='_100001'],input[id='_100002']").prop(
                    "disabled",
                    false
                );
                if (_100001 == "1") {
                    $(
                        "input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
                    ).prop("disabled", false);
                    if (_100800 == "1") {
                        $("input[id='_100899']").prop("readOnly", false);
                    } else {
                        $("input[id='_100899']").prop("readOnly", true);
                    }
                } else {
                    $(
                        "input[id='_100001'],input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
                    ).prop("disabled", true);
                    $("input[id='_100899']").prop("readOnly", true);
                }
                //$('.ShowF1').addClass("hidden");
            } else {
                $(
                    "input[id='_100001'],input[id='_100002'],input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
                ).prop("disabled", true);
                $("input[id='_100899']").prop("readOnly", true);
                //$('.ShowF1').removeClass("hidden");
            }
            if (
                (Code1 >= "0811" && Code1 <= "3400") ||
                (Code1 >= "4510" && Code1 <= "4879") ||
                (Code2 >= "0811" && Code2 <= "3400") ||
                (Code2 >= "4510" && Code2 <= "4879")
            ) {
                $("input[id^='_110100'],input[id^='_110200']").prop(
                    "disabled",
                    false
                );
                if (_110200 == "1") {
                    $("#_110201,#_110202").prop("readOnly", false);
                } else {
                    $("#_110201,#_110202").prop("readOnly", true);
                }
                //$('.ShowF2').addClass("hidden");
            } else {
                $("input[id^='_110100'],input[id^='_110200']").prop(
                    "disabled",
                    true
                );
                $("#_110201,#_110202").prop("readOnly", true);
                //$('.ShowF2').removeClass("hidden");
            }
            if (
                (Code1 >= "0811" && Code1 <= "3400") ||
                (Code1 >= "4100" && Code1 <= "4390") ||
                (Code2 >= "0811" && Code2 <= "3400") ||
                (Code2 >= "4100" && Code2 <= "4390")
            ) {
                $(
                    "input[id^='_120100'],input[id^='_120200'],input[id^='_120300']"
                ).prop("disabled", false);
                //$('.ShowF3').addClass("hidden");
            } else {
                $(
                    "input[id^='_120100'],input[id^='_120200'],input[id^='_120300']"
                ).prop("disabled", true);
                //$('.ShowF3').removeClass("hidden");
            }
        }
    } else if (FillType == "1" || FillType == "A") {
        if (Code1 >= "0811" && Code1 <= "3400") {
            if (FillType == "A") {
            } else {
            }
        } else {
        }
    } else if (FillType == "3" || FillType == "C") {
        if (
            (Code1 >= "4510" && Code1 <= "4699") ||
            (Code1 >= "4711" && Code1 <= "4879") ||
            (Code2 >= "4510" && Code2 <= "4699") ||
            (Code2 >= "4711" && Code2 <= "4879")
        ) {
        } else {
        }
        if (
            (Code1 >= "4510" && Code1 <= "4699") ||
            (Code1 >= "4711" && Code1 <= "4879")
        ) {
        } else {
        }
    }
    formObjectAddon();
}

//觸發自動加總and AutoBlur
function AutoCountBind() {
    var FillType = $("#SurveyFillType").val();
    //地址
    $("#B07Z").vs_FullAddress();
    //$('#B061').vs_CNS11643();

    $("input[id='BR']").on("click", function (event) {
        var BR = "" + $("input[id='BR']:checked").val();
        if (BR == "1") {
            $("#B07Z_BR").val($("#B07Z").val()).prop("readOnly", true);
        } else {
            $("#B07Z_BR").prop("readOnly", false);
        }
        formObjectAddon();
    });
    init();

    if (FillType == "0") {
        //B067,BR
        $("input[id='B067']").on("click", function (event) {
            var B067 = "" + $("input[id='B067']:checked").val();
            if (B067 == "1") {
                $("#B063").val($("#B061").val()).prop("readOnly", true);
                $("#B064").val($("#B062").val()).prop("readOnly", true);
            } else {
                $("#B063").prop("readOnly", false);
                $("#B064").prop("readOnly", false);
            }
            formObjectAddon();
        });
        /*$("input[id='BR']").on("click", function (event) { 	
var BR="" + $("input[id='BR']:checked").val();
if(BR=='1'){
	$("#B07Z_BR").val($("#B07Z").val()).prop("readOnly", true);	
}else{
	$("#B07Z_BR").prop("readOnly", false);			
}	
formObjectAddon();			
});*/
        //營利事業暨扣繳單位統一編號
        $("input[id='_130200'],input[id='_350000']").on(
            "click",
            function (event) {
                _350000 = $("#_350000").val();
                var _130200 = "" + $("input[id='_130200']:checked").val();
                if (
                    _130200 == "1" &&
                    (_350000 == "" || _350000 == "00000000")
                ) {
                    $("#_350000").prop("readOnly", true);
                } else {
                    $("#_350000").prop("readOnly", false).val("");
                }
                formObjectAddon();
            }
        );
        //單位級別
        $("input[id='_340000']").on("click", function (event) {
            var _340000 = "" + $("input[id='_340000']:checked").val();

            if (_340000 == "1" || _340000 == "8") {
                if (
                    $("#currentUrl").val() != "" &&
                    $("#currentUrl").val().indexOf("ENT8010p") == -1
                ) {
                    //後端
                    $("#btnPageU2,#btnPageD2").vs_initialForm({ D: 0 });
                } else {
                    //前端
                    $(
                        "#btnPageU2,#btnPageU3,#btnPageU4,#btnPageD2,#btnPageD3,#btnPageD4"
                    ).vs_initialForm({ D: 0 });
                }
                $(
                    "input[id^='_050100'],input[id^='_050200'],input[id^='_060100']"
                ).prop("disabled", false);
                $("#_360000").prop("readOnly", true);
                Myfunction020(); //Q5、Q6、Q8、Q9
                Myfunction03(); //Q10~Q13
            } else if (_340000 == "2") {
                if (
                    $("#currentUrl").val() != "" &&
                    $("#currentUrl").val().indexOf("ENT8010p") == -1
                ) {
                    //後端
                    $("#btnPageU2,#btnPageD2").vs_initialForm({ D: 1 });
                } else {
                    //前端
                    $(
                        "#btnPageU2,#btnPageU3,#btnPageU4,#btnPageD2,#btnPageD3,#btnPageD4"
                    ).vs_initialForm({ D: 1 });
                }
                $("#_360000").prop("readOnly", false);
                $(
                    "input[id^='_050100'],input[id^='_050200'],input[id^='_060100']"
                ).prop("disabled", true);
                Myfunction021();
            } else {
                if (
                    $("#currentUrl").val() != "" &&
                    $("#currentUrl").val().indexOf("ENT8010p") == -1
                ) {
                    //後端
                    $("#btnPageU2,#btnPageD2").vs_initialForm({ D: 1 });
                } else {
                    //前端
                    $(
                        "#btnPageU2,#btnPageU3,#btnPageU4,#btnPageD2,#btnPageD3,#btnPageD4"
                    ).vs_initialForm({ D: 1 });
                }
                $("#_360000").prop("readOnly", true);
                $(
                    "input[id^='_050100'],input[id^='_050200'],input[id^='_060100']"
                ).prop("disabled", false);
                Myfunction021();
            }
            formObjectAddon();
        });
        //問項三
        $(
            "#_030101,#_030210,#_030216,#_030231,#_030232,#_030233,#_030241,#_030251,#_030252,#_030253"
        ).on("change", function (event) {
            var Code31 = "" + $("#_030101").val();
            var Code33 = "" + $("#_030301").val();
            var _030210 = "" + $("#_030210").val();
            var _030211 = "" + $("input[id='_030211']:checked").val();
            var _030212 = "" + $("input[id='_030212']:checked").val();
            var _030213 = "" + $("input[id='_030213']:checked").val();
            var _030214 = "" + $("input[id='_030214']:checked").val();
            var _030231 = "" + $("#_030231").val();
            var _030241 = "" + $("#_030241").val();
            var _030251 = "" + $("#_030251").val();

            if (Code31 == "1") {
                $("#_030211,#_030212,#_030213,#_030214").prop(
                    "disabled",
                    false
                );
                if (_030210 == "1" || _030210 == "3" || _030210 == "4") {
                    $("#_030215,#_030216").prop("readOnly", false);
                } else if (_030210 == "2") {
                    $("#_030215").prop("readOnly", false);
                    $("#_030216").prop("readOnly", true).val("");
                } else {
                    $("#_030215,#_030216").prop("readOnly", false).val("");
                }
                $(".ShowM11").removeClass("hidden");
                $(".ShowM12").addClass("hidden");
                $(".ShowM13").addClass("hidden");
                $(".ShowM14").addClass("hidden");
                $(".ShowM15").addClass("hidden");
                $(".ShowM16").addClass("hidden");
                Myfunction311();
            } else if (Code31 == "2") {
                $(".ShowM12").removeClass("hidden");
                $(".ShowM11").addClass("hidden");
                $(".ShowM13").addClass("hidden");
                $(".ShowM14").addClass("hidden");
                $(".ShowM15").addClass("hidden");
                $(".ShowM16").addClass("hidden");
                Myfunction312();
            } else if (Code31 == "3") {
                if (_030231 == "1") {
                    $("#_030232").prop("disabled", false);
                    $("#_030233").prop("disabled", true).val("");
                } else if (_030231 == "2") {
                    $("#_030232").prop("disabled", true).val("");
                    $("#_030233").prop("disabled", false);
                } else {
                    $("#_030232,#_030233").prop("disabled", false).val("");
                    $("#_030234").prop("readOnly", false).val("");
                }
                $(".ShowM13").removeClass("hidden");
                $(".ShowM11").addClass("hidden");
                $(".ShowM12").addClass("hidden");
                $(".ShowM14").addClass("hidden");
                $(".ShowM15").addClass("hidden");
                $(".ShowM16").addClass("hidden");
                Myfunction313();
            } else if (Code31 == "4") {
                if (_030241 == "1" || _030241 == "2") {
                    $("#_030243").prop("readOnly", false);
                    $("#_030242").prop("readOnly", true).val("");
                } else if (_030241 == "3") {
                    $("#_030242").prop("readOnly", false);
                    $("#_030243").prop("readOnly", true).val("");
                } else {
                    $("#_030243").prop("readOnly", false).val("");
                    $("#_030242").prop("readOnly", false).val("");
                }
                $(".ShowM14").removeClass("hidden");
                $(".ShowM11").addClass("hidden");
                $(".ShowM12").addClass("hidden");
                $(".ShowM13").addClass("hidden");
                $(".ShowM15").addClass("hidden");
                $(".ShowM16").addClass("hidden");
                Myfunction314();
            } else if (Code31 == "5") {
                if (_030251 == "2" || _030251 == "3") {
                    $("#_030253").prop("disabled", false);
                } else {
                    $("#_030253").prop("disabled", true).val("");
                }
                $(".ShowM15").removeClass("hidden");
                $(".ShowM11").addClass("hidden");
                $(".ShowM12").addClass("hidden");
                $(".ShowM13").addClass("hidden");
                $(".ShowM14").addClass("hidden");
                $(".ShowM16").addClass("hidden");
                Myfunction315();
            } else if (Code31 == "6") {
                $(".ShowM16").removeClass("hidden");
                $(".ShowM11").addClass("hidden");
                $(".ShowM12").addClass("hidden");
                $(".ShowM13").addClass("hidden");
                $(".ShowM14").addClass("hidden");
                $(".ShowM15").addClass("hidden");
                Myfunction316();
            } else {
                $(".ShowM11").addClass("hidden");
                $(".ShowM12").addClass("hidden");
                $(".ShowM13").addClass("hidden");
                $(".ShowM14").addClass("hidden");
                $(".ShowM15").addClass("hidden");
                $(".ShowM16").addClass("hidden");
                Myfunction310();
            }
            Myfunction03();
            formObjectAddon();
        });
        $(
            "#_030300,#_030301,#_030310,#_030316,#_030331,#_030332,#_030333,#_030341,#_030351,#_030352,#_030353"
        ).on("change", function (event) {
            var _030300 = "" + $("#_030300").val();
            if (_030300 == "1") {
                $("#_030301").prop("disabled", false);
            } else {
                $("#_030301").prop("disabled", true).val("");
            }

            var Code33 = "" + $("#_030301").val();
            var _030310 = "" + $("#_030310").val();
            var _030311 = "" + $("input[id='_030311']:checked").val();
            var _030312 = "" + $("input[id='_030312']:checked").val();
            var _030313 = "" + $("input[id='_030313']:checked").val();
            var _030314 = "" + $("input[id='_030314']:checked").val();
            var _030331 = "" + $("#_030331").val();
            var _030341 = "" + $("#_030341").val();
            var _030351 = "" + $("#_030351").val();

            if (Code33 == "1") {
                $("#_030311,#_030312,#_030313,#_030314").prop(
                    "disabled",
                    false
                );
                if (_030310 == "1" || _030310 == "3" || _030310 == "4") {
                    $("#_030315,#_030316").prop("readOnly", false);
                } else if (_030310 == "2") {
                    $("#_030315").prop("readOnly", false);
                    $("#_030316").prop("readOnly", true).val("");
                } else {
                    $("#_030315,#_030316").prop("readOnly", false).val("");
                }
                $(".ShowM31").removeClass("hidden");
                $(".ShowM32").addClass("hidden");
                $(".ShowM33").addClass("hidden");
                $(".ShowM34").addClass("hidden");
                $(".ShowM35").addClass("hidden");
                $(".ShowM36").addClass("hidden");
                Myfunction331();
            } else if (Code33 == "2") {
                $(".ShowM32").removeClass("hidden");
                $(".ShowM31").addClass("hidden");
                $(".ShowM33").addClass("hidden");
                $(".ShowM34").addClass("hidden");
                $(".ShowM35").addClass("hidden");
                $(".ShowM36").addClass("hidden");
                Myfunction332();
            } else if (Code33 == "3") {
                if (_030331 == "1") {
                    $("#_030332").prop("disabled", false);
                    $("#_030333").prop("disabled", true).val("");
                } else if (_030331 == "2") {
                    $("#_030332").prop("disabled", true).val("");
                    $("#_030333").prop("disabled", false);
                } else {
                    $("#_030332,#_030333").prop("disabled", false).val("");
                    $("#_030334").prop("readOnly", false).val("");
                }
                $(".ShowM33").removeClass("hidden");
                $(".ShowM31").addClass("hidden");
                $(".ShowM32").addClass("hidden");
                $(".ShowM34").addClass("hidden");
                $(".ShowM35").addClass("hidden");
                $(".ShowM36").addClass("hidden");
                Myfunction333();
            } else if (Code33 == "4") {
                if (_030341 == "1" || _030341 == "2") {
                    $("#_030343").prop("readOnly", false);
                    $("#_030342").prop("readOnly", true).val("");
                } else if (_030341 == "3") {
                    $("#_030342").prop("readOnly", false);
                    $("#_030343").prop("readOnly", true).val("");
                } else {
                    $("#_030343").prop("readOnly", false).val("");
                    $("#_030342").prop("readOnly", false).val("");
                }
                $(".ShowM34").removeClass("hidden");
                $(".ShowM31").addClass("hidden");
                $(".ShowM32").addClass("hidden");
                $(".ShowM33").addClass("hidden");
                $(".ShowM35").addClass("hidden");
                $(".ShowM36").addClass("hidden");
                Myfunction334();
            } else if (Code33 == "5") {
                if (_030351 == "2" || _030351 == "3") {
                    $("#_030353").prop("disabled", false);
                } else {
                    $("#_030353").prop("disabled", true).val("");
                }
                $(".ShowM35").removeClass("hidden");
                $(".ShowM31").addClass("hidden");
                $(".ShowM32").addClass("hidden");
                $(".ShowM33").addClass("hidden");
                $(".ShowM34").addClass("hidden");
                $(".ShowM36").addClass("hidden");
                Myfunction335();
            } else if (Code33 == "6") {
                $(".ShowM36").removeClass("hidden");
                $(".ShowM31").addClass("hidden");
                $(".ShowM32").addClass("hidden");
                $(".ShowM33").addClass("hidden");
                $(".ShowM34").addClass("hidden");
                $(".ShowM35").addClass("hidden");
                Myfunction336();
            } else {
                $(".ShowM31").addClass("hidden");
                $(".ShowM32").addClass("hidden");
                $(".ShowM33").addClass("hidden");
                $(".ShowM34").addClass("hidden");
                $(".ShowM35").addClass("hidden");
                $(".ShowM36").addClass("hidden");
                Myfunction330();
            }
            Myfunction03();
            formObjectAddon();
        });
        //問項六
        $("input[id='_060100']").on("click", function (event) {
            var _060100 = "" + $("input[id='_060100']:checked").val();
            if (_060100 == "1") {
                $(
                    "input[id^='_060200'],input[id^='_060300'],input[id^='_060400'],input[id^='_060500'],input[id^='_060600']"
                ).prop("disabled", false);
            } else {
                $(
                    "input[id^='_060200'],input[id^='_060300'],input[id^='_060400'],input[id^='_060500'],input[id^='_0606'],input[id^='_060320'],input[id^='_060330'],input[id^='_060611'],input[id^='_060612']"
                )
                    .prop("disabled", true)
                    .prop("checked", false);
                $("input[id='_060501'],input[id='_060502'],input[id='_060503']")
                    .prop("disabled", true)
                    .prop("checked", false);
                $(
                    "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
                ).val("");
                $(
                    "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
                ).prop("disabled", true);
                $("#_060311,#_069999").prop("readOnly", true).val("");
            }
            formObjectAddon();
        });
        //_060500
        $("input[id='_060500']").on("click", function (event) {
            var _060500 = "" + $("input[id='_060500']:checked").val();
            if (_060500 == "1") {
                $(
                    "input[id='_060501'],input[id='_060502'],input[id='_060503']"
                ).prop("disabled", false);
            } else {
                $("input[id='_060501'],input[id='_060502'],input[id='_060503']")
                    .prop("disabled", true)
                    .prop("checked", false);
            }
            formObjectAddon();
        });
        //_060600
        $("input[id='_060600']").on("click", function (event) {
            var _060600 = "" + $("input[id='_060600']:checked").val();
            if (_060600 == "2") {
                $("input[id^=_06061]").prop("disabled", false);
            } else {
                $("input[id^=_06061]")
                    .prop("disabled", true)
                    .prop("checked", false);
                $(
                    "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
                ).val("");
                $(
                    "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
                ).prop("disabled", true);
                $("input[id='_069999']").prop("readOnly", true).val("");
            }
            formObjectAddon();
        });
        //_060612
        $("input[id='_060612']").on("click", function (event) {
            var _060612 = "" + $("input[id='_060612']:checked").val();
            if (_060612 == "1") {
                $(
                    "input[id='_060620'],input[id='_060630'],input[id='_060640'],input[id='_060650'],input[id='_060660'],input[id='_060670']"
                ).prop("disabled", false);
            } else {
                $(
                    "input[id='_060620'],input[id='_060630'],input[id='_060640'],input[id='_060650'],input[id='_060660'],input[id='_060670']"
                )
                    .prop("disabled", true)
                    .prop("checked", false);
                $(
                    "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
                ).val("");
                $(
                    "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
                ).prop("disabled", true);
                $("input[id='_069999']").prop("readOnly", true).val("");
            }
            formObjectAddon();
        });
        //_060620~_060690
        $("#_060620,#_060630,#_060640,#_060650,#_060660").on(
            "click",
            function (event) {
                var _060620 = "" + $("input[id='_060620']").prop("checked");
                var _060630 = "" + $("input[id='_060630']").prop("checked");
                var _060640 = "" + $("input[id='_060640']").prop("checked");
                var _060650 = "" + $("input[id='_060650']").prop("checked");
                var _060660 = "" + $("input[id='_060660']").prop("checked");

                if (_060620 == "true") {
                    $("#_060621").prop("disabled", false);
                } else {
                    $("#_060621,#_060622").val("").prop("disabled", true);
                }
                if (_060630 == "true") {
                    $("#_060631").prop("disabled", false);
                } else {
                    $("#_060631,#_060632").val("").prop("disabled", true);
                }
                if (_060640 == "true") {
                    $("#_060641").prop("disabled", false);
                } else {
                    $("#_060641,#_060642").val("").prop("disabled", true);
                }
                if (_060650 == "true") {
                    $("#_060651").prop("disabled", false);
                } else {
                    $("#_060651,#_060652").val("").prop("disabled", true);
                }
                if (_060660 == "true") {
                    $("#_060661").prop("disabled", false);
                } else {
                    $("#_060661,#_060662").val("").prop("disabled", true);
                }
                Myfunction_Q069999();
                formObjectAddon();
            }
        );
        //_060621~_060692
        $(
            "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662,#_069999"
        ).on("click", function (event) {
            var _060621 = "" + $("#_060621").val();
            var _060622 = "" + $("#_060622").val();
            var _060631 = "" + $("#_060631").val();
            var _060632 = "" + $("#_060632").val();
            var _060641 = "" + $("#_060641").val();
            var _060642 = "" + $("#_060642").val();
            var _060651 = "" + $("#_060651").val();
            var _060652 = "" + $("#_060652").val();
            var _060661 = "" + $("#_060661").val();
            var _060662 = "" + $("#_060662").val();

            if (_060621 == "") {
                $("#_060622").prop("disabled", true).val("");
            } else if (_060621 != "" && _060621 == _060622) {
                alert("請選擇不同的運用作業");
                $("#_060622").val("");
            } else {
                $("#_060622").prop("disabled", false);
            }
            if (_060631 == "") {
                $("#_060632").prop("disabled", true).val("");
            } else if (_060631 != "" && _060631 == _060632) {
                alert("請選擇不同的運用作業");
                $("#_060632").val("");
            } else {
                $("#_060632").prop("disabled", false);
            }
            if (_060641 == "") {
                $("#_060642").prop("disabled", true).val("");
            } else if (_060641 != "" && _060641 == _060642) {
                alert("請選擇不同的運用作業");
                $("#_060642").val("");
            } else {
                $("#_060642").prop("disabled", false);
            }
            if (_060651 == "") {
                $("#_060652").prop("disabled", true).val("");
            } else if (_060651 != "" && _060651 == _060652) {
                alert("請選擇不同的運用作業");
                $("#_060652").val("");
            } else {
                $("#_060652").prop("disabled", false);
            }

            if (_060661 == "") {
                $("#_060662").prop("disabled", true).val("");
            } else if (_060661 != "" && _060661 == _060662) {
                alert("請選擇不同的運用作業");
                $("#_060662").val("");
            } else {
                $("#_060662").prop("disabled", false);
            }

            Myfunction_Q069999();
            formObjectAddon();
        });

        //問項十100000
        $("input[name='_100001']").on("click", function (event) {
            var _100001 = "" + $("input[name='_100001']:checked").val();
            if (_100001 == "1") {
                $(
                    "input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
                ).prop("disabled", false);
            } else {
                $(
                    "input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
                )
                    .prop("disabled", true)
                    .prop("checked", false);
                $("input[id='_100899']").prop("readOnly", true).val("");
            }
            formObjectAddon();
        });
        //附記
        $("input[id='_130400']").on("click", function (event) {
            var _130400 = "" + $("input[id='_130400']:checked").val();
            if (_130400 == "1") {
                $(
                    "input[id='_130410'],input[id='_130412'],input[id='_130421'],input[id='_130424'],input[id='_130430']"
                ).prop("disabled", false);
            } else {
                $(
                    "input[id='_130410'],input[id='_130412'],input[id='_130421'],input[id='_130424'],input[id='_130430']"
                )
                    .prop("disabled", false)
                    .prop("checked", false);
                $("#_130411,#_130422,#_130423,#_130425,#_130426,#_130499")
                    .prop("readOnly", true)
                    .val("");
            }
            formObjectAddon();
        });
    } else if (FillType == "1") {
        MyfunctionQ00(); //_35
        MyfunctionQ09(); //問項九
        MyfunctionQ15(); //附記
    } else if (FillType == "2") {
        MyfunctionQ00(); //_35
        MyfunctionQ09(); //問項九
        MyfunctionQ15(); //附記
    } else if (FillType == "3") {
        MyfunctionQ00(); //_35
        MyfunctionQ09(); //問項九
        MyfunctionQ15(); //附記
    } else if (FillType == "4") {
        MyfunctionQ00(); //_35
        MyfunctionQ09(); //問項九
        MyfunctionQ15(); //附記
    } else if (FillType == "5") {
        MyfunctionQ00(); //_35
        MyfunctionQ09(); //問項九
        MyfunctionQ15(); //附記
    } else if (FillType == "6") {
        MyfunctionQ00(); //_35
        MyfunctionQ09(); //問項九
        MyfunctionQ15(); //附記
    } else if (FillType == "7") {
        MyfunctionQ00(); //_35
        MyfunctionQ09(); //問項九
        MyfunctionQ15(); //附記
    } else if (FillType == "8") {
    } else if (FillType == "A") {
    } else if (FillType == "B") {
    } else if (FillType == "C") {
    } else if (FillType == "D") {
    } else if (FillType == "E") {
    } else if (FillType == "F") {
    } else if (FillType == "G") {
    }
}

function AutoCountBlur() {
    var FillType = $("#SurveyFillType").val();
    var Total = 0;
}

function AutoCountConfirm() {
    var FillType = $("#SurveyFillType").val();
    var Msg = "";
    if (FillType == "0") {
    } else {
        return true;
    }
    if (Msg == "") {
        return true;
    }
    Msg += "\n\n請確認以上資料是否正確？若確實無誤請按「確認」鍵";
    if (!confirm(Msg)) {
        return false;
    } else {
        return true;
    }
}

//init()
//普表init() and _340000單位級別1、8 Q5、Q6、Q8、Q9 checked
function Myfunction020() {
    var _050100 = "" + $("input[id='_050100']:checked").val();
    var _050200 = "" + $("input[id='_050200']:checked").val();
    var _060100 = "" + $("input[id='_060100']:checked").val();
    var _060300 = "" + $("input[id='_060300']:checked").val();
    var _060500 = "" + $("input[id='_060500']:checked").val();
    var _060600 = "" + $("input[id='_060600']:checked").val();
    var _060612 = "" + $("input[id='_060612']:checked").val();
    var _060620 = "" + $("input[id='_060620']:checked").val();
    var _060630 = "" + $("input[id='_060630']:checked").val();
    var _060640 = "" + $("input[id='_060640']:checked").val();
    var _060650 = "" + $("input[id='_060650']:checked").val();
    var _060660 = "" + $("input[id='_060660']:checked").val();
    var _080000 = "" + $("input[id='_080000']:checked").val();
    var _080100 = "" + $("input[id='_080100']:checked").val();
    var _080200 = "" + $("input[id='_080200']:checked").val();
    var _080300 = "" + $("input[id='_080300']:checked").val();
    var _080400 = "" + $("input[id='_080400']:checked").val();
    var _090200 = "" + $("input[id='_090200']:checked").val();

    if (_050100 == "1") {
        $("#_050101,#_050102,#_050103").prop("readOnly", false);
    } else {
        $("#_050101,#_050102,#_050103").prop("readOnly", true);
    }
    if (_050200 == "1") {
        $("#_050201,#_050202,#_050203").prop("readOnly", false);
    } else {
        $("#_050201,#_050202,#_050203").prop("readOnly", true);
    }
    if (_060100 == "1") {
        $(
            "input[id^='_060200'],input[id^='_060300'],input[id^='_060400'],input[id^='_060500'],input[id^='_060600']"
        ).prop("disabled", false);
        if (_060300 == "1") {
            $("#_060311").prop("readOnly", false);
            $("input[id^='_060320'],input[id^='_060330']").prop(
                "disabled",
                false
            );
        } else {
            $("#_060311").prop("readOnly", true);
            $("input[id^='_060320'],input[id^='_060330']").prop(
                "disabled",
                true
            );
        }
        if (_060500 == "1") {
            $(
                "input[id='_060501'],input[id='_060502'],input[id='_060503']"
            ).prop("disabled", false);
        } else {
            $(
                "input[id='_060501'],input[id='_060502'],input[id='_060503']"
            ).prop("disabled", true);
        }
        if (_060600 == "2") {
            $("input[id^='_06061']").prop("disabled", false);
            if (_060612 == "1") {
                $(
                    "input[id='_060620'],input[id='_060630'],input[id='_060640'],input[id='_060650'],input[id='_060660']"
                ).prop("disabled", false);
                $("input[id='_069999']").prop("readOnly", false);
                if (_060620 == "1") {
                    $("#_060621,#_060622").prop("disabled", false);
                } else {
                    $("#_060621,#_060622").prop("disabled", true);
                }
                if (_060630 == "1") {
                    $("#_060631,#_060632").prop("disabled", false);
                } else {
                    $("#_060631,#_060632").prop("disabled", true);
                }
                if (_060640 == "1") {
                    $("#_060641,#_060642").prop("disabled", false);
                } else {
                    $("#_060641,#_060642").prop("disabled", true);
                }
                if (_060650 == "1") {
                    $("#_060651,#_060652").prop("disabled", false);
                } else {
                    $("#_060651,#_060652").prop("disabled", true);
                }
                if (_060660 == "1") {
                    $("#_060661,#_060662").prop("disabled", false);
                } else {
                    $("#_060661,#_060662").prop("disabled", true);
                }
            } else {
                $(
                    "input[id^='_060620'],input[id^='_060630'],input[id^='_060640'],input[id^='_060650'],input[id^='_060660']"
                ).prop("disabled", true);
                $("input[id='_069999']").prop("readOnly", true);
            }
        } else {
            $("input[id^='_06061']").prop("disabled", true);
            $(
                "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
            ).prop("disabled", true);
            $("input[id='_069999']").prop("readOnly", true);
        }
    } else {
        $(
            "input[id^='_060200'],input[id^='_060300'],input[id^='_060400'],input[id^='_060500'],input[id^='_060600']"
        ).prop("disabled", true);
        $("input[id^='_06061']").prop("disabled", true);
        $(
            "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
        ).prop("disabled", true);
        $("#_060311,#_069999").prop("readOnly", true);
    }
    if (_080000 == "1") {
        $(
            "input[id^='_0801'],input[id^='_0802'],input[id^='_0803'],input[id^='_0804']"
        ).prop("disabled", false);
        if (_080100 == "1") {
            $("input[id^='_080101']").prop("disabled", false);
        } else {
            $("input[id^='_080101']").prop("disabled", true);
        }
        if (_080200 == "1") {
            $("#_080201,#_080202").prop("readOnly", false);
        } else {
            $("#_080201,#_080202").prop("readOnly", true);
        }
        if (_080300 == "1") {
            $("#_080301").prop("readOnly", false);
        } else {
            $("#_080301").prop("readOnly", true);
        }
        if (_080400 == "1") {
            $("#_080401").prop("readOnly", false);
        } else {
            $("#_080401").prop("readOnly", true);
        }
    } else {
        $(
            "input[id^='_0801'],input[id^='_0802'],input[id^='_0803'],input[id^='_0804']"
        ).prop("disabled", true);
    }
    if (_090200 == "1") {
        $("#_090201,#_090202").prop("readOnly", false);
    } else {
        $("#_090201,#_090202").prop("readOnly", true);
    }
}
//init()單位級別2、3、空default Q5、Q6 disable (不清)
function Myfunction021() {
    $("input[id^='_050100'],input[id^='_050200']").prop("disabled", true);
    $("#_050101,#_050102,#_050103,#_050201,#_050202,#_050203").prop(
        "readOnly",
        true
    );
    $(
        "input[id^='_060100'],input[id^='_060200'],input[id^='_060300'],input[id^='_060400'],input[id^='_060500'],input[id^='_060600'],input[id^='_060320'],input[id^='_060330'],input[id^='_060611'],input[id^='_060612']"
    ).prop("disabled", true);
    $(
        "input[id^=_0606],input[id='_060501'],input[id='_060502'],input[id='_060503']"
    ).prop("disabled", true);
    $(
        "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662,#_060671,#_060672,#_060681,#_060682,#_060691,#_060692"
    ).prop("disabled", true);
    $("#_060311,#_060312,#_069999").prop("readOnly", true);
}
//普表init()附記
function Myfunction13() {
    var _130400 = "" + $("input[id='_130400']").prop("checked");
    var _130410 = "" + $("input[id='_130410']").prop("checked");
    if (_130400 == "true") {
        $(
            "input[id='_130410'],input[id='_130412'],input[id='_130430'],input[id='_130421'],input[id='_130424']"
        ).prop("disabled", false);
        if (_130410 == "true") {
            $("#_130411").prop("readOnly", false);
        } else {
            $("#_130411").prop("readOnly", true);
        }
    } else {
        $("input[id='_130410'],input[id='_130412'],input[id='_130430']").prop(
            "disabled",
            true
        );
    }
}
//init() 甲表Q9營運數位化狀況
//function Myfunction1_09(id1){
function Myfunction1_09() {
    var _090100 = "" + $("input[id='_090100']:checked").val();
    var _090300 = "" + $("input[id='_090300']:checked").val();
    var _090500 = "" + $("input[id='_090500']:checked").val();
    var _090600 = "" + $("input[id='_090600']:checked").val();
    var _090612 = "" + $("input[id='_090612']:checked").val();
    var _090620 = "" + $("input[id='_090620']:checked").val();
    var _090630 = "" + $("input[id='_090630']:checked").val();
    var _090640 = "" + $("input[id='_090640']:checked").val();
    var _090650 = "" + $("input[id='_090650']:checked").val();
    var _090660 = "" + $("input[id='_090660']:checked").val();
    //var A=id1;

    //alert($("#"+A+"0100").prop("checked"));
    if (_090100 == "1") {
        $(
            "input[id^='_090200'],input[id^='_090300'],input[id^='_090400'],input[id^='_090500'],input[id^='_090600']"
        ).prop("disabled", false);
        //$("#_090200").prop("disabled", false);
        //$("#+A+0200,#+A+0300,#+A+0400,#+A+0500,#+A+0600").prop("disabled", false);
        if (_090300 == "1") {
            $("#_090311").prop("readOnly", false);
            $("input[id^='_090320'],input[id^='_090330']").prop(
                "disabled",
                false
            );
        } else {
            $("#_090311").prop("readOnly", true);
            $("input[id^='_090320'],input[id^='_090330']").prop(
                "disabled",
                true
            );
        }
        if (_090500 == "1") {
            $(
                "input[id='_090510'],input[id='_090520'],input[id='_090530']"
            ).prop("disabled", false);
        } else {
            $(
                "input[id='_090510'],input[id='_090520'],input[id='_090530']"
            ).prop("disabled", true);
        }
        if (_090600 == "2") {
            $("input[id^='_09061']").prop("disabled", false);
            if (_090612 == "1") {
                $(
                    "input[id='_090620'],input[id='_090630'],input[id='_090640'],input[id='_090650'],input[id='_090660']"
                ).prop("disabled", false);
                $("input[id='_090699']").prop("readOnly", false);
                if (_090620 == "1") {
                    $("#_090621,#_090622").prop("disabled", false);
                } else {
                    $("#_090621,#_090622").prop("disabled", true);
                }
                if (_090630 == "1") {
                    $("#_090631,#_090632").prop("disabled", false);
                } else {
                    $("#_090631,#_090632").prop("disabled", true);
                }
                if (_090640 == "1") {
                    $("#_090641,#_090642").prop("disabled", false);
                } else {
                    $("#_090641,#_090642").prop("disabled", true);
                }
                if (_090650 == "1") {
                    $("#_090651,#_090652").prop("disabled", false);
                } else {
                    $("#_090651,#_090652").prop("disabled", true);
                }
                if (_090660 == "1") {
                    $("#_090661,#_090662").prop("disabled", false);
                } else {
                    $("#_090661,#_090662").prop("disabled", true);
                }
            } else {
                $(
                    "input[id^='_090620'],input[id^='_090630'],input[id^='_090640'],input[id^='_090650'],input[id^='_090660']"
                ).prop("disabled", true);
                $("input[id='_090699']").prop("readOnly", true);
            }
        } else {
            $("input[id^='_09061']").prop("disabled", true);
            $(
                "#_090621,#_090622,#_090631,#_090632,#_090641,#_090642,#_090651,#_090652,#_090661,#_090662"
            ).prop("disabled", true);
            $("input[id='_090699']").prop("readOnly", true);
        }
    } else {
        $(
            "input[id^='_090200'],input[id^='_090300'],input[id^='_090400'],input[id^='_090500'],input[id^='_090600']"
        ).prop("disabled", true);
        $("input[id^='_09061']").prop("disabled", true);
        $(
            "#_090621,#_090622,#_090631,#_090632,#_090641,#_090642,#_090651,#_090652,#_090661,#_090662"
        ).prop("disabled", true);
        $("#_060311,#_060312,#_090699").prop("readOnly", true);
    }
}
//init()甲表附記
function Myfunction1_15() {
    var _150400 = "" + $("input[id='_150400']").prop("checked");
    var _150410 = "" + $("input[id='_150410']").prop("checked");
    if (_150400 == "true") {
        $(
            "input[id='_150410'],input[id='_150412'],input[id='_150430'],input[id='_150421'],input[id='_150424']"
        ).prop("disabled", false);
        if (_150410 == "true") {
            $("#_150411").prop("readOnly", false);
        } else {
            $("#_150411").prop("readOnly", true);
        }
    } else {
        $("input[id='_150410'],input[id='_150412'],input[id='_150430']").prop(
            "disabled",
            true
        );
    }
}

//表首統編
function MyfunctionQ00() {
    //營利事業暨扣繳單位統一編號
    $("input[id='_350100'],input[id='_350000']").on("click", function (event) {
        _350000 = $("#_350000").val();
        var _350100 = "" + $("input[id='_350100']:checked").val();
        if (_350100 == "1" && (_350000 == "" || _350000 == "00000000")) {
            $("#_350000").prop("readOnly", true);
        } else {
            $("#_350000").prop("readOnly", false).val("");
        }
        formObjectAddon();
    });
}
//普表問項三連動Q10~12 disable
function Myfunction01() {
    $(
        "input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
    ).prop("disabled", true);
    $("input[id^='_110100'],input[id^='_110200']").prop("disabled", true);
    $("input[id^='120100'],input[id^='120200'],input[id^='120200']").prop(
        "disabled",
        true
    );
    $("input[id='_100899'],input[id='_110201'],input[id='_110202']").prop(
        "readOnly",
        true
    );
}

//單位級別2、3、空連動Q5、Q6 disable and clear (清)
function Myfunction022() {
    $("input[id^='_050100'],input[id^='_050200]'")
        .prop("disabled", true)
        .prop("checked", false);
    $("#_050101,#_050102,#_050103,#_050201,#_050202,#_050203")
        .prop("readOnly", true)
        .val("");
    $(
        "input[id^='_060100'],input[id^='_060200'],input[id^='_060300'],input[id^='_060400'],input[id^='_060500'],input[id^='_060600'],input[id^='_060320'],input[id^='_060330'],input[id^='_060611'],input[id^='_060612']"
    )
        .prop("disabled", true)
        .prop("checked", false);
    $(
        "input[id^=_0606],input[id='_060501'],input[id='_060502'],input[id='_060503']"
    )
        .prop("disabled", true)
        .prop("checked", false);
    $(
        "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662,#_060671,#_060672,#_060681,#_060682,#_060691,#_060692"
    )
        .prop("disabled", true)
        .prop("checked", false);
    $("#_060311,#_060312,#_069999").prop("readOnly", true).val("");
}
//普表Q3 _030101連動 clear (前端)
//Code31=='1' Myfunction311() 清除問項三(1)其他欄位資料[其他同,Myfunction310全清]
function Myfunction310() {
    $(
        "input[id='_030211'],input[id='_030212'],input[id='_030213'],input[id='_030214']"
    ).prop("checked", false);
    $(
        "#_030210,#_030215,#_030216,#_030221,#_030222,#_030231,#_030232,#_030233,#_030234,#_030241,#_030242,#_030243,#_030251,#_030252,#_030253,#_030261"
    ).val("");
}
function Myfunction311() {
    $(
        "#_030221,#_030222,#_030231,#_030232,#_030233,#_030234,#_030241,#_030242,#_030243,#_030251,#_030252,#_030253,#_030261"
    ).val("");
}
function Myfunction312() {
    $(
        "input[id='_030211'],input[id='_030212'],input[id='_030213'],input[id='_030214']"
    ).prop("checked", false);
    $(
        "#_030210,#_030215,#_030216,#_030231,#_030232,#_030233,#_030234,#_030241,#_030242,#_030243,#_030251,#_030252,#_030253,#_030261"
    ).val("");
}
function Myfunction313() {
    $(
        "input[id='_030211'],input[id='_030212'],input[id='_030213'],input[id='_030214']"
    ).prop("checked", false);
    $(
        "#_030210,#_030215,#_030216,#_030221,#_030222,#_030241,#_030242,#_030243,#_030251,#_030252,#_030253,#_030261"
    ).val("");
}
function Myfunction314() {
    $(
        "input[id='_030211'],input[id='_030212'],input[id='_030213'],input[id='_030214']"
    ).prop("checked", false);
    $(
        "#_030210,#_030215,#_030216,#_030221,#_030222,#_030231,#_030232,#_030233,#_030234,#_030251,#_030252,#_030253,#_030261"
    ).val("");
}
function Myfunction315() {
    $(
        "input[id='_030211'],input[id='_030212'],input[id='_030213'],input[id='_030214']"
    ).prop("checked", false);
    $(
        "#_030210,#_030215,#_030216,#_030221,#_030222,#_030231,#_030232,#_030233,#_030234,#_030241,#_030242,#_030243,#_030261"
    ).val("");
}
function Myfunction316() {
    $(
        "input[id='_030211'],input[id='_030212'],input[id='_030213'],input[id='_030214']"
    ).prop("checked", false);
    $(
        "#_030210,#_030215,#_030216,#_030221,#_030222,#_030231,#_030232,#_030233,#_030234,#_030241,#_030242,#_030243,#_030251,#_030252,#_030253"
    ).val("");
}
//Q3 _030301連動 clear (前端)
//Code33=='1' Myfunction311() 清除問項三(1)其他欄位資料[其他同,Myfunction330全清]
function Myfunction330() {
    $(
        "input[id='_030311'],input[id='_030312'],input[id='_030313'],input[id='_030314']"
    ).prop("checked", false);
    $(
        "#_030310,#_030315,#_030316,#_030321,#_030322,#_030331,#_030332,#_030333,#_030334,#_030341,#_030342,#_030343,#_030351,#_030352,#_030353,#_030361"
    ).val("");
}
function Myfunction331() {
    $(
        "#_030321,#_030322,#_030331,#_030332,#_030333,#_030334,#_030341,#_030342,#_030343,#_030351,#_030352,#_030353,#_030361"
    ).val("");
}
function Myfunction332() {
    $(
        "input[id='_030311'],input[id='_030312'],input[id='_030313'],input[id='_030314']"
    ).prop("checked", false);
    $(
        "#_030310,#_030315,#_030316,#_030331,#_030332,#_030333,#_030334,#_030341,#_030342,#_030343,#_030351,#_030352,#_030353,#_030361"
    ).val("");
}
function Myfunction333() {
    $(
        "input[id='_030311'],input[id='_030312'],input[id='_030313'],input[id='_030314']"
    ).prop("checked", false);
    $(
        "#_030310,#_030315,#_030316,#_030321,#_030322,#_030341,#_030342,#_030343,#_030351,#_030352,#_030353,#_030361"
    ).val("");
}
function Myfunction334() {
    $(
        "input[id='_030311'],input[id='_030312'],input[id='_030313'],input[id='_030314']"
    ).prop("checked", false);
    $(
        "#_030310,#_030315,#_030316,#_030321,#_030322,#_030331,#_030332,#_030333,#_030334,#_030351,#_030352,#_030353,#_030361"
    ).val("");
}
function Myfunction335() {
    $(
        "input[id='_030311'],input[id='_030312'],input[id='_030313'],input[id='_030314']"
    ).prop("checked", false);
    $(
        "#_030310,#_030315,#_030316,#_030321,#_030322,#_030331,#_030332,#_030333,#_030334,#_030341,#_030342,#_030343,#_030361"
    ).val("");
}
function Myfunction336() {
    $(
        "input[id='_030311'],input[id='_030312'],input[id='_030313'],input[id='_030314']"
    ).prop("checked", false);
    $(
        "#_030310,#_030315,#_030316,#_030321,#_030322,#_030331,#_030332,#_030333,#_030334,#_030341,#_030342,#_030343,#_030351,#_030352,#_030353"
    ).val("");
}
//普表問項三連動Q10~13
function Myfunction03() {
    var Code31 = "" + $("#_030101").val();
    var Code33 = "" + $("#_030301").val();
    var _030251 = "" + $("#_030251").val();
    var _030253 = "" + $("#_030253").val();
    var _030351 = "" + $("#_030351").val();
    var _030353 = "" + $("#_030353").val();
    var _100001 = "" + $("input[id='_100001']:checked").val();
    var _100800 = "" + $("input[id='_100800']:checked").val();
    var _110200 = "" + $("input[id='_110200']:checked").val();
    if (Code31 == "3" || Code33 == "3") {
        $("input[id='_100001'],input[id='_100002']").prop("disabled", false);
        if (_100001 == "1") {
            $(
                "input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
            ).prop("disabled", false);
            if (_100800 == "1") {
                $("input[id='_100899']").prop("readOnly", false);
            } else {
                $("input[id='_100899']").prop("readOnly", true);
            }
        } else {
            $(
                "input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
            ).prop("disabled", true);
            $("input[id='_100899']").prop("readOnly", true);
        }
        $(".ShowF1").addClass("hidden");
    } else {
        $(
            "input[id='_100001'],input[id='_100002'],input[id='_100100'],input[id='_100200'],input[id='_100300'],input[id='_100400'],input[id='_100500'],input[id='_100600'],input[id='_100700'],input[id='_100800']"
        ).prop("disabled", true);
        $("input[id='_100899']").prop("readOnly", true);
        $(".ShowF1").removeClass("hidden");
    }
    if (Code31 == "1" || Code33 == "1" || Code31 == "3" || Code33 == "3") {
        $("input[id^='_110100'],input[id^='_110200']").prop("disabled", false);
        if (_110200 == "1") {
            $("#_110201,#_110202").prop("readOnly", false);
        } else {
            $("#_110201,#_110202").prop("readOnly", true);
        }
        $(".ShowF2").addClass("hidden");
    } else {
        $("input[id^='_110100'],input[id^='_110200']").prop("disabled", true);
        $("#_110201,#_110202").prop("readOnly", true);
        $(".ShowF2").removeClass("hidden");
    }
    if (
        Code31 == "1" ||
        Code33 == "1" ||
        Code31 == "2" ||
        Code33 == "2" ||
        (Code31 == "5" && _030251 == "2" && _030253 == "1") ||
        (Code33 == "5" && _030351 == "2" && _030353 == "1")
    ) {
        $(
            "input[id^='_120100'],input[id^='_120200'],input[id^='_120300']"
        ).prop("disabled", false);
        $(".ShowF3").addClass("hidden");
    } else {
        $(
            "input[id^='_120100'],input[id^='_120200'],input[id^='_120300']"
        ).prop("disabled", true);
        $(".ShowF3").removeClass("hidden");
    }
    if (
        Code31 == "4" ||
        Code33 == "4" ||
        (Code31 == "5" && _030251 == "3" && _030253 == "1") ||
        (Code33 == "5" && _030351 == "3" && _030353 == "1")
    ) {
        $("#_130000").prop("readOnly", false);
        $(".ShowF4").addClass("hidden");
    } else {
        $("#_130000").prop("readOnly", true);
        $(".ShowF4").removeClass("hidden");
    }
    formObjectAddon();
    //alert($("#_100899").css('background-color'));
}
//普表問項六069999判斷
function Myfunction_Q069999() {
    //var _0606 = new Array($('#_060621'),$('#_060622'),$('#_060631'),$('#_060632'),$('#_060641'),$('#_060642'),$('#_060651'),$('#_060652'),$('#_060661'),$('#_060662'));
    var _n1 = 0;
    //$.each(_0606, function (i, val) {
    $(
        "#_060621,#_060622,#_060631,#_060632,#_060641,#_060642,#_060651,#_060652,#_060661,#_060662"
    ).each(function () {
        if ($(this).val() == "7") {
            _n1 = _n1 + 1;
        }
    });
    if (_n1 > 0) {
        $("input[id='_069999']").prop("readOnly", false);
    } else {
        $("input[id='_069999']").prop("readOnly", true).val("");
    }
    formObjectAddon();
}

//其他(甲)表問項九
function MyfunctionQ09() {
    $("input[id='_090100']").on("click", function (event) {
        var _090100 = "" + $("input[id='_090100']:checked").val();
        if (_090100 == "1") {
            $(
                "input[id^='_090200'],input[id^='_090300'],input[id^='_090400'],input[id^='_090500'],input[id^='_090600']"
            ).prop("disabled", false);
        } else {
            $(
                "input[id^='_090200'],input[id^='_090300'],input[id^='_090400'],input[id^='_090500'],input[id^='_090600'],input[id^='_090320'],input[id^='_090330'],input[id^='_090611'],input[id^='_090612']"
            )
                .prop("disabled", true)
                .prop("checked", false);
            $("input[id='_090510'],input[id='_090520'],input[id='_090530']")
                .prop("disabled", true)
                .prop("checked", false);
            $(
                "input[id='_090620'],input[id='_090630'],input[id='_090640'],input[id='_090650'],input[id='_090660'],input[id='_090670']"
            )
                .prop("disabled", true)
                .prop("checked", false);
            $(
                "#_090621,#_090622,#_090631,#_090632,#_090641,#_090642,#_090651,#_090652,#_090661,#_090662"
            )
                .val("")
                .prop("disabled", true);
            $("input[id='_090311'],input[id='_090312'],input[id='_090699']")
                .val("")
                .prop("readOnly", true);
        }
        formObjectAddon();
    });
    //_090500
    $("input[id='_090500']").on("click", function (event) {
        var _090500 = "" + $("input[id='_090500']:checked").val();
        if (_090500 == "1") {
            $(
                "input[id='_090510'],input[id='_090520'],input[id='_090530']"
            ).prop("disabled", false);
        } else {
            $("input[id='_090510'],input[id='_090520'],input[id='_090530']")
                .prop("disabled", true)
                .prop("checked", false);
        }
        formObjectAddon();
    });
    //_090600
    $("input[id='_090600']").on("click", function (event) {
        var _090600 = "" + $("input[id='_090600']:checked").val();
        if (_090600 == "2") {
            $("input[id^=_09061]").prop("disabled", false);
        } else {
            $("input[id^=_09061]")
                .prop("disabled", true)
                .prop("checked", false);
            $(
                "input[id='_090620'],input[id='_090630'],input[id='_090640'],input[id='_090650'],input[id='_090660'],input[id='_090670']"
            )
                .prop("disabled", true)
                .prop("checked", false);
            $(
                "#_090621,#_090622,#_090631,#_090632,#_090641,#_090642,#_090651,#_090652,#_090661,#_090662"
            )
                .prop("disabled", true)
                .val("");
            $("input[id='_090699']").prop("readOnly", true).val("");
        }
        formObjectAddon();
    });
    //_090612
    $("input[id='_090612']").on("click", function (event) {
        var _090612 = "" + $("input[id='_090612']:checked").val();
        if (_090612 == "1") {
            $(
                "input[id='_090620'],input[id='_090630'],input[id='_090640'],input[id='_090650'],input[id='_090660'],input[id='_090670']"
            ).prop("disabled", false);
        } else {
            $(
                "input[id='_090620'],input[id='_090630'],input[id='_090640'],input[id='_090650'],input[id='_090660'],input[id='_090670']"
            )
                .prop("disabled", true)
                .prop("checked", false);
            $(
                "#_090621,#_090622,#_090631,#_090632,#_090641,#_090642,#_090651,#_090652,#_090661,#_090662"
            )
                .prop("disabled", true)
                .val("");
            $("input[id='_090699']").prop("readOnly", true).val("");
        }
        formObjectAddon();
    });
    //_090620~_090690
    $("#_090620,#_090630,#_090640,#_090650,#_090660").on(
        "click",
        function (event) {
            var _090620 = "" + $("input[id='_090620']").prop("checked");
            var _090630 = "" + $("input[id='_090630']").prop("checked");
            var _090640 = "" + $("input[id='_090640']").prop("checked");
            var _090650 = "" + $("input[id='_090650']").prop("checked");
            var _090660 = "" + $("input[id='_090660']").prop("checked");

            if (_090620 == "true") {
                $("#_090621").prop("disabled", false);
            } else {
                $("#_090621,#_090622").val("").prop("disabled", true);
            }
            if (_090630 == "true") {
                $("#_090631").prop("disabled", false);
            } else {
                $("#_090631,#_090632").val("").prop("disabled", true);
            }
            if (_090640 == "true") {
                $("#_090641").prop("disabled", false);
            } else {
                $("#_090641,#_090642").val("").prop("disabled", true);
            }
            if (_090650 == "true") {
                $("#_090651").prop("disabled", false);
            } else {
                $("#_090651,#_090652").val("").prop("disabled", true);
            }
            if (_090660 == "true") {
                $("#_090661").prop("disabled", false);
            } else {
                $("#_090661,#_090662").val("").prop("disabled", true);
            }
            Myfunction_Q090699();
            formObjectAddon();
        }
    );
    //_090621~_090692
    $(
        "#_090621,#_090622,#_090631,#_090632,#_090641,#_090642,#_090651,#_090652,#_090661,#_090662,#_090699"
    ).on("click", function (event) {
        var _090621 = "" + $("#_090621").val();
        var _090622 = "" + $("#_090622").val();
        var _090631 = "" + $("#_090631").val();
        var _090632 = "" + $("#_090632").val();
        var _090641 = "" + $("#_090641").val();
        var _090642 = "" + $("#_090642").val();
        var _090651 = "" + $("#_090651").val();
        var _090652 = "" + $("#_090652").val();
        var _090661 = "" + $("#_090661").val();
        var _090662 = "" + $("#_090662").val();

        if (_090621 == "") {
            $("#_090622").prop("disabled", true).val("");
        } else if (_090621 != "" && _090621 == _090622) {
            alert("請選擇不同的運用作業");
            $("#_090622").val("");
        } else {
            $("#_090622").prop("disabled", false);
        }
        if (_090631 == "") {
            $("#_090632").prop("disabled", true).val("");
        } else if (_090631 != "" && _090631 == _090632) {
            alert("請選擇不同的運用作業");
            $("#_090632").val("");
        } else {
            $("#_090632").prop("disabled", false);
        }
        if (_090641 == "") {
            $("#_090642").prop("disabled", true).val("");
        } else if (_090641 != "" && _090641 == _090642) {
            alert("請選擇不同的運用作業");
            $("#_090642").val("");
        } else {
            $("#_090642").prop("disabled", false);
        }
        if (_090651 == "") {
            $("#_090652").prop("disabled", true).val("");
        } else if (_090651 != "" && _090651 == _090652) {
            alert("請選擇不同的運用作業");
            $("#_090652").val("");
        } else {
            $("#_090652").prop("disabled", false);
        }
        if (_090661 == "") {
            $("#_090662").prop("disabled", true).val("");
        } else if (_090661 != "" && _090661 == _090662) {
            alert("請選擇不同的運用作業");
            $("#_090662").val("");
        } else {
            $("#_090662").prop("disabled", false);
        }
        Myfunction_Q090699();
        formObjectAddon();
    });
}

//其他甲表問項九_090699判斷
function Myfunction_Q090699() {
    //var _0606 = new Array($('#_090621'),$('#_090622'),$('#_090631'),$('#_090632'),$('#_090641'),$('#_090642'),$('#_090651'),$('#_090652'),$('#_090661'),$('#_090662'));
    var _n1 = 0;
    //$.each(_0906, function (i, val) {
    $(
        "#_090621,#_090622,#_090631,#_090632,#_090641,#_090642,#_090651,#_090652,#_090661,#_090662"
    ).each(function () {
        if ($(this).val() == "7") {
            _n1 = _n1 + 1;
        }
    });
    if (_n1 > 0) {
        $("input[id='_090699']").prop("readOnly", false);
    } else {
        $("input[id='_090699']").prop("readOnly", true).val("");
    }
    formObjectAddon();
}
//其他(甲)附記
function MyfunctionQ15() {
    $("input[id='_150400']").on("click", function (event) {
        var _150400 = "" + $("input[id='_150400']:checked").val();
        if (_150400 == "1") {
            $(
                "input[id='_150410'],input[id='_150412'],input[id='_150421'],input[id='_150424'],input[id='_150430']"
            ).prop("disabled", false);
        } else {
            $(
                "input[id='_150410'],input[id='_150412'],input[id='_150421'],input[id='_150424'],input[id='_150430']"
            )
                .prop("disabled", true)
                .prop("checked", false);
            $("#_150411,#_150422,#_150423,#_150425,#_150426,#_150499")
                .prop("readOnly", true)
                .val("");
        }
        formObjectAddon();
    });
}
//OpenIll
function OpenIll(wId) {
    var horizontalPadding = 30;
    var verticalPadding = 30;
    var iframW = 600;
    var iframH = 400;

    $("#" + wId)
        .removeClass("hidden")
        .dialog({
            title: "範例說明",
            position: { at: "center top" },
            autoOpen: true,
            width: iframW,
            height: iframH,
            modal: true,
            resizable: true,
            autoResize: true,
            overlay: {
                opacity: 0.5,
                background: "black",
            },
            close: function () {
                $("#NewPage").remove();
                $(
                    '<iframe id="NewPage" name="NewPage" class="hidden"></iframe>'
                ).appendTo("body");
            },
        })
        .width(iframW - horizontalPadding)
        .height(iframH - verticalPadding);

    //$('form:first').vs_doSubmit({actionPage: '../utility/ques_' + wPage + '.jsp', targetWin: "NewPage", postMethod: "post"});
}

//OpenQues
function OpenQues(wPage, Code1) {
    //alert(Code1);
    //obj['Code1'] = Code1;
    var horizontalPadding = 30;
    var verticalPadding = 30;
    var iframW = 800;
    var iframH = 400;
    $("#NewPage")
        .removeClass("hidden")
        .dialog({
            title: "範例說明" + Code1,
            position: { at: "center top" },
            autoOpen: true,
            width: iframW,
            height: iframH,
            modal: true,
            resizable: true,
            autoResize: true,
            overlay: {
                opacity: 0.5,
                background: "black",
            },
            close: function () {
                $("#NewPage").remove();
                $(
                    '<iframe id="NewPage" name="NewPage" class="hidden"></iframe>'
                ).appendTo("body");
            },
        })
        .width(iframW - horizontalPadding)
        .height(iframH - verticalPadding);
    $("form:first").vs_doSubmit({
        actionPage: "../utility/ques_" + wPage + ".jsp",
        targetWin: "NewPage",
        postMethod: "post",
    });
}
