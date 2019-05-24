
var partnerData;
var tenantData;
var selectedpartner;
var selectedtenant;
$(document).ready(function() {

    getPartnersData();

    document.getElementById("add-partner-button").addEventListener("click", function() {
        let displayName = $("#partner-name").val();
        let primaryAdminName = $("#partner-admin-name").val();
        let primaryAdminEmail = $("#partner-admin-email").val();
        let partnerName = $('#parentSelect option:selected').text();
        let partnerId = partnerData.find(x => x.name === partnerName.trim());
        partnerId = partnerId.id;
        console.log(partnerData);


        var payl;

        if (primaryAdminEmail && primaryAdminName && partnerName) {
            payl = {
                displayName,
                primaryAdminName,
                primaryAdminEmail,
                partnerName,
                partnerId
            };
            console.log(payl);

                       fetch(`http://${url}:3030/addTenants`,{
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
                                   if(selectedpartner) fetchtenants(selectedpartner);

                               }
                            else{
                                   $('#createParent').trigger('reset');
                                   $('#exampleModalCenter').modal('hide');
                                   if(selectedpartner) fetchtenants(selectedpartner);

                               }

                           })
                }
                   else{
                       $('#createParent').trigger('reset');
                   }
                });
            });


$('#parentSelect').on('change', function (e) {
    var selected = $(this);
    var name = selected[0].value;

    var id = partnerData.find(data => data.name === name);


    var partnerId = document.getElementById("partnerID");

    partnerId.value = id;

});
$('#parentSelect2').on('change', function (e) {

    var selected = $(this);
    console.log('changed');
    var name = selected[0].value;


    var id = partnerData.find(data => data.name === name);
    console.log(partnerData);
    selectedpartner = id.id;
    fetchtenants(id.id);

});

$(document).on('click','button.btn.btn-danger.btn-link.btn-sm',function () {
    var result = confirm("Want to delete?");
    if (result) {
        var id = $(this).closest('tr').children('td:first').text();
        var payl = {
            id
        };
        fetch(`http://${url}:3030/deleteTenant`,{
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
                    
                    if(selectedpartner) {
                        fetchtenants(selectedpartner);
                        
                    } 
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


function fetchtenants(id) {
    fetch(`http://${url}:3030/getTenants/${id}`)
        .then((data) => data.json())
        .then((data) => {
          //  parterData = [];
          $("#partners-table").find("tr:gt(0)").remove();
            if(data.success && data.data.length > 0){
                let data_arr = data.data;
                data_arr.forEach((item) => {
                    /*
                    parterData.append({
                        "id" : data.partnerId,
                        "name": data.displayName
                    });
                    */

                    var id = item.tenantId;
                    var name = item.displayName;

                    var admin = item.members.find(x => x.role == "TENANT_ADMIN");
                    var admin_name = admin.displayName;
                    var admin_email = admin.email;
                    var partner_name = item.partner.name;

                    var payl = `<tr> <td>${id}</td> <td>${name}</td> <td>${admin_name}</td> <td>${admin_email}</td> <td>${partner_name}</td> <td class="td-actions text-right"><button type="button" rel="tooltip" title="" class="btn btn-primary btn-link btn-sm" data-original-title="Edit Task"><i class="material-icons">edit</i></button><button type="button" rel="tooltip" title="" class="btn btn-danger btn-link btn-sm" data-original-title="Remove"><i class="material-icons">close</i></button></td></tr> 
` ;
                    $('#parentSelect').append(`<option> ${name}</option>`);
                    //console.log(payl+ "payl")
                    $('#partners-table tbody').append(payl)

                })

            }
            else{
                console.log("length of returned array of zero")
                $('#partners-table tbody tr').remove();
            }
        })
        .catch((er) => {
            console.log(er)
        })
};

function getPartnersData() {

    fetch(`http://${url}:3030/getPartners`)
        .then((data) => data.json())
        .then((data) => {
            let data_arr = data.data;
            partnerData = [];
            data_arr.forEach((item) => {
                var id = item.partnerId;
                var name = item.displayName;

                var admin = item.members.find(x => x.role == "PARTNER_ADMIN");
                var admin_name = admin.displayName;
                var admin_email = admin.email;

                partnerData.push({
                    id,
                    name
                });

                $('#parentSelect').append(`<option> ${name}</option>`);
                $('#parentSelect2').append(`<option> ${name}</option>`);

            });
        })
}

function fetchtenants(id) {
    fetch(`http://${url}:3030/getTenants/${id}`)
        .then((data) => data.json())
        .then((data) => {
          //  parterData = [];
            
            if(data.success && data.data.length > 0){
                let data_arr = data.data;
                data_arr.forEach((item) => {
            
            
                })

            }
            else{
                console.log("length of returned array of zero")
                $('#partners-table tbody tr').remove();
            }
        })
        .catch((er) => {
            console.log(er)
        })
};