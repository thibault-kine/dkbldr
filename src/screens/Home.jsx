import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    return (
        <div>
            <h1>Meet your new deck-building buddy!</h1>

            <button onClick={() => navigate('/builder')}>Start building!</button>
        </div>
    )

}