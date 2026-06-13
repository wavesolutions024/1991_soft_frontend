export const validateEnquiry = (value) => {
  const error = {};

  if (!value.name?.trim()) {
    error.name = "Name is required";
  }
  if (!value.mobileNo) {
    error.mobileNo = "Mobile Number is required";
  }else {
    const normalizedPhone = value.mobileNo.replace(/\D/g, "");

    if (
      !/^\d{10}$/.test(normalizedPhone) && // 10-digit number
      !/^91\d{10}$/.test(normalizedPhone) // +91 followed by 10 digits
    ) {
      error.mobileNo = "Enter a valid mobile number";
    }
  }
  if (!value.tattooStyle) {
    error.tattooStyle = "Tattoo Style is required";
  }

  return error;
};
