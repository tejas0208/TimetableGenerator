$(document).ready(function(){

    var $this, i, filter,
        $input = $('#my_other_id'),
        $options = $('#my_id').find('option');

    $input.keyup(function(){
        filter = $(this).val();
        i = 1;
        $options.each(function(){
            $this = $(this);
            $this.removeAttr('selected');
            if ($this.text().indexOf(filter) != -1) {
                $this.show();
                if(i == 1){
                    $this.attr('selected', 'selected');
                }
                i++;
            } else {
                $this.hide();
            }
        });
    });

});
