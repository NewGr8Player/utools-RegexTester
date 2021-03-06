$(function () {
    var jrt = jch.RegexTester;
    var $tbReg = $("#tbReg");
    var $tbInput = $("#tbInput");
    var $tbReplace = $("#tbReplace");
    var $tbOutput = $("#tbOutput");
    var workMode = jrt.workMode.match;
    var replaceMode = jrt.replaceMode.includeNoMatch;
    var newLineChar = jrt.newLineChar.CRLF;
    var RegExpOption = "g";
    init();
    function init() {
        bind();
        changeWorkMode(jrt.workMode.match);
        $tbReg.val("([^?&=]+)=([^?&=]*)");
        $tbInput.val("https://www.baidu.com/s?wd=newgr8player.top&ie=utf-8&f=8&rsv_bp=1&tn=baidu");
        $tbReplace.val("\"$1\":\"$2\",\r\n");
        run();
    }
    function bind() {
        //输入自动运行
        $tbReg.add($tbInput).add($tbReplace).bind("change input", function (e) {
            run();
        });
        //修改工作模式
        $("input[name='workMode']").change(function (e) {
            changeWorkMode($("input[name='workMode']:checked").val());
            run();
        });
        //修改替换模式
        $("input[name='replaceMode']").change(function (e) {
            replaceMode = Number($("input[name='replaceMode']:checked").val());
            run();
        });
        //修改换行符
        $("input[name='newLineChar']").change(function (e) {
            newLineChar = Number($("input[name='newLineChar']:checked").val());
            run();
        });
        //修改正则选项
        $("input[name='RegExpOption']").change(function (e) {
            var $ipt = $(this);
            var val = $ipt.val();
            RegExpOption = RegExpOption.replace(val, "");
            RegExpOption += $ipt.prop("checked") ? val : "";
            run();
        });
        //将输出内容导入输入内容框
        $("#btnOutputToInput").click(function (e) {
            $tbInput.val($tbOutput.val());
            run();
        });
    }
    function run() {
        var txtReg = $tbReg.val();
        var txtInput = $tbInput.val();
        var txtReplace = $tbReplace.val();
        var reg = valiInputReg($tbReg, RegExpOption);
        var outputResult = "";
        var matchArr = [];
        if (txtReg.length === 0 || txtInput.length === 0) {
            return;
        }
        if (!(reg instanceof RegExp)) {
            return valiOutput(false);
        }
        if (workMode === jrt.workMode.match) {
            matchArr = jch.RegexTester.matchs(reg, txtInput);
            if (matchArr.length === 0) {
                return valiOutput(false);
            }
            $.each(matchArr, function (i, match) {
                if (!(match instanceof Array)) {
                    return true;
                }
                outputResult += match[0] + (i === matchArr.length - 1 ? "" : jrt.getNewLineChar(newLineChar));
            });
        }
        else if (workMode === jrt.workMode.replace) {
            outputResult = jch.RegexTester.replace(reg, txtInput, txtReplace, replaceMode);
        }
        valiOutput(outputResult);
    }
    /**
     * 变更工作模式
     * @param  {RegexTester.workMode} wm 目标工作模式
     * @returns void
     */
    function changeWorkMode(wm) {
        workMode = Number(wm);
        var $row = $tbReplace.parents(".row");
        if (workMode === jrt.workMode.match) {
            $row.hide(0);
        }
        else if (workMode === jrt.workMode.replace) {
            $row.show(0);
        }
    }
    /**
     * 校验正则表达式输入框输入的正则是否正确，返回正则对象
     *
     * @param {JQuery} $textarea 文本框的DOM对象
     * @param {string} regOption 正则表达式选项
     * @param {string} parentSelector 增加样式的父级选择器
     * @returns {RegExp} (description)
     */
    function valiInputReg($textarea, regOption, parentSelector) {
        if (regOption === void 0) { regOption = ""; }
        if (parentSelector === void 0) { parentSelector = ".form-group"; }
        var txt = $textarea.val();
        var $form = $textarea.parents(parentSelector).eq(0);
        var reg = null;
        if (txt.length === 0) {
            return reg;
        }
        try {
            reg = new RegExp(txt, regOption);
            $form.removeClass("has-error");
        }
        catch (ex) {
            $form.addClass("has-error");
        }
        return reg;
    }
    function valiOutput(outputText) {
        var $parent = $tbOutput.parents(".form-group").eq(0);
        if (typeof outputText === "boolean" && outputText === false) {
            $tbOutput.val("");
            $parent.addClass("has-error");
        }
        else if (typeof outputText === "string") {
            $tbOutput.val(outputText);
            $parent.removeClass("has-error");
        }
    }
});
