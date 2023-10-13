//const changeRole = document.getElementsByClassName("changeRole")
//const deleteUser = document.getElementsByClassName("deleteUser")

document.addEventListener("click", (e) => {

    const actionBtn = e.target;

    if(actionBtn.className == "changeRole"){
        
        fetch("/api/users/premium", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: actionBtn.value})
        })
        .then(response => response.json())
        .then(data => alert(data.payload))
        .catch(err => console.log(err))



    }

    if(actionBtn.className == "deleteUser"){
        
        fetch("/api/users/deleteOne", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: actionBtn.value})
        })
        .then(response => response.json())
        .then(data => alert(data.payload))
        .catch(err => console.log(err))



    }
    //console.log(changeRole.value)
})


