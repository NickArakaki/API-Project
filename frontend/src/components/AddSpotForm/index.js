import { useState } from "react";
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import validateAddSpotForm from "../../utils/validation";
import "./AddSpotForm.css"

export default function AddSpotForm() {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState();
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);

    if (!sessionUser) history.push('/');

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateAddSpotForm(
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
            image4
        )

        if (!Object.values(errors).length) {
            // make post request
            console.log("We're making progress")

        } else {
            // else set the errors
            setValidationErrors(errors);
        }
    }

    return (
        <form className="add_spot_form" onSubmit={handleSubmit}>
            <h2 className="add_spot_form_title">Create a New Spot</h2>
            <div className="add_spot_form_location_wrapper">
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact address once they have booked a reservation.</p>
            </div>
            <div>
                Country: {validationErrors.country && <span className="error">{validationErrors.country}</span>}
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </div>
            <div>
                Street Address: {validationErrors.streetAddress && <span className="error">{validationErrors.streetAddress}</span>}
                <input
                    type="text"
                    placeholder="Address"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                />
            </div>
            <div>
                City: {validationErrors.city && <span className="error">{validationErrors.city}</span>}
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />,
            </div>
            <div>
                State: {validationErrors.state && <span className="error">{validationErrors.state}</span>}
                <input
                    type="text"
                    placeholder="STATE"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />
            </div>
            <div>
                Latitude:
                <input
                    type="text"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
            </div>
            <div>
                Longitude
                <input
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
            </div>
            <hr />
            <div className="add_spot_form_description_wrapper">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {validationErrors.description && <span className="error">{validationErrors.description}</span>}
            </div>
            <hr />
            <div className="add_spot_form_title_wrapper">
                <h3>Create a tile for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            {validationErrors.title && <span className="error">{validationErrors.title}</span>}
            <hr />
            <div className="add_spot_form_price_wrapper">
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher ins search results</p>
                $ <input
                    type="number"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {validationErrors.price && <span className="error">{validationErrors.price}</span>}
            </div>
            <div className="add_spot_form_photo_wrapper">
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot</p>
                <input
                    className="add_spot_form_preview_image"
                    type="text"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                />
                {validationErrors.previewImage && <span className="error">{validationErrors.previewImage}</span>}
                {validationErrors.previewImageType && <span className="error">{validationErrors.previewImageType}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                />
                {validationErrors.image1Type && <span className="error">{validationErrors.image1Type}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                />
                {validationErrors.image2Type && <span className="error">{validationErrors.image2Type}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                />
                {validationErrors.image3Type && <span className="error">{validationErrors.image3Type}</span>}
                <input
                    className="add_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image4}
                    onChange={(e) => setImage4(e.target.value)}
                />
                {validationErrors.image3Type && <span className="error">{validationErrors.image3Type}</span>}
            </div>
            <hr />
            <button className="add_spot_form_submit_button" type="submit">Create Spot</button>
        </form>
    )
}
