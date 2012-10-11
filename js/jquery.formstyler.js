/*
 * Bootstrap Form Styler v1.0
 * Copyright 2012 Alexander Mamay (http://alexander.mamay.su/)
 *
 * Based on: 
 *
 * jQuery Form Styler v1.0
 * http://dimox.name/jquery-form-styler/
 *
 * Copyright 2012 Dimox (http://dimox.name/)
 * Released under the MIT license.
 *
 */

(function($) {
	$.fn.styler = function(opt) {

		var opt = $.extend({
			browseText: 'Select file'
		}, opt);

		return this.each(function() {
			var el = $(this);

			if (el.is(':checkbox')) {
				el.css({position: 'absolute', left: '-9999px'}).each(function() {
					if (el.next('span.fs_checkbox').length < 1) {
						var span = $('<span class="fs_checkbox" style="display:inline-block"><span></span></span>');
						el.after(span);
						if (el.is(':checked')) span.addClass('checked');
						if (el.is(':disabled')) span.addClass('disabled');
						// клик на псевдочекбокс
						span.click(function() {
							if (!span.is('.disabled')) {
								if (el.is(':checked')) {
									el.removeAttr('checked');
									span.removeClass('checked');
								} else {
									el.attr('checked', true);
									span.addClass('checked');
								}
								el.change();
								return false;
							}
						});
						// клик на label
						el.parent('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
							span.click();
							e.preventDefault();
						});
						// переключение по Space или Enter
						el.change(function() {
							if (el.is(':checked')) span.addClass('checked');
							else span.removeClass('checked');
						})
						// чтобы переключался чекбокс, который находится в теге label
						.keydown(function(e) {
							if (el.parent('label').length && (e.which == 13 || e.which == 32)) span.click();
						})
						.focus(function() {
							if (!span.is('.disabled')) span.addClass('focused');
						})
						.blur(function() {
							span.removeClass('focused');
						});
						// обновление при динамическом изменении
						el.on('refresh', function() {
							if (el.is(':checked')) span.addClass('fs_checked');
								else span.removeClass('fs_checked');
							if (el.is(':disabled')) span.addClass('disabled');
								else span.removeClass('disabled');
						})
					}
				});
			// end :checkbox
			} else if (el.is(':radio')) {
				el.css({position: 'absolute', left: '-9999px'}).each(function() {
					if (el.next('span.fs_radio').length < 1) {
						var span = $('<span class="fs_radio" style="display:inline-block"><span></span></span>');
						el.after(span);
						if (el.is(':checked')) span.addClass('checked');
						if (el.is(':disabled')) span.addClass('disabled');
						// клик на псевдорадиокнопке
						span.click(function() {
							if (!span.is('.disabled')) {
								$('input[name="' + el.attr('name') + '"]').next().removeClass('checked');
								el.attr('checked', true).next().addClass('checked');
								return false;
							}
						});
						// клик на label
						el.parent('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
							span.click();
							e.preventDefault();
						});
						// переключение стрелками
						el.change(function() {
							span.click();
						})
						.focus(function() {
							if (!span.is('.disabled')) span.addClass('focused');
						})
						.blur(function() {
							span.removeClass('focused');
						});
						// обновление при динамическом изменении
						el.on('refresh', function() {
							if (el.is(':checked')) {
								$('input[name="' + el.attr('name') + '"]').next().removeClass('checked');
								span.addClass('checked');
							}
							if (el.is(':disabled')) span.addClass('disabled');
								else span.removeClass('disabled');
						})
					}
				});
			// end :radio
			} else if (el.is(':file')) {
				el.css({position: 'absolute', left: '-9999px'}).each(function() {
					if (el.next('span.file').length < 1) {
						var file = $('<div class="input-append" style="display:inline-block;"></div>');
						var name = $('<input type="text" readonly="readonly" style="float:left">').appendTo(file);
						var browse = $('<button class="btn" style="float:left">' + opt.browseText + '</button>').appendTo(file);
						el.after(file);
						file.on('click', function() {	el.click(); });
						el.change(function() { name.val(el.val().replace(/.+[\\\/]/, '')); });
					}
				});
			// end :file
			} else if (el.is('select')) {
				el.each(function() {
					if (el.prev('span.selectbox').length < 1) {
						function doSelect() {
							var option = el.find('option');
							var optionSelected = option.filter(':selected');
							var optionText = option.filter(':first').text();
							if (optionSelected.length) optionText = optionSelected.text();
							var ddlist = '';
							for (i = 0; i < option.length; i++) {
								var selected = '';
								var disabled = ' class="disabled"';
								if (option.eq(i).is(':selected')) selected = ' class="fs_selected sel"';
								if (option.eq(i).is(':disabled')) selected = disabled;
								ddlist += '<li' + selected + '>'+ option.eq(i).text() +'</li>';
							}
							var selectbox =
								$('<span class="selectbox" style="display:inline-block;position:relative">'+
										'<div class="fs_select" style="float:left;position:relative;z-index:10000"><div class="text">' + optionText + '</div>'+
											'<b class="trigger"><i class="arrow"></i></b>'+
										'</div>'+
										'<div class="fs_dropdown" style="position:absolute;z-index:9999;overflow:auto;overflow-x:hidden;list-style:none">'+
											'<ul>' + ddlist + '</ul>'+
										'</div>'+
									'</span>');
							el.before(selectbox).css({position: 'absolute', top: -9999});
							var divSelect = selectbox.find('div.fs_select');
							var divText = selectbox.find('div.text');
							var dropdown = selectbox.find('div.fs_dropdown');
							var li = dropdown.find('li');
							var selectHeight = selectbox.outerHeight();
							if (dropdown.css('left') == 'auto') dropdown.css({left: 0});
							if (dropdown.css('top') == 'auto') dropdown.css({top: selectHeight});
							var liHeight = li.outerHeight();
							var position = dropdown.css('top');
							dropdown.hide();
							/* при клике на псевдоселекте */
							divSelect.click(function() {
								/* умное позиционирование */
								var topOffset = selectbox.offset().top;
								var bottomOffset = $(window).height() - selectHeight - (topOffset - $(window).scrollTop());
								if (bottomOffset < 0 || bottomOffset < liHeight * 6)	{
									dropdown.height('auto').css({top: 'auto', bottom: position});
									if (dropdown.outerHeight() > topOffset - $(window).scrollTop() - 20 ) {
										dropdown.height(Math.floor((topOffset - $(window).scrollTop() - 20) / liHeight) * liHeight);
									}
								} else if (bottomOffset > liHeight * 6) {
									dropdown.height('auto').css({bottom: 'auto', top: position});
									if (dropdown.outerHeight() > bottomOffset - 20 ) {
										dropdown.height(Math.floor((bottomOffset - 20) / liHeight) * liHeight);
									}
								}
								$('span.selectbox').css({zIndex: 1}).removeClass('focused');
								selectbox.css({zIndex: 2});
								if (dropdown.is(':hidden')) {
									$('div.fs_dropdown:visible').hide();
									dropdown.show();
								} else {
									dropdown.hide();
								}
								return false;
							});
							/* при наведении курсора на пункт списка */
							li.hover(function() {
								$(this).siblings().removeClass('fs_selected');
							});
							var selectedText = li.filter('.fs_selected').text();
							/* при клике на пункт списка */
							li.filter(':not(.disabled)').click(function() {
								var liText = $(this).text();
								if (selectedText != liText) {
									$(this).addClass('fs_selected sel').siblings().removeClass('fs_selected sel');
									option.removeAttr('selected').eq($(this).index()).attr('selected', true);
									selectedText = liText;
									divText.text(liText);
									el.change();
								}
								dropdown.hide();
							});
							dropdown.mouseout(function() {
								dropdown.find('li.sel').addClass('fs_selected');
							});
							/* фокус на селекте */
							el.focus(function() {
								$('span.selectbox').removeClass('focused');
								selectbox.addClass('focused');
							})
							/* меняем селект с клавиатуры */
							.keyup(function() {
								divText.text(option.filter(':selected').text());
								li.removeClass('fs_selected sel').eq(option.filter(':selected').index()).addClass('fs_selected sel');
							});
							/* прячем выпадающий список при клике за пределами селекта */
							$(document).on('click', function(e) {
								if (!$(e.target).parents().hasClass('selectbox')) {
									dropdown.hide().find('li.sel').addClass('fs_selected');
									selectbox.removeClass('focused');
								}
							});
						}
						doSelect();
						// обновление при динамическом изменении
						el.on('refresh', function() {
							el.prev().remove();
							doSelect();
						})
					}
				});
			// end select
			}

		});

	}
})(jQuery)