export const validateClient = (value) => {
  const error = {};

  if (!value.name?.trim()) {
    error.name = "Name is required";
  }



  if (!value.mobileno?.trim()) {
    error.mobileno = "Mobile number is required";
  } else {
    const normalizedPhone = value.mobileno.replace(/\D/g, "");

    if (
      !/^\d{10}$/.test(normalizedPhone) && // 10-digit number
      !/^91\d{10}$/.test(normalizedPhone) // +91 followed by 10 digits
    ) {
      error.mobileno = "Enter a valid mobile number";
    }
  }

  if (!value.dob) {
    error.dob = "Date of birth is required";
  }

  if (!value.gender) {
    error.gender = "Gender is required";
  }
  if (!value.tattoodetails) {
    error.tattoodetails = "Tattoo Details is required";
  }

  return error;
};
