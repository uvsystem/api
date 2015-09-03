/**
 * lppm.js
 *
 * UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.0
 * Membutuhkan common.js versi 2.0
 *
 * Variabel 'target' harus di-definisi-kan pada file index.html.
 * -> 'target' merupakan global url untuk server pusat.
 * 
 */

var lppmRestAdapter = rest( target, 'monev' );

var baseRestAdapter = {
		
	simpanFakultas: function( id, kode, nama, callback ) {

		var fakultas = {
			id: id,
			kode: kode,
			nama: nama
		};

		lppmRestAdapter.call( '/homebase/fakultas', fakultas, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan fakultas: " + fakultas ); // LOG
			},
			message.error
		);
	},
		
	simpanJurusan: function( idFakultas, id, kode, nama, callback ) {

		var jurusan = {
			id: id,
			kode: kode,
			nama: nama
		};

		lppmRestAdapter.call( '/homebase/jurusan/' + idFakultas, jurusan, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan jurusan: " + jurusan ); // LOG
			},
			message.error
		);
	},
		
	simpanProdi: function( idJurusan, id, kode, nama, callback ) {

		var prodi = {
			id: id,
			kode: kode,
			nama: nama
		};

		lppmRestAdapter.call( '/homebase/prodi/' + idJurusan, prodi, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan program studi: " + prodi ); // LOG
			},
			message.error
		);
	},
	
	hapus: function( id, callback ) {

		lppmRestAdapter.call( '/homebase/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus homebase: " + id ); // LOG
			},
			message.error
		);
	},
	
	getAllProdi: function( callback ) {

		lppmRestAdapter.call( '/homebase/prodi', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil Program Studi" ); // LOG
			},
			message.error
		);
	}
};

var operatorRestAdapter = {

	simpan: function( id, nama, email, username, password, callback ) {
		
		var operator = {
			id: id,
			nama: nama,
			email: email,
			username: username,
			password: password
		};

		lppmRestAdapter.call( '/operator', operator, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan operator: " + operator ); // LOG
			},
			message.error
		);
	},

	updatePassword: function( id, password, callback ) {
		
		var passwordWrapper = {
			password: password
		};

		lppmRestAdapter.call( '/operator/' + id + '/password', passwordWrapper, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Mengubah password operator: " + id ); // LOG
			},
			message.error
		);
	},

	getAll: function( callback ) {

		lppmRestAdapter.call( '/operator', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil Semua Operator" ); // LOG
			},
			message.error
		);
	},

	hapus: function( id, callback ) {

		lppmRestAdapter.call( '/operator/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus operator: " + id ); // LOG
			},
			message.error
		);
	},

	cari: function( keyword, callback ) {

		lppmRestAdapter.call( '/operator/search/' + keyword, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil operator, keyword: " + keyword ); // LOG
			},
			message.error
		);
	}
};

var dosenRestAdapter = {
	
	registrasi: function( idProdi, id, nik, nip, nidn, nama, password, telepon, email, tanggalLahir, callback ) {

		var dosen = {
			id: id,
			nik: nik,
			nip: nip,
			nidn: nidn,
			nama: nama,
			password: password,
			telepon: telepon,
			email: email,
			tanggalLahirStr: tanggalLahir,
		};
		
		lppmRestAdapter.call( '/dosen/' + idProdi, dosen, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Registrasi dosen: " + dosen ); // LOG
			},
			message.error
		);
	},
	
	terima: function( id, idOperator, callback ) {

		lppmRestAdapter.call( '/dosen/' + id + '/operator/' + idOperator + '/approve', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Verifikasi dosen (terima): " + id ); // LOG
			},
			message.error
		);
	},
	
	tolak: function( id, idOperator, callback ) {

		lppmRestAdapter.call( '/dosen/' + id + '/operator/' + idOperator + '/decline', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Verifikasi dosen (tolak): " + id ); // LOG
			},
			message.error
		);
	},
	
	getOne: function( id, callback ) {

		lppmRestAdapter.call( '/dosen/' + id, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil operator: " + id ); // LOG
			},
			message.error
		);
	},
	
	cari: function( keyword, callback ) {

		lppmRestAdapter.call( '/dosen/search/' + keyword, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil dosen, keyword: " + keyword ); // LOG
			},
			message.error
		);
	},
	
	getByHomeBase: function( id, callback ) {

		lppmRestAdapter.call( '/dosen/base/' + id, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil operator, homebase: " + id ); // LOG
			},
			message.error
		);
	},
	
	updatePassword: function( id, password, callback ) {
		
		var passwordWrapper = {
			passsword: password	
		};

		lppmRestAdapter.call( '/dosen/' + id + '/password', passwordWrapper, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Mengubah password dosen: " + id ); // LOG
			},
			message.error
		);
	}
};
