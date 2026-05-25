export const validateArtists = (value) => {
  const error = {};

  if (!value.artistName?.trim()) {
    error.name = "Name is required";
  }
  if (!value.artistNumber?.trim()) {
    error.name = "Number is required";
  }else {
        const normalizedPhone = value.artistNumber.replace(/[^0-9+]/g, "");
        if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
            error.artistNumber = "Enter a valid phone number";
        }
    }
  if (!value.username?.trim()) {
    error.name = "Username is required";
  }
  if (!value.password?.trim()) {
    error.name = "Password is required";
  }

  return error
};
