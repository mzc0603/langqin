(function() {
    'use strict';

    var textInput = document.getElementById('textInput');
    var charCountEl = document.getElementById('charCount');
    var wordCountEl = document.getElementById('wordCount');
    var lineCountEl = document.getElementById('lineCount');
    var paragraphCountEl = document.getElementById('paragraphCount');
    var searchTextEl = document.getElementById('searchText');
    var replaceTextEl = document.getElementById('replaceText');
    var caseSensitiveEl = document.getElementById('caseSensitive');
    var useRegexEl = document.getElementById('useRegex');
    var toastEl = document.getElementById('toast');

    function showToast(message, type) {
        toastEl.textContent = message;
        toastEl.className = 'toast show';
        if (type) {
            toastEl.classList.add(type);
        }
        setTimeout(function() {
            toastEl.className = 'toast';
        }, 2500);
    }

    function updateStats() {
        var text = textInput.value;
        charCountEl.textContent = text.length;
        var words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
        wordCountEl.textContent = words;
        var lines = text.length === 0 ? 0 : text.split('\n').length;
        lineCountEl.textContent = lines;
        var paragraphs = text.trim().length === 0 ? 0 : text.split(/\n\s*\n/).filter(function(p) {
            return p.trim().length > 0;
        }).length;
        paragraphCountEl.textContent = paragraphs;
    }

    function toUpperCase() {
        textInput.value = textInput.value.toUpperCase();
        updateStats();
        showToast('已转换为全部大写', 'success');
    }

    function toLowerCase() {
        textInput.value = textInput.value.toLowerCase();
        updateStats();
        showToast('已转换为全部小写', 'success');
    }

    function toCapitalize() {
        textInput.value = textInput.value.replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });
        updateStats();
        showToast('已转换为首字母大写', 'success');
    }

    function toToggleCase() {
        var result = '';
        for (var i = 0; i < textInput.value.length; i++) {
            var char = textInput.value[i];
            if (char === char.toUpperCase()) {
                result += char.toLowerCase();
            } else {
                result += char.toUpperCase();
            }
        }
        textInput.value = result;
        updateStats();
        showToast('已互换大小写', 'success');
    }

    function trimSpaces() {
        var lines = textInput.value.split('\n');
        var result = lines.map(function(line) {
            return line.trim();
        }).join('\n');
        textInput.value = result;
        updateStats();
        showToast('已去除首尾空格', 'success');
    }

    function removeAllSpaces() {
        textInput.value = textInput.value.replace(/\s+/g, '');
        updateStats();
        showToast('已去除所有空格', 'success');
    }

    function removeExtraSpaces() {
        var result = textInput.value
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n');
        textInput.value = result;
        updateStats();
        showToast('已合并多余空格', 'success');
    }

    function removeLineBreaks() {
        textInput.value = textInput.value.replace(/[\r\n]+/g, '');
        updateStats();
        showToast('已去除换行符', 'success');
    }

    function removeDuplicateLines() {
        var lines = textInput.value.split('\n');
        var seen = {};
        var result = [];
        for (var i = 0; i < lines.length; i++) {
            if (!seen.hasOwnProperty(lines[i])) {
                seen[lines[i]] = true;
                result.push(lines[i]);
            }
        }
        textInput.value = result.join('\n');
        updateStats();
        showToast('已去除重复行', 'success');
    }

    function removeEmptyLines() {
        var lines = textInput.value.split('\n');
        var result = lines.filter(function(line) {
            return line.trim().length > 0;
        });
        textInput.value = result.join('\n');
        updateStats();
        showToast('已去除空行', 'success');
    }

    function sortLinesAsc() {
        var lines = textInput.value.split('\n');
        lines.sort(function(a, b) {
            return a.localeCompare(b, 'zh-CN');
        });
        textInput.value = lines.join('\n');
        updateStats();
        showToast('已升序排序', 'success');
    }

    function sortLinesDesc() {
        var lines = textInput.value.split('\n');
        lines.sort(function(a, b) {
            return b.localeCompare(a, 'zh-CN');
        });
        textInput.value = lines.join('\n');
        updateStats();
        showToast('已降序排序', 'success');
    }

    function reverseLines() {
        var lines = textInput.value.split('\n');
        lines.reverse();
        textInput.value = lines.join('\n');
        updateStats();
        showToast('已行倒序', 'success');
    }

    function shuffleLines() {
        var lines = textInput.value.split('\n');
        for (var i = lines.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = lines[i];
            lines[i] = lines[j];
            lines[j] = temp;
        }
        textInput.value = lines.join('\n');
        updateStats();
        showToast('已随机打乱', 'success');
    }

    function replaceText() {
        var searchText = searchTextEl.value;
        var replaceWith = replaceTextEl.value;

        if (searchText.length === 0) {
            showToast('请输入查找内容', 'error');
            return;
        }

        try {
            var result;
            if (useRegexEl.checked) {
                var flags = caseSensitiveEl.checked ? 'g' : 'gi';
                var regex = new RegExp(searchText, flags);
                result = textInput.value.replace(regex, replaceWith);
            } else {
                var escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                var flags = caseSensitiveEl.checked ? 'g' : 'gi';
                var regex = new RegExp(escapedSearch, flags);
                result = textInput.value.replace(regex, replaceWith);
            }
            textInput.value = result;
            updateStats();
            showToast('替换完成', 'success');
        } catch (e) {
            showToast('正则表达式语法错误', 'error');
        }
    }

    function copyResult() {
        if (textInput.value.length === 0) {
            showToast('没有内容可复制', 'error');
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textInput.value).then(function() {
                showToast('已复制到剪贴板', 'success');
            }).catch(function() {
                fallbackCopy();
            });
        } else {
            fallbackCopy();
        }
    }

    function fallbackCopy() {
        textInput.select();
        textInput.setSelectionRange(0, textInput.value.length);
        try {
            document.execCommand('copy');
            showToast('已复制到剪贴板', 'success');
        } catch (e) {
            showToast('复制失败，请手动复制', 'error');
        }
        window.getSelection().removeAllRanges();
    }

    function clearContent() {
        if (textInput.value.length === 0) {
            showToast('内容已为空', 'error');
            return;
        }
        textInput.value = '';
        updateStats();
        showToast('已清空内容', 'success');
    }

    var actions = {
        toUpperCase: toUpperCase,
        toLowerCase: toLowerCase,
        toCapitalize: toCapitalize,
        toToggleCase: toToggleCase,
        trimSpaces: trimSpaces,
        removeAllSpaces: removeAllSpaces,
        removeExtraSpaces: removeExtraSpaces,
        removeLineBreaks: removeLineBreaks,
        removeDuplicateLines: removeDuplicateLines,
        removeEmptyLines: removeEmptyLines,
        sortLinesAsc: sortLinesAsc,
        sortLinesDesc: sortLinesDesc,
        reverseLines: reverseLines,
        shuffleLines: shuffleLines,
        replaceText: replaceText,
        copyResult: copyResult,
        clearContent: clearContent
    };

    function handleButtonClick(e) {
        var target = e.target;
        if (target.tagName === 'BUTTON' && target.hasAttribute('data-action')) {
            var action = target.getAttribute('data-action');
            if (actions[action]) {
                actions[action]();
            }
        }
    }

    function init() {
        updateStats();
        textInput.addEventListener('input', updateStats);
        document.querySelector('.toolbar').addEventListener('click', handleButtonClick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
