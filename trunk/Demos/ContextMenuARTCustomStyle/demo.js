window.addEvent('domready', function(){
	new Mif.Menu({
		contextmenu: true,
		skin: 'art',
		target: $('menu-target'),
		list: {
			onRadioCheck: function(item, state){
				if(state) alert(item.name+' selected');
			},
			items: [
				{
					name: 'new',
					onAction: function(){
						alert('create new bomb');
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
		}
	}, {
		container: ART.Container,
		options: {
			className: 'mif-menu-art', 
			offsets:{x:-2, y:-5},
			theme: new ART.Theme({
				normal: {
					
					radius: 8,

					overlayColor: '#fcf4cd',
					overlayOpacity: 0.8,
					border:1,
					borderOpacity: 0.7,
					borderColor: '#d0c140',
					shadow:8
					
				}
			})
		}
	});
});