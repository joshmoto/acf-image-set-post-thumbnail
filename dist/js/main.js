(()=>{var e,r={349:()=>{!function(e){var r=e("#acf-img-set-post-thumb-form"),o=null,s={};function t(o){var s=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,c=arguments.length>4&&void 0!==arguments[4]&&arguments[4],p=arguments.length>5&&void 0!==arguments[5]&&arguments[5];e.ajax({cache:!1,timeout:3e5,url:ajaxurl,method:"POST",data:{action:"process_images",security:acf_img_set_post_thumb_nonce,props:o,init:s,count:a,processed:i,exclude:c,done:p},success:function(o){var s=o.data;s.init&&(e('[type="submit"]',r).prop("disabled",!0),e(".logger",r).empty(),e(".progress-wrap",r).html('<div class="progress"><div class="progress-bar"></div></div>'),e(".progress-row, .logger-row",r).removeClass("row-hide"));var a=Math.round(100/s.count*s.processed*10)/10;s.done?o.success?(e(".progress-bar",r).width(a+"%").text(a+"%"),n("success",s)):n("error",s):o.success?(e(".progress-bar",r).width(a+"%").text(a+"%"),n("success",s),t(s.props,!1,s.count,s.processed,s.exclude,s.done)):(e(".logger",r).empty(),e(".progress-row",r).addClass("row-hide"),e(".logger-row",r).removeClass("row-hide"),n("error",s))},error:function(o){var s=o.data;setTimeout((function(){e(".logger",r).empty(),e(".progress-row",r).addClass("row-hide"),e(".logger-row",r).removeClass("row-hide"),s.log="An unknown problem has occurred!",n("error",s)}),1e3)}}).done((function(o){if(o.success){var s=o.data;s.done&&(n("done",s),e(".progress",r).addClass("progress-done"),e('[type="submit"]',r).prop("disabled",!1))}}))}function n(o){var s=arguments.length>1&&void 0!==arguments[1]&&arguments[1],t=e(".logger",r);"success"===o?e.each(s.log,(function(r,o){o.result?e(t).append("<strong>"+s.props.post_type+'</strong> <a href="'+o.edit_link+'" target="_blank" class="log-text-success">#'+r+"</a> post thumbnail has been set with acf image field <strong>"+s.props.acf_image_field+"</strong> attachment.<br/>"):e(t).append("<strong>"+s.props.post_type+'</strong> <a href="'+o.edit_link+'" target="_blank" class="log-text-error">#'+r+"</a> acf image field <strong>"+s.props.acf_image_field+"</strong> had no attachment id set.<br/>")})):"done"===o?e(t).append('<strong class="log-text-done">Process complete.</strong><br/>'):"error"===o&&s.log&&e(t).append(s.log+"<br/>"),e(t).animate({scrollTop:t.prop("scrollHeight")},{duration:250,easing:"linear"})}e(r).on("change",(function(r){r.preventDefault(),o=new FormData(this),s=Object.fromEntries(o),Object.hasOwn(s,"post_type")&&Object.hasOwn(s,"acf_image_field")&&e('[type="submit"]',this).prop("disabled",!1)})).on("submit",(function(e){if(e.preventDefault(),o=new FormData(this),s=Object.fromEntries(o),!0!==confirm("Are you sure you want to run this process?"))return!1;t(s)}))}(jQuery)},498:()=>{}},o={};function s(e){var t=o[e];if(void 0!==t)return t.exports;var n=o[e]={exports:{}};return r[e](n,n.exports,s),n.exports}s.m=r,e=[],s.O=(r,o,t,n)=>{if(!o){var a=1/0;for(l=0;l<e.length;l++){for(var[o,t,n]=e[l],i=!0,c=0;c<o.length;c++)(!1&n||a>=n)&&Object.keys(s.O).every((e=>s.O[e](o[c])))?o.splice(c--,1):(i=!1,n<a&&(a=n));if(i){e.splice(l--,1);var p=t();void 0!==p&&(r=p)}}return r}n=n||0;for(var l=e.length;l>0&&e[l-1][2]>n;l--)e[l]=e[l-1];e[l]=[o,t,n]},s.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),(()=>{var e={522:0,222:0};s.O.j=r=>0===e[r];var r=(r,o)=>{var t,n,[a,i,c]=o,p=0;if(a.some((r=>0!==e[r]))){for(t in i)s.o(i,t)&&(s.m[t]=i[t]);if(c)var l=c(s)}for(r&&r(o);p<a.length;p++)n=a[p],s.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return s.O(l)},o=self.webpackChunk=self.webpackChunk||[];o.forEach(r.bind(null,0)),o.push=r.bind(null,o.push.bind(o))})(),s.O(void 0,[222],(()=>s(349)));var t=s.O(void 0,[222],(()=>s(498)));t=s.O(t)})();
//# sourceMappingURL=main.js.map