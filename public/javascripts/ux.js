//コメント入力欄でEnter押すとボタンクリックさせる
function submitComment(){
    //Enterの時
    if(window.event.keyCode == 13){
        $('#comment_submit').trigger('click');
    }
}
