import React from "react";
import { Link } from "react-router-dom";

export default function Page404() {
    return (
        <div>
            <h1>404: Page not found</h1>
            <Link to={'/'}>Go back home</Link>
        </div>
    )
}