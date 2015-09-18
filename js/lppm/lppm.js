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

var lppmRestAdapter = rest( target, project );

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
	
	/**
	 * Tidak membutuhkan authentication.
	 */
	getAllProdi: function( callback ) {

		lppmRestAdapter.callFree( '/homebase/prodi', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil Program Studi: " + result.tipe ); // LOG
			},
			message.error
		);
	},
	
	/**
	 * Tidak membutuhkan authentication.
	 */
	getAll: function( callback ) {

		lppmRestAdapter.callFree( '/homebase', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil semua homebase: " + result.tipe ); // LOG
			},
			message.error
		);
	},
	
	cari: function( keyword, callback ) {

		lppmRestAdapter.call( '/homebase/search/' + keyword, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mencari homebase: " + keyword ); // LOG
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
			passwordStr: password
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
	
	simpan: function( idProdi, dosen, callback ) {
		
		lppmRestAdapter.call( '/dosen/' + idProdi, dosen, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Update dosen: " + dosen ); // LOG
			},
			message.error
		);
	},
	
	/**
	 * Registrasi tidak perlu otentikasi.
	 */
	registrasi: function( idProdi, id, nik, nip, nidn, nama, password, telepon, email, tanggalLahir, callback ) {

		var dosen = {
			id: id,
			nik: nik,
			nip: nip,
			nidn: nidn,
			nama: nama,
			passwordStr: password,
			telepon: telepon,
			email: email,
			tanggalLahirStr: tanggalLahir,
		};
		
		lppmRestAdapter.callFree( '/dosen/' + idProdi, dosen, 'POST',
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
	},
	
	getAll: function( callback ) {

		lppmRestAdapter.call( '/dosen', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil semua dosen: " + result.tipe ); // LOG
			},
			message.error
		);
	},
	
	getByStatus: function( status, callback ) {

		lppmRestAdapter.call( '/dosen/status/' + status, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil dosen dengan status: " + status ); // LOG
			},
			message.error
		);
	}
};

var kegiatanRestAdapter = {
	
	tambahPenelitian: function( idDosen, idSkema, nama, tahun, proposal, callback ) {
	
		var penelitian = {
			nama: nama,
			tahun: tahun,
			proposal: proposal
		};
	
		lppmRestAdapter.call( '/kegiatan/penelitian/dosen/' + idDosen + '/skema/' + idSkema, penelitian, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Tambah penelitian: " + penelitian ); // LOG
			},
			message.error
		);
	},
	
	tambahPengabdian: function( idDosen, idSkema, nama, tahun, tanggalMulai, tanggalSelesai, lokasi, proposal, callback ) {

		var pengabdian = {
			nama: nama,
			tahun: tahun,
			tanggalMulaiStr: tanggalMulai,
			tanggalSelesaiStr: tanggalSelesai,
			lokasi: lokasi,
			proposal: proposal
		};
	
		lppmRestAdapter.call( '/kegiatan/pengabdian/dosen/' + idDosen + '/skema/' + idSkema, pengabdian, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Tambah pengabdian: " + pengabdian ); // LOG
			},
			message.error
		);
	},
	
	tambahPelaksana: function( id, idDosen, callback ) {

		lppmRestAdapter.call( '/kegiatan/' + id + '/dosen/' + idDosen, null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Tambah pelaksana: " + id ); // LOG
			},
			message.error
		);
	},
	
	updateProposal: function( id, file, kode, directory, callback ) {
	
		var response = upload( file, kode, directory, "Uploading", targetImage );

		lppmRestAdapter.call( '/kegiatan/' + id + '/proposal', 
			{
				link: targetImage + response.model.url
			}, 
			'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Update proposal: " + response.message ); // LOG
			},
			message.error
		);
	},
	
	terimaKegiatan: function( id, idOperator, callback ) {

		lppmRestAdapter.call( '/kegiatan/' + id + '/operator/' + idOperator + '/terima', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menerima penelitian: " + id ); // LOG
			},
			message.error
		);
	},
	
	tolakKegiatan: function( id, idOperator, callback ) {

		lppmRestAdapter.call( '/kegiatan/' + id + '/operator/' + idOperator + '/tolak', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menolak penelitian: " + id ); // LOG
			},
			message.error
		);
	},

	/**
	 * Return daftar pelaksana kegiatan yang berhubungan dengan dosen.
	 */
	getByDosen: function( idDosen, callback ) {

		lppmRestAdapter.call( '/kegiatan/dosen/' + idDosen, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil kegiatan berdasrkan dosen: " + idDosen ); // LOG
			},
			message.error
		);
	},
	
	getAll: function( callback ) {

		lppmRestAdapter.call( '/kegiatan', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil semua kegiatan: " + result.tipe ); // LOG
			},
			message.error
		);
	}
};

var pelaksanaRestAdapter = {
	
	getByKegiatan: function ( idKegiatan, callback ) {
	
		lppmRestAdapter.call( '/pelaksana/kegiatan/' + idKegiatan, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil pelaksana kegiatan: " + idKegiatan ); // LOG
			},
			message.error
		);
	}
};

/*
 *
 */
var skemaRestAdapter = {

	tambahDikti: function( nama, jumlah, callback ) {

		var skema = {
			nama: nama,
			jumlah: jumlah
		};
	
		lppmRestAdapter.call( '/skema/dikti', skema, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Tambah skema dikti: " + skema ); // LOG
			},
			message.error
		);
	},

	tambahUniversitas: function( nama, jumlah, callback ) {

		var skema = {
			nama: nama,
			jumlah: jumlah
		};
	
		lppmRestAdapter.call( '/skema/universitas', skema, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Tambah skema universitas: " + skema ); // LOG
			},
			message.error
		);
	},
	
	getAll: function( callback ) {
		
		lppmRestAdapter.call( '/skema', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil semua skema: " + result.tipe ); // LOG
			},
			message.error
		);
	}
};

