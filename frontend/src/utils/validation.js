export default function validateSpotForm(
    country,
    address,
    city,
    state,
    description,
    title,
    price,
    previewImage,
    spotImages
) {
    const validationErrors = {};

    if (!country) validationErrors.country = "Country is required";
    if (!address) validationErrors.address = "Address is required";
    if (!city) validationErrors.city = "City is required";
    if (!state) validationErrors.state = "State is required";
    if (description.length < 30) validationErrors.description = "Description needs a minimum of 30 characters";
    if (!title) validationErrors.title = "Name is required";
    if (price <= 0) validationErrors.price = "Price is required";
    if (!previewImage) validationErrors.previewImage = "Please provide a preview image";

    // make sure the images are the correct type (.png, .jpg, or .jpeg)
    if (!validFile(previewImage)) validationErrors.previewImageType = "URL must end in .png, .jpg, or .jpeg";
    spotImages.forEach((spotImage, index) => {
        const spotImageKey = "spotImagesType".concat(Number(index).toString())
        if (!validFile(spotImage)) validationErrors[spotImageKey] = "URL must in in .png, .jpg, or .jpeg"
    })

    return validationErrors;
}

// validate spot
export const validateSpot = ({country, address, city, state, description, name, price}) => {
    const validationErrors = {};

    if (!country) validationErrors.country = "Country is required";
    if (!address) validationErrors.address = "Address is required";
    if (!city) validationErrors.city = "City is required";
    if (!state) validationErrors.state = "State is required";
    if (description.length < 30) validationErrors.description = "Description needs a minimum of 30 characters";
    if (!name) validationErrors.title = "Name is required";
    if (price <= 0) validationErrors.price = "Price is required";

    return validationErrors;
}

function validFile(url) {
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    const urlParts = url.split('.');
    const fileExtension = urlParts[urlParts.length - 1];
    return allowedExtensions.includes(fileExtension);
}
