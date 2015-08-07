/**
 * eHRMRestAdapter.js
 *
 * UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.0.0
 */

var target = 'https://core-unitedvision.whelastic.net';
var restAdapter = rest( target, 'ehrm' );

var unitKerjaRestAdapter = {

	save: function( id, nama, tipe, singkatan, callback ) {

		var unitKerja = {
			id: id,
			nama: nama,
			tipe: tipe,
			singkatan: singkatan
		};
		
		restAdapter.call( '/satker', unitKerja, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan unit kerja: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( kode, callback ) {

		restAdapter.call( '/satker/' + kode, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus unit kerja: " + kode ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		restAdapter.call( '/satker/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil unit kerja: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findSubUnit: function( kode, callback ) {

		restAdapter.callFree( '/satker/' + kode + '/sub', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	addSubUnit: function( kode, id, nama, tipe, singkatan, callback ) {

		var unitKerja = {
			id: id,
			nama: nama,
			tipe: tipe,
			singkatan: singkatan,
		};

		restAdapter.call( '/satker/' + kode + '/sub', unitKerja, 'POST',
			function( result ) {
				message.writeLog( "Mengambil unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/satker/search/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	all: function( callback ) {

		restAdapter.callFree( '/satker', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil semua unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var jabatanRestAdapter = {

	save: function( idUnitKerja, id, eselon, pangkat, nama, callback ) {

		var jabatan = {
			id: id,
			eselon: eselon,
			pangkat: pangkat,
			nama: nama
		};
		
		restAdapter.call( '/jabatan/' + idUnitKerja, jabatan, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan jabatan: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		restAdapter.call( '/jabatan/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus jabatan: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		restAdapter.call( '/jabatan/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil jabatan: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( id, callback ) {

		restAdapter.call( '/jabatan/satker/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil jabatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/jabatan/search/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari jabatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var pegawaiRestAdapter = {

	save: function( idSatuanKerja, id, nip, password, nik, nama, tanggalLahir, email, telepon, idPenduduk, callback ) {

		var pegawai = {
			id: id,
			nip: nip,
			passwordStr: password,
			nik: nik,
			nama: nama,
			tanggalLahirStr: tanggalLahir,
			email: email,
			telepon: telepon,
			idPenduduk: idPenduduk
		};
		
		var method = 'POST';
		if ( id != 0 )
			method = 'PUT';
		
		restAdapter.call( '/pegawai/' + idSatuanKerja, pegawai, method, function( result ) {
				callback( result );
				message.writeLog( "Menyimpan pegawai: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( nip, callback ) {

		restAdapter.call( '/pegawai/' + nip, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus pegawai: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( nip, callback ) {

		restAdapter.call( '/pegawai/' + nip, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil pegawai: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( idSatuanKerja, callback ) {

		restAdapter.call( '/pegawai/satker/' + idSatuanKerja, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil pegawai: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},

	findByEselon: function( eselon, callback ) {

		restAdapter.call( '/pegawai/eselon/' + eselon, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil pegawai: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findAll: function( callback ) {

		restAdapter.call( '/pegawai', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil pegawai: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/pegawai/search/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari pegawai: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	mutasi: function( nip, kode, callback ) {

		restAdapter.call( '/pegawai/' + nip + '/mutasi/' + kode, null, 'POST',
			function( result ) {
				message.writeLog( "Mutasi pegawai " + nip + " ke Satuan Kerja " + kode ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	promosiPangkat: function( nip, pangkat, nomorSk, tanggalMulai, tanggalSelesai, callback ) {

		var riwayat = {
			nomorSk: nomorSk,
			tanggalMulaiStr: tanggalMulai,
			tanggalSelesaiStr: tanggalSelesai
		};

		restAdapter.call( '/pegawai/' + nip + '/pangkat/' + pangkat, riwayat, 'POST',
			function( result ) {
				message.writeLog( "Promosi  pegawai  " + nip + " ke pangkat " + pangkat ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	hapusPangkat: function( nip, pangkat, callback ) {

		restAdapter.call( '/pegawai/' + nip + '/pangkat/' + pangkat, null, 'DELETE',
			function( result ) {
				message.writeLog( "Hapus pangkat " + pangkat + " dari pegawai  " + nip ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	promosiJabatan: function( nip, idJabatan, nomorSk, tanggalMulai, tanggalSelesai, callback ) {

		var riwayat = {
			nomorSk: nomorSk,
			tanggalMulaiStr: tanggalMulai,
			tanggalSelesaiStr: tanggalSelesai
		};
	
		restAdapter.call( '/pegawai/' + nip + '/jabatan/' + idJabatan, riwayat, 'POST',
			function( result ) {
				message.writeLog( "Promosi  pegawai  " + nip + " ke jabatan " + idJabatan ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	hapusJabatan: function( nip, jabatan, callback ) {

		restAdapter.call( '/pegawai/' + nip + '/jabatan/' + jabatan, null, 'DELETE',
			function( result ) {
				message.writeLog( "Hapus jabatan " + jabatan + " dari pegawai  " + nip ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var absenRestAdapter = {

	pagi: function( nip, callback ) {

		restAdapter.call( '/absen/' + nip + '/pagi', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen pagi: " + nip ); // LOG
			},
			message.error
		);
	},

	pagiDetail: function( nip, tanggal, jam, callback ) {

		restAdapter.call( '/absen/' + nip + '/pagi/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen pagi: " + nip ); // LOG
			},
			message.error
		);
	},

	cek1: function( nip, callback ) {

		restAdapter.call( '/absen/' + nip + '/cek1', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek1: " + nip ); // LOG
			},
			message.error
		);
	},

	cek1Detail: function( nip, tanggal, jam, callback ) {

		restAdapter.call( '/absen/' + nip + '/cek1/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek1: " + nip ); // LOG
			},
			message.error
		);
	},

	cek2: function( nip, callback ) {

		restAdapter.call( '/absen/' + nip + '/cek2', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek2: " + nip ); // LOG
			},
			message.error
		);
	},

	cek2Detail: function( nip, tanggal, jam, callback ) {

		restAdapter.call( '/absen/' + nip + '/cek2/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek2: " + nip ); // LOG
			},
			message.error
		);
	},

	sore: function( nip, callback ) {

		restAdapter.call( '/absen/' + nip + '/sore', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen sore: " + nip ); // LOG
			},
			message.error
		);
	},

	soreDetail: function( nip, tanggal, jam, callback ) {

		restAdapter.call( '/absen/' + nip + '/sore/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen sore: " + nip ); // LOG
			},
			message.error
		);
	},

	hadir: function( nip, tanggal, pagi, cek1, cek2, sore, callback ) {

		var hadirObject = { pagiStr: pagi, cek1Str: cek1, cek2Str: cek2, soreStr: sore };
		
		restAdapter.call( '/absen/' + nip + '/hadir/' + tanggal, hadirObject, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen hadir: " + nip + ":" + tanggal + ". " + hadirObject ); // LOG
			},
			message.error
		);
	},

	sakit: function( nip, tanggal, callback ) {

		restAdapter.call( '/absen/' + nip + '/sakit/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen sakit: " + nip + ":" + tanggal ); // LOG
			},
			message.error
		);
	},

	izin: function( nip, tanggal, callback ) {

		restAdapter.call( '/absen/' + nip + '/izin/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen izin: " + nip + ":" + tanggal ); // LOG
			},
			message.error
		);
	},

	cuti: function( nip, tanggal, callback ) {

		restAdapter.call( '/absen/' + nip + '/cuti/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cuti: " + nip + ":" + tanggal ); // LOG
			},
			message.error
		);
	},
	
	findBySatker: function( kode, tanggal, callback ) {

		restAdapter.call( '/absen/satker/' + kode + '/tanggal/' + tanggal, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil absen: " + kode + ":" + tanggal ); // LOG
			},
			message.error
		);
	},
	
	rekapBySatker: function( kode, awal, akhir, callback ) {

		restAdapter.callFree( '/absen/' + kode + '/rekap/' + awal + '/' + akhir, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Rekap absen: " + keyword ); // LOG
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/absen/search/' + keyword, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil absen: " + keyword ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, status, callback ) {

		restAdapter.call( '/absen/' + id + '/status/' + status, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus absen: " + status + ":" + id ); // LOG
			},
			message.error
		);
	}
};

var kalendarRestAdapter = {

	add: function( tanggal, callback ) {

		restAdapter.call( '/kalendar/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah kalendar: " + tanggal ); // LOG
			},
			message.error
		);
	},

	findOne: function( tanggal, callback ) {

		restAdapter.call( '/kalendar/' + tanggal, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kalendar: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},

	"delete": function( tanggal, callback ) {

		tanggal = tanggal.replace( "/", "-" );
		tanggal = tanggal.replace( "/", "-" );
		tanggal = tanggal.replace( "/", "-" );

		restAdapter.call( '/kalendar/' + tanggal, null, 'DELETE',
			function( result ) {
				message.writeLog( "Mengambil kalendar: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
		
	findRange: function( tanggalAwal, tanggalAkhir, callback ) {

		restAdapter.call( '/kalendar/' + tanggalAwal + '/to/' + tanggalAkhir, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kalendar: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var suratTugasRestAdapter = {
	
	add: function( id, nomor, jumlahHari, tujuan, maksud, callback ) {

		var suratTugas = {
			id: id,
			nomor: nomor,
			jumlahHari: jumlahHari,
			tujuan: tujuan,
			maksud: maksud
		};
		
		restAdapter.call( '/suratTugas/langsung', suratTugas, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah surat tugas: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	addPemegangTugas: function( id, nip, callback ) {
		
		restAdapter.call( '/suratTugas/' + id + '/pegawai/' + nip, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah pemegang tugas: " + nip + ' pada ' + id ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {
		
		restAdapter.call( '/suratTugas/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus surat tugas: " + id ); // LOG
			},
			message.error
		);
	},
	
	request: function( nip, nomor, jumlahHari, tujuan, maksud, daftarPegawai, callback ) {

		var suratTugas = {
			nomor: nomor,
			jumlahHari: jumlahHari,
			tujuan: tujuan,
			maksud: maksud,
			daftarPegawai: daftarPegawai
		};
		
		restAdapter.call( '/suratTugas/' + nip, suratTugas, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Merequest surat tugas: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	accept: function( nomor, callback ) {

		nomor = changeChar( nomor, "/", "-" );

		restAdapter.call( '/suratTugas/' + nomor + '/terima', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menerima surat tugas: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	ignore: function( nomor, callback ) {

		nomor = changeChar( nomor, "/", "-" );

		restAdapter.call( '/suratTugas/' + nomor + '/tolak', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menolak surat tugas: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	findPending: function( callback ) {

		restAdapter.call( '/suratTugas/pending', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas pending: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findAccepted: function( callback ) {

		restAdapter.call( '/suratTugas/terima', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas accepted: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findIgnored: function( callback ) {

		restAdapter.call( '/suratTugas/tolak', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas ignored: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findByTanggal: function( awal, akhir, callback ) {

		restAdapter.call( '/suratTugas/awal/' + awal + '/akhir/' + akhir, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findBySatker: function( kode, callback ) {

		restAdapter.call( '/suratTugas/satker/' + kode, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findByPegawai: function( nip, callback ) {

		restAdapter.call( '/suratTugas/' + nip, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/suratTugas/search/' + keyword, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	}
};

var sppdRestAdapter = {
	
	add: function( nip, nomorSuratTugas, nomor, tanggalBerangkat, transportasi, kodeRekening, nomorDpa, tingkat, daftarPengikut, callback ) {

		var sppd = {
			nomor: nomor,
			tanggalBerangkatStr: tanggalBerangkat,
			modaTransportasi: transportasi,
			kodeRekening: kodeRekening,
			nomorDpa: nomorDpa,
			tingkat: tingkat,
			daftarPengikut: daftarPengikut
		};

		nomorSuratTugas = changeChar( nomorSuratTugas, "/", "-" );
		
		restAdapter.call( '/sppd/' + nip + '/suratTugas/' + nomorSuratTugas, sppd, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan sppd: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	save: function( id, nip, nomorSuratTugas, nomor, tanggalBerangkat, transportasi, kodeRekening, nomorDpa, tingkat, callback ) {

		var sppd = {
			id: id,
			nomor: nomor,
			tanggalBerangkatStr: tanggalBerangkat,
			modaTransportasi: transportasi,
			kodeRekening: kodeRekening,
			nomorDpa: nomorDpa,
			tingkat: tingkat
		};

		nomorSuratTugas = changeChar( nomorSuratTugas, "/", "-" );

		restAdapter.call( '/sppd/' + nip + '/suratTugas/' + nomorSuratTugas, sppd, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan sppd: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},

	"delete": function( id, callback ) {

		restAdapter.call( '/sppd/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus sppd: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	addFollower: function( nomor, nama, tanggalLahir, keterangan, callback ) {

		var pengikut = {
			nama: nama,
			tanggalLahirStr: tanggalLahir,
			keterangan: keterangan
		};

		nomor = changeChar( nomor, "/", "-" );
			
		restAdapter.call( '/sppd/' + nomor + '/pengikut', pengikut, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah pengikut sppd: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	findByTanggal: function( awal, akhir, callback ) {

		restAdapter.call( '/sppd/awal/' + awal + '/akhir/' + akhir, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findBySatker: function( kode, callback ) {

		restAdapter.call( '/sppd/satker/' + kode, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil sppd: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findByPegawai: function( nip, callback ) {

		restAdapter.call( '/sppd/' + nip, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil sppd: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/sppd/search/' + keyword, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	}
}

var aplikasiRestAdapter = {
	
	findKode: function( callback ) {

		restAdapter.call( '/aplikasi/kode', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil kode aplikasi: " + result.object ); // LOG
			},
			message.error,
			false // Synchronous Access
		);
	},
	
	add: function( id, kode, nama, url, callback ) {
		
		var aplikasi = {
			id: id,
			kode: kode,
			nama: nama,
			url: url
		};

		restAdapter.call( '/aplikasi', aplikasi, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah aplikasi: " + aplikasi ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		restAdapter.call( '/aplikasi/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus aplikasi: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( kode, callback ) {

		restAdapter.call( '/aplikasi/' + kode, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil aplikasi: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	findAll: function( callback ) {

		restAdapter.call( '/aplikasi', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil aplikasi: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	addOperator: function( kode, nip, callback ) {

		restAdapter.call( '/aplikasi/' + kode +'/operator/' + nip, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah operator: " + nip + ' pada aplikasi: ' + kode ); // LOG
			},
			message.error
		);
	},
	
	findOperator: function( kode, callback ) {

		restAdapter.call( '/aplikasi/' + kode + '/operator', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil operator: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	addAdmin: function( kode, nip, callback ) {

		restAdapter.call( '/aplikasi/' + kode +'/admin/' + nip, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah admin: " + nip + ' pada aplikasi: ' + kode ); // LOG
			},
			message.error
		);
	},
	
	findAdmin: function( kode, callback ) {

		restAdapter.call( '/aplikasi/' + kode + '/admin', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil admin: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	deleteOperator: function( id, callback ) {

		restAdapter.call( '/aplikasi/operator/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus operator: " + id ); // LOG
			},
			message.error
		);
	},
};
