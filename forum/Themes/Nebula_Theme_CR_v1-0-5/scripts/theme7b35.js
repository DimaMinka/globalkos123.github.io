// The purpose of this code is to fix the height of overflow: auto blocks, because some browsers can't figure it out for themselves.
function smf_codeBoxFix()
{
	var codeFix = document.getElementsByTagName('code');
	for (var i = codeFix.length - 1; i >= 0; i--)
	{
		if (is_webkit && codeFix[i].offsetHeight < 20)
			codeFix[i].style.height = (codeFix[i].offsetHeight + 20) + 'px';

		else if (is_ff && (codeFix[i].scrollWidth > codeFix[i].clientWidth || codeFix[i].clientWidth == 0))
			codeFix[i].style.overflow = 'scroll';

		else if ('currentStyle' in codeFix[i] && codeFix[i].currentStyle.overflow == 'auto' && (codeFix[i].currentStyle.height == '' || codeFix[i].currentStyle.height == 'auto') && (codeFix[i].scrollWidth > codeFix[i].clientWidth || codeFix[i].clientWidth == 0) && (codeFix[i].offsetHeight != 0))
			codeFix[i].style.height = (codeFix[i].offsetHeight + 24) + 'px';
	}
}

// Add a fix for code stuff?
if ((is_ie && !is_ie4) || is_webkit || is_ff)
	addLoadEvent(smf_codeBoxFix);

// Toggles the element height and width styles of an image.
function smc_toggleImageDimensions()
{
	var oImages = document.getElementsByTagName('IMG');
	for (oImage in oImages)
	{
		// Not a resized image? Skip it.
		if (oImages[oImage].className == undefined || oImages[oImage].className.indexOf('bbc_img resized') == -1)
			continue;

		oImages[oImage].style.cursor = 'pointer';
		oImages[oImage].onclick = function() {
			this.style.width = this.style.height = this.style.width == 'auto' ? null : 'auto';
		};
	}
}

// Add a load event for the function above.
addLoadEvent(smc_toggleImageDimensions);

// Adds a button to a certain button strip.
function smf_addButton(sButtonStripId, bUseImage, oOptions)
{
	var oButtonStrip = document.getElementById(sButtonStripId);
	var aItems = oButtonStrip.getElementsByTagName('span');

	// Remove the 'last' class from the last item.
	if (aItems.length > 0)
	{
		var oLastSpan = aItems[aItems.length - 1];
		oLastSpan.className = oLastSpan.className.replace(/\s*last/, 'position_holder');
	}

	// Add the button.
	var oNewButton = document.createElement('span');
	setInnerHTML(oNewButton, '<a class="btn btn-info button_strip_merge" href="' + oOptions.sUrl + '" ' + ('sCustom' in oOptions ? oOptions.sCustom : '') + '><span class="last"' + ('sId' in oOptions ? ' id="' + oOptions.sId + '"': '') + '>' + oOptions.sText + '</span></a>');

	oButtonStrip.getElementsByTagName('div')[0].appendChild(oNewButton);
}

// Adds hover events to list items. Used for a versions of IE that don't support this by default.
var smf_addListItemHoverEvents = function()
{
	var cssRule, newSelector;

	// Add a rule for the list item hover event to every stylesheet.
	for (var iStyleSheet = 0; iStyleSheet < document.styleSheets.length; iStyleSheet ++)
		for (var iRule = 0; iRule < document.styleSheets[iStyleSheet].rules.length; iRule ++)
		{
			oCssRule = document.styleSheets[iStyleSheet].rules[iRule];
			if (oCssRule.selectorText.indexOf('LI:hover') != -1)
			{
				sNewSelector = oCssRule.selectorText.replace(/LI:hover/gi, 'LI.iehover');
				document.styleSheets[iStyleSheet].addRule(sNewSelector, oCssRule.style.cssText);
			}
		}

	// Now add handling for these hover events.
	var oListItems = document.getElementsByTagName('LI');
	for (oListItem in oListItems)
	{
		oListItems[oListItem].onmouseover = function() {
			this.className += ' iehover';
		};

		oListItems[oListItem].onmouseout = function() {
			this.className = this.className.replace(new RegExp(' iehover\\b'), '');
		};
	}
}

// Add hover events to list items if the browser requires it.
if (is_ie7down && 'attachEvent' in window)
	window.attachEvent('onload', smf_addListItemHoverEvents);

// Do we made it?
var protectSearchShown = false;
document.addEventListener('DOMContentLoaded', function() {
	$("body").click(function(e) {
        if (e.target.id != "search_form_header" && $(e.target).parents("#search_form_header").size() == 0) { 
	        $('#search_controls').fadeOut();
        }
    });
    
    $("#header_search_input").focus(function() {
	    $('#search_controls').fadeIn();
	});
	
	// Some design scripts
	$('.topic_icon').css({ "opacity": 0.2 });
	$('.topic_row').hover(function() { 
	    $( this ).find(".topic_icon").animate({"opacity": 1});
	},function() { 
	    $( this ).find(".topic_icon").animate({"opacity": 0.2}); 
	});
	
	// Small pagination
	$('.smallpagination').animate({"opacity": 0});
	$('.topic_row').hover(function() { 
	    $( this ).find(".smallpagination").animate({"opacity": 1});
	},function() { 
	    $( this ).find(".smallpagination").animate({"opacity": 0});
	});
}, false);

function defineSearchUrl()
{
	if (document.getElementById('search_header_area').value == 'members')
	{
		window.location = smf_scripturl + '?action=mlist;sa=search;fields=name,email;search=' + encodeURI(document.getElementById('header_search_input').value);
		return false;
	}
	else if (document.getElementById('search_header_area').value == 'thistopic')
	{
		$('#search_form_header').append('<input type="hidden" name="topic" value="' + document.getElementById('q_topic').value + '" />');
	}
	else if (document.getElementById('search_header_area').value == 'thisbrd')
	{
		$('#search_form_header').append('<input type="hidden" name="brd[' + document.getElementById('q_board').value  + ']" value="' + document.getElementById('q_board').value  + '" />');
	}
	
	return true;
}