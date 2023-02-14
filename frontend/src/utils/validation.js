export default function validateAddSpotForm(
    country,
    streetAddress,
    city,
    state,
    description,
    title,
    price,
    previewImage,
    image1,
    image2,
    image3,
    image4,
) {
    const validationErrors = {};

    if (!country) validationErrors.country = "Country is required";
    if (!streetAddress) validationErrors.streetAddress = "Address is required";
    if (!city) validationErrors.city = "City is required";
    if (!state) validationErrors.state = "State is required";
    if (description.length < 30) validationErrors.description = "Description needs a minimum of 30 characters";
    if (!title) validationErrors.title = "Name is required";
    if (price <= 0) validationErrors.price = "Price is required";
    if (!previewImage) validationErrors.previewImage = "Please provide a preview image";

    // make sure the images are the correct type (.png, .jpg, or .jpeg)
    if (!fileValidation(previewImage)) validationErrors.previewImageType = "URL must end in .png, .jpg, or .jpeg";
    if (image1 && !fileValidation(image1)) validationErrors.image1Type = "URL must end in .png, .jpg, or .jpeg";
    if (image2 && !fileValidation(image2)) validationErrors.image2Type = "URL must end in .png, .jpg, or .jpeg";
    if (image3 && !fileValidation(image3)) validationErrors.image3Type = "URL must end in .png, .jpg, or .jpeg";
    if (image4 && !fileValidation(image4)) validationErrors.image4Type = "URL must end in .png, .jpg, or .jpeg";

    return validationErrors;
}

function fileValidation(url) {
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    const urlParts = url.split('.');
    const fileExtension = urlParts[urlParts.length - 1];
    return allowedExtensions.includes(fileExtension);
}
