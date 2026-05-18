export const validateClient = (value) => {
    const error = {};

    if (!value.name?.trim()) {
        error.name = "Name is required";
    }

    if (!value.email?.trim()) {
        error.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
        error.email = "Email address is invalid";
    }

    if (!value.mobileno?.trim()) {
        error.mobileno = "Mobile Number is required";
    } else {
        const normalizedPhone = value.mobileno.replace(/[^0-9+]/g, "");
        if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
            error.mobileno = "Enter a valid phone number";
        }
    }

    if (!value.dob) {
        error.dob = "Date of birth is required";
    }

    if(!value.gender){
        error.gender = "Gender is required"
    }
    if(!value.tattoodetails){
        error.tattoodetails = "Tattoo Details is required"
    }

    return error;
};