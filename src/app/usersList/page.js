"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'


const UsersList = () => {
	const [usersList, setUsersList] = useState([]);

	const { push } = useRouter();


    async function loadData(){
		
		(async () => {
			const rawResponse = await fetch("Http://Localhost:3001/getContactList", {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				}
			});
			const content = await rawResponse.json();
			setUsersList(content);
			console.log("content", content);
		})();
	}
	
    let deleteContact = (contactId) => {
        if(confirm("Are you sure?")){
            console.log('contactId',contactId);


            (async () => {
                const rawResponse = await fetch("Http://Localhost:3001/deleteContact/"+contactId, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    }
                });
                const delteResp = await rawResponse.json();
                if(delteResp.statusCode === 200){
                    alert('deleted successully')
                    loadData()
                    //redirection()
                    
                }else{
                    alert('Some error occured. please try again')
                }
                console.log("delteResp", delteResp);
            })();
        }
    }
    
    useEffect(() => {

        loadData()
		
	}, []);

	return (
		<>

            <a href="/addUser" className="button" style={{'marginLeft': '50%'}}>Add New</a>

			<div className="containter-cards">
				{usersList.map((customer) => (
					<div className="card" key={customer._id}>
						<img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" style={{ width: "100%" }} />
						<div className="container">
							<h4><b> {customer.firstName} {customer.lastName}</b></h4>
							<p>{customer.email}</p>
							<p>{customer.country}</p>
							<p>{customer.phone}</p>
							<p>{customer.about}</p>
                            <a href={`/editUser/${customer._id}`} className="button">Edit</a>
							<button type="button" onClick={() => deleteContact(customer._id)} className="button delete">Delete</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default UsersList;
