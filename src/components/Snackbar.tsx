import React, { ReactNode, useState, useEffect } from "react";
import { Snackbar, SnackbarOrigin } from "@mui/joy";

interface MySnackbarProps {
    children: ReactNode;
    position?: `${"top" | "bottom"} ${"left" | "center" | "right"}`;
    open: boolean;
    onClose?: () => void;
    autoHideDuration?: number;
}

export default function Toast({
    children,
    position = "bottom left",
    open,
    onClose,
    autoHideDuration = 3000,
}: MySnackbarProps) {
    const [anchorOrigin, setAnchorOrigin] = useState<SnackbarOrigin>({
        vertical: "bottom",
        horizontal: "center",
    });

    useEffect(() => {
        const [vertical, horizontal] = position.split(" ") as [
        SnackbarOrigin["vertical"],
        SnackbarOrigin["horizontal"]
        ];
        setAnchorOrigin({ vertical, horizontal });
    }, [position]);

    return (
        <Snackbar
            anchorOrigin={anchorOrigin}
            open={open}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
            className="snack"
        >
            {children}
        </Snackbar>
    );
}
