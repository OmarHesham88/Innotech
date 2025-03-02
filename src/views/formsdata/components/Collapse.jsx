import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const Collapse = ({ children, isOpen = true, className = '' }) => {
    const [height, setHeight] = useState(isOpen ? 'auto' : '0px');
    const contentRef = useRef(null);
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (isOpen) {
                    setHeight(`${entry.target.scrollHeight}px`);
                }
            }
        });

        if (contentRef.current) {
            observer.current.observe(contentRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                setHeight(`${contentRef.current.scrollHeight}px`);
            } else {
                setHeight('0px');
            }
        }
    }, [isOpen]);

    return (
        <Box
            sx={{
                overflow: 'hidden',
                transition: 'height 0.3s ease-in-out',
                height: height,
            }}
            className={className}
        >
            <Box
                ref={contentRef}
                sx={{
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    transitionDelay: isOpen ? '0.1s' : '0s',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Collapse;
