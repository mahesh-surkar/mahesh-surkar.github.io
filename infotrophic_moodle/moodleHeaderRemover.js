//Remove moodle Header
//This script shold be added to Administation -> Appearance->Additional HTML->Before BODY is closed
<script>
     function moodleHeaderRemove()
     {
         var  moodleHeader = document.getElementsByClassName("navbar ");

          if (moodleHeader[0])
          {
               moodleHeader[0].remove();
          }
     
         var  pageHeaderHeadings= document.getElementsByClassName("page-header-headings ");
         if (pageHeaderHeadings[0])
         {         
               pageHeaderHeadings[0].remove();
          }

          var  loginform = document.getElementsByClassName("loginform ");

          if (loginform[0])
          {
               var pageNavBar = document.getElementById("page-navbar");
               if (pageNavBar)
               {
                     pageNavBar.remove();
                }
          }

          
     }

   if(self != top)
    {
       moodleHeaderRemove();
    }

    var loginInfo = document.getElementsByClassName('logininfo');

    if (loginInfo[0])
    {
        var links = loginInfo[0].getElementsByTagName('a');
      
        var parent =  window.parent.document.getElementsByClassName('loginDiv');

        if ( parent[0] && links.length !=0)
        {
            parent[0].innerHTML = "";
            var forLogin = document.createElement("div");        
            for (index = 0; index < links.length; index++)
            {
               // alert(":" +links[index]);
               //  forLogin.innerHTML =  loginInfo[0].innerHTML;
               // forLogin.appendChild(links[index]);
            }
            forLogin.innerHTML =  loginInfo[0].innerHTML;

            parent[0].appendChild(forLogin);
            parent[0].className = "loginDiv";
            forLogin.style.cssFloat = "right";
            forLogin.style.padding = "0px 18px 0px 0px";
       }
    }

    document.body.style.paddingTop = '6px';
    document.body.style.marginTop = '0px';

</script>

