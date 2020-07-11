
var gAppKey; 			//app key
var gAccessToken; 		//accesstoken
var gPlaybackSearchRecord; //search record
var streamparamsysy = '';
var bInstall = false;

function getParameter(param) {
    var query = window.location.search;
    var iLen = param.length;
    var iStart = query.indexOf(param);
    if (iStart == -1)
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    if (iEnd == -1)
        return query.substring(iStart);
    return query.substring(iStart, iEnd);
}

function init() {
    loadtext();
    TestActiveX();
    if (getParameter("AppKey"))
        streamparamsysy = '{ "AppKey":"' + getParameter("AppKey") + '",  "AccessToken":"' + getParameter("AccessToken") + '",  "Url":"ezopen://@open.ys7.com/' + getParameter("deviceSerial") + '/' + getParameter("channelNo") + '.rec';
    else streamparamsysy = '{ "AppKey":"e2a6402afe58419d9b25ed05208c1fab",  "AccessToken":"at.3pij3trk2urnifuu49aakc24bwwvtj8j-9nx9agxft6-107ft8i-ubax4zlr0",  "Url":"ezopen://@open.ys7.com/C04050772/2.rec';
    //s = '{ "AppKey":"' + getParameter("AppKey") + '",  "AccessToken":"' + getParameter("AccessToken") + '",  "Url":"ezopen://@open.ys7.com/' + getParameter("deviceSerial") + '/' + getParameter("channelNo") + '.rec?begin=' + getParameter("begin") + '&end=' + getParameter("end") + '" }';
    //s = '{ "AppKey":"e2a6402afe58419d9b25ed05208c1fab",  "AccessToken":"at.3tglbxps4pupcb0m5wh7xzbgahm2w3vn-58etv75185-0e3pcei-prvcinvc5",  "Url":"ezopen://@open.ys7.com/C04050772/2.rec?begin=20180702070000&end=20180702091203" }';
    StartPlayBack();
}

//预览函数
function StartPlayBack() {
    if (!bInstall) return; //如果控件未安装或者其他浏览器时不进行回放预览
    StopPlay();
    gPlaybackSearchRecord = "";
    //得到控件引用
    var playOcx = document.getElementById("EZUIKit");
    if (!playOcx) {
        //$.messager.alert("提示", "找不到控件！", "info");
        alert("找不到控件！");
        return;
    }
    var streamparams = '';
    if (streamparamsysy == '') {
        var b = document.getElementById('PlayBackstart').value;
        var e = document.getElementById('PlayBackend').value;
        streamparamsysy = '{ "AppKey":"e2a6402afe58419d9b25ed05208c1fab",  "AccessToken":"at.3pij3trk2urnifuu49aakc24bwwvtj8j-9nx9agxft6-107ft8i-ubax4zlr0",  "Url":"ezopen://@open.ys7.com/C04050772/2.rec?begin=' + b + '&end=' + e + '" }';
        streamparams = streamparamsysy;
    }
    else {
        var b = document.getElementById('PlayBackstart').value;
        var e = document.getElementById('PlayBackend').value;
        var sysy = streamparamsysy + '?begin=' + b + '&end=' + e + '" }';
        streamparams = sysy;
    }
    //获取取流参数    
    try {
        var streamobj = JSON.parse(streamparams);
    } catch (e) {
        //$.messager.alert("提示", "参数错误！", "info");
        alert("参数错误！");
    }

    if (!streamobj) {
        //$.messager.alert("提示", "获取流参数出错！", "info");
        alert("获取流参数出错！");
        return;
    }
    var appkey = streamobj.AppKey;
    var accesstoken = streamobj.AccessToken;
    var ezurl = streamobj.Url;
    //检测取流参数
    if (appkey == "") {
        //$.messager.alert("提示", "Appkey为空，请联系管理员！", "info");
        alert("Appkey为空,请联系管理员！");
        return;
    }
    if (accesstoken == "") {
        //$.messager.alert("提示", "Accesstoken为空，请联系管理员！", "info");
        alert("Accesstoken为空,请联系管理员！");
        return;
    }
    if (ezurl == "") {
        //$.messager.alert("提示", "EzUrl为空，请联系管理员！", "info");
        alert("EzUrl为空,请联系管理员！");
        return;
    }

    //设置appkey
    //判断参数是否初始化过
    if (gAppKey != appkey) {
        var res = playOcx.InitWithAppKey(appkey);
        if (0 != res) {
            //alert("Init appkey Error!");
            alert("Appkey初始化出错！");
            return;
        }
        gAppKey = appkey;
        //alert("Init appkey success.");
    }
    //设置
    if (gAccessToken != accesstoken) {
        var res = playOcx.SetAccessToken(accesstoken);
        if (0 != res) {
            //$.messager.alert("提示", "accesstoken初始化出错！", "info");
            alert("accesstoken初始化出错！");
            return;
        }
        gAccessToken = accesstoken;
        //alert("Init accesstoken success.");
    }
    //清理播放结果窗口
    //开始播放, 播放结果 根据 PluginEventHandler 回调函数
    var res = playOcx.StartPlay(ezurl);
    if (0 != res) {
        //$.messager.alert("提示", "播放出错,请联系管理员！", "info");
        //console.log("播放出错,请联系管理员！")
        //alert("播放出错,请重试！");
        return;
    }
}

function StopPlay() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.StopPlay();
    if (0 != res) {
        //$.messager.alert("提示", "停止播放出错,请联系管理员！", "info");
    }
}

function CapturePicture() {
    var picNameText = document.getElementById("picturename"); //获取picture name 输入框
    if (picNameText.value == "") {
        alert("please input the name of picture.");
        return;
    }
    var picname = picNameText.value;
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.CapturePicture(picname);
    if (res == "") {
        alert("capture picture Error！");
    }
    else {
        alert("picture save at " + res);
    }
}

function StartTalk() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.StartTalk();
    if (0 != res) {
        alert("StartTalk Error！");
    }
}

function StopTalk() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.StopTalk();
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

//ptz command
var cmd_up = 0;
var cmd_down = 1;
var cmd_left = 2;
var cmd_right = 3;
//ptz action
var action_start = 0;
var action_stop = 1;
//ptz speed
var ptz_speed = 7;

function StartUpPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_up, action_start, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function StopUpPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_up, action_stop, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function StartDownPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_down, action_start, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function StopDownPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_down, action_stop, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function StartLeftPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_left, action_start, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function StopLeftPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_left, action_stop, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function StartRightPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_right, action_start, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function StopRightPTZCtrl() {
    var playOcx = document.getElementById("EZUIKit"); //得到控件引用
    var res = playOcx.PTZCtrl(cmd_right, action_stop, ptz_speed);
    if (0 != res) {
        alert("StopTalk Error！");
    }
}

function TestActiveX() {
    try {
        var ax = new ActiveXObject("EZOPENUIACTIVEXK.EzOpenUIActiveXKCtrl.1");
        bInstall = true;
        //alert("已安装");  
    } catch (e) {
        //$.messager.alert("提示", "请下载安装EZUIKit且用IE浏览器或兼容模式打开！", "info");
        alert("请下载安装EZUIKit且用360浏览器兼容模式打开！");  
    }
}

//handle message msgtype
var EZUI_MSGID_PLAY_EXCEPTION = 0; 		//播放异常
var EZUI_MSGID_PLAY_RECONNECT = 1; 		//播放重连
var EZUI_MSGID_PLAY_RECONNECT_EXCEPTION = 2; 		//播放重连异常
var EZUI_MSGID_PLAY_START = 3; 		//播放开始
var EZUI_MSGID_PLAY_STOP = 4; 		//播放停止
var EZUI_MSGID_PLAY_ARCHIVE_END = 5; 		//回放结束
var EZUI_MSGID_VOICETALK_START = 16; 		//语音对讲开始
var EZUI_MSGID_VOICETALK_STOP = 17; 		//语音对讲停止
var EZUI_MSGID_VOICETALK_EXCEPTION = 18; 		//语音对讲异常 
var EZUI_MSGID_RECORD_FILE = 20; 		//查询的录像文件
var EZUI_MSGID_PTZCTRL_SUCCESS = 46; 		//云台控制命令发送成功
var EZUI_MSGID_PTZCTRL_FAILED = 47; 		//云台控制失败

var EZUI_ERROR_ACCESSTOKEN_EXPIRE = "UE001"; 	///< accesstoken异常或失效，需要重新获取accesstoken，并传入到sdk
var EZUI_ERROR_APPKEY_TOKEN_NOT_MATCH = "UE002";     ///< appkey和AccessToken不匹配,建议更换appkey或者AccessToken
var EZUI_ERROR_CHANNEL_NOT_EXIST = "UE004";     ///< 通道不存在，设备参数错误，建议重新获取播放地址
var EZUI_ERROR_DEVICE_NOT_EXIST = "UE005";     ///< 设备不存在，设备参数错误，建议重新获取播放地址
var EZUI_ERROR_PARAM_INVALID = "UE006";     ///< 参数错误，建议重新获取播放地址
var EZUI_ERROR_EZOPEN_URL_INVALID = "UE007";     ///< 播放地址错误,建议重新获取播放地址
var EZUI_ERROR_NO_RESOURCE = "UE101";     ///< 设备连接数过大，停止其他连接后再试试
var EZUI_ERROR_DEVICE_OFFLINE = "UE102"; 	///< 设备不在线，确认设备上线之后重试
var EZUI_ERROR_CONNECT_DEVICE_TIMEOUT = "UE103"; 	///< 播放失败，请求连接设备超时，检测设备网路连接是否正常.
var EZUI_ERROR_INNER_VERIFYCODE = "UE104"; 	///< 视频验证码错误，建议查看设备上标记的验证码
var EZUI_ERROR_PLAY_FAIL = "UE105"; 	///< 视频播放失败
var EZUI_ERROR_TERMINAL_BINDING = "UE106"; 	///< 当前账号开启了终端绑定，只允许指定设备登录操作
var EZUI_ERROR_DEVICE_INFO_INVALID = "UE107"; 	///< 设备信息异常为空，建议重新获取播放地址
var EZUI_ERROR_VIDEO_RECORD_NOTEXIST = "UE108"; 	///< 未查找到录像文件
var EZUI_ERROR_VTDU_NO_RESOURCE = "UE109"; 	///< 取流并发路数限制,请升级为企业版.
var EZUI_ERROR_UNSUPPORTED = "UE110"; 	///< 设备不支持的清晰度类型, 请根据设备预览能力级选择.


function PluginEventHandler(lEventType, strErrorCode, lInterErrorCode) {
    switch (lEventType) {
        case EZUI_MSGID_PLAY_START: 	//播放开始
            {
                var info;
                if (gPlaybackSearchRecord != "") {
                    info = "回放成功!" + gPlaybackSearchRecord;
                }
                else {
                    info = "播放成功!";
                }
                //console.log(info);
            }
            break;
        case EZUI_MSGID_PLAY_EXCEPTION: //播放异常
            {
                var errinfo;
                if (strErrorCode == EZUI_ERROR_ACCESSTOKEN_EXPIRE) {
                    errinfo = "accesstoken异常或失效，需要重新获取accesstoken，并传入到sdk";
                }
                else if (strErrorCode == EZUI_ERROR_APPKEY_TOKEN_NOT_MATCH) {
                    errinfo = "appkey和AccessToken不匹配,建议更换appkey或者AccessToken";
                }
                else if (strErrorCode == EZUI_ERROR_CHANNEL_NOT_EXIST) {
                    errinfo = "通道不存在，设备参数错误，建议重新获取播放地址";
                }
                else if (strErrorCode == EZUI_ERROR_DEVICE_NOT_EXIST) {
                    errinfo = "设备不存在，设备参数错误，建议重新获取播放地址";
                }
                else if (strErrorCode == EZUI_ERROR_PARAM_INVALID) {
                    errinfo = "参数错误，建议重新获取播放地址";
                }
                else if (strErrorCode == EZUI_ERROR_EZOPEN_URL_INVALID) {
                    errinfo = "播放地址错误,建议重新获取播放地址";
                }
                else if (strErrorCode == EZUI_ERROR_NO_RESOURCE) {
                    errinfo = "设备连接数过大，停止其他连接后再试试";
                }
                else if (strErrorCode == EZUI_ERROR_DEVICE_OFFLINE) {
                    errinfo = "设备不在线，确认设备上线之后重试";
                }
                else if (strErrorCode == EZUI_ERROR_CONNECT_DEVICE_TIMEOUT) {
                    errinfo = "播放失败，请求连接设备超时，检测设备网路连接是否正常.";
                }
                else if (strErrorCode == EZUI_ERROR_INNER_VERIFYCODE) {
                    errinfo = "视频验证码错误，建议查看设备上标记的验证码";
                }
                else if (strErrorCode == EZUI_ERROR_PLAY_FAIL) {
                    errinfo = "视频播放失败";
                }
                else if (strErrorCode == EZUI_ERROR_TERMINAL_BINDING) {
                    errinfo = "当前账号开启了终端绑定，只允许指定设备登录操作";
                }
                else if (strErrorCode == EZUI_ERROR_DEVICE_INFO_INVALID) {
                    errinfo = "设备信息异常为空，建议重新获取播放地址";
                }
                else if (strErrorCode == EZUI_ERROR_VIDEO_RECORD_NOTEXIST) {
                    errinfo = "未查找到录像文件";
                }
                else if (strErrorCode == EZUI_ERROR_VTDU_NO_RESOURCE) {
                    errinfo = "取流并发路数限制,请升级为企业版.";
                }
                else if (strErrorCode == EZUI_ERROR_UNSUPPORTED) {
                    errinfo = "设备不支持的清晰度类型, 请根据设备预览能力级选择";
                }

                var info = "播放失败," + errinfo + ".错误码:" + strErrorCode + ", 内部错误码:" + lInterErrorCode;
                alert(errinfo);
                console.log(info);
            }
            break;
        case EZUI_MSGID_PLAY_STOP: 		//播放停止
            {
                //document.getElementById('startplaybtn').style.display = 'block';
                //document.getElementById('stopplaybtn').style.display = 'none';
                //document.getElementById('starttalkbtn').style.display = 'none';
                //document.getElementById('stoptalkbtn').style.display = 'none';
                //document.getElementById('ptzupbtn').style.display = 'none';
                //document.getElementById('ptzdownbtn').style.display = 'none';
                //document.getElementById('ptzleftbtn').style.display = 'none';
                //document.getElementById('ptzrightbtn').style.display = 'none';
            }
            break;
        case EZUI_MSGID_RECORD_FILE: 	//录像搜索成功
            {
                gPlaybackSearchRecord = "录像搜索成功:" + strErrorCode;
            }
            break;
        case EZUI_MSGID_VOICETALK_START: 	//对讲开启
            {
                var info = "对讲开启成功";
                showpanel.value = info;
                document.getElementById('starttalkbtn').style.display = 'none';
                document.getElementById('stoptalkbtn').style.display = 'block';
            }
            break;
        case EZUI_MSGID_VOICETALK_STOP: 	//对讲开启
            {
                var info = "对讲停止成功";
                showpanel.value = info;
                document.getElementById('starttalkbtn').style.display = 'block';
                document.getElementById('stoptalkbtn').style.display = 'none';
            }
            break;
        case EZUI_MSGID_PTZCTRL_SUCCESS: 	//云台控制成功
            {
                var info = "云台控制信令发送成功";
                showpanel.value = info;
            }
            break;
        case EZUI_MSGID_PTZCTRL_FAILED: 	//云台控制失败
            {
                var info = "云台控制失败";
                showpanel.value = info;
            }
            break;
        default:
    }

}

window.unload = function () {
    alert("unload");
}
function myformatterplay(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var s = date.getSeconds();
    return '' + y + (m < 10 ? ('0' + m) : m) + (d < 10 ? ('0' + d) : d) + (h < 10 ? ('0' + h) : h) + (mm < 10 ? ('0' + mm) : mm) + (s < 10 ? ('0' + s) : s);
}
// 格式化时间
function dateFormatplay(oDate, fmt) {
    var o = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "h+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
        "S": oDate.getMilliseconds()//毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
function loadtext() {
    var pCurTime = dateFormatplay(new Date(), "yyyyMMdd");
    var begin = pCurTime + "000000";
    var end = myformatterplay(new Date());
    document.getElementById('PlayBackstart').value = begin;
    document.getElementById('PlayBackend').value = end;
}