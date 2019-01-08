//最简单的方式:通过replace函数
(function() {
	var target = '<div class="content"><%= name %></div>'
	var data = {
		name: 'kebin'
	}
	var tpl = template(target, data)

	function template(tpl, data) {
		return tpl.replace(/<%=([^%>]+)%>/g, function(s0, s1) {
			return data[s1.trim()]
		})
	}
})();

//复杂方式
//原理
// var fn = new Function("data", "var r = []; for(var i in data){ r.push(data[i]); } return r.join(' ')");
// var ret = fn({"name": "barretlee", "age": "20"}); 
// console.log(ret)// barretlee 20

(function() {
	var tplEngine = function(tpl, data) {
		var reg = /<%([^%>]+)?%>/g,
			regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
			code = 'var r=[];\n',
			cursor = 0;

		var add = function(line, js) {
			js ? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
				(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
			return add;
		}
		while (match = reg.exec(tpl)) {
			add(tpl.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}
		add(tpl.substr(cursor, tpl.length - cursor));
		code += 'return r.join("");';
		return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
	};

	var tpl = '<% for(var i = 0; i < this.posts.length; i++) {' + 　
		'var post = posts[i]; %>' +
		'<% if(!post.expert){ %>' +
		'<span>post is null</span>' +
		'<% } else { %>' +
		'<a href="#"><% post.expert %> at <% post.time %></a>' +
		'<% } %>' +
		'<% } %>';

	var data = {
		"posts": [{
			"expert": "content 1",
			"time": "yesterday"
		}, {
			"expert": "content 2",
			"time": "today"
		}, {
			"expert": "content 3",
			"time": "tomorrow"
		}, {
			"expert": "",
			"time": "eee"
		}]
	};

	tplEngine(tpl, data);
})()