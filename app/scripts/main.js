'use strict';

$(function() {


	//cache DOM
	const $directoryModule = $('#directoryModule'),
		$addContactModule = $('#addContactModule'),
		$ul = $directoryModule.find('ul'),
		$directoryCounter = $directoryModule.find('#directoryCounter'),
		$username = $addContactModule.find('#username'),
		$email = $addContactModule.find('#email'),
		$infoBox = $addContactModule.find('#infoBox'),
		$btnAddContact = $addContactModule.find('#add-contact'),
		directoryTemplate = $directoryModule.find('#directory-template').html();

	//cache DOM ajax
	var $editUsername,
		$editEmail,
		$noEditUsername,
		$noEditEmail,
		$btnEdit,
		$btnSave,
		$btnCancel;

	function editMode(elem) {
		$editUsername = elem.find('#field-username');
		$editEmail = elem.find('#field-email');
		$noEditUsername = elem.find('.span-username');
		$noEditEmail = elem.find('.span-email');
		$btnEdit = elem.find('.btn-edit');
		$btnSave = elem.find('.btn-save');
		$btnCancel = elem.find('.btn-cancel');

		//Toggle edit fields
		$editUsername.toggleClass('hidden');
		$editEmail.toggleClass('hidden');

		//Toggle save/cancel buttons
		$btnSave.toggleClass('hidden');
		$btnCancel.toggleClass('hidden');

		//Toggle text boxes
		$noEditUsername.toggleClass('hidden');
		$noEditEmail.toggleClass('hidden');

		//Toggle edit button
		$btnEdit.toggleClass('hidden');
	}

	function updateCounter() {
		$directoryCounter.html('Directory (' + $ul.find('li').length + ')');
	}

	function render(obj) {
		$ul.append(Mustache.render(directoryTemplate, obj));
	}

	//GET: directory list
	
	$.ajax({
		type: 'GET',
		url: 'http://127.0.0.1:3000/',
		success: function(directory) {
			$.each(directory, function(i, contact) {
				render(contact);
			});

			updateCounter();
		},
		error: function() {
			$ul.append('<li>Error Loading Directory</li>');
		}
	});



	//POST: add new contact
	$btnAddContact.on('click', function() {
		const contact = {
			username: $username.val(),
			email: $email.val()
		};

		$.ajax({
			type: 'POST',
			url: 'http://127.0.0.1:3000/adduser',
			data: contact,
			success: function(newContact) {
				render(newContact);
				updateCounter();

				const $contactItem = $ul.find(`li[data-id=${newContact._id}]`);
				$contactItem.hide();
				$contactItem.slideDown(300);

				$username.val('');
				$email.val('');

				$infoBox.removeClass();
			},
			error: function(err) {
				$infoBox.removeClass();
				$infoBox.addClass('msg-error').html(JSON.stringify(err));
			}
		});
	});

	//DELETE: delete person
	$ul.delegate('.btn-delete', 'click', function() {

		const $li = $(this).closest('li'),
			dataId = $(this).attr('data-id');

		$.ajax({
			type: 'DELETE',
			url: `http://127.0.0.1:3000/delete/${dataId}`,
			success: function() {

				$li
				.slideUp(300, function() {
					$li.remove();
					updateCounter();
				})
				.animate({
					opacity: 0
				},
				{
					queue: false,
					duration: 200
				});

				$infoBox.removeClass();
			},
			error: function(err) {
				$infoBox.removeClass();
				$infoBox.addClass('msg-error').html(JSON.stringify(err));
			}
		});
	});

	//PUT: update person
	$ul.delegate('.btn-save', 'click', function() {

		const $li = $(this).closest('li'),
			dataId = $(this).attr('data-id'),
			contact = {
				username: $li.find('#field-username').val(),
				email: $li.find('#field-email').val()
			};

		$noEditUsername = $li.find('.span-username');
		$noEditEmail = $li.find('.span-email');

		$.ajax({
			type: 'PUT',
			url: `http://127.0.0.1:3000/update/${dataId}`,
			data: contact,
			success: function(data) {
				editMode($li);

				$noEditUsername.html(data.username);
				$noEditEmail.html(data.email);

				$infoBox.removeClass();
			},
			error: function(err) {
				$infoBox.removeClass();
				$infoBox.addClass('msg-error').html(JSON.stringify(err));
			}
		});
	});

	//Enable edit mode
	$ul.delegate('.btn-edit', 'click', function() {
		const $li = $(this).closest('li');
		editMode($li);

		$editUsername.val($noEditUsername.html());
		$editEmail.val($noEditEmail.html());
	});

	//Disable Edit mode
	$ul.delegate('.btn-cancel', 'click', function() {
		const $li = $(this).closest('li');
		editMode($li);
	});
});
