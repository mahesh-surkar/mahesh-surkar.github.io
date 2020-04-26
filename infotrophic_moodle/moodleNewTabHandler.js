//Handle  moodle link opend in new tab
////This script shold be added to Administation -> Appearance->Additional HTML->Within HEAD 
//
<script>
function redirect() { 
    var referer = document.referrer;
    currentPage=window.location.href;
    var host = window.location.host;
    window.location.href="http://" + host +"?page=" +currentPage;
 }

if(self == top) 
{
    redirect();
}

</script>

