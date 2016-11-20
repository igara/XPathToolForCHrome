/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/chrome/index.d.ts" />

/**
 * #######################################
 * ブラウザで表示中の画面での処理を行う
 * （DOM操作など）
 * Chrome開発者ツールの処理などもこちらで行える
 * #######################################
 */


/**
 * XPath取得する際のイベントハンドラ
 * @param {Event} event
 */
function xpathClickEvent(event) {
	event.preventDefault();
	var xpath = getXpath(event.target);
	console.log(xpath);
	alert("XPathを取得しました¥n" + xpath);
	localStorage.setItem("xpath", xpath);
}

/**
 * クリックした箇所のXPathを取得する
 * @param {Element} element 
 * @return {string}
 */
function getXpath(element) {
	if (element && element.parentNode) {
		var xpath = getXpath(element.parentNode) + "/" + element.tagName;
		var s = [];

		for (var i = 0; i < element.parentNode.childNodes.length; i++) {
			var e = element.parentNode.childNodes[i];
			if (e.tagName == element.tagName) {
				s.push(e);
			}
		}

		if(1 < s.length) {
			for(var i = 0; i < s.length; i++) {
				if(s[i] === element) {
					xpath += "[" + (i + 1) + "]";
					break;
				}
			}
		}
		// 追加されたイベントハンドラを解除
		$(document).unbind();
		return xpath.toLowerCase();
	} else {
		return "";
	}
}

/**
 * XPathパース
 * @param {string} expression - XPath String
 * @return {Element | string | number | boolean}
 */
document.xpath = function(expression) {
	var ret = document.evaluate(expression, document, null, XPathResult.ANY_TYPE, null);
	var arr = [];
	var e;
	switch(ret.resultType){
		case XPathResult.NUMBER_TYPE:
			return ret.numberValue;
		case XPathResult.STRING_TYPE:
			return ret.stringValue;
		case XPathResult.BOOLEAN_TYPE:
			return ret.booleanValue;
		case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
			// ノード集合
			arr = [];
			while(e = ret.iterateNext()) {
				arr.push(e);
			}
			return arr;
		default:
			return ret;
	}
}

/**
 * ContentScript、BackGroundのイベントを拾う
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// 保存されているXPathをaction_scriptに送る
	if (request.event === "GetXPath") {
		var xpath = localStorage.getItem("xpath");
		sendResponse( {xpath: xpath} );
	}
	// XPath取得のイベントハンドラを追加
	if (request.event === "XPathToolOn") {
		$(document).click(xpathClickEvent.bind(this));
		sendResponse( {message: "XPathTool起動"} );
	}
	// action_scriptで指定されたvalueからSelectに指定されているvalueを変更
	if (request.event === "ChangeSelectByValue") {
		var xpath = localStorage.getItem("xpath");
		$(document.xpath(xpath)).val(request.value);
		sendResponse( {message: "valueから変更しました"} );
	}
	// action_scriptで指定されたHTML文字列からSelectに指定されているvalueを変更
	if (request.event === "ChangeSelectByHtml") {
		var xpath = localStorage.getItem("xpath");
		var option = xpath + "/option";
		var element = $(document.xpath(option));
		for (var i = 0; i < element.length; i++) {
			var $ele = $(element[i]);
			if ($ele.html() === request.value) {
				$(document.xpath(xpath)).val($ele.val());
				sendResponse( {message: "htmlから変更しました"} );
			}
		}
	}
	// 指定したXPathのSelectからOptionの一覧を取得する
	if (request.event === "UpdateOptionList") {
		var xpath = localStorage.getItem("xpath");
		var option = xpath + "/option";
		var element = $(document.xpath(option));
		var arr = {};
		for (var i = 0; i < element.length; i++) {
			var $ele = $(element[i]);
			arr[$ele.val()] = $ele.html();
		}
		sendResponse( {message: arr} );
	}
});
