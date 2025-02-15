import { useState } from 'react'
import { searchCard } from '../../api/cards';

function Searchbar({ onCardFound }) {    

    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);


    async function handleSearch(e) {
        e.preventDefault();
        setError(null);

        try {
            const res = await searchCard(query);
            onCardFound(res);
        }
        catch (err) {
            setError(err);
        }
    }


    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type='text'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search for a card...'
                />
                <button type='submit'>Tutor it!</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default Searchbar
