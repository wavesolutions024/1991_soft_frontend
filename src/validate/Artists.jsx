export const validateArtists = (value,id) => {
  const error = {};

  if (!value.artistName?.trim()) {
    error.artistName = "Name is required";
  }
  if (!value.artistNumber?.trim()) {
    error.artistNumber = "Number is required";
  }else {
        const normalizedPhone = value.artistNumber.replace(/[^0-9+]/g, "");
        if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
            error.artistNumber = "Enter a valid phone number";
        }
    }
  if (!value.username?.trim()) {
    error.username = "Username is required";
  }
  if (!value.password?.trim() && !id) {
    error.password = "Password is required";
  }

  if(!value.salary){
     error.salary = "Salary is required";
  }


  if(value.role === ""){
     error.role = "Role is required";
  }

  return error
};
