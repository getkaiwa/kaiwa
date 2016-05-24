(function () {
var root = this, exports = {};

// The jade runtime:
var jade = exports.jade=function(exports){Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.merge=function merge(a,b){var ac=a["class"],bc=b["class"];if(ac||bc)ac=ac||[],bc=bc||[],Array.isArray(ac)||(ac=[ac]),Array.isArray(bc)||(bc=[bc]),ac=ac.filter(nulls),bc=bc.filter(nulls),a["class"]=ac.concat(bc).join(" ");for(var key in b)key!="class"&&(a[key]=b[key]);return a};function nulls(val){return val!=null}return exports.attrs=function attrs(obj,escaped){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):0==key.indexOf("data")&&"string"!=typeof val?buf.push(key+"='"+JSON.stringify(val)+"'"):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):escaped&&escaped[key]?buf.push(key+'="'+exports.escape(val)+'"'):buf.push(key+'="'+val+'"')}}return buf.join(" ")},exports.escape=function escape(html){return String(html).replace(/&(?!(\w+|\#\d+);)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function rethrow(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err},exports}({});

// create our folder objects
exports.includes = {};
exports.misc = {};
exports.pages = {};

// body.jade compiled template
exports.body = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<body><div id="updateBar"><p>Update available!</p><button class="primary upgrade">Upgrade</button></div><div id="wrapper"><input type="checkbox" id="toggle-sidebar"/><label for="toggle-sidebar" class="toggle-sidebar-label"><svg height="32" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"></path></svg></label><aside id="menu"><label for="toggle-sidebar" class="toggle-sidebar-label"><svg height="32" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"></path></svg></label><section id="organization"><span id="orga_name"></span><a href="/" class="button secondary settings"><svg id="settingssvg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 25 25" height="25" width="25"><g transform="scale(0.4)"><path d="M37.418,34.3c-2.1-2.721-2.622-6.352-1.292-9.604c0.452-1.107,1.104-2.1,1.902-2.951 c-0.753-0.877-1.573-1.697-2.507-2.387l-2.609,1.408c-1.05-0.629-2.194-1.112-3.414-1.421l-0.845-2.833 c-0.75-0.112-1.512-0.188-2.287-0.188c-0.783,0-1.54,0.075-2.288,0.188l-0.851,2.833c-1.215,0.309-2.355,0.792-3.41,1.421 l-2.614-1.408c-1.229,0.912-2.318,2-3.228,3.231l1.404,2.612c-0.628,1.053-1.11,2.193-1.419,3.411l-2.832,0.849 c-0.114,0.75-0.187,1.508-0.187,2.287c0,0.778,0.073,1.537,0.187,2.286l2.832,0.848c0.309,1.22,0.791,2.36,1.419,3.413l-1.404,2.61 c0.909,1.231,1.999,2.321,3.228,3.231l2.614-1.406c1.055,0.628,2.195,1.11,3.41,1.42l0.851,2.832 c0.748,0.114,1.505,0.188,2.288,0.188c0.775,0,1.537-0.074,2.287-0.188l0.845-2.832c1.224-0.31,2.364-0.792,3.414-1.42l0.062,0.033 l2.045-3.02L37.418,34.3z M26.367,36.776c-2.777,0-5.027-2.253-5.027-5.027c0-2.775,2.25-5.028,5.027-5.028 c2.774,0,5.024,2.253,5.024,5.028C31.391,34.523,29.141,36.776,26.367,36.776z"></path><path d="M51.762,24.505l-1.125-0.459l-1.451,3.55c-0.814,1.993-2.832,3.054-4.505,2.37l-0.355-0.144 c-1.673-0.686-2.37-2.856-1.558-4.849l1.451-3.551l-1.125-0.46c-2.225,0.608-4.153,2.2-5.092,4.501 c-1.225,2.997-0.422,6.312,1.771,8.436l-2.958,6.812l-2.204,3.249l-0.007,2.281l5.275,2.154l1.593-1.633l0.7-3.861l2.901-6.836 c3.049,0.018,5.947-1.785,7.174-4.779C53.186,28.983,52.924,26.499,51.762,24.505z"></path></g></svg></a></section><div class="viewport"><section id="bookmarks"><h1>Rooms</h1><nav></nav><input type="text" placeholder="add a room" id="joinmuc" class="inline"/></section><section id="roster"><h1>Contacts</h1><ul id="contactrequests"></ul><nav></nav><input type="text" placeholder="add a contact" id="addcontact" class="inline"/></section></div><section id="kaiwaNotice">Powered by<a href="http://getkaiwa.com" target="_blank"><img src="/images/logo.png" alt="Kaiwa"/></a></section></aside><header id="topbar"><div id="connectionStatus"><p>You\'re currently&nbsp;<strong>disconnected</strong></p><button class="primary reconnect">Reconnect</button></div><div id="me"><img class="avatar"/><div><span class="name"></span><span contenteditable="true" spellcheck="false" class="status"></span></div></div></header><main id="pages"></main></div></body>');
    }
    return buf.join("");
};

// head.jade compiled template
exports.head = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/><meta name="apple-mobile-web-app-capable" content="yes"/><link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Lato:400,700"/><link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"/>');
    }
    return buf.join("");
};

// bareMessage.jade compiled template
exports.includes.bareMessage = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        var messageClasses = [ "message", "message.classList" ];
        if (firstEl) {
            messageClasses.push("first");
        }
        buf.push("<div" + jade.attrs({
            id: "chat" + message.cid,
            "class": messageClasses
        }, {
            id: true,
            "class": true
        }) + "><div" + jade.attrs({
            title: messageDate.format("{Dow}, {MM}/{dd}/{yyyy} - {h}:{mm} {Tt}"),
            "class": "date"
        }, {
            title: true
        }) + ">" + jade.escape((jade.interp = messageDate.format("{h}:{mm} {tt}")) == null ? "" : jade.interp) + '</div><p class="body">' + ((jade.interp = message.processedBody) == null ? "" : jade.interp) + "</p>");
        var urls = message.urls;
        buf.push('<section class="embeds">');
        (function() {
            var $$obj = urls;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    if (item.source == "body") {
                        buf.push('<section class="embed hidden"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    } else {
                        buf.push('<section class="embed"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    }
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var item = $$obj[$index];
                        if (item.source == "body") {
                            buf.push('<section class="embed hidden"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        } else {
                            buf.push('<section class="embed"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        }
                    }
                }
            }
        }).call(this);
        buf.push("</section></div>");
    }
    return buf.join("");
};

// call.jade compiled template
exports.includes.call = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div class="call"><img class="callerAvatar"/><h1 class="caller"><span class="callerName"></span><span class="callerNumber"></span></h1><h2 class="callTime"></h2><div class="callActions"><button class="answer">Answer</button><button class="ignore">Ignore</button><button class="cancel">Cancel</button><button class="end">End</button><button class="mute">Mute</button><button class="unmute">Unmute</button></div></div>');
    }
    return buf.join("");
};

// contactListGroupItem.jade compiled template
exports.includes.contactListGroupItem = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li class="group"><input' + jade.attrs({
            type: "checkbox",
            id: contactgroup.cid
        }, {
            type: true,
            id: true
        }) + "/><label" + jade.attrs({
            "for": contactgroup.cid
        }, {
            "for": true
        }) + '><div class="wrap"><span class="name">' + jade.escape(null == (jade.interp = contactgroup.name) ? "" : jade.interp) + '</span></div></label><ul class="group-entries"></ul></li>');
    }
    return buf.join("");
};

// contactListItem.jade compiled template
exports.includes.contactListItem = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li class="contact joined"><div class="wrap"><i class="remove fa fa-times-circle"></i><i class="presence fa fa-circle"></i><div class="user"><img class="avatar"/><span class="name">' + jade.escape(null == (jade.interp = contact.displayName) ? "" : jade.interp) + '</span></div><div class="unread">' + jade.escape(null == (jade.interp = contact.unreadCount) ? "" : jade.interp) + "</div></div></li>");
    }
    return buf.join("");
};

// contactListItemResource.jade compiled template
exports.includes.contactListItemResource = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li><p class="jid">' + jade.escape(null == (jade.interp = resource.jid) ? "" : jade.interp) + '</p><p class="status">' + jade.escape(null == (jade.interp = resource.status) ? "" : jade.interp) + "</p></li>");
    }
    return buf.join("");
};

// contactRequest.jade compiled template
exports.includes.contactRequest = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li><div class="jid"></div><div class="response"><button class="primary small approve">Approve</button><button class="secondary small deny">Deny</button></div></li>');
    }
    return buf.join("");
};

// dayDivider.jade compiled template
exports.includes.dayDivider = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li class="day_divider"><hr/><div class="day_divider_name">' + jade.escape((jade.interp = day_name) == null ? "" : jade.interp) + "</div></li>");
    }
    return buf.join("");
};

// embeds.jade compiled template
exports.includes.embeds = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        if (locals.type === "photo") {
            buf.push('<section class="embed active"><a' + jade.attrs({
                href: locals.original,
                target: "_blank",
                "class": "photo"
            }, {
                href: true,
                target: true
            }) + "><img" + jade.attrs({
                width: locals.width,
                height: locals.height,
                src: locals.url,
                alt: locals.title,
                "class": "embedded"
            }, {
                width: true,
                height: true,
                src: true,
                alt: true
            }) + "/>");
            if (locals.title || locals.description) {
                buf.push('<div class="description">');
                if (locals.title) {
                    buf.push("<h3>" + jade.escape(null == (jade.interp = locals.title) ? "" : jade.interp) + "</h3>");
                }
                if (locals.description) {
                    buf.push("<p>" + jade.escape(null == (jade.interp = locals.description) ? "" : jade.interp) + "</p>");
                }
                buf.push("</div>");
            }
            buf.push("</a></section>");
        } else if (locals.type === "video" && locals.thumbnail_url) {
            buf.push('<section class="embed active"><a' + jade.attrs({
                href: locals.original,
                target: "_blank",
                "class": "preview"
            }, {
                href: true,
                target: true
            }) + "><img" + jade.attrs({
                width: locals.width,
                height: locals.height,
                src: locals.thumbnail_url,
                alt: locals.title,
                "class": "embedded"
            }, {
                width: true,
                height: true,
                src: true,
                alt: true
            }) + "/>");
            if (locals.title || locals.description) {
                buf.push('<div class="description">');
                if (locals.title) {
                    buf.push("<h3>" + jade.escape(null == (jade.interp = locals.title) ? "" : jade.interp) + "</h3>");
                }
                if (locals.description) {
                    buf.push("<p>" + jade.escape(null == (jade.interp = locals.description) ? "" : jade.interp) + "</p>");
                }
                buf.push("</div>");
            }
            buf.push("</a></section>");
        }
    }
    return buf.join("");
};

// ldapUserItem.jade compiled template
exports.includes.ldapUserItem = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li class="ldapUser"><span class="name"></span><span class="delete fa fa-trash"></span><span class="fa fa-plus"></span><div class="wrap"><span class="inputLabel">Display Name</span><input type="text" class="displayName"/><span class="inputLabel">First Name</span><input type="text" class="givenName"/><span class="inputLabel">Last Name</span><input type="text" class="sn"/><span class="inputLabel">Email</span><input type="text" class="mail"/><button class="primary small changePassword">Change Password</button></div></li>');
    }
    return buf.join("");
};

// message.jade compiled template
exports.includes.message = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li><div class="message"><span class="timestamp">' + jade.escape(null == (jade.interp = message.timestamp) ? "" : jade.interp) + '</span><p class="body">' + jade.escape(null == (jade.interp = message.body) ? "" : jade.interp) + "</p></div></li>");
    }
    return buf.join("");
};

// messageGroup.jade compiled template
exports.includes.messageGroup = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push("<li></li>");
    }
    return buf.join("");
};

// mucBareMessage.jade compiled template
exports.includes.mucBareMessage = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        var messageClasses = [ "message", "message.classList" ];
        if (firstEl) {
            messageClasses.push("first");
        }
        buf.push("<div" + jade.attrs({
            id: "chat" + message.cid,
            "class": messageClasses
        }, {
            id: true,
            "class": true
        }) + "><div" + jade.attrs({
            title: messageDate.format("{Dow}, {MM}/{dd}/{yyyy} - {h}:{mm} {Tt}"),
            "class": "date"
        }, {
            title: true
        }) + ">" + jade.escape((jade.interp = messageDate.format("{h}:{mm} {tt}")) == null ? "" : jade.interp) + '</div><p class="body">' + ((jade.interp = message.processedBody) == null ? "" : jade.interp) + "</p>");
        var urls = message.urls;
        buf.push('<section class="embeds">');
        (function() {
            var $$obj = urls;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    if (item.source == "body") {
                        buf.push('<section class="embed hidden"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    } else {
                        buf.push('<section class="embed"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    }
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var item = $$obj[$index];
                        if (item.source == "body") {
                            buf.push('<section class="embed hidden"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        } else {
                            buf.push('<section class="embed"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        }
                    }
                }
            }
        }).call(this);
        buf.push("</section></div>");
    }
    return buf.join("");
};

// mucListItem.jade compiled template
exports.includes.mucListItem = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li class="contact"><div class="wrap"><i class="remove fa fa-times-circle"></i><i class="join fa fa-sign-in"></i><div class="unread">' + jade.escape(null == (jade.interp = contact.unreadCount) ? "" : jade.interp) + '</div><span class="name">' + jade.escape(null == (jade.interp = contact.displayName) ? "" : jade.interp) + "</span></div></li>");
    }
    return buf.join("");
};

// mucRosterItem.jade compiled template
exports.includes.mucRosterItem = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li class="online"><div class="name"></div></li>');
    }
    return buf.join("");
};

// mucWrappedMessage.jade compiled template
exports.includes.mucWrappedMessage = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li><div class="sender"><a href="#" class="messageAvatar"><img' + jade.attrs({
            src: message.sender.getAvatar(message.from.full),
            alt: message.from.resource,
            "data-placement": "below"
        }, {
            src: true,
            alt: true,
            "data-placement": true
        }) + '/></a></div><div class="messageWrapper"><div class="message_header"><div class="name">' + jade.escape((jade.interp = message.sender.getName(message.from.full)) == null ? "" : jade.interp) + '</div><div class="nickname">' + jade.escape((jade.interp = message.sender.getNickname(message.from.full)) == null ? "" : jade.interp) + "</div><div" + jade.attrs({
            title: messageDate.format("{Dow}, {MM}/{dd}/{yyyy} - {h}:{mm} {Tt}"),
            "class": "date"
        }, {
            title: true
        }) + ">" + jade.escape((jade.interp = messageDate.format("{h}:{mm} {tt}")) == null ? "" : jade.interp) + "</div></div>");
        var messageClasses = [ "message", "message.classList" ];
        if (firstEl) {
            messageClasses.push("first");
        }
        buf.push("<div" + jade.attrs({
            id: "chat" + message.cid,
            "class": messageClasses
        }, {
            id: true,
            "class": true
        }) + "><div" + jade.attrs({
            title: messageDate.format("{Dow}, {MM}/{dd}/{yyyy} - {h}:{mm} {Tt}"),
            "class": "date"
        }, {
            title: true
        }) + ">" + jade.escape((jade.interp = messageDate.format("{h}:{mm} {tt}")) == null ? "" : jade.interp) + '</div><p class="body">' + ((jade.interp = message.processedBody) == null ? "" : jade.interp) + "</p>");
        var urls = message.urls;
        buf.push('<section class="embeds">');
        (function() {
            var $$obj = urls;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    if (item.source == "body") {
                        buf.push('<section class="embed hidden"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    } else {
                        buf.push('<section class="embed"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    }
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var item = $$obj[$index];
                        if (item.source == "body") {
                            buf.push('<section class="embed hidden"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        } else {
                            buf.push('<section class="embed"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        }
                    }
                }
            }
        }).call(this);
        buf.push("</section></div></div></li>");
    }
    return buf.join("");
};

// wrappedMessage.jade compiled template
exports.includes.wrappedMessage = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<li><div class="sender"><a href="#" class="messageAvatar"><img' + jade.attrs({
            src: message.sender.avatar,
            alt: message.sender.displayName,
            "data-placement": "below"
        }, {
            src: true,
            alt: true,
            "data-placement": true
        }) + '/></a></div><div class="messageWrapper"><div class="message_header"><div class="name">' + jade.escape((jade.interp = message.sender.displayName) == null ? "" : jade.interp) + "</div><div" + jade.attrs({
            title: messageDate.format("{Dow}, {MM}/{dd}/{yyyy} - {h}:{mm} {Tt}"),
            "class": "date"
        }, {
            title: true
        }) + ">" + jade.escape((jade.interp = messageDate.format("{h}:{mm} {tt}")) == null ? "" : jade.interp) + "</div></div>");
        var messageClasses = [ "message", "message.classList" ];
        if (firstEl) {
            messageClasses.push("first");
        }
        buf.push("<div" + jade.attrs({
            id: "chat" + message.cid,
            "class": messageClasses
        }, {
            id: true,
            "class": true
        }) + "><div" + jade.attrs({
            title: messageDate.format("{Dow}, {MM}/{dd}/{yyyy} - {h}:{mm} {Tt}"),
            "class": "date"
        }, {
            title: true
        }) + ">" + jade.escape((jade.interp = messageDate.format("{h}:{mm} {tt}")) == null ? "" : jade.interp) + '</div><p class="body">' + ((jade.interp = message.processedBody) == null ? "" : jade.interp) + "</p>");
        var urls = message.urls;
        buf.push('<section class="embeds">');
        (function() {
            var $$obj = urls;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var item = $$obj[$index];
                    if (item.source == "body") {
                        buf.push('<section class="embed hidden"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    } else {
                        buf.push('<section class="embed"><a' + jade.attrs({
                            href: item.href,
                            "class": "source"
                        }, {
                            href: true
                        }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                    }
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var item = $$obj[$index];
                        if (item.source == "body") {
                            buf.push('<section class="embed hidden"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        } else {
                            buf.push('<section class="embed"><a' + jade.attrs({
                                href: item.href,
                                "class": "source"
                            }, {
                                href: true
                            }) + ">" + jade.escape(null == (jade.interp = item.desc) ? "" : jade.interp) + "</a></section>");
                        }
                    }
                }
            }
        }).call(this);
        buf.push("</section></div></div></li>");
    }
    return buf.join("");
};

// growlMessage.jade compiled template
exports.misc.growlMessage = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div class="growlMessage">');
        if (icon) {
            buf.push("<img" + jade.attrs({
                src: icon,
                height: "30",
                width: "30"
            }, {
                src: true,
                height: true,
                width: true
            }) + "/>");
        }
        if (title) {
            buf.push("<h1>" + jade.escape(null == (jade.interp = title) ? "" : jade.interp) + "</h1>");
        }
        if (description) {
            buf.push("<p>" + jade.escape(null == (jade.interp = description) ? "" : jade.interp) + "</p>");
        }
        buf.push("</div>");
    }
    return buf.join("");
};

// chat.jade compiled template
exports.pages.chat = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<section class="page chat"><section class="conversation"><header><div class="title"><span class="name"></span><i class="user_presence fa fa-circle"></i><span class="status"></span></div><div class="tzo"></div></header><ul class="messages scroll-container"></ul><div class="activeCall"><div class="container"><video autoplay="autoplay" class="remote"></video><video autoplay="autoplay" muted="muted" class="local"></video><aside class="button-wrap"><button class="accept primary">Accept</button><button class="end secondary">End</button><div class="button-group outlined"><button class="mute">Mute</button><button class="unmute">Unmute</button></div></aside></div></div><div class="chatBox"><div class="contactState"></div><form class="formwrap"><textarea name="chatInput" type="text" placeholder="Send a message..." autocomplete="off"></textarea></form><button class="primary small call">Call</button></div></section></section>');
    }
    return buf.join("");
};

// groupchat.jade compiled template
exports.pages.groupchat = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<section class="page chat"><section class="group conversation"><header class="online"><div class="title"><span class="name"></span><i class="channel_actions fa fa-comments-o"></i><span contenteditable="true" spellcheck="false" class="status"></span></div></header><ul class="messages"></ul><a id="members_toggle"><i class="fa fa-user"></i><span id="members_toggle_count"></span></a><ul class="groupRoster"></ul><div class="chatBox"><ul class="autoComplete"></ul><form class="formwrap"><textarea name="chatInput" type="text" placeholder="Send a message..." autocomplete="off"></textarea></form></div></section></section>');
    }
    return buf.join("");
};

// settings.jade compiled template
exports.pages.settings = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<section class="page main"><h1 id="title">Settings</h1><div id="avatarChanger"><h4>Change Avatar</h4><div class="uploadRegion"><p>Drag and drop a new avatar here</p><img/><form><input id="uploader" type="file"/></form></div></div><div><h4>Desktop Integration</h4><button class="enableAlerts">Enable alerts</button><button class="primary installFirefox">Install app</button><button class="soundNotifs">sound notifications</button></div><div id="ldapSettings"><h4>LDAP settings</h4><ul id="ldapUsers"></ul><input type="text" placeholder="add a ldap user" id="newLdapUser"/></div><div><button class="disconnect">Disconnect</button><button class="primary logout">Logout</button></div></section>');
    }
    return buf.join("");
};

// signin.jade compiled template
exports.pages.signin = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<section class="page signin"><div id="loginForm"><form><label>JID:<input type="text" id="jid" placeholder="you@aweso.me"/></label><label>Password:<input type="password" id="password"/></label><label>WebSocket URL:<input type="text" id="wsURL" placeholder="wss://aweso.me:5281/xmpp-websocket"/></label><input type="submit" value="Connect" class="button primary"/></form></div></section>');
    }
    return buf.join("");
};


// attach to window or export with commonJS
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = exports;
} else if (typeof define === "function" && define.amd) {
    define(exports);
} else {
    root.templatizer = exports;
}

})();