'use strict';

$(function() {

	//cache DOM
	const $mainParagraph = $('.main-paragraph'),
		$mainParagraphElem = $mainParagraph.find('p, ul'),
		$btnRollUp = $mainParagraph.find('.rollUp'),
		$btnRollDown = $mainParagraph.find('.rollDown');

	//Roll Up
	$btnRollUp.on('click', function() {

		$mainParagraphElem
			.slideUp(300)
			.animate(
				{ opacity: 0 },
				{ queue: false, duration: 200 }
			);

		$btnRollUp.hide();
		$btnRollDown.show();
	});

	//Roll Down
	$btnRollDown.on('click', function() {

		$mainParagraphElem
			.slideDown(300)
			.animate(
				{ opacity: 1 },
				{ queue: false, duration: 500 }
			);

		$btnRollUp.show();
		$btnRollDown.hide();
	});
});
