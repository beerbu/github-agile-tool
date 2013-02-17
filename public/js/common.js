$(function () {
    $(".pointClass").change(function(e) {
        var url = '/' + currentUser+ '/' + currentProject + '/pbl/' + $(this).data('pbl');
        $.post(url,{point:$(this).val()});
    });    
    
    function assign() {
	$('.cancel').click(function (){
	    $('#assign .name').text('Assign').parent().removeClass('btn-info')
	})
	$('#assign input[type="radio"]').bind('click', function (){
	    var selectedName = $(this).val(),
	    btnText = $('#assign .name').text(selectedName);
	    $(btnText).text(selectedName).parent().addClass('btn-info');
	})
    };

    function sortable() {
	$('#sortable').click(function() {
	    console.log('active');
	});
	$('#sortable').sortable().disableSelection();
	$('#sortable').bind('sortstop', function (e, ui) {   // ソートが完了したら実行される。
	    var rows = $('#sortable .priority');
	    for (var i = 0, n = rows.length; i < n; i += 1) {
		$($(rows)[i]).text(i + 1);
	    }
	    console.log('ソート完了');
	});
    };

    // 1行目クリックで並べ替えを可能にする
    $('#issueTable').tablesorter();
    // 1行目のクリックされたセルをアクティブ表示にする
    $('#issueTable th').click(function (){
	var elm = $(this),
	others = $(elm).siblings();
	$(elm).addClass('active');
	$(others).removeClass('active');
	// プライオリティがアクティブならsortableを実行する
	if ( $('#issueTable th.priority').hasClass('active') ) {
	    sortable();
	}
    })
    assign();
});
