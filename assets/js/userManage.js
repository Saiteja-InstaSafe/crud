const url = "localhost";
var partnerData;
var tenantData =[];
var selectedpartner;
var selectedtenant;
$(document).ready(function() {

    getPartnersData();

    document.getElementById("add-partner-button").addEventListener("click", function() {
        let userName = Math.round(Math.random()*10000);
        let displayName = document.getElementById('user-name').value;
        let userType = 1;
        let partnerName = $('#parentSelect option:selected').text();
        let partnerId = document.getElementById('partnerID').value;
        
        let tenantName =  $('#tenantSelect option:selected').text();
        let tenantId = document.getElementById('tenantID').value;
        let createdBy = "userCreator"
       


        var payl;

        if (userName && tenantName && partnerName) {
            payl = {
               userName,
               displayName,
               userType,
               partnerName,
               partnerId,
               tenantId,
               tenantName,
               createdBy
            };
            console.log(payl);

                       fetch(`http://${url}:3030/addUsers`,{
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
                                   if(selectedtenant) fetchUsers(selectedtenant);

                               }
                            else{
                                   $('#createParent').trigger('reset');
                                   $('#exampleModalCenter').modal('hide');
                                   if(selectedtenant) fetchUsers(selectedtenant);

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
   fetchtenants(id.id);
    console.log(id.id);
   
    var partnerId = document.getElementById("partnerID");

    partnerId.value = id.id;

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


$('#tenantSelect2').on('change',function(e){
    var selected = $(this);
    var tenantName  = selected[0].value;
   
    var tenantID = tenantData.find(data => data.name === tenantName);
    selectedtenant = tenantID.id;
    fetchUsers(tenantID.id);


});
$('#tenantSelect').on('change',function(e){
    var selected = $(this);
    var tenantName  = selected[0].value;
    var tenantID = tenantData.find(data => data.name === tenantName);
    var ti = document.getElementById("tenantID");
    ti.value = tenantID.id;


});

$(document).on('click','button.btn.btn-danger.btn-link.btn-sm',function () {
    var result = confirm("Want to delete?");
    if (result) {
        var id = $(this).closest('tr').children('td:first').text();
        var payl = {
            id
        };
        fetch(`http://${url}:3030/deleteUser`,{
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
                    
                    if(selectedtenant) {
                        fetchUsers(selectedtenant);
                        
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
          $("#partners-table").find("tr:gt(0)").remove();
            if(data.success && data.data.length > 0){
                let data_arr = data.data;
                data_arr.forEach((item) => {
                    console.log(item)
                    var id = item.tenantId;
                    var name = item.displayName;
                        
                    tenantData.push({
                        id,
                        name
                    });

                    $('#tenantSelect').append(`<option> ${name}</option>`);
                    $('#tenantSelect2').append(`<option> ${name}</option>`);


                })

            }
            else{
                console.log("length of returned array of zero")
                //$('#partners-table tbody tr').remove();
                $('#tenantSelect').find('option').not(':first').remove();;
                $('#tenantSelect2 ').find('option').not(':first').remove();;
            }
        })
        .catch((er) => {
            console.log(er)
        })
};
function fetchUsers(id) {
    fetch(`http://${url}:3030/getUsers/${id}`)
        .then((data) => data.json())
        .then((data) => {
          $("#partners-table").find("tr:gt(0)").remove();
            if(data.success && data.data.length > 0){
                let data_arr = data.data;
                data_arr.forEach((item) => {
                    console.log(item)
                    var id = item.userId;
                    var name = item.displayName;
                    var partner_name = item.partner.name;
                    var tenant_name = item.tenant.tenantName;
                    var createdBy = item.auditLog.createdBy;
                    var payl = `<tr> <td>${id}</td> <td>${name}</td> <td>${tenant_name}</td> <td>${partner_name}</td> <td>${createdBy}</td> <td class="td-actions text-right"><button type="button" rel="tooltip" title="" class="btn btn-primary btn-link btn-sm" data-original-title="Edit Task"><i class="material-icons">edit</i></button><button type="button" rel="tooltip" title="" class="btn btn-danger btn-link btn-sm" data-original-title="Remove"><i class="material-icons">close</i></button></td></tr>`;

                    //console.log(payl+ "payl")
                    $('#partners-table tbody').append(payl)
                })

            }
            else{
                console.log("length of returned array of zero")
                //$('#partners-table tbody tr').remove();
        
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

