import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as spotActions from "../../store/spots";
import validateSpotForm from "../../utils/validation";

export default function SpotForm({ updateForm = false }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.singleSpot);

    /****************************** Local State ***********************************/
    const [country, setCountry] = useState(updateForm ? spot.country : "");
    const [address, setAddress] = useState(updateForm ? spot.address : "");
    const [city, setCity] = useState(updateForm ? spot.city : "");
    const [state, setState] = useState(updateForm ? spot.state : "");
    const [latitude, setLatitude] = useState(updateForm ? spot.lat : "");
    const [longitude, setLongitude] = useState(updateForm ? spot.lng : "");
    const [description, setDescription] = useState(updateForm ? spot.description : "");
    const [name, setName] = useState(updateForm ? spot.name : "");
    const [price, setPrice] = useState(updateForm ? spot.price : "");
    const [previewImage, setPreviewImage] = useState(updateForm ? : "");
    const [spotImages, setSpotImages] = useState(updateForm ? spot.SpotImages : []);


    if (!sessionUser || sessionUser.id !== spot.ownerId) history.push('/');

    const errors = validateSpotForm(
        country,
        address,
        city,
        state,
        description,
        name,
        price,
        previewImage,
        spotImages
    );

    return (
        null
    )
}
