import { Button, Modal, ModalClose, Sheet, Typography } from '@mui/joy';
import React, { ReactElement, ReactNode, useState } from 'react'
import "../style/Modal.css"

interface BasicModalProps {
    title?: string;
    icon?: ReactNode;
    children: ReactNode;
}

export default function BasicModal({ title, children, icon }: BasicModalProps) {

    const [open, setOpen] = useState(false);

    return (
        <>
            {title ? 
                <Button variant="solid" color="neutral" onClick={() => setOpen(true)} startDecorator={icon}>
                    {title}
                </Button>
            :
                <Button variant="solid" color="neutral" onClick={() => setOpen(true)}>
                    {icon}
                </Button>
            }

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                className="basic-modal"
            >
                <Sheet
                    variant="outlined"
                    className="modal-sheet"
                >
                    <ModalClose variant="plain" />
                    <Typography 
                        component='h2'
                        level='h4'
                    >{title}</Typography>
                    {children}
                </Sheet>
            </Modal>
        </>
    )
}