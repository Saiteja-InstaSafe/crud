const url = "localhost";
$(document).ready(function() {
    
        fetchpartners();
    document.getElementById("add-partner-button").addEventListener("click", function(){
        var partnerName = $("#partner-name").val();
       var primaryAdminName =  $("#partner-admin-name").val();
       var primaryAdminEmail = $("#partner-admin-email").val();
       var parentPartnerName = $('#parentSelect option:selected').text();

        var partnerId = document.getElementById("partnerID");
        var parentPartnerId = partnerId.value;
        var payl;

       if(primaryAdminEmail && primaryAdminName && partnerName){

           if(!(parentPartnerName === "Optional Parent")){
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
            console.log(payl)
           fetch(`http://${url}:3030/addPartners`,{
               method:'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
               },
               body:JSON.stringify(payl)
           })
               .then((res) => {
                   //console.log(res)
                   if(res.status === 200) {
                       $('#createParent').trigger('reset');
                       $('#exampleModalCenter').modal('hide');
                       $("#good-alert").fadeTo(2000, 500).slideUp(500, function () {
                           $("#good-alert").slideUp(500);
                       });
                       fetchpartners();

                   }
                else{
                       $('#createParent').trigger('reset');

                       $('#exampleModalCenter').modal('hide');
                       fetchpartners();
                   }

               })
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




$('#parentSelect').on('change', function (e) {
    var selected = $(this);
    console.log('changed')
    var tableRow = $("td").filter(function() {
        return $(this).text() == selected[0].value;
    }).closest("tr");
    var id = tableRow[0].cells[0].textContent;
   var partnerId = document.getElementById("partnerID");
   console.log(partnerId)
   partnerId.value = id;

});

$(document).on('click','button.btn.btn-danger.btn-link.btn-sm',function () {
    var result = confirm("Want to delete?");
    if (result) {
        //Logic to delete the item
        var id = $(this).closest('tr').children('td:first').text()
        var payl = {
            id
        };
        fetch(`http://${url}:3030/deletePartner`,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(payl)
        })
            .then((res) =>{
                if(res.status ===  200){
                    $(this).closest("tr").remove();
                    $('#partners-table tbody').innerHTML = "";
                    fetchpartners();




                }
                else{
                    console.log(res);
                }
            })
            .catch((err) =>{
                console.log(err)
            })

    }

});


function fetchpartners() {
    fetch(`http://${url}:3030/getPartners`)
        .then((data) => data.json())
        .then((data) => {
            $("#partners-table").find("tr:gt(0)").remove();
            if(data.success){
                let data_arr = data.data;
                console.log(data_arr)
                data_arr.forEach((item) => {
                    var id = item.partnerId;
                    var name = item.displayName;

                    var admin = item.members.find(x => x.role == "PARTNER_ADMIN");
                    var admin_name = admin.displayName;
                    var admin_email = admin.email;
                    var parent_name = item.parentPartner ? item.parentPartner.value : "-";

                    var payl = `<tr> <td>${id}</td> <td>${name}</td> <td>${admin_name}</td> <td>${admin_email}</td> <td>${parent_name}</td> <td class="td-actions text-right"><button type="button" rel="tooltip" title="" class="btn btn-primary btn-link btn-sm" data-original-title="Edit Task"><i class="material-icons">edit</i></button><button type="button" rel="tooltip" title="" class="btn btn-danger btn-link btn-sm" data-original-title="Remove"><i class="material-icons">close</i></button></td></tr> 
` ;
                    $('#parentSelect').append(`<option> ${name}</option>`);
                    //console.log(payl+ "payl")
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