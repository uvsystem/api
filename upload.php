<?php

	$image = $_FILES[ "file" ];
	$kode = $_POST[ "kode" ];
	$target_dir = $_POST[ "directory" ];

	save_file( $kode, $image, $target_dir );
	
	function save_file( $kode, $image, $target_dir ) {

		$file_name = $kode . "-" . basename( $image[ "name" ] );
		$target_file = $target_dir . "/" . $file_name;

		$imageFileType = pathinfo( $target_file, PATHINFO_EXTENSION );

		// Check if image file is an actual image or fake image
		if( isset( $_POST[ "submit" ] ) ) {

			if( getimagesize( $image[ "tmp_name" ] ) !== false ) {

				// Upload the file.
				if ( move_uploaded_file( $image[ "tmp_name" ], $target_file ) ) {

					echo json_encode( 
						Array ( 
							"tipe" => "SUCCESS", 
							"message" => "File berhasil di-upload", 
							"model" => Array ( 
								"directory" => $target_dir,
								"file_name" => $file_name,
								"url" => $target_file
							)
						)
					);

				} else {
					echo json_encode( Array ( "tipe" => "ERROR", "message" => "File tidak bisa di-upload" ) );
				}

			} else {
				echo json_encode( Array ( "tipe" => "ERROR", "message" => "File is not an image" ) );
			}
		}
	}
?>
