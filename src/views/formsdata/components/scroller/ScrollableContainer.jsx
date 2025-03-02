import React from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import './ScrollableContainer.css';

const ScrollableContainer = ({ children, maxHeight = '100vh', maxWidth = '100%' }) => {
    return (
        <SimpleBar style={{ maxHeight, maxWidth }} className="scrollable-container">
            {children}
        </SimpleBar>
    );
};

export default ScrollableContainer;
