import { useHistory } from "react-router-dom"

export default function AddSpotButton() {
    const history = useHistory();

    const redirectAddSpotForm = () => {
        history.push('/spots/add')
    }

    return (
        <button onClick={redirectAddSpotForm} className="add_spot_button">
            <i className="fa-solid fa-plus fa-xl" />
        </button>
    )
}
