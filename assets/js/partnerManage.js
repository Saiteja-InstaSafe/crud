$(document).ready(function() {
        fetchpartners();
    document.getElementById("add-partner-button").addEventListener("click", function(){
        var partnerName = $("#partner-name").val();
       var primaryAdminName =  $("#partner-admin-name").val();
       var primaryAdminEmail = $("#partner-admin-email").val();
       var parentPartnerName = $("#partner-parent-name").val();
       var parentPartnerId = $("#partner-parent-id").val();
        var payl;
       if(primaryAdminEmail && primaryAdminName && partnerName){

           if(parentPartnerName){
            payl = {
                   partnerName,
                   primaryAdminName,
                   primaryAdminEmail,
                   parentPartnerName,
                   parentPartnerId
               }
           }
           else{
               payl = {
                   partnerName,
                   primaryAdminEmail,
                   primaryAdminName,

               }




           }
           fetch("http://localhost:3030/addPartners",{
               method:'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
               },
               body:JSON.stringify(payl)
           })
           $('#createParent').trigger('reset');
           $('#exampleModalCenter').modal('hide')
           $("#good-alert").fadeTo(2000, 500).slideUp(500, function(){
               $("#good-alert").slideUp(500);
           });
           fetchpartners();
                   /*
                   if(res.body.statusCode === 201){
                      ;
                   }
                   else{
                       $('#createParent').trigger('reset');
                       $('#exampleModalCenter').modal('hide')
                       fetchpartners();
                   }

                    */








       }
       else{
           $('#createParent').trigger('reset')
       }
    });



});

function fetchpartners() {
    fetch('http://localhost:3030/getPartners')
        .then((data) => data.json())
        .then((data) => {
            $('#partners-table tbody').innerHTML = "";
            if(data.success){
                let data_arr = data.data;
                data_arr.forEach((item) => {
                    var id = item.partnerId;
                    var name = item.displayName;

                    var admin = item.members.find(x => x.role == "PARTNER_ADMIN");
                    var admin_name = admin.displayName;
                    var admin_email = admin.email;
                    var parent_name = item.parentPartner ? item.parentPartner : "-";

                    var payl = `<tr> <td>${id}</td> <td>${name}</td> <td>${admin_name}</td> <td>${admin_email}</td> <td>${parent_name}</td> <td class="td-actions text-right"><button type="button" rel="tooltip" title="" class="btn btn-primary btn-link btn-sm" data-original-title="Edit Task"><i class="material-icons">edit</i></button><button type="button" rel="tooltip" title="" class="btn btn-danger btn-link btn-sm" data-original-title="Remove"><i class="material-icons">close</i></button></td></tr> 
` ;
                    console.log(payl+ "payl")
                    $('#partners-table tbody').append(payl)

                })
            }
            else{
                console.log(data.statusCode)
            }
        })
        .catch((er) => {
            console.log(er)
        })
};