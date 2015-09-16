/**
 * common.js
 *
 * UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 2.0
 *
 * Variabel 'waitModal' dan 'url' harus di-definisi-kan pada index.html.
 * -> Variabel 'waitModal' untuk menampilkan loading modal ketika terjadi proses.
 * -> Variabel 'url' merupakan global target.
 *
 */
 
/**
 * Fungsi untuk mengupload file
 */
function upload( file, kode, directory, submit, targetImage ) {

	if ( file ) {

		var response;
		
		var form = new FormData();
		form.append( 'kode', kode );
		form.append( 'directory', directory );
		form.append( 'file', file );
		form.append( 'submit', submit );

		$.ajax( {
			url: targetImage + 'upload.php',
			type: 'POST',
			data: form,
			processData: false,
			async: false,
			mimeType:"multipart/form-data",
			contentType: false,
			success: function( data ) {
				response = JSON.parse( data );
			},
			error: function() {
				alert( 'error' );
			}
		} );
		
		return response;
	}
};

/**
 * Membuat object baru yang mewarisi semua property dari prototype.
 * Menggunakan fungsi Object.create() dari ECMAScript 5, jika tersedia.
 * Jika tidak, aan akan menggunakan teknik lama.
 */
function inherit( p ) {
    if ( p == null )
		throw TypeError(); 

    if ( Object.create )
		return Object.create( p );
    var t = typeof p;

    if ( t !== "object" && t !== "function" ) 
		throw TypeError();

    function f() {};
    f.prototype = p;
    return new f();
};

/**
 * Membuat controller modal yang dapat mengubah state modal (show/hide).
 *
 * idModal: id modal yang ingin di ubah.
 */
var createModal = function( idModal ) {
	return {

		element: $( idModal ),
		
		isShow: function() {
			return ( this.element.val() == true );
		},

		show: function () {

			if ( this.isShow() )
				this.hide();
			
			if ( this.element.val() == 'false' || this.element.val() == false ) {
				this.element.modal( 'show' );
				this.element.val( true );
			}
		},
			
		hide: function () {
				
			if ( this.element.val() == 'true' || this.element.val() == true ) {
				this.element.modal( 'hide' );
				this.element.val( false );
			}
		}
	};
};

/**
 * Membuat object rest.
 */
function rest( link, projectName ) {

	return {
		
		url: link + '/' + projectName,

		/**
		 * Memanggil service yang memerlukan otentikasi dan otorisasi
		 */
		call: function( path, data, method, success, error, async ) {
	
			// Jika tidak login, redirect ke halaman login.
			if ( operator.isAuthenticated() == false ) {
					
				window.location.href = 'login.html';
				return;
					
			}

			// Secara default, menggunakan asynchronous call
			if ( async == null )
				async = true;
			
			var targetUrl = this.url + path;
			var _password = operator.getTokenString(); // Token menjadi pengganti password user
			var _username = operator.getUsername();
	
			var promise = $.ajax(
				{
			        type: method,
			        url: targetUrl,
					async: async,
					contentType: 'application/json',
			        processData: false,
			        data: JSON.stringify( data ),
							
			        beforeSend: function ( jqXHR, settings )
					{
						
						if ( waitModal )
							waitModal.show();
						jqXHR.setRequestHeader ("Authorization", "Basic " + btoa( _username + ':' + _password ) );
						
					}
				}
			);
	
		    promise.done( function( result )
			{
	
				// result = JSON.parse( result ); // Otomatis parse object menjadi JSON. Dan eksekusi function
					
				if ( result.tipe == "ERROR" )
					message.logResult( result ); // LOG
	
				success( result ); // Eksekusi callback
					
			} );
	
	
			promise.fail( error ); // Panggil error ketika terjadi kesalahan
				  
			promise.always( function ( jqXHR, textStatus )
			{
	
				if ( waitModal )
					waitModal.hide();
				
		    } );
		},

		/**
		 * Memanggil service yang tidak membutuhkan otentikasi dan otorosasi
		 */
		callFree: function( path, data, method, success, error, async ) {

			// Secara default menggunakan asynchronous call
			if ( async == null )
				async = true;
			
			var targetUrl = this.url + path;
	
			var promise = $.ajax(
				{
			        type: method,
			        url: targetUrl,
					async: async,
					contentType: 'application/json',
			        processData: false,
			        data: JSON.stringify( data ),
							
			        beforeSend: function ( jqXHR, settings )
					{
						
						if ( waitModal )
							waitModal.show();

					}
				}
			);
	
		    promise.done( function( result )
			{
	
				// result = JSON.parse( result ); // Otomatis parse object menjadi JSON. Dan eksekusi function
					
				if ( result.tipe == "ERROR" )
					message.logResult( result ); // LOG
	
				success( result ); // Eksekusi callback
					
			} );
	
	
			promise.fail( error ); // Panggil error ketika terjadi kesalahan
				  
			promise.always( function ( jqXHR, textStatus )
			{
	
				if ( waitModal )
					waitModal.hide();
				
		    } );
		},
	
		/**
		 * Memanggil service yang memerlukan otentikasi dan otorisasi
		 */
		callAjax: function( object ) {
	
			var path = object.path; 
			var data = object.data;
			var method = object.method;
			var success = object.success;
			var error = object.error;
			var async = object.async;
				
			if ( !path ) throw new Error( 'api.js: callAjax(): url is undefined' );
	
			if ( !data ) data = { };
					
			if ( !method ) throw new Error( 'api.js: callAjax(): method is undefined' );				
				
			if ( !success ) success = message.success;
				
			if ( !error ) error = message.log;
				
			this.call( path, data, method, success, error, async );
	
		},

		/**
		 * Melakukan login untuk mendapatkan token
		 */
		login: function( _username, _password ) {

			var targetUrl = this.url;

			var promise = $.ajax(
			{
		        type: 'POST',
		        url: targetUrl + '/token/' + _username,
				contentType: 'application/json',
		        processData: false,
			        
				beforeSend: function (jqXHR, settings)
				{

					if ( waitModal )
						waitModal.show();
					jqXHR.setRequestHeader ("Authorization", "Basic " + btoa( _username + ':' + _password ) );
		        }
					
		    } );
	
			var success = function( result ) {
	
				//result = JSON.parse( result );
				
				if ( result.tipe == "ENTITY" ) {
	
					operator.setToken( result.object ); // Atur token baru, token menggunakan RestMessage
	
					message.write( "Berhasil Login!" );
					window.location.href = 'index.html';
	
				} else {
					message.write( result.message );
				}
			};
	
		    promise.done( success );
		    promise.fail( function( jqXHR, textStatus, errorThrown ) {
				message.write( "Kombinasi username dan password salah" );
				message.log( jqXHR, textStatus, errorThrown );
			});
			promise.always( function( jqXHR, textStatus ) {
				if ( waitModal )
					waitModal.hide();
		    });
		},

		/**
		 * Proses logout.
		 * Update status token agar tidak bisa digunakan lagi.
		 */
		logout: function() {
			
			var targetUrl = this.url;
			var promise = $.ajax(
				{
					type: 'PUT',
					url: targetUrl + '/token/' + operator.getTokenString(),
					
					beforeSend: function ( jqXHR, settings )
					{
						
						if ( waitModal )
							waitModal.show();
						
					}
				}
			);
					
		    promise.done( function( result ) {
					
				operator.reset();
					
				message.write( "Berhasil Logout!" );
	
				window.location.href = 'login.html';
	
			});
	
			promise.fail( message.error );
			promise.always( function( jqXHR, textStatus ) {
				if ( waitModal )
					waitModal.hide();
		    });
		}
	};
};

/**
 * Variabel yang menampung fugsi halaman berupa perpindahan halaman secara dinamis.
 * Memungkinkan implementasi SPA (Single Page Application).
 */
var page = {

	toUvs: function () {
		window.location.href = "https://uvs.web.id/";
	},
	
	/**
	 * Ganti isi element dengan file HTML yang di-load dari URL.
	 */
	load: function( element, url ) {
		
		var promise = $.ajax(
			{
				type: 'GET',
				url: url,
				async: false,
			} 
		);

		promise.done( function ( result ) {
		
			page.change( element, result );
			
		});
			
		promise.fail( message.error );
		
	},

	/**
	 * Ganti isi element dengan content.
	 */
	change: function ( element, content ) {

		// Apply semua JS dan CSS setelah 'dynamic content' di setup.
		if ( element )
			element.html( content ).trigger( "create" );

	},

	/**
	 * Atur nama halaman.
	 * Secara otomatis mengubah judul halaman, jika pada halaman terdapat component header.
	 * id header = 'header-text'.
	 */
	setName: function ( pageName ) {
	
		localStorage.setItem( 'page', pageName );

		var header = $( '#page-header' );
		if ( header )
			page.change( header, '/ ' + pageName.toUpperCase() );
		
	},

	/**
	 * Ambil nama halaman.
	 * Sama dengan 'current page'.
	 */
	getName: function () {

		var pageName = localStorage.getItem ( 'page' );

		if ( pageName == 'undefined' )
			throw new Error( "Nama halaman = null" );
			
		return pageName.toUpperCase();
		
	},

	/**
	 * Fungsi untuk menghasilkan konten berupa list.
	 */
	content: {

		/**
		 * Atur konten.
		 * Ganti konten, nama halaman, dan pilihan.
		 */
		set: function ( list, resource, pageName ) {
		
			this.change( $( '#content' ), resource.getContent( list ) );
			this.change( $( '#option-panel' ), resource.getOption() );

			this.setName( pageName );
			
		},
	
		/**
		 * Fungsi create default.
		 * Membuat item dalam list.
		 * NOTE: KETIKA DISENTUH, BUKA DETAIL. ID DIAMBIL DARI ATRIBUT 'ID' PADA ELEMENT 'DIV'.
		 */
		create: function ( object ) {
				
			return '<li>' +
				'<div id="' + object.id + '">' +
				'<h4>'+ object.nama + '</h4>' +
				'</div>' +
				'</li>';
		},
			
		/**
		 * Fungsi untuk menghasilkan list view.
		 * NOTE: CARA BUAT LIST VIEW NANTI BACA LAGI DI JQUERY MOBILE
		 */
		generate: function ( list, todo ) {

			var html = '<div data-role="collapsible-set">';
			html += '<ul data-role="listview" data-inset="true">';
			        
			for ( var index = 0; index < list.length; index++ ) {
						
				var object = list[ index ];
					
				html += todo( object );
				
			}
			
			html += '</ul>';
			html += '</div>';	
			
			return html;
			
		},

	},
	
	list: {

		/**
		 * Fungsi default untuk me-return hasil.
		 */
		get: function ( result ) {

			if ( result.tipe != 'LIST' && !result.list ) {
			
				message.writeLog( 'Returning empty list' );
				return [ ];
				
			}

			return result.list;

		},

		/**
		 * Generate HTML5 list <datalist> dari list object.
		 */
		dataList: {

			generateFromStorage: function ( container, listName ) {

				var list = storage.get( container.nama );

				return this.generateFromList( list, listName );
				
			},

			generateFromList: function ( list, listName ) {
				
				var html = '<datalist id="' + listName + '">';

				html += page.list.option.generate( list );
				html += '</datalist>';
				
				return html;
				
			}
		},

		/**
		 * Generate list for <select>
		 */
		selectionList: {

			generateFromStorage: function ( container, selectedName ) {

				var list = storage.get( container.nama );

				return this.generateFromList( list, selectedName );
				
			},

			generateFromList: function ( list, selected ) {

				var html = '';
				
				if ( selected == '' ) {
					
					html += '<option value="" selected> - Pilih - </option>';
					html = page.list.option.generate ( list );
				} else {
					
					html = page.list.option.generateSelected (list, selected );
				}

				return html;
				
			}
		},
		
		/**
		 * Generate pilihan <option> untuk komponen list.
		 */
		option: {
			
			generate: function ( list ) {

				var html = '';
				
				if ( list ) {

					for( var index = 0; index < list.length; index++ ) {

						var tmp = list[ index ];
						html += '<option>' + tmp.nama + '</option>';
						
					}
				}
				
				return html;
				
			},

			generateSelected: function ( list, selected ) {

				var html = '';
				
				if ( !list ) {
				
					for( var index = 0; index < list.length; index++ ) {

						var tmp = list[ index ];

						if ( tmp.nama == selected ) {

							html += '<option selected>' + tmp.nama + '</option>';
							
						} else {

							html += '<option>' + tmp.nama + '</option>';
							
						}
					}
				}
				
				return html;
				
			},
			
			generateFromStorage: function( container ) {
				
				var list = storage.get( container );
				
				return this.generate( list );
				
			}
		},
	},
};

/**
 * Kelas untuk membuat object tanggal yang sesuai kebutuhan.
 */
var myDate = {

	/**
	 * Membuat custom object tanggal
	 */
	create: function( day, month, year ) {
		
		return {
			day: day,
			month: month,
			year: year,
			
			getString: function() {
				return this.day + "-" + this.month + "-" + this.year;
			},
			getFormattedString: function() {
				return this.month + "-" + this.day + "-" + this.year;
			},
			getDatePickerString: function() {
				return this.year + "-" + this.month + "-" + this.day;
			},
			getNumber: function() {
				return ( parseInt( this.year ) * 365 ) + ( parseInt( this.month ) * 30 ) + parseInt( this.day );
			},
			isBefore: function ( comparer ) {
				return ( this.getNumber() < comparer.getNumber() );
			},
			isAfter: function ( comparer ) {
				return ( this.getNumber() > comparer.getNumber() );
			},
			isExpire: function() {
				var now = myDate.fromDate( new Date() );
				return now.isAfter( expire )
			}
		};
	},

	// Months definiton
	month: {

		getName: function ( index ) {

			if ( index > 12 )
				index -= 12;
			
			if ( index < 1 )
				index += 12;

			switch ( index ) {
				case 1: return 'January'
				case 2: return 'February'
				case 3: return 'March'
				case 4: return 'April'
				case 5: return 'May'
				case 6: return 'June'
				case 7: return 'July'
				case 8: return 'August'
				case 9: return 'September'
				case 10: return 'October'
				case 11: return 'November'
				case 12: return 'December'
			}
		},

		getNama: function ( index ) {

			if ( index > 12 )
				index -= 12;
			
			if ( index < 1 )
				index += 12;

			switch ( index ) {
				case 1: return 'JANUARI'
				case 2: return 'FEBRUARI'
				case 3: return 'MARET'
				case 4: return 'APRIL'
				case 5: return 'MEI'
				case 6: return 'JUNI'
				case 7: return 'JULI'
				case 8: return 'AGUSTUS'
				case 9: return 'SEPTEMBER'
				case 10: return 'OKTOBER'
				case 11: return 'NOVEMBER'
				case 12: return 'DESEMBER'
			}
		},
				
		getRealName: function ( name ) {
			
			name = name.toLowerCase ();
	        
			switch ( name ) {
	        	case 'januari': return 'Januari'
	            case 'februari': return 'Februari'
	            case 'maret': return 'Maret'
	            case 'april': return 'April'
	            case 'mei': return 'Mei'
	            case 'juni': return 'Juni'
	            case 'juli': return 'Juli'
	            case 'agustus': return 'Agustus'
	            case 'september': return 'September'
	            case 'oktober': return 'Oktober'
	            case 'november': return 'November'
	            case 'desember': return 'Desember'
			}
		},
		
		getIndex: function ( name ) {
		
			name = name.toLowerCase ();
	        
			switch ( name ) {
	        	case 'januari': return 1
	            case 'februari': return 2
	            case 'maret': return 3
	            case 'april': return 4
	            case 'mei': return 5
	            case 'juni': return 6
	            case 'juli': return 7
	            case 'agustus': return 8
	            case 'september': return 9
	            case 'oktober': return 10
	            case 'november': return 11
	            case 'desember': return 12
			}
		}
	},

	/**
	 * Membuat JavaScript object date.
	 */
	now: function() {
		return new Date();
	},

	/**
	 * Membuat custom object tanggal
	 */
	getNow: function() {
		return this.fromDate( this.now() );
	},
	
	/**
	 * Membuat object tanggal dari hari pertama pada bulan berjalan
	 */
	getAwal: function() {
		
		var date = new Date();
		return this.create( 1, date.getMonth() + 1, date.getFullYear() );
		
	},
	
	/**
	 * Membuat object tanggal dari hari terakhir pada bulan berjalan
	 */
	getAkhir: function() {
		
		var date = new Date();
		date.setMonth( date.getMonth() + 1 );
		date.setDate( 0 );

		return this.create( date.getDate(), date.getMonth() + 1, date.getFullYear() );
		
	},

	/**
	 * Memisahkan tanggal, bulan, tahun sesuai delimeter.
	 * Delimeter dapat berupa "/", "-", atau " ".
	 * Tambah "0" di depan jika hanya 1 karakter.
	 */
	split: function ( str ) {
		
		var delim;
		
		if ( str.indexOf ( "/" ) != -1 ) {
			delim = "/";
		} else if ( str.indexOf ( "-" ) != -1 ) {
			delim = "-";
		} else {
			delim = " ";
		}
		
		var complete = function ( x ) {
		
			if ( x.length < 2 )
				x = "0" + x;
			
			return x;
			
		};
		
		var splitted = str.split ( delim );
		splitted[ 0 ] = complete( splitted[ 0 ] );
		splitted[ 1 ] = complete( splitted[ 1 ] );
		splitted[ 2 ] = complete( splitted[ 2 ] );

		return splitted;
		
	},
	
	/**
	 * Membuat custom object tanggal dari JavaScript object Date
	 */
	fromDate: function ( date ) {
		return this.create( date.getDate(), date.getMonth() + 1, date.getFullYear() );
	},
	
	/**
	 * Membuat custom object tanggal dari JQuery Datepicker
	 */
	fromDatePicker: function ( date ) {
		var str = this.split( date );
		return this.create( str[2], str[1], str[0] );
	},
	
	/**
	 * Membuat custom object tanggal dari String.
	 * Format String: DD/mm/YYYY
	 */
	fromString: function(date) {
		var str = this.split( date );
		return this.create( str[0], str[1], str[2] );
	},
	
	/**
	 * Membuat custom object tanggal dari String yang terformat.
	 * Format: MM/dd/YYYY
	 */
	fromFormattedString: function ( date ) {
		var str = this.split( date );
		return this.create( str[1], str[0], str[2] );
	},

	/**
	 * Membuat object String yang terformat dari object JavaScript Date.
	 * Format: MM/dd/YYYY
	 */
	formatDate: function ( unformattedDate ) {
		var tmp = this.fromDate( unformattedDate );
		return tmp.getFormattedString();
	},

	/**
	 * Membuat object String yang terformat dari JQuery Datepicker.
	 * Format: MM/dd/YYYY
	 */
	formatDatePicker: function ( unformattedDate ) {
		var tmp = this.fromDatePicker( unformattedDate );
		return tmp.getFormattedString();
	},
	
	/**
	 * Membuat custom object tanggal dari hari pertama pada bulan dan tahun yang sudah ditentukan.
	 */
	createFirstDate: function( bulan, tahun ) {
		var indexBulan = this.month.getIndex( bulan );
		return this.create( 1, indexBulan, tahun );
	},
	
	/**
	 * Membuat custom object tanggal dari hari terakhir pada bulan dan tahun yang sudah ditentukan.
	 */
	createLastDate: function( bulan, tahun ) {
	
		var indexBulan = this.month.getIndex( bulan );
		
		var date = new Date();
		date.setMonth( indexBulan );
		date.setDate( 0 );
		date.setFullYear( tahun );

		return this.create( date.getDate(), indexBulan, tahun );
	}
};

var number = {

	/**
	 * Modifikasi angka menggunakan koma sebagai pemisah satuan.
	 */
	addCommas: function ( x ) {
		return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
	},

	/**
	 * Modifikasi angka dengan menghilangkan tanda koma.
	 */
	removeCommas: function ( x ) {
		return x.toString().replace( ",", "" );
	}
};

var myList = {

	getByNama: function ( list, nama ) {
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];
			
				if ( nama == obj.nama )
					return obj;
			}
		}
		
		message.writeLog( "Returning null for nama: " + nama );
		
		return null;
		
	},

	getById: function ( list, id ) {
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];
				
				if ( id == obj.id )
					return obj;
			}
		}
		
		message.writeLog( "Returning null for id: " + id );
		
		return null;
	},

	getByKode: function ( list, kode ) {
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];

				if ( kode == obj.kode )
					return obj;
			}
		}
		
		message.writeLog( "Returning null for kode: " + kode );
		
		return null;
	},

	getByNomor: function ( list, nomor ) {
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];

				if ( nomor == obj.nomor )
					return obj;
			}
		}
		
		message.writeLog( "Returning null for nomor: " + nomor );
		
		return null;
	},

	getByNip: function ( list, nip ) {
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];

				if ( nip == obj.nip )
					return obj;
			}
		}
		
		message.writeLog( "Returning null for nip: " + nip );
		
		return null;
	},

	getByUsername: function ( list, username ) {
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];

				if ( username == obj.username )
					return obj;
			}
		}
		
		message.writeLog( "Returning null for username: " + username );
		
		return null;
	}
};

/**
 * Kelas untuk mengelola browser data storage
 */
var storage = {

	/**
	 * Memasukan list ke dalam storage dengan key (index) nama container.
	 */
	set: function ( container, list ) {

		storageName = container.nama.toLowerCase();

		message.writeLog("api.js: setStorage(): Storage " + storageName + " is set : " + ( list != null ) ); // LOG

		if ( list != null )
			list = JSON.stringify( list );

		localStorage.setItem( storageName, list );
		
	},

	/**
	 * Mengambil list dari dalam storage dengan key (index) nama container.
	 */
	get: function ( container ) {

		storageName = container.nama.toLowerCase();

		var list = localStorage.getItem( storageName );
		
		message.writeLog( "api.js: getStorage(): List " + storageName + " is Ready : " + ( list != null ) ); // LOG
		
		if ( list != null )
			return JSON.parse( list );
		
		return [ ];
		
	},

	/**
	 * Mengambil JSON dari storage sesuai container, dan memiliki nama.
	 */
	getByNama: function ( container, nama ) {
		
		var list = this.get( container );
		
		return myList.getByNama( list, nama );
		
	},

	/**
	 * Mengambil JSON dari storage sesuai container, dan memiliki id.
	 */
	getById: function ( container, id ) {

		var list = this.get( container );

		return myList.getById( list, id );

	},

	/**
	 * Mengambil JSON dari storage sesuai container, dan memiliki kode.
	 */
	getByKode: function ( container, kode ) {
		
		var list = this.get( container );
		
		return myList.getByKode( list, kode );
		
	},

	/**
	 * Mengambil JSON dari storage sesuai container, dan memiliki nomor.
	 */
	getByNomor: function ( container, nomor ) {
		
		var list = this.get( container );
		
		return myList.getByNomor( list, nomor );
		
	},

	/**
	 * Mengambil JSON dari storage sesuai container, dan memiliki nip.
	 */
	getByNip: function ( container, nip ) {
		
		var list = this.get( container );
		
		return myList.getByNip( list, nip );
		
	},

	/**
	 * Mengambil JSON dari storage sesuai container, dan memiliki username.
	 */
	getByUsername: function ( container, username ) {
		
		var list = this.get( container );
		
		return myList.getByUsername( list, username );
		
	}
};

/**
 * Pesan yang akan ditampilkan ketika terjadi suatu proses.
 */
var message = {
	
	/**
	 * Sistem tidak menampilkan apapun.
	 */
	empty: function() { },
		
	/**
	 * Proses menghasilkan pesan yang perlu ditampilkan.
	 */
	write: function( msg ) {
		alert( msg );
	},
		
	/**
	 * Proses berhasil.
	 * Lakukan aksi berdasarkan tipe message.
	 */
	success: function( result ) {

		page.change( $( '#message' ), '');
	
		switch ( result.tipe ) {
		
			case "SUCCESS": console.log( "Proses SUCCESS" );
					page.change( $( '#message' ), 
						'<div id="success-alert" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Selamat!</strong> ' + result.message + '</div>');
				break;
			case "ENTITY": console.log( "Entity Set" );
					page.change( $( '#message' ), 
						'<div id="success-alert" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Selamat!</strong> ' + result.message + '</div>');
				break;
			case "LIST": console.log( "List Set" );
					page.change( $( '#message' ), 
						'<div id="success-alert" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Selamat!</strong> ' + result.message + '</div>');
				break;
			case "OBJECT": console.log( "Object Set" );
					page.change( $( '#message' ), 
						'<div id="success-alert" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Selamat!</strong> ' + result.message + '</div>');
				break;
			case "MESSAGE": 
					page.change( $( '#message' ), 
						'<div id="warning-alert" class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Pesan!</strong> ' + result.message + '</div>');
				break;
			case "ERROR": 
					page.change( $( '#message' ), 
						'<div id="error-alert" class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> ' + result.message + '</div>');
				break;
			default: console.log( "Tipe result tidak dikenali : " + result.tipe );
		}
	},
		
	/**
	 * Secara default menampilkan pesan koneksi error ketika terjadi kesalahan.
	 */
	error: function() {
		alert( 'Tidak bisa melakukan koneksi ke server' );
	},
		
	/**
	 * Tampilkan error. Digunakan saat proses debugging.
	 */
	writeError: function( jqXHR, textStatus, errorThrown ) {
		alert( 'Error : ' + textStatus + ' - ' + errorThrown );
	},
		
	/**
	 * Tampilkan log pada browser console.
	 */
	writeLog: function( log ) {
		console.log( "LOG : " + log );
	},
		
	/**
	 * Tampilkan error pada browser console.
	 */
	log: function( jqXHR, textStatus, errorThrown ) {
		console.log( 'LOG: Error : ' + textStatus + ' - ' + errorThrown );
	},
	
	/**
	 * Tampilkan pesan pada browser console.
	 */
	logResult: function( result ) {
		console.log( result.message );
	}
};

/**
 * Kelas untuk menampung data pegawai yang melakukan login berdasarkan token.
 * Digunakan untuk otentikasi dan otorisasi.
 */
var operator = {

	/**
	 * Mengambil objek token. Hanya digunakan untuk tujuan spesifik.
	 * Jika tidak ada, return null.
	 */
	getToken: function() {
		
		var token = localStorage.getItem( 'token' );

		// jika token null, cek cookie dan request token dari server.
		
		if ( token == null )
			throw new Error( "Token = null" );

		return JSON.parse( token ); // Ubah token menjadi JSON
		
	},
		
	/**
	 * Mengatur objek token. Digunakan setelah berhasil login.
	 */
	setToken: function( token ) {

		message.writeLog( "Set token with " + token ); // LOG

		if ( token != null ) {
			
			token = JSON.stringify( token );
			
			// simpan token string di dalam cookie
			
		}

		localStorage.setItem( 'token', token );
		
	},
		
	/**
	 * Mengambil token yang akan digunakan sebagai pengganti password.
	 * Hanya bekerja jika sudah berhasil login. Jika tidak akan menghasilkan null.
	 */
	getTokenString: function() {

		var token;
		
		try {
			
			token = this.getToken();
		
			return token.token;
			
		} catch ( e ) {
			
			throw e;
			
		}
	},
		
	/**
	 * Mengambil objek pegawai yang sedang login.
	 */
	getPengguna: function() {

		var token;
	
		try {
			
			token = this.getToken();

			return token.pengguna;
			
		} catch ( e ) {
			
			throw e;
			
		}
	},
	
	/**
	 * Mengambil username dari object pengguna yang berhasil login terakhir kali.
	 * Sering digunakan untuk melakukan REST request.
	 */
	getUsername: function() {

		var pengguna;
		
		try {
			
			pengguna = this.getPengguna();

			return pengguna.username;
			
		} catch ( e ) {
			throw e;
		}
	},
		
	/**
	 * Mengambil nama dari object pengguna yang berhasil login terakhir kali.
	 * Sering digunakan untuk melakukan REST request.
	 */
	getName: function() {

		var pengguna;
		
		try {
			
			pengguna = this.getPengguna();

			return pengguna.nama;
			
		} catch ( e ) {
			throw e;
		}
	},

	/**
	 * Mengambil ROLE pengguna yang berhasil login terakhir kali.
	 * Digunakan untuk proses otorisasi setelah login.
	 */
	getRole: function() {

		if ( this.getUsername() == 'superuser' )
			return 'ADMIN';
	
		var pengguna;
		
		try {
			
			pengguna = this.getPengguna();
			
			return pengguna.role;
			
		} catch ( e ) {
			
			message.writeLog( e );
			
			return "GUEST";
			
		}
	},
		
	/**
	 * Reset objek token pada keadaan semula. Menghapus semua data pegawai yang berhasil login.
	 * Setelah memanggil fungsi ini, pegawai harus login lagi untuk melakukan proses berikutnya.
	 * Digunakan ketika logout.
	 */
	reset: function() {

		this.setToken(null);
		
		// Hapus token dari cookie.
		
	},
		
	/**
	 * Mengecek apakah token ada dan masih berlaku.
	 * Jika token ada dan masih berlaku, maka pegawai bisa melakukan proses berikutnya, selain dari pada itu, pegawai harus login kembali.
	 */
	isAuthenticated: function() {

		try {
			
			var token = this.getToken();
			var now = myDate.fromDate( new Date() );
			var expire = myDate.fromFormattedString( token.expire );
			
			// Jika token sudah expire, maka user dianggap belum login
			if ( now.isAfter( expire ) )
				return false;
			return true;
				
		} catch ( e ) {

			message.writeLog( e );
			return false;
			
		}
	},
	
	/**
	 * Mengecek apakah pengguna memiliki hak untuk mengakses sistem.
	 * Hanya ADMIN dan OPERATOR yang bisa mengakses sistem.
	 */
	isAuthorized: function() {

		if ( this.isAuthenticated() == false )
			return false;
		
		// Reload token
		// restAdapter.callFree( '/token/' + this.getTokenString(), null, 'GET', function( result ) {
		// 	if ( result.tipe == 'ENTITY')
		//		operator.setToken( result.object );
		// },
		// message.writeError, 
		// false
		// );

		var role = this.getRole();
		if ( ( role != 'ADMIN' && role != 'OPERATOR' ) ) {

			message.write( 'Maaf, anda tidak bisa mengakses halaman ini' );
			message.writeLog( 'Maaf, anda tidak bisa mengakses halaman ini' ); // LOG

			return false;

		}
		
		return true;
		
	}
};

/**
 * Kelas untuk menampilkan/mengunduh file pdf ke dalam browser
 */
 var printer = {

	submitPost: function( path, params, method ) {
	
		method = method || "post"; // Method POST sebagai default.

		var form = document.createElement( "form" );
		form.setAttribute( "method", method );
		form.setAttribute( "action", path );

		for( var key in params ) {
		
			if ( params.hasOwnProperty( key ) ) {
			
				var hiddenField = document.createElement( "input" );
				hiddenField.setAttribute( "type" , "hidden" );
				hiddenField.setAttribute( "name", key );
				hiddenField.setAttribute( "value", params[ key ] );

				form.appendChild( hiddenField );
				
			 }
		}

		document.body.appendChild( form );
		
		form.submit();
		
	}
};

/**
 * Pilih berdasarkan 2 pilihan.
 */
function choose( option1, option2 ) {

	if ( option1 )
		return option1;
	
	return copyOf( option2 );
	
};

/**
 * Membuat object baru yang memiliki semua property dari object lama
 */
function copyOf( object ) {

	return $.extend( {}, object );
	
};

var setupPage = function( list, container ) {

	if ( !list )
		list = [ ];
		
	page.setContent( list, container, container.nama );
	
};

// DEFINISI DYNAMIC TABEL

var activeContainer;
var set = 20;

/**
 * Membuat batas atas dan bawah untuk menampilkan data dari list sesuai jumlah data dalam list, nomor halaman, dan jumlah data per halaman
 */
var tableSet = function( list, pageNumber) {

	// Jika list kosong, return default value.
	if ( list.length == 0 ) {
		
		return {
			first: 0,
			last: 0
		};
	}

	// Secara default selalu membuat halaman 1
	if ( !pageNumber )
		pageNumber = 1;
				
	pageNumber--;
	
	var first = pageNumber * set;
	var last = first + set;

	// Jika index terakhir melebihi jumlah maksimum list, maka gunakan jumlah maksimum list sebagai index terakhir
	if ( last > list.length )
		last = list.length;
	
	return {
		first: first,
		last: last
	};
};

/**
 * Mengganti semua karakter lama pada object String dengan karakter baru
 */
function changeChar( str, oldChar, newChar ) {

	// message.writeLog( 'Not All Done' );
	while ( str.match( oldChar ) )
		str = str.replace( "/", "-" );
		
	return str;
};
