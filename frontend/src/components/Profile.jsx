function Profile(){

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if(!user){
    return <p>Please login</p>;
  }

  return(

    <div>

      <h2 className="text-2xl mb-4">
        Your Profile
      </h2>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>

    </div>
  );
}

export default Profile;