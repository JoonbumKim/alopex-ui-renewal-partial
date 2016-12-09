$(document).ready(function()
{
	var uploadObj1 = $("#fileuploader").setOptions({
	    url : 'http://localhost:3000/upload',
		fileName : 'uploadFiles',
		dragDrop:false,
		uploadStr: '싱글파일추가',
		showDone : true,
		showDelete: true,
		showDownload:true
	});
	
	var uploadObj2 = $("#fileuploaderA").setOptions({
	    url : 'http://localhost:3000/upload',
		fileName : 'uploadFiles',
		dragDrop:true,
		uploadStr: '멀티파일추가'
	});
	
	
	            $("#uploadBtn1").on('click', function(){
	        		$("#fileuploader").startUpload();
		        });
		
				$("#startUploadA").on('click', function(){
					$("#fileuploaderA").startUpload();
				});

				$("#stopUploadA").on('click', function(){
					$("#fileuploaderA").stopUpload();
				});

				$("#cancelAllA").on('click', function(){
					$("#fileuploaderA").cancelAll();
				});

				$("#btn_setCheckedAllTrueA").on("click", function (){
					$("#fileuploaderA").checkAll();
			      
				});

				$("#btn_setCheckedAllFalseA").on("click", function (){
					$("#fileuploaderA").unCheckAll();
				});

				$("#btn_cancelCheckedA").on("click", function (){
					$("#fileuploaderA").checkDelete();
				});
});
