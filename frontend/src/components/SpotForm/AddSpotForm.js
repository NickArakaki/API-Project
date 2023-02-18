import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

import * as spotActions from '../../store/spots';
import validateSpotForm from "../../utils/validation";

import "./SpotForm.css"

export default function AddSpotForm() { // Refactoring idea: maybe use the rest operator for image1...image4
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [spotImages, setSpotImages] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);

    useEffect(() => {
        const imageList = [];
        if (image1) imageList.push(image1);
        if (image2) imageList.push(image2);
        if (image3) imageList.push(image3);
        if (image4) imageList.push(image4);

        setSpotImages(imageList);

    }, [image1, image2, image3, image4])


    if (!sessionUser) history.push('/');

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateSpotForm(
            country,
            streetAddress,
            city,
            state,
            description,
            title,
            price,
            previewImage,
            spotImages
        )

        if (!Object.values(errors).length) {
            // make post request
            setValidationErrors([]);
            const spotData = {
                address: streetAddress,
                city,
                state,
                country,
                lat: Number(latitude) || 37.7645358,
                lng: Number(longitude) || -122.4730327,
                name: title,
                description,
                price
            };

            const images = [
                {
                    url: previewImage,
                    preview: true
                }
            ]

            spotImages.forEach(spotImage => {
                images.push({
                    url: spotImage,
                    preview: false
                })
            })

            dispatch(spotActions.addSpotThunk(spotData))
                .then((spot) => {
                    // iterate over spotImages and add to spotId
                    images.forEach(spotImage => {
                        dispatch(spotActions.addSpotImageThunk(spot.id, spotImage))
                    })
                    history.push(`/spots/${spot.id}`);
                })
                .catch(async res => {
                    const data = await res.json();
                    if (data && Object.values(data.errors).length > 0) {
                        setServerErrors(Object.values(data.errors));
                    }
                })

        } else {
            // else set the errors
            setValidationErrors(errors);
        }
    }

    return (
        <form className="spot_form" onSubmit={handleSubmit}>
            <h2 className="spot_form_title">Create a New Spot</h2>
            {serverErrors.length > 0 && (
                <ul className="spot_form_server_errors_list">
                    {serverErrors.map(error => (
                        <li key={error} className="spot_error spot_server_error">{error}</li>
                    ))}
                </ul>
            )}
            <div className="spot_form_location_div spot_form_block">
                <div className="spot_form_block_heading">Where's your place located?</div>
                <p className="spot_form_prompt">Guests will only get your exact address once they have booked a reservation.</p>
                <div className="spot_form_location_inputs_div">
                    <div className="spot_form_input_div">
                        <div className="spot_form_input_title">
                            Country: {validationErrors.country && <span className="spot_error">{validationErrors.country}</span>}
                        </div>
                        <input
                            className="spot_form_input"
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div className="spot_form_input_div">
                        <div className="spot_form_input_title">
                            Street Address: {validationErrors.address && <span className="spot_error">{validationErrors.address}</span>}
                        </div>
                        <input
                            className="spot_form_input"
                            type="text"
                            placeholder="Address"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                        />
                    </div>
                    <div className="spot_form_input_div">
                        <div className="spot_form_city_state_div">
                            <div className="spot_form_city_input_div">
                                <div className="spot_form_input_title">
                                    City: {validationErrors.city && <span className="spot_error">{validationErrors.city}</span>}
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    />
                            </div>
                            <div className="spot_form_state_input_div">
                                <div className="spot_form_input_title">
                                    State: {validationErrors.state && <span className="spot_error">{validationErrors.state}</span>}
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="STATE"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div >
                    <div className="spot_form_input_div">
                        <div className="spot_form_lat_lng_div">
                            <div className="spot_form_lat_input_div">
                                <div className="spot_form_input_title">
                                    Latitude:
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="Latitude"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    />
                            </div>
                            <div className="spot_form_lng_input_div">
                                <div className="spot_form_input_title">
                                    Longitude:
                                </div>
                                <input
                                    className="add_spot_form_input"
                                    type="text"
                                    placeholder="Longitude"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="spot_form_description_div spot_form_block">
                <div className="spot_form_block_heading">Describe your place to guests</div>
                <p className="spot_form_prompt">Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                {validationErrors.description && <span className="spot_error">{validationErrors.description}</span>}
                <textarea
                    className="spot_form_input spot_form_description_input"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="spot_form_title_div spot_form_block">
                <div className="spot_form_block_heading">Create a tile for your spot</div>
                <p className="spot_form_prompt">Catch guests' attention with a spot title that highlights what makes your place special</p>
                {validationErrors.title && <span className="spot_error">{validationErrors.title}</span>}
                <input
                    className="spot_form_input spot_from_title_input"
                    type="text"
                    placeholder="Name of your spot"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="spot_form_price_div spot_form_block">
                <div className="spot_form_block_heading">Set a base price for your spot</div>
                <p className="spot_form_prompt">Competitive pricing can help your listing stand out and rank higher ins search results</p>
                {validationErrors.price && <span className="spot_error">{validationErrors.price}</span>}
                <div className="spot_form_price_input_div">
                    <div className="spot_form_price_input_div">
                        <div className="spot_form_price_label">$</div>
                        <input
                            className="spot_form_input spot_form_price_input"
                            type="number"
                            placeholder="Price per night (USD)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="spot_form_image_div spot_form_block">
                <div className="spot_form_block_heading">Liven up your spot with photos</div>
                <p className="spot_form_prompt  ">Submit a link to at least one photo to publish your spot</p>
                {validationErrors.previewImage && <span className="spot_error">{validationErrors.previewImage}</span>}
                {validationErrors.previewImageType && <span className="spot_error">{validationErrors.previewImageType}</span>}
                <input
                    className="spot_form_input spot_form_preview_image_input"
                    type="text"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                />
                {validationErrors.spotImagesType0 && <span className="spot_error">{validationErrors.spotImagesType0}</span>}
                <input
                    className="spot_form_input spot_form_spot_image"
                    type="text"
                    placeholder="Image URL"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                />
                {validationErrors.spotImagesType1 && <span className="spot_error">{validationErrors.spotImagesType1}</span>}
                <input
                    className="spot_form_input spot_form_spot_image"
                    type="text"
                    placeholder="Image URL"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                />
                {validationErrors.spotImagesType2 && <span className="spot_error">{validationErrors.spotImagesType2}</span>}
                <input
                    className="spot_form_input spot_form_spot_image"
                    type="text"
                    placeholder="Image URL"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                />
                {validationErrors.spotImagesType3 && <span className="spot_error">{validationErrors.spotImagesType3}</span>}
                <input
                    className="spot_form_input spot_form_spot_image"
                    type="text"
                    placeholder="Image URL"
                    value={image4}
                    onChange={(e) => setImage4(e.target.value)}
                />
            </div>
            <button className="spot_form_submit_button" type="submit">Create Spot</button>
        </form>
    )
}
