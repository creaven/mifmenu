window.addEvent('domready', function(){

	document.addEvent('contextmenu', function(event){
		event.preventDefault();
	});

	var list={
		items: [
			{
				name: 'new',
				onAction: function(){
					alert('create new node');
				}
			},
			{
				name: 'open',
				list: {
					items: [
						{
							name: 'folder'
						},
						{
							name: 'archive',
							list: {
								items: [
									{
										type: 'description',
										name: '<b>archive type</b>'
									},
									{
										name: 'zip',
										type: 'radio',
										group: 'archives'
									},
									{
										name: 'rar',
										type: 'radio',
										group: 'archives'
									},
									{
										name: '7z',
										type: 'radio',
										group: 'archives'
									}
								]
							}
						}
					]
				}
			},
			{
				name: 'print  &hellip;',
				onAction: function(){
					alert('print dialog');
				}
			},
			{
				name: 'language',
				list: {
					onCheck: function(item, state){
						alert(item.name + ' - ' + (state ? 'yes' : 'no'));
					},
					items: [
						
						{
							name: 'russian',
							type: 'checkbox'
						},
						{
							name: 'osetian',
							type: 'checkbox',
							checked: true
						},
						{
							name: 'georgian',
							type: 'checkbox'
						},
						{
							name: 'latin',
							list: {
								items: [
									{
										name: 'english',
										type: 'radio',
										group: 'latinas'
									},
									{
										name: 'franch',
										type: 'radio',
										group: 'latinas'
									},
									{
										name: 'deutch',
										type: 'radio',
										group: 'latinas'
									},
									{
										name: 'albanian',
										type: 'radio',
										group: 'latinas',
										checked: true
									}
								]
							}
						}
					]
				}
			},
			'-',
			{
				name: 'dos',
				type: 'radio',
				group: 'code'
			},
			{
				name: 'ansi',
				type: 'radio',
				group: 'code'
			},
			{
				name: 'utf-8',
				type: 'radio',
				group: 'code',
				checked: true
			},
			'-',
			{
				name: 'moro god?',
				disabled: true
			}
		]
	};

	var shadow_menu=new Mif.Menu({
		list: list
	});
	
	var art_menu=new Mif.Menu({
		skin: 'art',
		list: list
	});
	
	shadow_menu.attachTo('shadow');
	
	art_menu.attachTo('art');
});