/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/chrome/index.d.ts" />

/**
 * #######################################
 * ブラウザのURL入力横にあるボタンを押下して表示させたポップアップ内の処理を行う
 * #######################################
 */

$(function () {
    // 保存されているXPathをaction_script側でも取得する
    chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {event:"GetXPath"}, function(response) {
            $("#xpath").html(response.xpath);
        });
    });
    // XPath取得中状態にする
    $("#xpath_mode_button").click(function() {
        chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {event:"XPathToolOn"}, function(response) {
                console.log(response.message);
            });
        });
    });
    // action_scriptで指定されたvalueからSelectに指定されているvalueを変更
    $("#change_element_value_button").click(function() {
        chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {event:"ChangeSelectByValue", value: $("#element_value").val()}, function(response) {
                console.log(response.message);
            });
        });
    });
    // action_scriptで指定されたHTML文字列からSelectに指定されているvalueを変更
    $("#change_element_html_button").click(function() {
        chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {event:"ChangeSelectByHtml", value: $("#element_html").val()}, function(response) {
                console.log(response.message);
            });
        });
    });
    // 指定したXPathのSelectからOptionの一覧を取得する
     $("#update_button").click(function() {
        chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {event:"UpdateOptionList"}, function(response) {
                var county = response.message;
                var $list = $("#option_list");
                var html = "";
                for (var id in county) {
                     html += "Value:" + id + " HTML: " + county[id] + "\n";
                }
                $list.html(html);
            });
        });
    });
});