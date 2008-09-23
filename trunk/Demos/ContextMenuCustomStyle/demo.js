window.addEvent('domready', function(){
	mmenu=new Mif.Menu({
		contextmenu: true,
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
	},{
		container: Mif.Menu.Container,
		options:{
			opacity:0.2,
			className: 'mif-menu-default', 
			offsets:{
				x:-2, 
				y:0,
				t: 8,
				r: 8,
				b: 8,
				l: 8
			}
		}
	});
});