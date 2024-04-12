"use client";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";

const headers = { Accept: "application/json", "Content-Type": "application/json" }

const AddContact = () => {
	const [usersList, setUsersList] = useState([]);

	const [emailError, setEmailError] = useState("");
	const [phoneError, setPhoneError] = useState("");

	const { push } = useRouter();

	useEffect(() => {
		(async () => {
			const rawResponse = await fetch("Http://Localhost:3001/getContactList", { method: "GET", headers });
			const content = await rawResponse.json();
			setUsersList(content);
			console.log("content", content);
		})();
	}, []);

	function redirection(){
		
		push(`/usersList`)
	}

	let handleSubmit = async (event) =>{
		console.log('event',event);
		event.preventDefault();

		let firstName = event?.target?.firstName?.value ?? null
		let lastName = event?.target?.lastName?.value ?? null
		let email = event?.target?.email?.value ?? null
		let country = event?.target?.country?.value ?? null
		let phone = event?.target?.phone?.value ?? null
		let about = event?.target?.about?.value ?? null

		let body = { firstName ,lastName ,email ,country ,phone ,about }
		console.log('body',body);


		(async () => {

			const rawResponse = await fetch("http://Localhost:3001/addContactList", { method: "POST", headers, body: JSON.stringify(body) });
			const addContactListResp = await rawResponse.json();
			if(addContactListResp.emailError){
				setEmailError(addContactListResp.emailError)
			}else{
				setEmailError("")
			}
			if(addContactListResp.phoneError){
				setPhoneError(addContactListResp.phoneError)
			}else{
				setPhoneError("")
			}
			if(addContactListResp.statusCode===200){
				alert('Contact has been added successfully!!!')
				redirection()
			}

		})();

	}

	return (
		<>
		<h1 style={{'textAlign': 'center'}}><b className="">Add Contact</b></h1>
			<div className="container" style={{ "marginTop": "100px" }}>
				<form id="contact-form" onSubmit={handleSubmit} method="POST">
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="firstName">First Name</label>
								<input type="text" name="firstName" className="form-control" required/>
							</div>
						</div>

						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="lastName">Last Name</label>
								<input type="text" name="lastName" className="form-control" required/>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-md-4">
							<div className="form-group">
								<label htmlFor="Email">Email</label>
								<input type="email" name="email" className="form-control" required/>
								<p className="error">{emailError}</p>
							</div>
						</div>

						<div className="col-md-4">
							<div className="form-group">
								<label htmlFor="phone">Phone</label>
								<input type="number" name="phone" className="form-control" required/>
								<p className="error">{phoneError}</p>
							</div>
						</div>

						<div className="col-md-4">
							<div className="form-group">
								<label htmlFor="country">Conntry</label>
								<input type="text" name="country" className="form-control" />
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-md-12">
							<div className="form-group">
								<label htmlFor="message">About</label>
								<textarea name="about" className="form-control" rows="5"></textarea>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-md-12">
							<div className="form-group">
								<button type="submit" style={{ "marginTop": "10px" }} className="btn btn-primary">
									Submit
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default AddContact;
